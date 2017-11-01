/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/8/6
 * @describe 人员类型管理 Sagas
 */
'use strict';
import {take, call, put, takeLatest, cancel} from 'redux-saga/effects';

import {
    QUERY_AREALIST_BEGIN,
    DELETE_AREAK_BY_ID
} from './constants';

import {
    queryAreaListBegin,
    queryAreaListFinish
} from './actions';

import {
    queryArea,
    delteAreaById
} from '../../api/serverApi';

import {LOCATION_CHANGE} from 'react-router-redux';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

import requestError from "../../utils/requestError";

/**
 * 获取当前地图区域
 */
export function* queryAreaListSaga() {
    try {
        const response = yield call(queryArea);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.QUERY_AREALIST_ERROR));   //提示错误信息
        } else {
            yield put(queryAreaListFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_PEOPLECATEGORY_ERROR)); //提示信息
    }
}

/**
 * 根据主键id删除区域
 * @param action 操作对象
 */
export function* delteAreaSage(action) {
    try {
        const response = yield call(delteAreaById, action.areaName);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.DELETE_AREA_BY_ID_ERROR));   //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.DELETE_AREA_BY_ID_SUCCESS));   //提示成功信息
            yield put(queryAreaListBegin());                               //重新加载区域数据
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_PEOPLECATEGORY_ERROR)); //提示信息
    }
}

/**
 * 监听
 */
export function* watchFetchData() {

    //监听 获取地图区域
    const watchQueryAreaList = yield takeLatest(QUERY_AREALIST_BEGIN, queryAreaListSaga);

    //监听 根据主键id删除地图区域
    const watchDelteArea = yield takeLatest(DELETE_AREAK_BY_ID, delteAreaSage);

    yield take([LOCATION_CHANGE]);

    yield cancel(watchQueryAreaList);
    yield cancel(watchDelteArea);
}

export default [
    watchFetchData,
];
