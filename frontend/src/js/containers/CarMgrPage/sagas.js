/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理 Sagas
 */
'use strict';
import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';

import {
    CREATE_CAR,
    MODIFY_CAR,
    CAR_OP_BEGIN,
    CAR_OP_FINISH,
    QUERY_ALL_CAR_BEGIN,
    QUERY_ALL_CAR_FINISH,
    DELETE_CAR
} from './constants';

import {
    carOpBegin,
    carOpFinish,
    queryAllCarBegin,
    queryAllCarFinish,
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";
import requestError from "../../utils/requestError";
import {queryAllCarAPI, deleteCarsAPI} from '../../api/serverApi';
import {LOCATION_CHANGE} from 'react-router-redux';
import {createCarSaga} from "../CarFormModal/sagas";
import {modifyCarSaga} from "../CarFormModal/sagas";

/**
 * 获取所有车辆数据
 */
export function* queryAllCarSaga() {
    try {
        //操作开始，更新loading的state
        yield put(carOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllCarAPI);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.GET_DATA_ERROR));   //提示错误信息
        } else {
            //成功拿到数据时，返回结果数据，让redux来更新state
            yield put(queryAllCarFinish(response));
        }
    } catch (err) {
        console.log(err);
        yield put(showErrorMessage(requestError.REQUEST_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(carOpFinish());
}

export function* delCarSaga(action) {
    try {
        const response = yield call(deleteCarsAPI, {carCode: action.carCode});
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.GET_DATA_ERROR));   //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.DELETE_SUCCESS));   //提示成功信息
        }
    } catch (err) {
        console.log(err);
        yield put(showErrorMessage(requestError.REQUEST_ERROR));
    }
    yield put(queryAllCarBegin());
}

export function* watchFetchData() {
    //设置监听
    const queryAllCarWatcher = yield takeLatest(QUERY_ALL_CAR_BEGIN, queryAllCarSaga);
    //设置监听
    const createCarWatcher = yield takeLatest(CREATE_CAR, createCarSaga);
    //监听修改车辆
    const modifyWatcher = yield takeLatest(MODIFY_CAR, modifyCarSaga);

    //设置监听 删除
    const watcherDelCar = yield takeLatest(DELETE_CAR, delCarSaga);

    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(queryAllCarWatcher);
    yield cancel(createCarWatcher);
    yield cancel(modifyWatcher);
    yield cancel(watcherDelCar);

}

// Bootstrap sagas
export default [
    watchFetchData,
];
