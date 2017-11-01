/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 添加车辆 constants，用于Action
 *
 * CONSTANT的定义请遵循以下格式：
 * export const YOUR_ACTION_CONSTANT = 'YourContainer/YOUR_ACTION_CONSTANT';
 *
 */
'use strict';
export const CAR_FORM_MODAL_SHOW = 'CarFormModal/CAR_FORM_MODAL_SHOW';                    //显示车辆信息对话框
export const CAR_FORM_MODAL_HIDE = 'CarFormModal/CAR_FORM_MODAL_HIDE';                    //隐藏车辆信息对话框
export const CAR_FORM_MODAL_OP_BEGIN = 'CarFormModal/CAR_FORM_MODAL_OP_BEGIN';            //对车辆数据的操作（CURD）开始
export const CAR_FORM_MODAL_OP_FINISH = 'CarFormModal/CAR_FORM_MODAL_OP_FINISH';          //对车辆数据的操作（CURD）结束
export const CAR_FORM_MODAL_CREATE_CAR = 'CarFormModal/CAR_FORM_MODAL_CREATE_CAR';  //添加一个车辆
export const CAR_FORM_MODAL_MODIFY_CAR = 'CarFormModal/CAR_FORM_MODAL_MODIFY_CAR';  //修改一个车辆信息
export const CAR_FORM_MODAL_VIEW_CAR = 'CarFormModal/CAR_FORM_MODAL_VIEW_CAR';      //查看（只读）一个车辆的信息
export const IMAGE_URL = 'CarFormModal/IMAGE_URL';      //查看（只读）一个车辆的信息