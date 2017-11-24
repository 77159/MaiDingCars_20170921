/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/1
 * @describe 系统配置文件
 */
'use strict';

import * as cookies from '../api/cookies.js';

export const AppConfig = {
    //后台接口服务地址
    serviceUrl: 'http://192.168.1.92:8080/',

    fmTokenCookieName: 'fm-factorcar-token',
    // serviceUrl: 'http://192.168.1.72:8080/',
    // serviceUrl: 'http://192.168.1.168:8080/',
    get token() {
        let token = cookies.getItem(this.fmTokenCookieName);
        return token;
        //return '44A16F0A4D45492FA6EC8791CAEC2E2C';
    },

    set token(value) {
        window.token = value;
        cookies.setItem(this.fmTokenCookieName, value);
    },

    get fmapID() {
        // return 'md-xm-one-57-59';
        return 'md-gz-1-2';
    },

    get userName() {
        //let user = cookies.getItem(this.fmUserDisplayName);
        //if (!user || user == '') user = '未登录';
        //return decodeURIComponent(user) || '未登录';
        return '管理员';
    }
};