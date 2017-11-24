/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
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
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 轨迹回放 Actions
 */
'use strict';
import {
    TRACE_REPLAY,
    GET_TRACE_DATA,
    EMPTY_TRACE_DATA
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function changeTraceReplay(traceReplayMsg) {
    return {
        type: TRACE_REPLAY,
        payload: traceReplayMsg
    };
}

/**
 * 获取轨迹回放数据
 * @returns {{type}}
 */
export function getTraceData(traceData) {
    return {
        type: GET_TRACE_DATA,
        payload: traceData,
    };
}

/**
 * 清空人员轨迹回访数据
 * @returns {{type}}
 */
export function emptyTraceData() {
    return {
        type: EMPTY_TRACE_DATA,
    };
}

