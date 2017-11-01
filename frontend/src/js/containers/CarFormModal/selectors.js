/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 添加车辆 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectorCarFormModal = (state) => state.get('carFormModal');

const carEntitySelector = () => createSelector(
    selectorCarFormModal,
    (carModalState) => carModalState.get('carEntity')
);

const modalVisibleSelector = () => createSelector(
    selectorCarFormModal,
    (carModalState) => carModalState.get('modalVisible')
);

const operationSelector = () => createSelector(
    selectorCarFormModal,
    (carModalState) => carModalState.get('operation')
);


const operationRunningSelector = () => createSelector(
    selectorCarFormModal,
    (carModalState) => carModalState.get('operationRunning')
);

const imgURLSelector = () => createSelector(
    selectorCarFormModal,
    (carModalState) => carModalState.get('imgURL')
);

export {
    selectorCarFormModal,
    carEntitySelector,
    modalVisibleSelector,
    operationSelector,
    operationRunningSelector,
    imgURLSelector
};
