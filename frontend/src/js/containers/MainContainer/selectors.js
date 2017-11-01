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

export {
    selectMainContainer,
    realTimeLocationsSelector,
};
