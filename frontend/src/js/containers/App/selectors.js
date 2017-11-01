/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 系统入口页面,路由的顶层 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectGlobal = (state) => state.get('global');

const messageSelector = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('message')
);

const makeSelectLoading = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectLocationState = () => {
    let prevRoutingState;
    let prevRoutingStateJS;

    return (state) => {
        const routingState = state.get('route'); // or state.route

        if (!routingState.equals(prevRoutingState)) {
            prevRoutingState = routingState;
            prevRoutingStateJS = routingState.toJS();
        }

        return prevRoutingStateJS;
    };
};

export {
    selectGlobal,
    messageSelector,
    makeSelectRepos,
    makeSelectLocationState,
    makeSelectLoading,
    makeSelectError
};
