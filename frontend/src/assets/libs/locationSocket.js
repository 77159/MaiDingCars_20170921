/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/12
 * @describe
 */
'use strict';

//console.log("rtls web Worker running.");

const OPEN_SOCKET_CONNECTION_BEGIN = 'OPEN_SOCKET_CONNECTION_BEGIN';            //正在打开与服务器的WS连接
const OPEN_SOCKET_CONNECTION_SUCCESS = 'OPEN_SOCKET_CONNECTION_SUCCESS';        //成功建立与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_BEGIN = 'CLOSE_SOCKET_CONNECTION_BEGIN';          //正在关闭与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_SUCCESS = 'CLOSE_SOCKET_CONNECTION_SUCCESS';      //成功关闭与服务器的WS连接
const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';                                    //接收到来自服务器的消息
const ERROR_SOCKET_CONNECTION = 'ERROR_SOCKET_CONNECTION';                      //与服务器的连接发生错误
const UNKNOWN_COMMAND = 'UNKNOWN_COMMAND';                                      //未识别的命令

var token = '';
var wsUrl = '';

//处理由主线程发送过来的数据
self.onmessage = function (event) {
    const {
        type,
        payload
    } = event.data;

    token = payload;

    if (type === OPEN_SOCKET_CONNECTION_BEGIN) {
        wrapPostMessage(OPEN_SOCKET_CONNECTION_BEGIN, '正在连接 web socket 服务器...');
        openWS();
        return;
    }

    if (type === CLOSE_SOCKET_CONNECTION_BEGIN) {
        wrapPostMessage(CLOSE_SOCKET_CONNECTION_BEGIN, '正在关闭 web socket 服务器...');
        closeWS();
        return;
    }

    wrapPostMessage(UNKNOWN_COMMAND);
    return;
}

//var wsUrl = "ws://192.168.1.92:8080/websocket.ws";

var ws = null;

var onOpen = function (event) {
    //ws.send("type=1001");
    wrapPostMessage(OPEN_SOCKET_CONNECTION_SUCCESS, '成功连接到服务器');
};

var onError = function (event) {
    wrapPostMessage(ERROR_SOCKET_CONNECTION, 'WS 发生错误');
}

var onReceivedMessage = function (event) {
    wrapPostMessage(RECEIVED_MESSAGE, event.data);
};

var onClose = function (event) {
    wrapPostMessage(CLOSE_SOCKET_CONNECTION_SUCCESS, '关闭服务器连接 .... ok');
};

function newWebSocket(url, onopen, onmessage, onclose, onerror) {
    var new_ws = new WebSocket(url);
    new_ws.onopen = onopen;
    new_ws.onmessage = onmessage;
    new_ws.onclose = onclose;
    new_ws.onerror = onerror;
    return new_ws;
}

function openWS() {
    //wsUrl = "ws://192.168.1.92:8080/websocket.ws?token=" + token;
    wsUrl = "ws://123.56.157.161:8080/maiding-car-locate/websocket.ws?token=" + token;
    ws = newWebSocket(wsUrl, onOpen, onReceivedMessage, onClose, onError);
}

function closeWS() {
    ws.close();
}

/**
 * 发送消息至主线程
 * @param {string} type 消息类型
 * @param {object} data 回传的数据
 */
function wrapPostMessage(type, data = null) {
    const action = {
        type: type,
        payload: data
    };
    self.postMessage(action);
}