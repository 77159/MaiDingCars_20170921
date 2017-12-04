/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * These are the pages you can go to.
 * They are all wrapped in the App component, which should contain the navbar etc
 * See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
 * about the code splitting business
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 全局路由配置
 */
'use strict';
import {
    getAsyncInjectors
} from '../utils/asyncInjectors';

import MainContainer from '../containers/MainContainer';

const errorLoading = (err) => {
    console.error('动态页面加载失败', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
    cb(null, componentModule.default);
};

export default function createRoutes(store) {
    // create reusable async injectors using getAsyncInjectors factory
    const {
        injectReducer,
        injectSagas
    } = getAsyncInjectors(store);

    return [{
        path: '/main',
        //name: 'mainContainer',
        getComponent(nextState, cb) {
            const importModules = Promise.all([
                import ('../containers/MainContainer/reducer'),
                import ('../containers/MainContainer'),
                import ('../containers/ModifyPasswordModel/sagas'),
                import ('../containers/HeadContainer/sagas'),
                import ('../containers/AreaSettingPage/reducer'),
                import ('../containers/AreaSettingPage/sagas'),
                import ('../containers/CarMgrPage/reducer'),
                import ('../containers/CarMgrPage/sagas'),
                import ('../containers/CategoryFormModel/sagas'),
            ]);
            const renderRoute = loadModule(cb);
            importModules.then(([reducer, component, sagas, sagas2, areaReducer, areaSagas, carReducer, carSagas, categorySagas]) => {
                injectReducer('mainContainer', reducer.default);
                injectSagas(sagas.default);
                injectSagas(sagas2.default);
                injectSagas(areaSagas.default);
                injectReducer('area', areaReducer.default);
                injectReducer('car', carReducer.default);
                injectSagas(carSagas.default);
                injectSagas(categorySagas.default);
                renderRoute(component);
            });
            importModules.catch(errorLoading);
        },
        childRoutes: [{
            path: '/monitoring', //动态监控页面
            name: 'monitoring',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import ('../containers/MonitoringPage/reducer'),
                    import ('../containers/MonitoringPage/sagas'),
                    import ('../containers/CarMgrPage/reducer'),
                    import ('../containers/MonitoringPage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([reducer, sagas, carReducer, component]) => {
                    injectReducer('monitoring', reducer.default);
                    injectSagas(sagas.default);
                    injectReducer('car', carReducer.default);
                    renderRoute(component);
                });
                importModules.catch(errorLoading);
            }
        }, {
            path: '/trace', //轨迹回放页面
            name: 'trace',
            getComponent(nextState, cb) {

                const importModules = Promise.all([
                    import ('../containers/TraceReplayPage/reducer'),
                    import ('../containers/TraceReplayPage/sagas'),
                    import ('../containers/TraceReplayPage')
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([reducer, sagas, component]) => {
                    injectReducer('trace', reducer.default);
                    injectSagas(sagas.default);

                    renderRoute(component);
                });
                importModules.catch(errorLoading);

            }
        }, {
            path: '/heat', //热力图
            name: 'heat',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import ('../containers/HeatPage/reducer'),
                    import ('../containers/HeatPage/sagas'),
                    import ('../containers/HeatPage')
                ]);

                const renderRoute = loadModule(cb);
                importModules.then(([reducer, sagas, component]) => {
                    injectReducer('heat', reducer.default);
                    injectSagas(sagas.default);
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        }, {
            path: '/area', //区域设置页面
            name: 'area',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    //import ('../containers/AreaSettingPage/reducer'),
                    import ('../containers/AreaFormPanel/sagas'),
                    import ('../containers/AreaFormPanel/reducer'),
                    import ('../containers/AreaSettingPage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([sagas2, reducer2, component]) => {
                    // injectReducer('area', reducer.default);
                    injectSagas(sagas2.default);
                    injectReducer('areaForm', reducer2.default);
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        }, {
            path: '/statistical', //统计分析
            name: 'statistical',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import ('../containers/StatisticalPage/reducer'),
                    import ('../containers/StatisticalPage/sagas'),
                    import ('../containers/StatisticalFormModal/reducer'),
                    import ('../containers/StatisticalFormModal/sagas'),
                    import ('../containers/StatisticalPage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([reducer, sagas, reducer2, sagas2, component]) => {
                    injectReducer('statistical', reducer.default);
                    injectSagas(sagas.default);
                    injectReducer('StatisticalFormModal', reducer2.default);
                    injectSagas(sagas2.default);
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        }, {
            path: '/device', //设备管理页面
            name: 'device',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import ('../containers/DeviceMgrPage/reducer'),
                    import ('../containers/DeviceMgrPage/sagas'),
                    import ('../containers/DeviceMgrPage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([reducer, sagas, component]) => {
                    injectReducer('device', reducer.default);
                    injectSagas(sagas.default);
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        }, {
            path: '/car', //车辆管理页面
            name: 'car',
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    import ('../containers/DeviceMgrPage/reducer'),
                    import ('../containers/DeviceMgrPage/sagas'),
                    import ('../containers/CarMgrPage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([deviceReducer, sagas3, component]) => {
                    injectReducer('device', deviceReducer.default);
                    injectSagas(sagas3.default);
                    renderRoute(component);
                });

                importModules.catch(errorLoading);
            }
        }]
    }, {
        path: '/',
        name: 'login',
        //component: Login
        getComponent(nextState, cb) {
            const importModules = Promise.all([
                import ('../containers/LoginPage/reducer'),
                import ('../containers/LoginPage/sagas'),
                import ('../containers/LoginPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
                injectReducer('login', reducer.default);
                injectSagas(sagas.default);
                renderRoute(component);
            });

            importModules.catch(errorLoading);
        }
    },
        /*{
         path: '*',
         name: 'notfound',
         component: NotFoundPage,
         }*/

        /* {
         path: '/login',                   //登录页面
         name: 'login',
         getComponent(nextState, cb) {
         import('../containers/LoginPage')
         .then(loadModule(cb))
         .catch(errorLoading);
         }
         },*/
        /* {
         path: '*',                        //404页面
         name: 'notfound',
         getComponent(nextState, cb) {
         import('../containers/NotFoundPage')
         .then(loadModule(cb))
         .catch(errorLoading);
         }
         }*/
        // {
        //     path: '/',
        //     name: 'index',
        //     getComponent(nextState, cb) {
        //         const importModules = Promise.all([
        //             import('../containers/App/reducer'),
        //             //import('../containers/App/sagas'),
        //             import('../containers/App'),
        //         ]);
        //
        //         const renderRoute = loadModule(cb);
        //
        //         importModules.then(([reducer, component]) => {
        //             injectReducer('app', reducer.default);
        //             //injectSagas(sagas.default);
        //             renderRoute(component);
        //         });
        //         importModules.catch(errorLoading);
        //     },
        // },
        // {
        //     path: '/',
        //     name: 'home',
        //     getComponent(nextState, cb) {
        //         const importModules = Promise.all([
        //             import('containers/HomePage/reducer'),
        //             import('containers/HomePage/sagas'),
        //             import('containers/HomePage'),
        //         ]);
        //
        //         const renderRoute = loadModule(cb);
        //
        //         importModules.then(([reducer, sagas, component]) => {
        //             injectReducer('home', reducer.default);
        //             injectSagas(sagas.default);
        //
        //             renderRoute(component);
        //         });
        //
        //         importModules.catch(errorLoading);
        //     },
        // },
    ];
}