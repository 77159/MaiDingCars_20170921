/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置表单
 */

'use strict';
import {fromJS} from 'immutable';

import {
    QUERY_AREA_BY_ID_FINISH,
    LOCK_FORM,
    UNLOCK_FORM,
    EMPTY_AREA_FORM,
    CURENTPOINTS
} from './constants';

const initialState = fromJS({
    area: {
        "id": "",
        "areaName": "",
        "areaType": 0,
        "areaStyle": '{"backgroundColor":"","opacity":0.5}',
        "polygon": null,
    },
    lock: true,
    points: null,       //当前区域点位置
});

export default (state = initialState, action) => {
    const {type, payload} = action;

    //根据区域id获取区域对象
    if (type === QUERY_AREA_BY_ID_FINISH) {
        return state.set('area', fromJS(payload.area));
    }

    //地图区域表单锁定
    if (type === LOCK_FORM) {
        return state.set('lock', true);
    }

    //地图区域表单解锁
    if (type === UNLOCK_FORM) {
        return state.set('lock', false);
    }

    //清空表单
    if (type === EMPTY_AREA_FORM) {
        return state.set('area', fromJS({
            "id": "",
            "areaName": "",
            "areaType": 0,
            "areaStyle": '{"backgroundColor":"","opacity":0.5}',
            "polygon": null,
        }));
    }

    //当前地图绘制的区域坐标点
    if (type === CURENTPOINTS) {
        return state.set('points', payload.points);
    }

    return state;
}

