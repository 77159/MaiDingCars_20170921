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

import {
    receivedCarLocation,
    getOnlineDevice,
    pushAlarmMessage,
    putMessageLastDateTime,
    putMessageIsArea
} from "./actions";

import {
    alertMessageDataSelector,
} from './selectors'

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
        this.state = {};
    };

    //开启Web Worker
    componentDidMount() {
        //创建web worker
        createWebWorker(this.onWebWorkerMessage);
        //开启web socket
        openWS();
    };

    componentWillMount = () => {
        // console.log("componentWillMount");
    };

    onWebWorkerMessage = (event) => {
        const {
            type,
            payload
        } = event.data;

        if (type === OPEN_SOCKET_CONNECTION_SUCCESS || type === OPEN_SOCKET_CONNECTION_BEGIN ||
            type === CLOSE_SOCKET_CONNECTION_SUCCESS || type === CLOSE_SOCKET_CONNECTION_BEGIN ||
            type === UNKNOWN_COMMAND) {
            // console.info('socket message:', payload);
            return;
        }

        if (type === ERROR_SOCKET_CONNECTION) {
            // console.error('socket error:', payload);
            return;
        }

        if (type === RECEIVED_MESSAGE) {
            const data = JSON.parse(payload);

            //车辆实时定位信息
            if (data.type === 0) {
                this.props.receivedLocation(data);
                return;
            }

            //设备实时位置信息
            // if (data.type === 0) {
            //     //过滤设备没有和人员关联的数据
            //     if (!data.carCode) return;
            //
            //     // 如果存在报警信息
            //     //  检查报警信息集合中人员是否存已经存在
            //     //   如果不存在，则添加到报警信息集合中，并且更新持续时间，和当前在重点区域的标识true
            //     //   如果存在，则更新持续时间
            //     // 如果不存在报警信息
            //     //  检查报警信息集中人员是否已存在并且当前在重点区域的标识为true
            //     //    如果存在，则将当前在重点区域的标识设置为false
            //     //  如果不存在则不做任何操作
            //
            //
            //     //是否存在报警信息
            //     const alertInfo = data.alertInfo;
            //     //报警集合
            //     const alertMessageData = this.props.alertMessageData;
            //     //查找当前是否
            //     const areaAlterMessage = alertMessageData.filter((item) => {
            //         return data.carCode === item.carCode && item.isArea === true;
            //     });
            //
            //     /**
            //      * 判断是否有报警信息；
            //      * 如果有报警信息判断当前报警信息集合里面是否有该条报警信息；
            //      *  如没有，则新增；
            //      *  如有，更新最后报警信息时间；
            //      * 如果没有报警信息判断当前人员是否在当前报警信息集合中；
            //      *  如果在，则移除；
            //      *  如果不在，无操作
            //      */
            //     if (alertInfo) {
            //         //判断
            //         if (!areaAlterMessage.size > 0) {
            //             alertInfo['isRead'] = 0;                        //未读信息
            //             alertInfo['key'] = alertMessageData.size + 1;
            //             alertInfo['lastDateTime'] = alertInfo.dateTime;
            //             alertInfo['isArea'] = true;
            //             alertInfo['isShow'] = true;
            //             this.props.pushAlarmMessage(alertInfo);
            //         } else {
            //             this.props.putMessageLastDateTime({
            //                 id: areaAlterMessage.get(0).id,
            //                 lastDateTime: alertInfo.dateTime
            //             });
            //         }
            //     } else {
            //         if (areaAlterMessage.size > 0) {
            //             this.props.putMessageIsArea({
            //                 id: areaAlterMessage.get(0).id,
            //                 isArea: false,
            //             })
            //         }
            //     }
            //
            //     this.props.receivedLocation(data);
            //     return;
            // }

            //设备上线
            // if (data.type === 1) {
            //     return;
            // }
            // //设备下线
            // if (data.type === 2) {
            //     return;
            // }
            // //获取报警信息
            // if (data.type === 99) {
            //     return;
            // }
            // //获取当前最新在线设备
            // if (data.type === 1001) {
            //     const list = data.list;
            //
            //     //过滤设备没有和人员关联的数据
            //     const onLineList = list.map((item) => {
            //         if (!item.carCode || item.carCode !== null) {
            //             return item;
            //         }
            //     });
            //
            //     this.props.getOnlineDevice(onLineList);
            //     return;
            // }
            // //TODO 处理类型不明确
            // if (data.type === 3) {
            //     return;
            // }
        }
    };

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
        receivedLocation: (locationEntity) => dispatch(receivedCarLocation(locationEntity)),
        getOnlineDevice: (onlineDevice) => dispatch(getOnlineDevice(onlineDevice)),
        pushAlarmMessage: (alarmMessage) => dispatch(pushAlarmMessage(alarmMessage)),
        putMessageLastDateTime: (obj) => dispatch(putMessageLastDateTime(obj)),
        putMessageIsArea: (obj) => dispatch(putMessageIsArea(obj)),
    };
}

const selectorStateToProps = createStructuredSelector({
    alertMessageData: alertMessageDataSelector(),
});

// Wrap the component to inject dispatch and state into it
export default connect(selectorStateToProps, actionsDispatchToProps)(MainContainer);