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

const selectHome = (state) => state.get('ModifyPasswordModel');

/**
 * 密码修改
 * passwordMsg 修改密码的信息集合
 */
const makeSelectUsername = () => createSelector(
    selectHome,
    (homeState) => homeState.get('passwordMsg')
);

/**
 * modal状态
 */
const modalVisibleSelector = () => createSelector(
    selectHome,
    (modifyPasswordModalState) => modifyPasswordModalState.get('modalVisible')
);

/**
 * 操作的动作
 */
const operationSelector = () => createSelector(
    selectHome,
    (modifyModalState) => modifyModalState.get('operation')
);

/**
 * 当前操作状态
 */
const operationRunningSelector = () => createSelector(
    selectHome,
    (loginModalState) => loginModalState.get('operationRunning')
);

export {
    selectHome,
    operationSelector,
    modalVisibleSelector,
    makeSelectUsername,
    operationRunningSelector
};
