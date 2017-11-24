/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 添加设备 Actions
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