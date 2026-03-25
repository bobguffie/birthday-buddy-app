"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("@capacitor-community/electron");
var electron_2 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var electron_unhandled_1 = __importDefault(require("electron-unhandled"));
var electron_updater_1 = require("electron-updater");
var setup_1 = require("./setup");
// Graceful handling of unhandled errors.
(0, electron_unhandled_1.default)();
// Define our menu templates (these are optional)
var trayMenuTemplate = [new electron_2.MenuItem({ label: 'Quit App', role: 'quit' })];
var appMenuBarMenuTemplate = [
    { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
    { role: 'viewMenu' },
];
// Get Config options from capacitor.config
var capacitorFileConfig = (0, electron_1.getCapacitorElectronConfig)();
// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
var myCapacitorApp = new setup_1.ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);
// If deeplinking is enabled then we will set it up here.
if ((_a = capacitorFileConfig.electron) === null || _a === void 0 ? void 0 : _a.deepLinkingEnabled) {
    (0, electron_1.setupElectronDeepLinking)(myCapacitorApp, {
        customProtocol: (_b = capacitorFileConfig.electron.deepLinkingCustomProtocol) !== null && _b !== void 0 ? _b : 'mycapacitorapp',
    });
}
// If we are in Dev mode, use the file watcher components.
if (electron_is_dev_1.default) {
    (0, setup_1.setupReloadWatcher)(myCapacitorApp);
}
// Run Application
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for electron app to be ready.
            return [4 /*yield*/, electron_2.app.whenReady()];
            case 1:
                // Wait for electron app to be ready.
                _a.sent();
                // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
                (0, setup_1.setupContentSecurityPolicy)(myCapacitorApp.getCustomURLScheme());
                // Initialize our app, build windows, and load content.
                return [4 /*yield*/, myCapacitorApp.init()];
            case 2:
                // Initialize our app, build windows, and load content.
                _a.sent();
                // Check for updates if we are in a packaged app.
                electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
                return [2 /*return*/];
        }
    });
}); })();
// Handle when all of our windows are close (platforms have their own expectations).
electron_2.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_2.app.quit();
    }
});
// When the dock icon is clicked.
electron_2.app.on('activate', function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!myCapacitorApp.getMainWindow().isDestroyed()) return [3 /*break*/, 2];
                    return [4 /*yield*/, myCapacitorApp.init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
});
// Place all ipc or other electron api calls and custom functionality under this line
