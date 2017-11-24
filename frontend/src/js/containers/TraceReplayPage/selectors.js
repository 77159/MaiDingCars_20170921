/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 轨迹回放 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectTrace = (state) => state.get('trace');

const SelectorTraceDataSource = () => createSelector(
    selectTrace,
    (homeState) => homeState.get('traceDataSource')
);

export {
    SelectorTraceDataSource,
};
