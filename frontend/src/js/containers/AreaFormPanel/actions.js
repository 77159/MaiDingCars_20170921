/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置面板
 */
'use strict';

import {
    CREATE_AREA,
    QUERY_AREA_BY_ID_BEGIN,
    QUERY_AREA_BY_ID_FINISH,
    MODIFY_AREA,
    LOCK_FORM,
    UNLOCK_FORM,
    EMPTY_AREA_FORM,
    CURENTPOINTS,
} from './constants';

/**
 * 创建地图区域
 * @param area
 * @returns {{type, payload: {area: *}}}
 */
export const createArea = (area) => ({
    type: CREATE_AREA,
    area
});

/**
 * 根据主键id获取当前区域开始
 * @param id 主键id
 */
export const queryAreaByIdBegin = (id) => ({
    type: QUERY_AREA_BY_ID_BEGIN,
    id
});

/**
 * 根据主键id获取当前区域完成
 * @param area
 */
export const queryAreaByIdFinish = (area) => ({
    type: QUERY_AREA_BY_ID_FINISH,
    payload: {
        area,
    }
});

/**
 * 修改地图区域设置
 * @param area
 */
export const modifyArea = (area) => ({
    type: MODIFY_AREA,
    area
});


/**
 * 锁定地图区域表单
 * @returns {{type}}
 */
export function lockForm() {
    return {
        type: LOCK_FORM,
    }
}

/**
 * 解锁地图区域设置表单
 * @returns {{type}}
 */
export function unLockForm() {
    return {
        type: UNLOCK_FORM,
    }
}

/**
 * 清空当前表单的值
 * @returns {{type}}
 */
export function emptyAreaForm() {
    return {
        type: EMPTY_AREA_FORM,
    }
}

/**
 * 当前地图绘制的区域坐标点
 * @param points 坐标点你
 * @returns {{type, payload: {points: *}}}
 */
export function curentPoints(points) {
    return {
        type: CURENTPOINTS,
        payload: {
            points
        }
    }
}

