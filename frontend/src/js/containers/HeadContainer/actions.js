/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 顶部导航 Actions
 */
'use strict';
import {
    LOGIN_OUT
} from './constants';

export function loginOut() {
    return {
        type: LOGIN_OUT,
    };
}
