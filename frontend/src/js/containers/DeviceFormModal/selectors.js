/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备信息对话框（Modal）组件 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectorDeviceFormModal = (state) => state.get('deviceFormModal');

const deviceEntitySelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('deviceEntity')
);

const modalVisibleSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('modalVisible')
);

const operationSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('operation')
);
const operationRunningSelector = () => createSelector(
    selectorDeviceFormModal,
    (deviceModalState) => deviceModalState.get('operationRunning')
);

export {
    selectorDeviceFormModal,
    deviceEntitySelector,
    modalVisibleSelector,
    operationSelector,
    operationRunningSelector
};
