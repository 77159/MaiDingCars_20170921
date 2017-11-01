/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置面板
 */
'use strict';
import {createSelector} from 'reselect';

const selectorAreaForm = (state) => state.get('areaForm');

const SelectorArea = () => createSelector(
    selectorAreaForm,
    (areaForm) => areaForm.get('area')
);

const SelectorLock = () => createSelector(
    selectorAreaForm,
    (areaForm) => areaForm.get('lock')
);

const SelectorPoints = () => createSelector(
    selectorAreaForm,
    (areaForm) => areaForm.get('points')
);


export {
    SelectorArea,
    SelectorLock,
    SelectorPoints,
};