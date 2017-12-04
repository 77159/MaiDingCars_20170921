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
 * @describe 轨迹回放 Actions
 */
'use strict';
import {
    CHANGE_USERNAME,
    UPDATE_LOADING,
    GET_HEATMAP_DATA,
    REQUEST_HEATMAP
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function changeUsername(name) {
    return {
        type: CHANGE_USERNAME,
        name,
    };
}

export function updateLoading(loading) {
    return {
        type: UPDATE_LOADING,
        loading
    }
}

/**
 * 请求热力图数据
 * @param parameter 请求热力图的条件参数
 * @returns {{type, parameter: *}}
 */
export function requestHeatMapData(param) {
    return {
        type: REQUEST_HEATMAP,
        param
    }
}

/**
 * 获取热力图数据
 * @param data 热力图数据
 * @returns {{type, data: *}}
 */
export function getHeatmapData(data) {
    return {
        type: GET_HEATMAP_DATA,
        data,
    }
}

