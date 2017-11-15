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
);

const carMsgListSelector = () => createSelector(
    selectorDevice,
    (deviceState) => deviceState.get('carMsgList')
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
    carMsgSelector,
    carMsgListSelector
};
