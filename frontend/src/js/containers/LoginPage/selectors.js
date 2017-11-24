/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 人员登陆 selectors
 */
'use strict';
import {
    createSelector
} from 'reselect';

const loginSelector = (state) => state.get('login');

/**
 * 人员登陆信息集合
 * loginMsg 人员信息对象
 */
const makeSelectUsername = () => createSelector(
    loginSelector,
    (homeState) => homeState.get('loginMsg')
);

/**
 * 当前操作状态
 */
const operationRunningSelector = () => createSelector(
    loginSelector,
    (loginModalState) => loginModalState.get('operationRunning')
);

export {
    makeSelectUsername,
    operationRunningSelector
};