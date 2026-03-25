"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalNotificationsWeb = void 0;
var index_63o4j45U_js_1 = require("./index-63o4j45U.js");
var c = /** @class */ (function (_super) {
    __extends(c, _super);
    function c() {
        var _this = this;
        _this = _super.apply(this, arguments) || this, _this.pending = [], _this.deliveredNotifications = [], _this.hasNotificationSupport = function () { if (!("Notification" in window) || !Notification.requestPermission)
            return !1; if (Notification.permission !== "granted")
            try {
                new Notification("");
            }
            catch (i) {
                if (i instanceof Error && i.name === "TypeError")
                    return !1;
            } return !0; };
        return _this;
    }
    c.prototype.getDeliveredNotifications = function () {
        return __awaiter(this, void 0, void 0, function () { var i, _i, _a, t, e; return __generator(this, function (_b) {
            i = [];
            for (_i = 0, _a = this.deliveredNotifications; _i < _a.length; _i++) {
                t = _a[_i];
                e = { title: t.title, id: parseInt(t.tag), body: t.body };
                i.push(e);
            }
            return [2 /*return*/, { notifications: i }];
        }); });
    };
    c.prototype.removeDeliveredNotifications = function (i) {
        return __awaiter(this, void 0, void 0, function () { var _loop_1, this_1, _i, _a, t; return __generator(this, function (_b) {
            _loop_1 = function (t) {
                var e = this_1.deliveredNotifications.find(function (n) { return n.tag === String(t.id); });
                e == null || e.close(), this_1.deliveredNotifications = this_1.deliveredNotifications.filter(function () { return !e; });
            };
            this_1 = this;
            for (_i = 0, _a = i.notifications; _i < _a.length; _i++) {
                t = _a[_i];
                _loop_1(t);
            }
            return [2 /*return*/];
        }); });
    };
    c.prototype.removeAllDeliveredNotifications = function () {
        return __awaiter(this, void 0, void 0, function () { var _i, _a, i; return __generator(this, function (_b) {
            for (_i = 0, _a = this.deliveredNotifications; _i < _a.length; _i++) {
                i = _a[_i];
                i.close();
            }
            this.deliveredNotifications = [];
            return [2 /*return*/];
        }); });
    };
    c.prototype.createChannel = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.deleteChannel = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.listChannels = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.schedule = function (i) {
        return __awaiter(this, void 0, void 0, function () { var _i, _a, t; return __generator(this, function (_b) {
            if (!this.hasNotificationSupport())
                throw this.unavailable("Notifications not supported in this browser.");
            for (_i = 0, _a = i.notifications; _i < _a.length; _i++) {
                t = _a[_i];
                this.sendNotification(t);
            }
            return [2 /*return*/, { notifications: i.notifications.map(function (t) { return ({ id: t.id }); }) }];
        }); });
    };
    c.prototype.getPending = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { notifications: this.pending }];
        }); });
    };
    c.prototype.registerActionTypes = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.cancel = function (i) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            this.pending = this.pending.filter(function (t) { return !i.notifications.find(function (e) { return e.id === t.id; }); });
            return [2 /*return*/];
        }); });
    };
    c.prototype.areEnabled = function () {
        return __awaiter(this, void 0, void 0, function () { var i; return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.checkPermissions()];
                case 1:
                    i = (_a.sent()).display;
                    return [2 /*return*/, { value: i === "granted" }];
            }
        }); });
    };
    c.prototype.changeExactNotificationSetting = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.checkExactNotificationSetting = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw this.unimplemented("Not implemented on web.");
        }); });
    };
    c.prototype.requestPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.hasNotificationSupport())
                            throw this.unavailable("Notifications not supported in this browser.");
                        _b = {};
                        _a = this.transformNotificationPermission;
                        return [4 /*yield*/, Notification.requestPermission()];
                    case 1: return [2 /*return*/, (_b.display = _a.apply(this, [_c.sent()]), _b)];
                }
            });
        });
    };
    c.prototype.checkPermissions = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            if (!this.hasNotificationSupport())
                throw this.unavailable("Notifications not supported in this browser.");
            return [2 /*return*/, { display: this.transformNotificationPermission(Notification.permission) }];
        }); });
    };
    c.prototype.transformNotificationPermission = function (i) { switch (i) {
        case "granted": return "granted";
        case "denied": return "denied";
        default: return "prompt";
    } };
    c.prototype.sendPending = function () { var i; var t = [], e = new Date().getTime(); for (var _i = 0, _a = this.pending; _i < _a.length; _i++) {
        var n = _a[_i];
        !((i = n.schedule) === null || i === void 0) && i.at && n.schedule.at.getTime() <= e && (this.buildNotification(n), t.push(n));
    } this.pending = this.pending.filter(function (n) { return !t.find(function (o) { return o === n; }); }); };
    c.prototype.sendNotification = function (i) {
        var _this = this;
        var t;
        if (!((t = i.schedule) === null || t === void 0) && t.at) {
            var e = i.schedule.at.getTime() - new Date().getTime();
            this.pending.push(i), setTimeout(function () { _this.sendPending(); }, e);
            return;
        }
        this.buildNotification(i);
    };
    c.prototype.buildNotification = function (i) {
        var _this = this;
        var t = new Notification(i.title, { body: i.body, tag: String(i.id) });
        return t.addEventListener("click", this.onClick.bind(this, i), !1), t.addEventListener("show", this.onShow.bind(this, i), !1), t.addEventListener("close", function () { _this.deliveredNotifications = _this.deliveredNotifications.filter(function () { return !_this; }); }, !1), this.deliveredNotifications.push(t), t;
    };
    c.prototype.onClick = function (i) { var t = { actionId: "tap", notification: i }; this.notifyListeners("localNotificationActionPerformed", t); };
    c.prototype.onShow = function (i) { this.notifyListeners("localNotificationReceived", i); };
    return c;
}(index_63o4j45U_js_1.W));
exports.LocalNotificationsWeb = c;
