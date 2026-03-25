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
var _this = this;
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var cp = require('child_process');
var chokidar = require('chokidar');
var electron = require('electron');
var child = null;
var npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
var reloadWatcher = {
    debouncer: null,
    ready: false,
    watcher: null,
    restarting: false,
};
///*
function runBuild() {
    return new Promise(function (resolve, _reject) {
        var tempChild = cp.spawn(npmCmd, ['run', 'build']);
        tempChild.once('exit', function () {
            resolve();
        });
        tempChild.stdout.pipe(process.stdout);
    });
}
//*/
function spawnElectron() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(child !== null)) return [3 /*break*/, 2];
                    child.stdin.pause();
                    child.kill();
                    child = null;
                    return [4 /*yield*/, runBuild()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    child = cp.spawn(electron, ['--inspect=5858', './']);
                    child.on('exit', function () {
                        if (!reloadWatcher.restarting) {
                            process.exit(0);
                        }
                    });
                    child.stdout.pipe(process.stdout);
                    return [2 /*return*/];
            }
        });
    });
}
function setupReloadWatcher() {
    var _this = this;
    reloadWatcher.watcher = chokidar
        .watch('./src/**/*', {
        ignored: /[/\\]\./,
        persistent: true,
    })
        .on('ready', function () {
        reloadWatcher.ready = true;
    })
        .on('all', function (_event, _path) {
        if (reloadWatcher.ready) {
            clearTimeout(reloadWatcher.debouncer);
            reloadWatcher.debouncer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Restarting');
                            reloadWatcher.restarting = true;
                            return [4 /*yield*/, spawnElectron()];
                        case 1:
                            _a.sent();
                            reloadWatcher.restarting = false;
                            reloadWatcher.ready = false;
                            clearTimeout(reloadWatcher.debouncer);
                            reloadWatcher.debouncer = null;
                            reloadWatcher.watcher = null;
                            setupReloadWatcher();
                            return [2 /*return*/];
                    }
                });
            }); }, 500);
        }
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runBuild()];
            case 1:
                _a.sent();
                return [4 /*yield*/, spawnElectron()];
            case 2:
                _a.sent();
                setupReloadWatcher();
                return [2 /*return*/];
        }
    });
}); })();
