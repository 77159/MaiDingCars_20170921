/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 实时监控页面 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectMonitoring = (state) => state.get('monitoring');

export {
    selectMonitoring
};