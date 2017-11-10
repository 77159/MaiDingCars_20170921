/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 主界面 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectMainContainer = (state) => state.get('mainContainer');

const realTimeLocationsSelector = () => createSelector(
    selectMainContainer,
    (globalState) => globalState.get('realTimeLocations')
);

const SelectorOnLineDevice = () => createSelector(
    selectMainContainer,
    (globalState) => globalState.get('onlineDevice')
);

/**
 * 获取当前所有的报警信息
 */
const alertMessageDataSelector = () => createSelector(
    selectMainContainer,
    (globalState) => globalState.get('alertMessageData')
);


/**
 * 获取当前所有的已在报警信息列表中的数据
 */
const alarmDatasSelector = () => createSelector(
    selectMainContainer,
    (globalState) => globalState.get('alarmDatas')
);

export {
    selectMainContainer,
    realTimeLocationsSelector,
    SelectorOnLineDevice,
    alertMessageDataSelector,
    alarmDatasSelector
};
