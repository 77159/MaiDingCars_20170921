/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备管理页面 reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    QUERY_ALL_DEVICE,
    CREATE_DEVICE,
    MODIFY_DEVICE,
    GET_DEVICE,
    DELETE_DEVICE, QUERY_ALL_DEVICE_SUCCESS, DEVICE_OP_BEGIN, DEVICE_OP_FINISH, QUERY_ALL_DEVICE_BEGIN,
    QUERY_ALL_DEVICE_FINISH,
    QUERY_ALL_NOT_DEVICE_FINISH
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //表格数据加载状态  【True】加载中 【False】加载完成
    tableDataLoading: true,
    //设备数据
    deviceDataSource: null,

    notDeviceDataSource:null,
    //工作状态下拉列表，默认：全部
    // workState: 'all',
    // curSelectedRowKeys: [],
    // ModalText: 'Content of the modal',
    // visible: false,
    // confirmLoading: false,
    // loading: false,
});


export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //对设备数据的操作（CURD）开始
    if (type === DEVICE_OP_BEGIN) {
        return state
            .set('tableDataLoading', true);
    }

    //对设备数据的操作（CURD）结束
    if (type === DEVICE_OP_FINISH) {
        return state
            .set('tableDataLoading', false);
    }

    //查询所有设备信息-结束
    if (type === QUERY_ALL_DEVICE_FINISH) {
        return state
            .set('deviceDataSource', payload.list);
    }

    //添加设备
    if (type === CREATE_DEVICE) {

    }

    //修改设备信息
    if (type === MODIFY_DEVICE) {

    }

    //查询一个设备的信息
    if (type === GET_DEVICE) {

    }

    //删除设备（一个或多个）
    if (type === DELETE_DEVICE) {

    }

    //查询所有未被使用的设备信息-结束
    if (type === QUERY_ALL_NOT_DEVICE_FINISH) {
        return state
            .set('notDeviceDataSource', payload);
    }

    return state;
}

//     //显示&隐藏 图标管理弹出框
//     if (type === actions.SHOW_POI_MANAGEMENT_DIALOG) {
//         return Object.assign({}, state, {
//             showPOIMgmtDialog: payload
//         });
//     }
//
//     ////显示默认图标&用户图标 管理窗口
//     if (type === actions.SHOW_POI_TYPE) {
//         return Object.assign({}, state, {
//             poiIconValue: payload
//         });
//     }
//
//     //获取用户图标数据,操作完成
//     if (type === actions.GET_USER_POI_ICON_DONE) {
//         return Object.assign({}, state, {
//             userPoiIcon: payload,
//             getUserPoiIconDone: true
//         });
//     }
//     //获取系统默认图标
//     if (type === actions.GET_DEFAULT_POI_ICON_DONE) {
//         return Object.assign({}, state, {
//             defaultPoiIcon: payload
//         });
//     }
//
//     //编辑用户图标数据保存完成回调
//     if (type === actions.UPDATE_USER_POI_ICON_DONE) {
//         let updateUserSuccess = false;
//         //保存失败
//         if (!payload || (payload.success && payload.success == false)) {
//             updateUserSuccess = false;
//         } else {
//             updateUserSuccess = true; //保存成功
//         }
//
//         if (typeof payload.callback == 'function') {
//             payload.callback(updateUserSuccess);
//         }
//     }
//
//     //删除用户图标数据保存完成回调
//     if (type === actions.REMOVE_USER_POI_ICON_DONE) {
//         let removeUserSuccess = false;
//         //保存失败
//         if (!payload || (payload.success && payload.success == false)) {
//             removeUserSuccess = false;
//         } else {
//             removeUserSuccess = true; //保存成功
//         }
//
//         if (typeof payload.callback == 'function') {
//             payload.callback(removeUserSuccess);
//         }
//     }