/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置面板
 */
'use strict';
import {take, call, put, takeLatest, cancel} from 'redux-saga/effects';

import {
    CREATE_AREA,
    QUERY_AREA_BY_ID_BEGIN,
    MODIFY_AREA
} from './constants';

import {
    queryAreaByIdFinish,
    emptyAreaForm,
} from './actions';

import {
    queryAreaListBegin,
} from '../AreaSettingPage/actions';

import {
    createArea,
    queryAreaById,
    modifyArea
} from '../../api/serverApi';

import {LOCATION_CHANGE} from 'react-router-redux';

import {
    showErrorMessage,
    showSuccessMessage,
} from "../App/actions";

import requestError from "../../utils/requestError";

/**
 * 创建地图区域
 * @param action 操作对象
 */
function* createAreaSaga(action) {
    try {
        const area = action.area;
        const response = yield call(createArea, area);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            if(response.error_code === 10008){
                yield put(showErrorMessage(requestError.CREATE_AREA_NAME_ERROR));
            } else {
                yield put(showErrorMessage(requestError.CREATE_AREA_ERROR));
            }
        } else {
            yield put(showSuccessMessage(requestError.CREATE_AREA_SUCCESS));   //提示成功信息
            yield put(queryAreaListBegin());        //更新区域列表
            yield put(emptyAreaForm());             //清空表单
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.CREATE_AREA_ERROR)); //提示信息
    }
}

/**
 * 根据主键id获取地图区域
 * @param action
 */
function* queryAreaByIdSaga(action) {
    try {
        const response = yield call(queryAreaById, action.id);
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示错误信息
        } else {
            //yield put(showSuccessMessage(requestError.QUERY_AREA_BY_ID_SUCCES));   //提示成功信息
            yield put(queryAreaByIdFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.QUERY_AREA_BY_ID_ERROR)); //提示信息
    }
}

/**
 * 更新地图区域
 * @param action 操作对象
 */
function* modifyAreaSaga(action) {
    try {
        const area = action.area;
        const response = yield  call(modifyArea, area);
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.MODIFY_AREA_SUCCESS));   //提示成功信息
            yield put(queryAreaListBegin());        //更新列表
            //yield put(queryAreaByIdBegin(area.id)); //更新表单
            yield put(emptyAreaForm());             //清空表单
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.MODIFY_AREA_ERROR)); //提示信息
    }
}

/**
 * 监听
 */
export function* watchFetchData() {
    //监听 获取地图区域
    const watchCreateArea = yield takeLatest(CREATE_AREA, createAreaSaga);
    //监听 根据主键id获取区域
    const watchQueryAreaByid = yield takeLatest(QUERY_AREA_BY_ID_BEGIN, queryAreaByIdSaga);
    //监听 修改地图区域
    const watchModifyArea = yield takeLatest(MODIFY_AREA, modifyAreaSaga);

    yield take([LOCATION_CHANGE]);

    yield cancel(watchCreateArea);
    yield cancel(watchQueryAreaByid);
    yield cancel(watchModifyArea);
}

export default [
    watchFetchData,
];