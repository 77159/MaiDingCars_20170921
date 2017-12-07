/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计信息对话框（Modal） selectors
 */
'use strict';
import {
    createSelector
} from 'reselect';

const selectorStatisticalFormModal = (state) => state.get('StatisticalFormModal');

const deviceEntitySelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('deviceEntity')
);

const modalVisibleSelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('modalVisible')
);

const operationSelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('operation')
);
const operationRunningSelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('operationRunning')
);

const centerAreaEntitySelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('centerAreaEntity')
);

const isShowSelector = () => createSelector(
    selectorStatisticalFormModal,
    (statisticalModalState) => statisticalModalState.get('isShow')
);

export {
    selectorStatisticalFormModal,
    deviceEntitySelector,
    modalVisibleSelector,
    operationSelector,
    operationRunningSelector,
    centerAreaEntitySelector,
    isShowSelector
};