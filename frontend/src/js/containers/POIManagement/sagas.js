/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  {zxg} (zhangxiaoguang@fengmap.com)
 * @date     {2016/11/8}
 * @describe 地图容器异步请求
 */

//import validator from 'validator';
import {
	SagaCancellationException
} from 'redux-saga';
import {
	fork,
	take,
	call,
	put,
	race,
	cancel
} from 'redux-saga/effects';
import * as actions from './actions.js';

import {
	serverApi,
	cookies
} from '../../api';

import * as notifyActions from '../../components/notificationPanel/actions.js';
import requestError from '../../utils/contants/requestError';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

/**
 * 请求用户图标数据
 * @yield {getUserPoiIcon} [请求后台方法]
 */
function* getUserPoiIcon() {
	while (true) {

		//没有参数也必须写，不然就一直发请求
		const {} = yield take(actions.GET_USER_POI_ICON);

		try {
			const response = yield call(serverApi.getUserPoiIcon);

			//yield put(signInModalActions.hideModal());
			//TODO 获取成功提示
			//yield put(messageActions.success('Signing in to your account has been done successfully.'));
			//错误提示
			if (!response || response.success == false) {
				yield put(notifyActions.requsetError(requestError.GET_USERPOI_ERROR));
			} else {
				yield put(actions.getUserPoiIconDone(response));
			}
		} catch (error) {
			//TODO 提示错误信息
			console.log("getUserPoiIcon error:" + (error.message ? error.message : error));
			yield put(notifyActions.requsetError(requestError.REQUEST_ERROR));
		}
		//TODO 隐藏加载进度条
		console.log("getUserPoiIcon finish.");

	}
}

/**
 * 获取系统默认图标
 * @yield {[type]} [description]
 */
function* getDefaultPoiIcon() {
	while (true) {

		//没有参数也必须写，不然就一直发请求
		const {} = yield take(actions.GET_DEFAULT_POI_ICON);

		try {
			const response = yield call(serverApi.getDefaultPoiIcon);
			yield put(actions.getDefaultPoiIconDone(response));
			//yield put(signInModalActions.hideModal());
			//TODO 获取成功提示
			console.log("getDefaultPoiIcon is successful!");
			//错误提示
			if (!response || response.success == false) {
				yield put(notifyActions.requsetError(requestError.GET_DEFAULTPOI_ERROR));
			}
			//yield put(messageActions.success('Signing in to your account has been done successfully.'));
		} catch (error) {
			//TODO 提示错误信息
			console.log("getDefaultPoiIcon error:" + (error.message ? error.message : error));
			yield put(notifyActions.requsetError(requestError.REQUEST_ERROR));
		}
		//TODO 隐藏加载进度条
		console.log("getDefaultPoiIcon finish.");

	}
}

/**
 * 删除用户图标
 * @yield {[type]} [description]
 */
function* removeUserPoiIcon() {
	while (true) {

		//没有参数也必须写，不然就一直发请求
		const {
			payload: {
				removePoi,
				callback
			}
		} = yield take(actions.REMOVE_USER_POI_ICON);

		try {
			const response = yield call(serverApi.removeUserPoiIcon, removePoi);
			if (response.success) {

				yield put(actions.removeUserPoiIconDone(response, callback));

				if (!response || response.success == false) {
					yield put(notifyActions.requsetError(requestError.REMOVE_USERPOI_ERROR));
				}

				yield put(actions.getUserPoiIcon());
			}
			//console.log('repsonse', repsonse);
			//
			//yield put(signInModalActions.hideModal());
			//TODO 获取成功提示
			console.log("removeUserPoiIcon is successful!");
			//yield put(messageActions.success('Signing in to your account has been done successfully.'));
		} catch (error) {
			//TODO 提示错误信息
			console.log("removeUserPoiIcon error:" + (error.message ? error.message : error));
			yield put(notifyActions.requsetError(requestError.REQUEST_ERROR));
		}
		//TODO 隐藏加载进度条
		console.log("removeUserPoiIcon finish.");

	}
}

/**
 * 编辑用户图标名称
 * @yield {[type]} [description]
 */
function* updateUserPoiIcon() {
	while (true) {

		//没有参数也必须写，不然就一直发请求
		const {
			payload: {
				updataPoi,
				callback
			}
		} = yield take(actions.UPDATE_USER_POI_ICON);

		try {
			const response = yield call(serverApi.updateUserPoiIcon, updataPoi);
			//错误提示
			if (!response || response.success == false) {
				yield put(notifyActions.requsetError(requestError.UPDATE_USERPOI_ERROR));
			}

			yield put(actions.updateUserPoiIconDone(response, callback));

			yield put(actions.getUserPoiIcon());
			//TODO 获取成功提示
			console.log("updateUserPoiIcon is successful!");
			//yield put(messageActions.success('Signing in to your account has been done successfully.'));
		} catch (error) {
			//TODO 提示错误信息
			console.log("updateUserPoiIcon error:" + (error.message ? error.message : error));
			yield put(notifyActions.requsetError(requestError.REQUEST_ERROR));
		}
		//TODO 隐藏加载进度条
		console.log("updateUserPoiIcon finish.");

	}
}

// main saga
export default function* mainSaga() {
	//请求用户图标数据
	yield fork(getUserPoiIcon);
	//请求系统默认图标数据
	yield fork(getDefaultPoiIcon);
	//删除用户图标
	yield fork(removeUserPoiIcon);
	//编辑用户图标名称
	yield fork(updateUserPoiIcon);
}