/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 主界面 Reducer
 */

'use strict';
import {fromJS} from 'immutable';

import {
    RECEIVED_CAR_LOCATION,
    GET_ONLINE_CAR,
    GET_ONLINE_DEVICE,
    PUSH_ALARM_MESSAGE,
    PUT_MESSAGE_ISREAD,
    PUT_MESSAGE_LASTDATETIME,
    PUT_MESSAGE_ISAREA,
    PUT_MESSAGE_ISSHOW,
    PUT_ALARM_DATAS,
    DEL_ALARM_DATAS,
    DEL_ALARM_ALL_DATAS,
    UPDATE_MESSAGE_SHOW,
    UPDATE_UNREAD_MESSAGE,
    DELETE_ALARM_MESSAGE_BY_KEYS,
    UPDATE_ALARM_LASTDATETIME
} from './constants';

// The initial state of the App
const initialState = fromJS({
    loading: false,
    error: false,
    onlineCar: null,
    onlineDevice: null,         //获取当前最新设备
    isReadCount: 0,             //已读条数
    /*************************/
    realTimeLocations: null,    //实时位置信息
    alertMessageData: [],       //报警数据列表
    alarmDatas: []               //当前正在报警的数据
});


export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //接收实时位置信息
    if (type === RECEIVED_CAR_LOCATION) {
        return state.set('realTimeLocations', payload);
    }

    //接收在线人员设备
    if (type === GET_ONLINE_CAR) {
        return state.set('onlineCar', payload);
    }

    //接受当前最新设备
    if (type === GET_ONLINE_DEVICE) {
        return state.set('onlineDevice', payload);
    }

    //接受当前报警信息
    if (type === PUSH_ALARM_MESSAGE) {
        let alertMessageData = state.get('alertMessageData');
        return state.set('alertMessageData', alertMessageData.push(payload));
    }

    //已读信息
    if (type === PUT_MESSAGE_ISREAD) {
        let alertMessageData = state.get('alertMessageData');
        alertMessageData.forEach((item) => {
            if (item.key === payload) {
                item.isRead = 1;
            }
        });
    }

    //更新报警最后更新时间
    if (type === PUT_MESSAGE_LASTDATETIME) {
        let alertMessageData = state.get('alertMessageData');
        alertMessageData.forEach((item) => {
            if (item.key === payload.id) {
                item.lastDateTime = payload.lastDateTime;
            }
        });
    }

    //更新是人员是否在重点区域
    if (type === PUT_MESSAGE_ISAREA) {
        let alertMessageData = state.get('alertMessageData');
        alertMessageData.forEach((item) => {
            if (item.id === payload.id && item.isArea) {
                item.isArea = payload.isArea;
            }
        });
    }

    //更新警告信息是否已经弹出信息框
    if (type === PUT_MESSAGE_ISSHOW) {
        let alertMessageData = state.get('alertMessageData');
        alertMessageData.forEach((item) => {
            if (item.id === payload.id && item.isShow) {
                item.isShow = payload.isShow;
            }
        });
    }

    //更新当前报警信息
    if (type === PUT_ALARM_DATAS) {
        let alarmDatas = state.get('alarmDatas');
        return state.set('alarmDatas', alarmDatas.push(payload));
    }

    //移除当前的报警信息
    if (type === DEL_ALARM_DATAS) {
        let alarmDatas = state.get('alarmDatas');
        return state.set('alarmDatas', alarmDatas.delete(payload));
    }

    //移除所有的报警信息
    if (type === DEL_ALARM_ALL_DATAS) {
        let alarmDatas = state.get('alarmDatas');
        return state.set('alarmDatas', alarmDatas.clear());
    }

    //更新已经显示的报警信息状态
    if (type === UPDATE_MESSAGE_SHOW) {
        let alarmDatas = state.get('alarmDatas');
        const key = payload;

        alarmDatas.forEach((item) => {
            if (item.key === key && item.isShow) {
                item.isShow = false;
            }
        });
    }

    //更新报警信息未读信息状态
    if (type === UPDATE_UNREAD_MESSAGE) {
        let alertMessageData = state.get('alertMessageData');
        const ids = payload.ids;
        ids.forEach((id) => {
            alertMessageData.forEach((item) => {
                if (item.key === id && item.isRead) {
                    item.isRead = false;
                }
            });
        });
    }

    //根据key删除预警信息
    if (type === DELETE_ALARM_MESSAGE_BY_KEYS) {
        let alertMessageData = state.get('alertMessageData');
        const keys = payload.keys;

        const datas = alertMessageData.filter((item) => {
            let flag = false;
            for (let i = 0; i < keys.length; i++) {
                if (item.key === keys[i]) {
                    flag = true;
                    break
                }
            }
            return flag === false;
        });

        return state.set('alertMessageData', datas);
    }


    //根据主键key更新最后报警时间
    if (type === UPDATE_ALARM_LASTDATETIME) {
        let alertMessageData = state.get('alertMessageData');
        let alarmDatas = state.get('alarmDatas');


        const {key, dateTime} = payload;
        //更新警告列表中最后更新时间
        for (let i = 0; i < alertMessageData.size; i++) {
            let item = alertMessageData.get(i);
            if (item.key === key) {
                item.lastDateTime = dateTime;
                break;
            }
        }

        //更新当前警报信息的最后更新时间
        for (let i = 0; i < alarmDatas.size; i++) {
            let item = alarmDatas.get(i);
            if (item.key === key) {
                item.lastDateTime = dateTime;
                break;
            }
        }
    }

    return state;
}

