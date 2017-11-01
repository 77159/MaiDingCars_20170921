/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 区域设置 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectorArea = (state) => state.get('area');

const SelectorListGroups = () => createSelector(
    selectorArea,
    (area) => area.get('listGroups')
);

const SelectorAreaList = () => createSelector(
    selectorArea,
    (area) => area.get('areaList')
);

const SelectkeyArea = () => createSelector(
    selectorArea,
    (area) => area.get('keyArea')
);

export {
    SelectorListGroups,
    SelectorAreaList,
    SelectkeyArea
};
