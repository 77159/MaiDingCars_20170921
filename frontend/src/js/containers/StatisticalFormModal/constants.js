/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * CONSTANT的定义请遵循以下格式：
 * export const YOUR_ACTION_CONSTANT = 'YourContainer/YOUR_ACTION_CONSTANT';
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备信息对话框（Modal）组件，可支持添加、修改、查看功能。 constants，用于Action
 */
'use strict';
export const DEVICE_FORM_MODAL_SHOW = 'DeviceFormModal/DEVICE_FORM_MODAL_SHOW';                    //显示设备信息对话框
export const DEVICE_FORM_MODAL_HIDE = 'DeviceFormModal/DEVICE_FORM_MODAL_HIDE';                    //隐藏设备信息对话框
export const DEVICE_FORM_MODAL_OP_BEGIN = 'DeviceFormModal/DEVICE_FORM_MODAL_OP_BEGIN';            //对设备数据的操作（CURD）开始
export const DEVICE_FORM_MODAL_OP_FINISH = 'DeviceFormModal/DEVICE_FORM_MODAL_OP_FINISH';          //对设备数据的操作（CURD）结束
export const DEVICE_FORM_MODAL_CREATE_DEVICE = 'DeviceFormModal/DEVICE_FORM_MODAL_CREATE_DEVICE';  //添加一个设备
export const DEVICE_FORM_MODAL_MODIFY_DEVICE = 'DeviceFormModal/DEVICE_FORM_MODAL_MODIFY_DEVICE';  //修改一个设备设备信息
export const DEVICE_FORM_MODAL_VIEW_DEVICE = 'DeviceFormModal/DEVICE_FORM_MODAL_VIEW_DEVICE';      //查看（只读）一个设备的信息