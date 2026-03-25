"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var electron_1 = require("electron");
var events_1 = require("events");
////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-var-requires
var plugins = require('./electron-plugins');
var randomId = function (length) {
    if (length === void 0) { length = 5; }
    return (0, crypto_1.randomBytes)(length).toString('hex');
};
var contextApi = {};
Object.keys(plugins).forEach(function (pluginKey) {
    Object.keys(plugins[pluginKey])
        .filter(function (className) { return className !== 'default'; })
        .forEach(function (classKey) {
        var functionList = Object.getOwnPropertyNames(plugins[pluginKey][classKey].prototype).filter(function (v) { return v !== 'constructor'; });
        if (!contextApi[classKey]) {
            contextApi[classKey] = {};
        }
        functionList.forEach(function (functionName) {
            if (!contextApi[classKey][functionName]) {
                contextApi[classKey][functionName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return electron_1.ipcRenderer.invoke.apply(electron_1.ipcRenderer, __spreadArray(["".concat(classKey, "-").concat(functionName)], args, false));
                };
            }
        });
        // Events
        if (plugins[pluginKey][classKey].prototype instanceof events_1.EventEmitter) {
            var listeners_1 = {};
            var listenersOfTypeExist_1 = function (type) {
                return !!Object.values(listeners_1).find(function (listenerObj) { return listenerObj.type === type; });
            };
            Object.assign(contextApi[classKey], {
                addListener: function (type, callback) {
                    var id = randomId();
                    // Deduplicate events
                    if (!listenersOfTypeExist_1(type)) {
                        electron_1.ipcRenderer.send("event-add-".concat(classKey), type);
                    }
                    var eventHandler = function (_) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        return callback.apply(void 0, args);
                    };
                    electron_1.ipcRenderer.addListener("event-".concat(classKey, "-").concat(type), eventHandler);
                    listeners_1[id] = { type: type, listener: eventHandler };
                    return id;
                },
                removeListener: function (id) {
                    if (!listeners_1[id]) {
                        throw new Error('Invalid id');
                    }
                    var _a = listeners_1[id], type = _a.type, listener = _a.listener;
                    electron_1.ipcRenderer.removeListener("event-".concat(classKey, "-").concat(type), listener);
                    delete listeners_1[id];
                    if (!listenersOfTypeExist_1(type)) {
                        electron_1.ipcRenderer.send("event-remove-".concat(classKey, "-").concat(type));
                    }
                },
                removeAllListeners: function (type) {
                    Object.entries(listeners_1).forEach(function (_a) {
                        var id = _a[0], listenerObj = _a[1];
                        if (!type || listenerObj.type === type) {
                            electron_1.ipcRenderer.removeListener("event-".concat(classKey, "-").concat(listenerObj.type), listenerObj.listener);
                            electron_1.ipcRenderer.send("event-remove-".concat(classKey, "-").concat(listenerObj.type));
                            delete listeners_1[id];
                        }
                    });
                },
            });
        }
    });
});
electron_1.contextBridge.exposeInMainWorld('CapacitorCustomPlatform', {
    name: 'electron',
    plugins: contextApi,
});
////////////////////////////////////////////////////////
