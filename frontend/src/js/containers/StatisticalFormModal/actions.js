/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计信息对话框（Modal） Actions
 */
'use strict';
import {
    STATISTICAL_FORM_MODAL_SHOW,
    STATISTICAL_FORM_MODAL_HIDE,
    STATISTICAL_FORM_MODAL_OP_BEGIN,
    STATISTICAL_FORM_MODAL_OP_FINISH,
    GET_CENTER_AREA_DATA,
    GET_CENTER_AREA_DATA_DONE,
    OPERATING_BEGIN,
    OPERATING_FINISH
} from './constants';

/**
 * 对设备数据的操作（CURD）开始
 */
export const statisticalFormModalOpBegin = () => ({
    type: STATISTICAL_FORM_MODAL_OP_BEGIN
});

/**
 * 对设备数据的操作（CURD）结束
 */
export const statisticalFormModalOpFinish = () => ({
    type: STATISTICAL_FORM_MODAL_OP_FINISH
});

/**
 * 显示设备信息对话框
 * @param {string} operation 操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
 * @param {object} deviceEntity 当操作类型为 [view | modify ] 时，需要传入设备对象
 */
export const statisticalFormModalShow = (operation, deviceEntity) => ({
    type: STATISTICAL_FORM_MODAL_SHOW,
    payload: {
        operation,
        deviceEntity
    }
});

/**
 * 隐藏设备信息对话框
 */
export const statisticalFormModalHide = () => ({
    type: STATISTICAL_FORM_MODAL_HIDE
});

export const getCenterAreaStaticData = (deviceID, count) => ({
    type: GET_CENTER_AREA_DATA,
    payload: {
        deviceID,
        count
    }
});

export const getCenterAreaStaticDataDone = (centerAreaEntity, count) => ({
    type: GET_CENTER_AREA_DATA_DONE,
    payload: {
        centerAreaEntity,
        count
    }
});


/**
 * 查询统计数据（CURD）开始
 */
export const operatingBegin = () => ({
    type: OPERATING_BEGIN
});

/**
 * 查询统计数据（CURD）结束
 */
export const operatingFinish = () => ({
    type: OPERATING_FINISH
});
