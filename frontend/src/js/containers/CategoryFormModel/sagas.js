/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/8/6
 * @describe 车辆类型管理 Sagas
 */
'use strict';
import {take, call, put, cancel, takeLatest} from 'redux-saga/effects';

import {
    GET_CARCATEGORY,
    POST_CARCATEGORY,
    DELETE_CARCATEGORY,
    GET_CARCATEGORYBYID,
    PUT_CARCATEGORY,
    GET_CAR_CATEGORY_PARENT_BY_ID,
    QUERY_AREA,
    QUERY_AREA_FINISH
} from './constants';

import {
    getCarCategory,
    getCarCategoryFinish,
    updateOperationrunning,
    getCarCategoryByIdFinish,
    queryAreaFinish
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";
import requestError from "../../utils/requestError";
import {
    getAllCarCategoryAPI,
    postCarCategory,
    deleteCarCategory,
    getCarCategoryById,
    putCarCategory,
    queryArea
} from '../../api/serverApi';
import {LOCATION_CHANGE} from 'react-router-redux';

/**
 * 获取车辆类型
 */
export function* getAllCarCategorySaga() {
    try {
        const response = yield call(getAllCarCategoryAPI);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示信息
        } else {
            yield put(getCarCategoryFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_CARCATEGORY_ERROR)); //提示信息
    }
}

/**
 * 获取区域列表
 */
export function* queryAreaSaga() {
    try {
        const response = yield call(queryArea);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示信息
        } else {
            yield put(queryAreaFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_CARCATEGORY_ERROR)); //提示信息
    }
}

/**
 * 添加车辆类型
 * @param action
 */
export function* postCarCategorySaga(action) {
    try {
        //操作开始
        yield put(updateOperationrunning(true));
        const response = yield call(postCarCategory, action.carCategory);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示信息
        } else {
            yield put(showSuccessMessage(requestError.POST_CARCATEGORY_SUCCESS));   //提示信息
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.POST_CARCATEGORY_ERROR));
    }

    //重新加载车辆类型列表
    yield put(getCarCategory());
    //操作结束
    yield put(updateOperationrunning(false));
}

/**
 * 删除车辆类型
 * @param action
 */

export function* deleteCarCategorySaga(action) {
    try {
        const response = yield call(deleteCarCategory, action.id);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            if (response.error_code === 10010) {
                yield put(showErrorMessage('该类别已经被使用，无法删除，请先取消车辆关联后再进行尝试'));   //提示错误信息
            } else {
                yield put(showErrorMessage(requestError.error_message));   //提示错误信息
            }
        } else {
            yield put(showSuccessMessage(requestError.DELETE_CARCATEGORY_SUCCESS));
        }
    } catch (err) {
        console.log(err);
        yield put(showErrorMessage(requestError.DELETE_CARCATEGORY_ERROR));
    }
    //重新加载车辆类型列表
    yield put(getCarCategory());
}


/**
 * 修改车辆类型对象
 * @param action
 */
export function* putCarCategorySaga(action) {
    try {
        yield put(updateOperationrunning(true));
        const response = yield call(putCarCategory, action.carCategory);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));       //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.PUT_CARCATEGORY_SUCCESS));   //提示错误信息
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.PUT_CARCATEGORY_ERROR));
    }
    yield put(getCarCategory());
    yield put(updateOperationrunning(false));
}


/**
 * 根绝id获取车辆类型对象
 * @param actions
 */
export function* getCarCategoryByIdSaga(action) {
    try {
        const response = yield call(getCarCategoryById, action.id);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.error_message));   //提示错误信息
        } else {
            yield put(getCarCategoryByIdFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_CARCATEGORY_ERROR)); //提示信息
    }
}

/**
 * 根据车辆类型id查询车辆类型
 * @param action
 */
export function* getCarCategoryParentByIdSaga(action) {
    try {
        const response = yield call(getCarCategoryById, action.id);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(requestError.error_message));   //提示错误信息
        } else {
            yield put(getCarCategoryParentByIdFinish(response));
        }
    } catch (err) {
        yield put(showErrorMessage(requestError.GET_CARCATEGORY_ERROR)); //提示信息
    }
}


/**
 * 监听
 */
export function* watchFetchData() {
    //监听 查询车辆类型列表   queryAreaSaga
    const watchGetCarCategory = yield takeLatest(GET_CARCATEGORY, getAllCarCategorySaga);
    //监听 查询车辆类型列表
    const watchQueryAreaSaga = yield takeLatest(GET_CARCATEGORY, queryAreaSaga);
    //监听 添加车辆类型
    const watchAddCarCategory = yield takeLatest(POST_CARCATEGORY, postCarCategorySaga);
    //监听 修改车辆类型
    const watchPutCarCategory = yield  takeLatest(PUT_CARCATEGORY, putCarCategorySaga);
    //监听 根据id查询车辆类型对象
    const watchGetCarCategoryById = yield  takeLatest(GET_CARCATEGORYBYID, getCarCategoryByIdSaga);
    //监听 删除车辆类型
    const watchDeleteCarCategory = yield takeLatest(DELETE_CARCATEGORY, deleteCarCategorySaga);
    //监听 根据id查询车辆父类型
    const watchGetCarCategoryParentById = yield  takeLatest(GET_CAR_CATEGORY_PARENT_BY_ID, getCarCategoryParentByIdSaga);

    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);

    //console.log('========Cancel device watcher=========');

    yield cancel(watchGetCarCategory);
    yield cancel(watchAddCarCategory);
    yield cancel(watchPutCarCategory);
    yield cancel(watchGetCarCategoryById);
    yield cancel(watchGetCarCategoryById);
    yield cancel(watchDeleteCarCategory);
    yield cancel(watchGetCarCategoryParentById);
    yield cancel(watchQueryAreaSaga);

}

export default [
    watchFetchData,
];
