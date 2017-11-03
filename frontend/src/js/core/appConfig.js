/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/1
 * @describe 系统配置文件
 */
'use strict';

export const AppConfig = {
    //后台接口服务地址
    // serviceUrl: 'http://192.168.1.95:9095/',
    serviceUrl: 'http://192.168.1.72:9090/',
    get token() {
        //let token = cookies.getItem(this.fmTokenCookieName);
        //return (token != null ? token : null);
        return '44A16F0A4D45492FA6EC8791CAEC2E2C';
    },

    get fmapID() {
        return 'md-xm-57-9';
    },

    get userName() {
        //let user = cookies.getItem(this.fmUserDisplayName);
        //if (!user || user == '') user = '未登录';
        //return decodeURIComponent(user) || '未登录';
        return '管理员';
    }
};