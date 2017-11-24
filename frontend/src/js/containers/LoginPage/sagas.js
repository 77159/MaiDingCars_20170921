/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 人员登陆 Sagas
 */
'use strict';
import {
    take,
    call,
    put,
    select,
    cancel,
    takeLatest
} from 'redux-saga/effects';
import {
    LOCATION_CHANGE
} from 'react-router-redux';
import {
    CHANGE_USERNAME
} from '../LoginPage/constants';
import {
    showMessage,
    showSuccessMessage,
    showErrorMessage
} from '../App/actions';
import {
    changeUsernameAPI
} from '../../api/serverApi';
import {} from '../../utils/requestError';
import {
    browserHistory
} from 'react-router';
import requestError from "../../utils/requestError";

import {
    loginFormModalOpBegin,
    loginFormModalOpFinish,
} from './actions';

import {
    AppConfig
} from '../../core/appConfig.js';

/**
 * 请求登陆
 * @param action
 */
export function* changeUsernameSaga(action) {
    try {
        let token = null;
        //操作开始，更新loading的state
        yield put(loginFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(changeUsernameAPI, action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            if (response.error_code === 202101) {
                yield put(showErrorMessage(requestError.LOGIN_USER_ERROR)); //提示错误信息
            }
        } else {
            token = response.token;
            AppConfig.token = token;
            yield put(showSuccessMessage(requestError.LOGIN_SUCCESS)); //提示成功信息
            browserHistory.push('/monitoring'); //切换页面
        }
    } catch (error) {
        //异常提示
        yield put(showErrorMessage(requestError.LOGIN_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(loginFormModalOpFinish(token));
}

/**
 * 设置监听
 */
export function* watchFetchData() {
    const watcher = yield takeLatest(CHANGE_USERNAME, changeUsernameSaga);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    watchFetchData
];