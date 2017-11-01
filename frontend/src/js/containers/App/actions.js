/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 系统入口页面,路由的顶层 Action
 */
'use strict';
/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */
import {
    SHOW_MESSAGE
} from './constants';

/**
 * 显示提示信息
 * @param message 提示信息对象，
 * message：{
 *     type:[success|error|info|warning|warn|loading]  提示信息类型
 *     content:string|ReactNode   提示内容
 *     duration:number  自动关闭的延时，单位秒，默认值3秒
 * }
 * 详细信息请参考：https://ant.design/components/message-cn/
 */
export const showMessage = (message) => ({
    type: SHOW_MESSAGE,
    payload: message
});

/**
 * 显示错误信息
 * @param message 提示信息对象
 * @link showMessage
 */
export const showErrorMessage = (message) => {
    let warpMsg = {
        type: 'error',
        content: message
    };
    return showMessage(warpMsg);
};

/**
 * 显示成功信息
 * @param message 提示信息对象
 * @link showMessage
 */
export const showSuccessMessage = (message) => {
    let warpMsg = {
        type: 'success',
        content: message
    };
    return showMessage(warpMsg);
};