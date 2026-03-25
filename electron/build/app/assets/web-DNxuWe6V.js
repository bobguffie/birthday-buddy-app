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
exports.AdMobWeb = void 0;
var index_63o4j45U_js_1 = require("./index-63o4j45U.js");
var o;
(function (n) { n.NOT_REQUIRED = "NOT_REQUIRED", n.REQUIRED = "REQUIRED", n.UNKNOWN = "UNKNOWN"; })(o || (o = {}));
var r = /** @class */ (function (_super) {
    __extends(r, _super);
    function r() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    r.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("initialize");
            return [2 /*return*/];
        }); });
    };
    r.prototype.requestTrackingAuthorization = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("requestTrackingAuthorization");
            return [2 /*return*/];
        }); });
    };
    r.prototype.trackingAuthorizationStatus = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { status: "authorized" }];
        }); });
    };
    r.prototype.requestConsentInfo = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (console.log("requestConsentInfo", e), { status: index_63o4j45U_js_1.A.REQUIRED, isConsentFormAvailable: !0, canRequestAds: !0, privacyOptionsRequirementStatus: o.REQUIRED })];
        }); });
    };
    r.prototype.showPrivacyOptionsForm = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("showPrivacyOptionsForm");
            return [2 /*return*/];
        }); });
    };
    r.prototype.showConsentForm = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (console.log("showConsentForm"), { status: index_63o4j45U_js_1.A.REQUIRED, canRequestAds: !0, privacyOptionsRequirementStatus: o.REQUIRED })];
        }); });
    };
    r.prototype.resetConsentInfo = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("resetConsentInfo");
            return [2 /*return*/];
        }); });
    };
    r.prototype.setApplicationMuted = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("setApplicationMuted", e);
            return [2 /*return*/];
        }); });
    };
    r.prototype.setApplicationVolume = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("setApplicationVolume", e);
            return [2 /*return*/];
        }); });
    };
    r.prototype.showBanner = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("showBanner", e);
            return [2 /*return*/];
        }); });
    };
    r.prototype.hideBanner = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("hideBanner");
            return [2 /*return*/];
        }); });
    };
    r.prototype.resumeBanner = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("resumeBanner");
            return [2 /*return*/];
        }); });
    };
    r.prototype.removeBanner = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("removeBanner");
            return [2 /*return*/];
        }); });
    };
    r.prototype.prepareInterstitial = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (console.log("prepareInterstitial", e), { adUnitId: e.adId })];
        }); });
    };
    r.prototype.showInterstitial = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            console.log("showInterstitial");
            return [2 /*return*/];
        }); });
    };
    r.prototype.prepareRewardVideoAd = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (console.log(e), { adUnitId: e.adId })];
        }); });
    };
    r.prototype.showRewardVideoAd = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { type: "", amount: 0 }];
        }); });
    };
    r.prototype.prepareRewardInterstitialAd = function (e) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (console.log(e), { adUnitId: e.adId })];
        }); });
    };
    r.prototype.showRewardInterstitialAd = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { type: "", amount: 0 }];
        }); });
    };
    return r;
}(index_63o4j45U_js_1.W));
exports.AdMobWeb = r;
