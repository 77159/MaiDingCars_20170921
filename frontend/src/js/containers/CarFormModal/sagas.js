/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 添加车辆 Sagas
 */

'use strict';
import {take, call, put, select, cancel, takeLatest, takeEvery} from 'redux-saga/effects';

import {
    CAR_FORM_MODAL_SHOW,
    CAR_FORM_MODAL_HIDE,
    CAR_FORM_MODAL_OP_BEGIN,
    CAR_FORM_MODAL_OP_FINISH,
    CAR_FORM_MODAL_CREATE_CAR,
    CAR_FORM_MODAL_MODIFY_CAR,
    CAR_FORM_MODAL_VIEW_CAR,
} from './constants';

import {
    carFormModalHide,
    carFormModalOpBegin,
    carFormModalOpFinish,
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

import {createCarAPI, queryAllCarAPI, modifyCarAPI} from '../../api/serverApi';
import {LOCATION_CHANGE} from 'react-router-redux';
import requestError from "../../utils/requestError";
import {queryAllCarBegin} from "../CarMgrPage/actions";
import {CREATE_CAR} from "../CarMgrPage/constants";


/**
 * 添加车辆
 */
export function* createCarSaga(action) {
    try {
        //操作开始，更新loading的state
        yield put(carFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(createCarAPI, action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            if(response.error_code === 200101) {
                yield put(showErrorMessage(requestError.CREATE_CAR_NUM_ERROR));        //提示错误信息
            }
        } else {
            yield put(showSuccessMessage(requestError.CREATE_CAR_SUCCESS));   //提示成功信息
            //关闭窗口
            yield put(carFormModalHide());
            //车辆管理页面的数据重新加载
            yield put(queryAllCarBegin());
        }
    } catch (error) {
        console.log(error);
        //异常提示
        yield put(showErrorMessage(requestError.REQUEST_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(carFormModalOpFinish());

}

/*
 * 修改车辆信息
 * */
export function* modifyCarSaga(action) {
    try {
        //操作开始，更新loading的state
        yield put(carFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(modifyCarAPI, action.carEntity);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.MODIFY_CAR_ERROR));       //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.MODIFY_CAR_SUCCESS));   //提示成功信息
            //关闭窗口
            yield put(carFormModalHide());
            //车辆管理页面的数据重新加载
            yield put(queryAllCarBegin());
        }
    } catch (error) {
        console.log("修改车辆异常", error);
        //异常提示
        yield put(showErrorMessage(requestError.REQUEST_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(carFormModalOpFinish());
}


export function* watchFetchData() {
    //设置监听
    const createCarWatcher = yield takeLatest(CAR_FORM_MODAL_CREATE_CAR, createCarSaga);
    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(createCarWatcher);
}


export default [
    watchFetchData
];