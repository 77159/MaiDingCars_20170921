/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆类型管理 Reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    GET_CARCATEGORY_FINISH,
    GET_CARCATEGORYFINISH,
    UPDATE_OPERATIONRUNNING,
    GET_CAR_CATEGORY_PARENT_BY_ID_FINISH,
    UPDATE_CAR_CATEGORY_NAME,
    UPDATE_CAR_LEVEL_NAME,
    EMPTY_CAR_CATEGORY_ID,
    IMAGE_URL,
    QUERY_AREA,
    QUERY_AREA_FINISH,
    UPDATE_AREA
} from './constants';

const initialState = fromJS({
    carCategory: [],         //当前所有车辆类型
    id: '',                     //车辆类型id
    //pid: '',                  //车辆类型pid
    typeName: '',               //车辆类型
    //name: '',                 //级别类型
    imgUrl: '',
    area: '',
    imgUrlComponent: '',
    operationRunning: false,    //操作状态
    //imgURL: ''
    areaName: []
});

export default (state = initialState, action = {}) => {
    const {type, payload} = action;

    //查询所有车辆类型对象
    if (type === GET_CARCATEGORY_FINISH) {
        return state.set('carCategory', payload);
    }

    //查询所有区域列表
    if (type === QUERY_AREA_FINISH) {
        return state.set('areaName', payload);
    }

    //根据id查询车辆类型
    if (type === GET_CARCATEGORYFINISH) {
        const value = payload;
        return state.set('id', value.id).set('typeName', value.typeName).set('area', value.area).set('imgUrl', value.imgUrl);
    }

    //更新当前操作状态
    if (type === UPDATE_OPERATIONRUNNING) {
        return state.set('operationRunning', payload.operationRunning)
    }

    //更新当前最新的车辆类型名称
    if (type === UPDATE_CAR_CATEGORY_NAME) {
        const typeName = payload.typeName;
        return state.set('typeName', typeName);
    }

    //更新当前最新的区域名称
    if (type === UPDATE_AREA) {
        const area = payload.area;
        return state.set('area', area);
    }

    //清空车辆类型id
    if (type === EMPTY_CAR_CATEGORY_ID) {
        return state.set('id', '').set('area', '').set('imgUrl', '').set('typeName', '');
    }

    //查询图片组件传递过来的图片路径
    if (type === IMAGE_URL) {
        return state
            .set('imgUrl', payload.imgUrl);
    }


    return state;
}