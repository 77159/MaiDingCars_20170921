/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/7
 * @describe 根Reducer（由其他所有reducer Combine 合并组成）
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
'use strict';
import {fromJS} from 'immutable';
import {combineReducers} from 'redux-immutable';
import {LOCATION_CHANGE} from 'react-router-redux';

import globalReducer from '../containers/App/reducer';
import deviceFormModalReducer from '../containers/DeviceFormModal/reducer';
import carFormModalReducer from '../containers/CarFormModal/reducer';
import ModifyPasswordModelReducer from '../containers/ModifyPasswordModel/reducer';
import categoryFormModalReducer from '../containers/CategoryFormModel/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */
// Initial routing state
const routeInitialState = fromJS({
    locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
    switch (action.type) {
        /* istanbul ignore next */
        case LOCATION_CHANGE:
            return state.merge({
                locationBeforeTransitions: action.payload,
            });
        default:
            return state;
    }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
    return combineReducers({
        route: routeReducer,
        global: globalReducer,
        deviceFormModal: deviceFormModalReducer,
        carFormModal: carFormModalReducer,
        categoryFormModal: categoryFormModalReducer,
        ModifyPasswordModel: ModifyPasswordModelReducer,

        ...asyncReducers,
    });
}
