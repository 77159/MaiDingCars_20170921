/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 顶部导航 Sagas
 */
'use strict';
import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {LOGIN_OUT} from '../HeadContainer/constants';
import {showSuccessMessage, showErrorMessage} from '../App/actions';
import {loginOutAPI} from '../../api/serverApi';
import {browserHistory} from 'react-router';
import requestError from "../../utils/requestError";


export function* loginOutSaga(action) {
    try {
        //发起异步网络请求，并获取返回结果
        const response = yield call(loginOutAPI, action);
        console.log(response);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.DROP_OUT_ERROR));
        } else {
            yield put(showSuccessMessage(requestError.DROP_OUT_SUCCESS));
            browserHistory.push('/');    //切换页面
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.DROP_OUT_ERROR));
    }
}

/**
 * 设置监听
 */
export function* watchFetchData() {
    const watcher = yield takeLatest(LOGIN_OUT, loginOutSaga);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    watchFetchData,
];
