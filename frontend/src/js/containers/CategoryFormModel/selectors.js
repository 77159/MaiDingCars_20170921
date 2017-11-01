/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/8/6
 * @describe 车辆类型管理 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectorCategoryForm = (state) => state.get('categoryFormModal');

/**
 * 车辆类型数据集合
 */
const carCategorySourceSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('carCategory')
);

/**
 * 区域列表数据集合
 */
const areaNameSourceSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('areaName')
);


/**
 * 当前操作状态
 */
const operationRunningSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('operationRunning')
);


/**
 * 车辆类型名称
 */
const typeNameSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('typeName')
);

/**
 * 车辆类别id
 */
const idSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('id')
);

/**
 * 区域名称
 */
const areaSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('area')
);

/**
 * imgUrl
 */
const imgUrlSelector = () => createSelector(
    selectorCategoryForm,
    (carCategoryState) => carCategoryState.get('imgUrl')
);


const imgUrlComponentSelector = () => createSelector(
    selectorCategoryForm,
    (carModalState) => carModalState.get('imgUrl')
);

export {
    carCategorySourceSelector,
    operationRunningSelector,
    typeNameSelector,
    idSelector,
    areaSelector,
    imgUrlSelector,
    imgUrlComponentSelector,
    areaNameSourceSelector
};
