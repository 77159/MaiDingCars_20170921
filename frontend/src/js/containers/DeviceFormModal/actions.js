/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备信息对话框（Modal）组件，可支持添加、修改、查看功能。 Actions
 */
'use strict';
import {
    DEVICE_FORM_MODAL_SHOW,
    DEVICE_FORM_MODAL_HIDE,
    DEVICE_FORM_MODAL_OP_BEGIN,
    DEVICE_FORM_MODAL_OP_FINISH,
    DEVICE_FORM_MODAL_CREATE_DEVICE,
    DEVICE_FORM_MODAL_MODIFY_DEVICE,
    DEVICE_FORM_MODAL_VIEW_DEVICE
} from './constants';

/**
 * 对设备数据的操作（CURD）开始
 */
export const deviceFormModalOpBegin = () => ({
    type: DEVICE_FORM_MODAL_OP_BEGIN
});

/**
 * 对设备数据的操作（CURD）结束
 */
export const deviceFormModalOpFinish = () => ({
    type: DEVICE_FORM_MODAL_OP_FINISH
});

/**
 * 显示设备信息对话框
 * @param {string} operation 操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
 * @param {object} deviceEntity 当操作类型为 [view | modify ] 时，需要传入设备对象
 */
export const deviceFormModalShow = (operation, deviceEntity) => ({
    type: DEVICE_FORM_MODAL_SHOW,
    payload:{
        operation,
        deviceEntity
    }
});

/**
 * 隐藏设备信息对话框
 */
export const deviceFormModalHide=()=>({
    type:DEVICE_FORM_MODAL_HIDE
});

/**
 * 添加一个设备
 */
export const deviceFormModalCreateDevice = () => ({
    type: DEVICE_FORM_MODAL_CREATE_DEVICE
});

/**
 * 修改一个设备设备信息
 */
export const deviceFormModalModifyDevice = () => ({
    type: DEVICE_FORM_MODAL_MODIFY_DEVICE
});

/**
 * 查看（只读）一个设备的信息
 */
export const deviceFormModalViewDevice = () => ({
    type: DEVICE_FORM_MODAL_VIEW_DEVICE
});