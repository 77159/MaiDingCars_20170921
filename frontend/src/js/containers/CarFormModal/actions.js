/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 添加车辆 Actions
 */
'use strict';
import {
    CAR_FORM_MODAL_SHOW,
    CAR_FORM_MODAL_HIDE,
    CAR_FORM_MODAL_OP_BEGIN,
    CAR_FORM_MODAL_OP_FINISH,
    CAR_FORM_MODAL_CREATE_CAR,
    CAR_FORM_MODAL_MODIFY_CAR,
    CAR_FORM_MODAL_VIEW_CAR,
    IMAGE_URL
} from './constants';

/**
 * 对车辆数据的操作（CURD）开始
 */
export const carFormModalOpBegin = () => ({
    type: CAR_FORM_MODAL_OP_BEGIN
});

/**
 * 对车辆数据的操作（CURD）结束
 */
export const carFormModalOpFinish = () => ({
    type: CAR_FORM_MODAL_OP_FINISH
});

/**
 * 显示车辆信息对话框
 * @param {string} operation 操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
 * @param {object} carEntity 当操作类型为 [view | modify ] 时，需要传入车辆对象
 */
export const carFormModalShow = (operation, carEntity) => ({
    type: CAR_FORM_MODAL_SHOW,
    payload:{
        operation,
        carEntity
    }
});

/**
 * 隐藏车辆信息对话框
 */
export const carFormModalHide=()=>({
    type:CAR_FORM_MODAL_HIDE
});

/**
 * 添加一个车辆
 */
export const carFormModalCreateCar = () => ({
    type: CAR_FORM_MODAL_CREATE_CAR
});

/**
 * 修改一个车辆信息
 */
export const carFormModalModifyCar = ( carEntity) => ({
    type: CAR_FORM_MODAL_MODIFY_CAR,
    carEntity
});

/**
 * 查看（只读）一个车辆的信息
 */
export const carFormModalViewCar = () => ({
    type: CAR_FORM_MODAL_VIEW_CAR
});

export const getImgUrl = (imgURL) => ({
    type: IMAGE_URL,
    payload:{
        imgURL
    }
});