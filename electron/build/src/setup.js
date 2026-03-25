"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronCapacitorApp = void 0;
exports.setupReloadWatcher = setupReloadWatcher;
exports.setupContentSecurityPolicy = setupContentSecurityPolicy;
var electron_1 = require("@capacitor-community/electron");
var chokidar_1 = __importDefault(require("chokidar"));
var electron_2 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var electron_serve_1 = __importDefault(require("electron-serve"));
var electron_window_state_1 = __importDefault(require("electron-window-state"));
var path_1 = require("path");
// Define components for a watcher to detect when the webapp is changed so we can reload in Dev mode.
var reloadWatcher = {
    debouncer: null,
    ready: false,
    watcher: null,
};
function setupReloadWatcher(electronCapacitorApp) {
    var _this = this;
    reloadWatcher.watcher = chokidar_1.default
        .watch((0, path_1.join)(electron_2.app.getAppPath(), 'app'), {
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
                    electronCapacitorApp.getMainWindow().webContents.reload();
                    reloadWatcher.ready = false;
                    clearTimeout(reloadWatcher.debouncer);
                    reloadWatcher.debouncer = null;
                    reloadWatcher.watcher = null;
                    setupReloadWatcher(electronCapacitorApp);
                    return [2 /*return*/];
                });
            }); }, 1500);
        }
    });
}
// Define our class to manage our app.
var ElectronCapacitorApp = /** @class */ (function () {
    function ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate) {
        var _a, _b;
        this.MainWindow = null;
        this.SplashScreen = null;
        this.TrayIcon = null;
        this.TrayMenuTemplate = [
            new electron_2.MenuItem({ label: 'Quit App', role: 'quit' }),
        ];
        this.AppMenuBarMenuTemplate = [
            { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
            { role: 'viewMenu' },
        ];
        this.CapacitorFileConfig = capacitorFileConfig;
        this.customScheme = (_b = (_a = this.CapacitorFileConfig.electron) === null || _a === void 0 ? void 0 : _a.customUrlScheme) !== null && _b !== void 0 ? _b : 'capacitor-electron';
        if (trayMenuTemplate) {
            this.TrayMenuTemplate = trayMenuTemplate;
        }
        if (appMenuBarMenuTemplate) {
            this.AppMenuBarMenuTemplate = appMenuBarMenuTemplate;
        }
        // Setup our web app loader, this lets us load apps like react, vue, and angular without changing their build chains.
        this.loadWebApp = (0, electron_serve_1.default)({
            directory: (0, path_1.join)(electron_2.app.getAppPath(), 'app'),
            scheme: this.customScheme,
        });
    }
    // Helper function to load in the app.
    ElectronCapacitorApp.prototype.loadMainWindow = function (thisRef) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, thisRef.loadWebApp(thisRef.MainWindow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Expose the mainWindow ref for use outside of the class.
    ElectronCapacitorApp.prototype.getMainWindow = function () {
        return this.MainWindow;
    };
    ElectronCapacitorApp.prototype.getCustomURLScheme = function () {
        return this.customScheme;
    };
    ElectronCapacitorApp.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var icon, preloadPath;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                icon = electron_2.nativeImage.createFromPath((0, path_1.join)(electron_2.app.getAppPath(), 'assets', process.platform === 'win32' ? 'appIcon.ico' : 'appIcon.png'));
                this.mainWindowState = (0, electron_window_state_1.default)({
                    defaultWidth: 1000,
                    defaultHeight: 800,
                });
                preloadPath = (0, path_1.join)(electron_2.app.getAppPath(), 'build', 'src', 'preload.js');
                this.MainWindow = new electron_2.BrowserWindow({
                    icon: icon,
                    show: false,
                    x: this.mainWindowState.x,
                    y: this.mainWindowState.y,
                    width: this.mainWindowState.width,
                    height: this.mainWindowState.height,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: true,
                        // Use preload to inject the electron varriant overrides for capacitor plugins.
                        // preload: join(app.getAppPath(), "node_modules", "@capacitor-community", "electron", "dist", "runtime", "electron-rt.js"),
                        preload: preloadPath,
                    },
                });
                this.mainWindowState.manage(this.MainWindow);
                if (this.CapacitorFileConfig.backgroundColor) {
                    this.MainWindow.setBackgroundColor(this.CapacitorFileConfig.electron.backgroundColor);
                }
                // If we close the main window with the splashscreen enabled we need to destory the ref.
                this.MainWindow.on('closed', function () {
                    var _a;
                    if (((_a = _this.SplashScreen) === null || _a === void 0 ? void 0 : _a.getSplashWindow()) && !_this.SplashScreen.getSplashWindow().isDestroyed()) {
                        _this.SplashScreen.getSplashWindow().close();
                    }
                });
                // When the tray icon is enabled, setup the options.
                if ((_a = this.CapacitorFileConfig.electron) === null || _a === void 0 ? void 0 : _a.trayIconAndMenuEnabled) {
                    this.TrayIcon = new electron_2.Tray(icon);
                    this.TrayIcon.on('double-click', function () {
                        if (_this.MainWindow) {
                            if (_this.MainWindow.isVisible()) {
                                _this.MainWindow.hide();
                            }
                            else {
                                _this.MainWindow.show();
                                _this.MainWindow.focus();
                            }
                        }
                    });
                    this.TrayIcon.on('click', function () {
                        if (_this.MainWindow) {
                            if (_this.MainWindow.isVisible()) {
                                _this.MainWindow.hide();
                            }
                            else {
                                _this.MainWindow.show();
                                _this.MainWindow.focus();
                            }
                        }
                    });
                    this.TrayIcon.setToolTip(electron_2.app.getName());
                    this.TrayIcon.setContextMenu(electron_2.Menu.buildFromTemplate(this.TrayMenuTemplate));
                }
                // Setup the main manu bar at the top of our window.
                electron_2.Menu.setApplicationMenu(electron_2.Menu.buildFromTemplate(this.AppMenuBarMenuTemplate));
                // If the splashscreen is enabled, show it first while the main window loads then switch it out for the main window, or just load the main window from the start.
                if ((_b = this.CapacitorFileConfig.electron) === null || _b === void 0 ? void 0 : _b.splashScreenEnabled) {
                    this.SplashScreen = new electron_1.CapacitorSplashScreen({
                        imageFilePath: (0, path_1.join)(electron_2.app.getAppPath(), 'assets', (_d = (_c = this.CapacitorFileConfig.electron) === null || _c === void 0 ? void 0 : _c.splashScreenImageName) !== null && _d !== void 0 ? _d : 'splash.png'),
                        windowWidth: 400,
                        windowHeight: 400,
                    });
                    this.SplashScreen.init(this.loadMainWindow, this);
                }
                else {
                    this.loadMainWindow(this);
                }
                // Security
                this.MainWindow.webContents.setWindowOpenHandler(function (details) {
                    if (!details.url.includes(_this.customScheme)) {
                        return { action: 'deny' };
                    }
                    else {
                        return { action: 'allow' };
                    }
                });
                this.MainWindow.webContents.on('will-navigate', function (event, _newURL) {
                    if (!_this.MainWindow.webContents.getURL().includes(_this.customScheme)) {
                        event.preventDefault();
                    }
                });
                // Link electron plugins into the system.
                (0, electron_1.setupCapacitorElectronPlugins)();
                // When the web app is loaded we hide the splashscreen if needed and show the mainwindow.
                this.MainWindow.webContents.on('dom-ready', function () {
                    var _a, _b;
                    if ((_a = _this.CapacitorFileConfig.electron) === null || _a === void 0 ? void 0 : _a.splashScreenEnabled) {
                        _this.SplashScreen.getSplashWindow().hide();
                    }
                    if (!((_b = _this.CapacitorFileConfig.electron) === null || _b === void 0 ? void 0 : _b.hideMainWindowOnLaunch)) {
                        _this.MainWindow.show();
                    }
                    setTimeout(function () {
                        if (electron_is_dev_1.default) {
                            _this.MainWindow.webContents.openDevTools();
                        }
                        electron_1.CapElectronEventEmitter.emit('CAPELECTRON_DeeplinkListenerInitialized', '');
                    }, 400);
                });
                return [2 /*return*/];
            });
        });
    };
    return ElectronCapacitorApp;
}());
exports.ElectronCapacitorApp = ElectronCapacitorApp;
// Set a CSP up for our application based on the custom scheme
function setupContentSecurityPolicy(customScheme) {
    electron_2.session.defaultSession.webRequest.onHeadersReceived(function (details, callback) {
        callback({
            responseHeaders: __assign(__assign({}, details.responseHeaders), { 'Content-Security-Policy': [
                    electron_is_dev_1.default
                        ? "default-src ".concat(customScheme, "://* 'unsafe-inline' devtools://* 'unsafe-eval' data:")
                        : "default-src ".concat(customScheme, "://* 'unsafe-inline' data:"),
                ] }),
        });
    });
}
