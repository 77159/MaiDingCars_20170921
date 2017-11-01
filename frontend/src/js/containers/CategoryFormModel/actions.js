/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/8/6
 * @describe 车辆类型管理 Actions
 */
'use strict';
import {
    GET_CARCATEGORY,
    GET_CARCATEGORY_FINISH,
    POST_CARCATEGORY,
    DELETE_CARCATEGORY,
    GET_CARCATEGORYBYID,
    GET_CARCATEGORYFINISH,
    PUT_CARCATEGORY,
    UPDATE_OPERATIONRUNNING,
    GET_CAR_CATEGORY_PARENT_BY_ID,
    GET_CAR_CATEGORY_PARENT_BY_ID_FINISH,
    UPDATE_CAR_CATEGORY_NAME,
    EMPTY_CAR_CATEGORY_ID,
    UPDATE_CAR_LEVEL_NAME,
    IMAGE_URL,
    QUERY_AREA,
    QUERY_AREA_FINISH,
    UPDATE_AREA
} from './constants';

/**
 * 查询车辆类别
 */
export const getCarCategory = () => ({
    type: GET_CARCATEGORY,
});

/**
 * 查询车辆类型完成
 * @param carCategory 车辆类型对象
 */
export const getCarCategoryFinish = (carCategory) => ({
    type: GET_CARCATEGORY_FINISH,
    payload: carCategory,
});

/**
 * 查询所有区域
 */
export const queryArea = () => ({
    type: QUERY_AREA,
});

/**
 * 查询所有区域完成
 * @param areaName 车辆类型对象
 */
export const queryAreaFinish = (areaName) => ({
    type: QUERY_AREA_FINISH,
    payload: areaName,
});


/**
 * 根据车辆类型id查询车辆类型
 * @param id 车辆类型id
 */
export const getCarCategoryById = (id) => ({
    type: GET_CARCATEGORYBYID,
    id: id,
});

/**
 * 根据车辆类型id查询车辆类型
 * @param category 车辆类型对象
 */
export const getCarCategoryByIdFinish = (category) => ({
    type: GET_CARCATEGORYFINISH,
    payload: category
});

/**
 * 清空车辆类型id,当在修改页面切换到新建页面时可以清空
 * @constructor
 */
export const emptyCarCategoryId = () => ({
    type: EMPTY_CAR_CATEGORY_ID,
});

/**
 * 更新车辆类型名称
 * @param typeName  车辆类型对象
 */
export const updateCarCategoryName = (typeName) => ({
    type: UPDATE_CAR_CATEGORY_NAME,
    payload: {
        typeName,
    }
});

/**
 * 添加车辆类型
 * @param carCategory 车辆类型对象
 */
export const postCarCategory = (carCategory) => ({
    type: POST_CARCATEGORY,
    carCategory,
});

/**
 * 修改车辆类型
 * @param carCategory 车辆类型对象
 */
export const putCarCategory = (carCategory) => ({
    type: PUT_CARCATEGORY,
    carCategory,
});

/**
 * 根据车辆类型id删除车辆类型
 * @param id 车辆类型id
 */
export const deleteCarCategory = (id) => ({
    type: DELETE_CARCATEGORY,
    id: id,
});


/**
 * 更新操作状态值
 * @param operationRunning 操作类型
 */
export const updateOperationrunning = (operationRunning) => ({
    type: UPDATE_OPERATIONRUNNING,
    payload: {
        operationRunning
    }
});

/**
 * 查询图片组件传递过来的图片路径
 * @param imgUrl
 */
export const getImgUrl = (imgUrl) => ({
    type: IMAGE_URL,
    payload:{imgUrl}
});


/**
 * 更新区域名称
 * @param area
 */
export const updateArea = (area) => ({
    type: UPDATE_AREA,
    payload: {
        area,
    }
});