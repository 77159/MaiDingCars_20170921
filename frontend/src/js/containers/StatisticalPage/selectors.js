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

const selectorDevice = (state) => state.get('statistical');

const deviceDataSourceSelector = () => createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('deviceDataSource')
);

const tableDataLoadingSelector=()=>createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('tableDataLoading')
);

const carMsgSelector = () => createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('carMsg')


    // (carState) => {
    // const carDataSource = carState.get('carDataSource') ? carState.get('carDataSource') : [];
    // return carDataSource.filter((item) => {
    //     return item.deviceCode !== null && item.deviceCode !== '';
    //      });
    // }

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
    carMsgSelector
};
