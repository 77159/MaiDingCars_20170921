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

const selectorDevice = (state) => state.get('device');

const deviceDataSourceSelector = () => createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('deviceDataSource')
);

const tableDataLoadingSelector=()=>createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('tableDataLoading')
);

const notDeviceDataSourceSelector = () => createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('notDeviceDataSource')
);

const deviceEntitySelector = () => createSelector(
    selectorDevice,
    (deviceModalState) => deviceModalState.get('deviceEntity')
);

export {
    deviceEntitySelector,
    selectorDevice,
    deviceDataSourceSelector,
    tableDataLoadingSelector,
    notDeviceDataSourceSelector
};
