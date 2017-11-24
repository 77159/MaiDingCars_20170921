/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计分析页面 selectors
 */

'use strict';
import {
    createSelector
} from 'reselect';

const selectorStatistical = (state) => state.get('statistical');

const tableDataLoadingSelector = () => createSelector(
    selectorStatistical,
    (statisticalState) => statisticalState.get('tableDataLoading')
);

const carMsgSelector = () => createSelector(
    selectorStatistical,
    (statisticalState) => statisticalState.get('carMsg')
);

const carMsgListSelector = () => createSelector(
    selectorStatistical,
    (statisticalState) => statisticalState.get('carMsgList')
);

const statisticalEntitySelector = () => createSelector(
    selectorStatistical,
    (deviceModalState) => deviceModalState.get('statisticalEntity')
);

const densityEntitySelector = () => createSelector(
    selectorStatistical,
    (deviceModalState) => deviceModalState.get('densityEntity')
);

const speedEntitySelector = () => createSelector(
    selectorStatistical,
    (deviceModalState) => deviceModalState.get('speedEntity')
);

const abnormalEntitySelector = () => createSelector(
    selectorStatistical,
    (deviceModalState) => deviceModalState.get('abnormalEntity')
);

export {
    statisticalEntitySelector,
    selectorStatistical,
    tableDataLoadingSelector,
    carMsgSelector,
    carMsgListSelector,
    densityEntitySelector,
    speedEntitySelector,
    abnormalEntitySelector
};