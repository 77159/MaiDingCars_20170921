/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计分析页面 sagas
 */

'use strict';
import {
    take,
    call,
    put,
    select,
    cancel,
    takeLatest,
    takeEvery
} from 'redux-saga/effects';

import {
    CAR_MSG_BEGIN,
    CAR_MSG_LIST_BEGIN,
    GET_DENSITY_DATA,
    GET_SPEED_DATA,
    GET_ABNORMAL_DATA
} from './constants';

import {
    statisticalOpBegin,
    statisticalOpFinish,
    queryAllDeviceFinish,
    queryAllCarMsgFinish,
    queryAllCarMsgListFinish,
    getDensityDataDone,
    getSpeedDataDone,
    getAbnormalDataDone
} from './actions';

import {
    showErrorMessage,
} from "../App/actions";

import {
    queryAllDeviceAPI,
    queryAllCarMsgAPI,
    queryAllCarMsgListAPI,
    queryDensityStatics,
    querySpeedStatics,
    queryAbnormalStatics
} from '../../api/serverApi';
import {
    LOCATION_CHANGE
} from 'react-router-redux';
import requestError from "../../utils/requestError";


/**
 * 获取车辆信息数据
 */
export function* queryAllCarMsgSaga() {
    try {
        //操作开始，更新loading的state
        yield put(statisticalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllCarMsgAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR)); //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllCarMsgFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
}


/**
 * 获取车辆信息列表数据
 */
export function* queryAllCarMsgListSaga() {
    try {
        //操作开始，更新loading的state
        yield put(statisticalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllCarMsgListAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR)); //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllCarMsgListFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(statisticalOpFinish());
}

export function* queryDensitySaga(action) {
    try {
        let data = action.payload;
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryDensityStatics, data.startdate, data.enddate);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(response.error_msg)); //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(getDensityDataDone(response));
        }
    } catch (error) {
        //异常提示
        yield put(showErrorMessage(requestError.GET_DATA_ERROR));
    }
}

export function* querySpeedSaga(action) {
    try {
        let data = action.payload;
        //发起异步网络请求，并获取返回结果
        const response = yield call(querySpeedStatics, data.startdate, data.enddate);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(response.error_msg)); //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(getSpeedDataDone(response));
        }
    } catch (error) {
        //异常提示
        yield put(showErrorMessage(requestError.GET_DATA_ERROR));
    }
}

export function* queryAbnormalSaga(action) {
    try {
        let data = action.payload;
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAbnormalStatics, data.startdate, data.enddate);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(response.error_msg)); //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(getAbnormalDataDone(response));
        }
    } catch (error) {
        //异常提示
        yield put(showErrorMessage(requestError.GET_DATA_ERROR));
    }
}

export function* watchFetchData() {
    //监听查询车辆信息
    const queryAllCarMsgWatcher = yield takeLatest(CAR_MSG_BEGIN, queryAllCarMsgSaga);
    //监听查询车辆信息列表
    const queryAllCarMsgListWatcher = yield takeLatest(CAR_MSG_LIST_BEGIN, queryAllCarMsgListSaga);

    const queryDensityWatcher = yield takeLatest(GET_DENSITY_DATA, queryDensitySaga);
    const querySpeedWatcher = yield takeLatest(GET_SPEED_DATA, querySpeedSaga);
    const queryAbnormalWatcher = yield takeLatest(GET_ABNORMAL_DATA, queryAbnormalSaga);

    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(queryAllCarMsgWatcher);
    yield cancel(queryAllCarMsgListWatcher);
    yield cancel(queryDensityWatcher);
    yield cancel(querySpeedWatcher);
    yield cancel(queryAbnormalWatcher);
}

export default [
    watchFetchData
];