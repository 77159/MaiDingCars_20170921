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

const selectHome = (state) => state.get('heat');

const makeSelectUsername = () => createSelector(
    selectHome,
    (homeState) => homeState.get('username')
);
const selectPlaying = () => createSelector(
    selectHome,
    (homeState) => homeState.get('playing')
);

export {
    selectHome,
    makeSelectUsername,
    selectPlaying
};
