/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/1
 * @describe 系统主界面（程序入口）
 */
'use strict';
// Needed for redux-saga es6 generator support
import 'babel-polyfill';
import React from 'react';
import {
    render
} from 'react-dom';
import {
    Provider
} from 'react-redux';
import {
    Router,
    browserHistory
} from 'react-router';
import {
    syncHistoryWithStore
} from 'react-router-redux';
//引入主容器
import App from './containers/App';
import Login from './containers/LoginPage';

//Import selector for `syncHistoryWithStore`
import {
    makeSelectLocationState
} from './containers/App/selectors';
//import 'sanitize.css/sanitize.css';   // CSS 基础库，增强兼容性

import {
    AppConfig
} from './core/appConfig';

//引入全局 redux store
import configureStore from './core/store';
//引入路由
import createRoutes from './core/route';

//初始化state(状态)，可用于历史状态加载
const initialState = {};
//初始化路由，可用于历史路由加载
//const browserHistory = useRouterHistory(createBrowserHistory)();
//创建ReduxStore
const store = configureStore(initialState, browserHistory);

//同步历史路由和Store
const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: makeSelectLocationState(),
});

//设置路由，将所有路由都包装到App组件中。
const rootRoute = [{
    path: '/login',
    component: App,
    indexRoute: {
        component: Login
    },
    childRoutes: createRoutes(store)
}];


//Root App Element
const targetEl = document.getElementById('app');
const RootApp = () => (
    <Provider store={store}>
        <Router
            history={history}
            routes={rootRoute}
            // render={
            //     // Scroll to top when going to a new page, imitating default browser
            //     // behaviour
            //     applyRouterMiddleware(useScroll())
            // }
        />
        {/*
            {/!*<LoadingPanel />*!/}
            {/!*!//NotificationPanel 组件必须放在下面两个组件之前，否则会有渲染异常*!/}
            <NotificationPanel />
            <HeadToolbar />
            <MapContainer />*/}
        {/*<MainLayout/>*/}
    </Provider>
);

//渲染主程序组件
render(<RootApp/>, targetEl);

//接口服务地址
window.serviceUrl = AppConfig.serviceUrl;
window.imgServiceUrl = AppConfig.imgServiceUrl;
window.token = AppConfig.token;
window.lock = AppConfig.lockNum;
window.fmapID = AppConfig.fmapID;