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
 * @describe 主界面 constants，用于Action
 */
'use strict';
export const RECEIVED_CAR_LOCATION = 'MainContainer/RECEIVED_CAR_LOCATION';           //接收到新的人员位置
export const GET_ONLINE_CAR = 'MainContainer/GET_ONLINE_CAR';                         //接收到新的人员位置
export const GET_ONLINE_DEVICE = 'MainContainer/GET_ONLINE_DEVICE';                         //获取当前人员设备
export const PUSH_ALARM_MESSAGE = 'MainContainer/PUSH_ALARM_MESSAGE';                       //获取报警信息
export const PUT_MESSAGE_ISREAD = 'MainContainer/PUT_MESSAGE_ISREAD';                       //修改已读信息
export const PUT_MESSAGE_LASTDATETIME = 'MainContainer/PUT_MESSAGE_LASTDATETIME';           //更新报警最后更新时间
export const PUT_MESSAGE_ISAREA = 'MainContainer/PUT_MESSAGE_ISAREA';                       //更新人员是否在重点区域
export const PUT_MESSAGE_ISSHOW = 'MainContainer/PUT_MESSAGE_ISSHOW';                       //更新人员是否在已显示提示信息

export const PUT_ALARM_DATAS = 'MainContainer/PUT_ALARM_DATAS';                             //添加当前报警信息
export const DEL_ALARM_DATAS = 'MainContainer/DEL_ALARM_DATAS';                             //移除当前报警信息
export const DEL_ALARM_ALL_DATAS = 'MainContainer/DEL_ALARM_ALL_DATAS';                     //移除当前报警信息
export const UPDATE_MESSAGE_SHOW = 'MainContainer/UPDATE_MESSAGE_SHOW';                     //更新当前报警信息是否已经显示
export const UPDATE_UNREAD_MESSAGE = 'MainContainer/UPDATE_UNREAD_MESSAGE';                 //更新当前未读信息状态
export const DELETE_ALARM_MESSAGE_BY_KEYS = 'MainContainer/DELETE_ALARM_MESSAGE_BY_KEYS';   //删除当前报警信息
export const UPDATE_ALARM_LASTDATETIME = 'MainContainer/UPDATE_ALARM_LASTDATETIME';         //更新报警最后时间
export const UPDATE_ONLINEDEVICE = 'MainContainer/UPDATE_ONLINEDEVICE';                     //更新在线列表
export const REMOVE_ONLINE_DEVICE = 'MainContainer/REMOVE_ONLINE_DEVICE';                   //下线在线列表
export const UPDATE_ALARM_DURATION = 'MainContainer/UPDATE_ALARM_DURATION';                 //更新持续报警时间
