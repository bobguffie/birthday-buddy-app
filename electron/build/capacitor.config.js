"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    appId: 'com.birthdaybuddy.app',
    appName: 'Birthday Buddy',
    webDir: 'dist',
    plugins: {
        LocalNotifications: {
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#488AFF",
            sound: "beep.wav",
        },
    },
};
exports.default = config;
