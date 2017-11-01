/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 主界面
 */
'use strict';
import React from 'react';
// import withProgressBar from 'components/ProgressBar';
import {Layout} from 'antd';
import HeadContainer from '../HeadContainer';
import styles from './index.less';
import {openWS, closeWS, createWebWorker} from "../../api/locationWebWorker";
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {receivedPeopleLocation} from "./actions";

const {Content} = Layout;


const OPEN_SOCKET_CONNECTION_BEGIN = 'OPEN_SOCKET_CONNECTION_BEGIN';            //正在打开与服务器的WS连接
const OPEN_SOCKET_CONNECTION_SUCCESS = 'OPEN_SOCKET_CONNECTION_SUCCESS';        //成功建立与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_BEGIN = 'CLOSE_SOCKET_CONNECTION_BEGIN';          //正在关闭与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_SUCCESS = 'CLOSE_SOCKET_CONNECTION_SUCCESS';      //成功关闭与服务器的WS连接
const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';                                    //接收到来自服务器的消息
const ERROR_SOCKET_CONNECTION = 'ERROR_SOCKET_CONNECTION';                      //与服务器的连接发生错误
const UNKNOWN_COMMAND = 'UNKNOWN_COMMAND';                                      //未识别的命令

export class MainContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    //开启Web Worker
    componentDidMount() {
        //创建web worker
        createWebWorker(this.onWebWorkerMessage);
        //开启web socket
        openWS();
    }

    componentWillMount = () => {
        console.log("componentWillMount");
    }

    onWebWorkerMessage = (event) => {
        //msgIndex++;
        const {
            type,
            payload
        } = event.data;

        if (type === OPEN_SOCKET_CONNECTION_SUCCESS || type === OPEN_SOCKET_CONNECTION_BEGIN ||
            type === CLOSE_SOCKET_CONNECTION_SUCCESS || type === CLOSE_SOCKET_CONNECTION_BEGIN ||
            type === UNKNOWN_COMMAND) {
            console.info('socket message:' + payload);
            return;
        }

        if (type === ERROR_SOCKET_CONNECTION) {
            console.error('socket error:' + payload);
            return;
        }

        if (type === RECEIVED_MESSAGE) {
            this.props.receivedLocation(JSON.parse(payload));
        }
    }

    render() {
        return (
            <Layout className="layout" style={{height: '100%', background: '#f2f4f5'}}>
                <HeadContainer/>
                <Content style={{height: 'calc(100% - 54px)'}}>
                    {React.Children.toArray(this.props.children)}
                </Content>
            </Layout>
        );
    }
}


export function actionsDispatchToProps(dispatch) {
    return {
        receivedLocation: (locationEntity) => dispatch(receivedPeopleLocation(locationEntity))
    };
}

const selectorStateToProps = createStructuredSelector({});

// Wrap the component to inject dispatch and state into it
export default connect(selectorStateToProps, actionsDispatchToProps)(MainContainer);