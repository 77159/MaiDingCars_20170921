/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备管理 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectorDeviceFormModal = (state) => state.get('deviceFormModal');

const deviceEntitySelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('deviceEntity')
);

const modalVisibleSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('modalVisible')
);

const operationSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('operation')
);
const operationRunningSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('operationRunning')
);

export {
    selectorDeviceFormModal,
    deviceEntitySelector,
    modalVisibleSelector,
    operationSelector,
    operationRunningSelector
};
