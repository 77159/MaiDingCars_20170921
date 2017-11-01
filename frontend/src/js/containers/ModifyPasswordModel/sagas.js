/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 修改密码 Sagas
 */
'use strict';
import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {
    MODIFY_PASSWORD,
    MODIFY_BEGIN,
    MODIFY_FINISH,
    MODIFY_FORM_MODAL_HIDE
} from './constants';
import {showMessage, showSuccessMessage, showErrorMessage} from '../App/actions';
import {modifyPasswordAPI} from '../../api/serverApi';

import {
    modifyFormModalOpBegin,
    modifyFormModalOpFinish,
    modifyFormModalHide
} from './actions';
import requestError from "../../utils/requestError";


/**
 * 修改密码
 */
export function* modifyPasswordSaga(action) {
    try {
        //操作开始，更新loading的state
        yield put(modifyFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(modifyPasswordAPI, action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            if(response.error_code === 202201) {
                yield put(showErrorMessage(requestError.MODIFY_USER_PASSWORD_ERROR));
            }
        } else {
            yield put(showSuccessMessage(requestError.MODIFY_PASSWORD_SUCCESS));          //提示成功信息
            yield put(modifyFormModalHide());
        }
    } catch (error) {
        console.log(error);
        //异常提示
        yield put(showErrorMessage(requestError.MODIFY_PASSWORD_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(modifyFormModalOpFinish());
}


/**
 * 设置监听
 */
export function* watchFetchData() {
    const watcher = yield takeLatest(MODIFY_PASSWORD, modifyPasswordSaga);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    watchFetchData,
];
