/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/12
 * @describe
 */

'use strict';
import {receivedCarLocation} from "../containers/MainContainer/actions";
//import locationSocket from './locationSocket';


import {dispatch} from 'redux';

const OPEN_SOCKET_CONNECTION_BEGIN = 'OPEN_SOCKET_CONNECTION_BEGIN';            //正在打开与服务器的WS连接
const OPEN_SOCKET_CONNECTION_SUCCESS = 'OPEN_SOCKET_CONNECTION_SUCCESS';        //成功建立与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_BEGIN = 'CLOSE_SOCKET_CONNECTION_BEGIN';          //正在关闭与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_SUCCESS = 'CLOSE_SOCKET_CONNECTION_SUCCESS';      //成功关闭与服务器的WS连接
const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';                                    //接收到来自服务器的消息
const ERROR_SOCKET_CONNECTION = 'ERROR_SOCKET_CONNECTION';                      //与服务器的连接发生错误
const UNKNOWN_COMMAND = 'UNKNOWN_COMMAND';                                      //未识别的命令

var worker;

export function createWebWorker(onMessage) {

    //创建web worker
    worker = new Worker("../../assets/libs/locationSocket.js");
    //var msgIndex = 0;
    //接收worker返回的信息
    worker.onmessage = onMessage;
}

export function openWS() {
    //向worker内部发送信息
    worker.postMessage({type: OPEN_SOCKET_CONNECTION_BEGIN, payload: window.token});
}

export function closeWS() {
    //向worker内部发送信息
    worker.postMessage({type: CLOSE_SOCKET_CONNECTION_BEGIN});
}