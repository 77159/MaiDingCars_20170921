/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 登陆管理 Actions
 */
'use strict';
import {
    CHANGE_USERNAME,
    LOGIN_BEGIN,
    LOGIN_FINISH
} from './constants';


/**
 * 登陆开始
 */
export const loginFormModalOpBegin = () => ({
    type: LOGIN_BEGIN
});

/**
 * 登陆结束
 */
export const loginFormModalOpFinish = () => ({
    type: LOGIN_FINISH
});

/**
 * 登陆
 * @param loginMsg 登陆信息对象
 */
export function changeUsername(loginMsg) {
    return {
        type: CHANGE_USERNAME,
        payload: loginMsg
    };
}
