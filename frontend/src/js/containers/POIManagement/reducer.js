/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  {zxg} (zhangxiaoguang@fengmap.com)
 * @date     {2016/7/11}
 * @describe 图标管理（Dialog），可以通过Esc关闭，或点击遮罩区域。
 */
import * as actions from './actions.js';

const initialState = {
    //显示&隐藏 图标管理弹出框 【True】显示 【False】隐藏
    showPOIMgmtDialog: false,
    //判断当前显示的是系统图标还是用户图标，[defaultPoi]，系统图标[uesrPoi]用户图标
    poiIconValue: 'defaultPoi',
    //编辑状态开关
    editorStatus: false,
    //编辑的初始数据
    editorData: null,
    //保存图标修改的信息
    editorArr: [],
    getUserPoiIconDone: false,
    //用户图标数据
    userPoiIcon: [],
    //系统默认图标
    defaultPoiIcon: [],
};

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;
    //TODO 1、系统图标获取  2、切换TAB 3、用户图标加载 4、用户图标修改名称 & 影响图标绘制界面 5、新增用户图标（上传 显示上传进度） 6、删除用户自定义图标 7、点击任意图标开启绘制模式（非编辑模式）

    //显示&隐藏 图标管理弹出框
    if (type === actions.SHOW_POI_MANAGEMENT_DIALOG) {
        return Object.assign({}, state, {
            showPOIMgmtDialog: payload
        });
    }

    ////显示默认图标&用户图标 管理窗口
    if (type === actions.SHOW_POI_TYPE) {
        return Object.assign({}, state, {
            poiIconValue: payload
        });
    }

    //获取用户图标数据,操作完成
    if (type === actions.GET_USER_POI_ICON_DONE) {
        return Object.assign({}, state, {
            userPoiIcon: payload,
            getUserPoiIconDone: true
        });
    }
    //获取系统默认图标
    if (type === actions.GET_DEFAULT_POI_ICON_DONE) {
        return Object.assign({}, state, {
            defaultPoiIcon: payload
        });
    }

    //编辑用户图标数据保存完成回调
    if (type === actions.UPDATE_USER_POI_ICON_DONE) {
        let updateUserSuccess = false;
        //保存失败
        if (!payload || (payload.success && payload.success == false)) {
            updateUserSuccess = false;
        } else {
            updateUserSuccess = true; //保存成功
        }

        if (typeof payload.callback == 'function') {
            payload.callback(updateUserSuccess);
        }
    }

    //删除用户图标数据保存完成回调
    if (type === actions.REMOVE_USER_POI_ICON_DONE) {
        let removeUserSuccess = false;
        //保存失败
        if (!payload || (payload.success && payload.success == false)) {
            removeUserSuccess = false;
        } else {
            removeUserSuccess = true; //保存成功
        }

        if (typeof payload.callback == 'function') {
            payload.callback(removeUserSuccess);
        }
    }

    return state;
}