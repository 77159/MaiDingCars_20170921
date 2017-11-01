/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置页面。路径为 '/area'
 */

'use strict';

import {
    QUERY_LISTGROUPS,
    QUERY_AREALIST_BEGIN,
    QUERY_AREALIST_FINISH,
    DELETE_AREAK_BY_ID,
} from './constants';

/**
 * 获取当前地图楼层集合
 * @param listGroups 地图楼层集合
 * @returns {{type, payload: {listGroups: *}}}
 */
export function queryListGroups(listGroups) {
    return {
        type: QUERY_LISTGROUPS,
        payload: {
            listGroups
        },
    };
}

/**
 * 开始获取当前地图区域
 * @returns {{type}}
 */
export function queryAreaListBegin() {
    return {
        type: QUERY_AREALIST_BEGIN,
    }
}

/**
 * 完成获取当前地图区域
 * @param areaList
 */
export function queryAreaListFinish(areaList) {
    return {
        type: QUERY_AREALIST_FINISH,
        payload: {
            areaList
        }
    }
}

/**
 * 根据主键id删除地图区域
 * @param areaName
 * @returns {{type: *, id: *}}
 */
export function deleteAreaById(areaName) {
    return {
        type: DELETE_AREAK_BY_ID,
        areaName
    }
}



