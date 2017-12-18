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
import {Layout} from 'antd';
import HeadContainer from '../HeadContainer';
import {openWS, closeWS, createWebWorker} from "../../api/locationWebWorker";

import {createStructuredSelector} from 'reselect';

import {updatCarSpeed} from '../CarMgrPage/actions';

import {connect} from 'react-redux';

import moment from 'moment';

import {
    receivedCarLocation,
    getOnlineDevice,
    pushAlarmMessage,
    putMessageLastDateTime,
    putMessageIsArea,
    putAlarmDatas,
    delAlarmDatas,
    updateLastDateTime,
    updateOnLineDevice,
    removeOnlineDevice,
    updateAlarmDuration
} from "./actions";

import {
    alertMessageDataSelector,
    alarmDatasSelector,
    SelectorOnLineDevice
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
        this.key = 0;
    };

    //开启Web Worker
    componentDidMount() {
        if (window.token) {
            //创建web worker
            createWebWorker(this.onWebWorkerMessage);
            //开启web socket
            openWS();
        }
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
            if (!payload) return;
            const data = JSON.parse(payload);

            if (!data) return;

            const carCode = data.carCode;
            const speed = data.speed;
            //console.log(carCode, speed);

            //更新在线列表；
            this.updateOnLineDevice(data);

            //更新车辆信息速度
            this.props.updatCarSpeed({carCode: carCode, speed: speed});

            //车辆实时定位信息
            if (data.type === 0) {
                this.props.receivedLocation(data);
                //console.log('data', data);

                //console.log('data', data);
                //当前报警信息
                const alertInfo = data.alertInfo;
                // console.log('alertInfo', alertInfo);
                // console.log('alertInfo', alertInfo);
                if (alertInfo) {
                    alertInfo['carCode'] = carCode;
                }

                //解除已在报警列表中的报警信息
                this.removeAlarmDatas(carCode, alertInfo);

                //当前有报警信息
                if (alertInfo && alertInfo.length > 0) {

                    alertInfo.map((item) => {

                        const carCode = data.carCode;
                        const {type} = item;
                        const {isExist, key} = this.isExistAlarmDatas(carCode, type);

                        item.carStatus = 2; //报警状态
                        if (isExist) {
                            //存在，更新最后报警时间
                            //item.updateTime = data.dateTime;
                            //console.log('data.dateTime', data.dateTime);
                            this.props.updateLastDateTime({key: key, dateTime: data.dateTime})
                        } else {
                            //console.log('不在执行');
                            item.key = this.key++;
                            item.carCode = data.carCode;
                            item.dateTime = data.dateTime;//时间
                            item.updateTime = data.dateTime;
                            item.lastDateTime = data.dateTime;
                            item.time = 0;          //持续时间
                            item.x = data.pointX;
                            item.y = data.pointY;
                            item.isRead = true;     //未读
                            item.isShow = true;  //显示提示
                            //不存在，添加到报警信息，添加到当前报警信息列表
                            this.props.pushAlarmMessage(item);
                            this.props.putAlarmDatas(item);
                        }
                    });
                }

                return;
            }

            //设备下线
            if (data.type === 2) {
                this.props.removeOnlineDevice(carCode);
            }

            //获取当前最新在线设备
            // if (data.type === 1001) {
            //     const list = data.list;
            //     this.props.getOnlineDevice(list);
            //     return;
            // }
        }
    };

    /**
     * 判断是否在报警信息列表中
     * @param carCode
     * @param type
     * @returns {{isExist: boolean, key: string}}
     */
    isExistAlarmDatas = (carCode, type) => {
        //当前已经在报警列表中的信息
        const alarmDatas = this.props.alarmDatas;
        //console.log('alarmDatas', alarmDatas);
        let isExist = false;
        let key = '';

        const data = alarmDatas.filter((item) => {
            return item.carCode === carCode;
        });

        for (let i = 0; i < data.size; i++) {
            const item = data.get(i);
            if (carCode === item.carCode && type === item.type) {
                isExist = true;
                key = item.key;
                break;
            }
        }
        return {isExist, key};
    };

    /**
     * 是否已经在在线列表中
     * @param carCode 车辆code
     */
    isExistOnlineDevice = (carCode) => {
        const onlineDevice = this.props.onlineDevice;
        if (!onlineDevice || onlineDevice.size <= 0) return false;
        for (let i = 0; i < onlineDevice.size; i++) {
            const item = onlineDevice.get(i);
            if (carCode === item.carCode) {
                return true;
            }
        }
        return false;
    };
    /**
     * 更新在线车辆
     * @param data 车辆信息对象
     */
    updateOnLineDevice = (data) => {
        const carCode = data.carCode;
        const flag = this.isExistOnlineDevice(carCode);
        if (!flag) {
            this.props.updateOnLineDevice(data);
        }
    };

    /**
     * 移除已不在报警列表中的车辆
     * @param alertInfo 报警信息
     */
    removeAlarmDatas = (carCode, alertInfo) => {
        //当前已经在报警列表中的信息
        const alarmDatas = this.props.alarmDatas;

        const data = alarmDatas.filter((item) => {
            return item.carCode === carCode;
        });

        for (let i = 0; i < data.size; i++) {
            const item = data.get(i);
            let isExist = false;
            for (let j = 0; j < alertInfo.length; j++) {
                const info = alertInfo[j];
                if (item.carCode === carCode && item.type === info.type) {
                    isExist = true;
                    const lastDate = moment(item.lastDateTime);
                    const dateTime = moment(item.dateTime);
                    const time = lastDate.diff(dateTime, 's');
                    //更新持续时间
                    this.props.updateAlarmDuration({key: item.key, time: time});
                    //console.log('持续时间：' + item.carCode, dateTime.format('HH:mm:ss'), lastDate.format('HH:mm:ss'), lastDate.diff(dateTime, 's'));
                    break;
                }
            }

            //当前已有的报警列表中移除解除报警的信息
            if (!isExist) {
                this.props.delAlarmDatas(i);
            }
        }


        // for (let i = 0; i < alarmDatas.size; i++) {
        //     const item = alarmDatas.get(i);
        //     let isExist = false;
        //     for (let j = 0; j < alertInfo.length; j++) {
        //         const info = alertInfo[j];
        //         if (item.carCode === carCode && item.type === info.type) {
        //             isExist = true;
        //             //console.log('持续时间：', info, alertInfo);
        //             //console.log(moment(info.dateTime).diff(alertInfo.dateTime));
        //             break;
        //         }
        //     }
        //
        //     //当前已有的报警列表中移除解除报警的信息
        //     if (!isExist) {
        //         this.props.delAlarmDatas(i);
        //     }
        // }
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
        pushAlarmMessage: (alarmMessage) => dispatch(pushAlarmMessage(alarmMessage)),
        putAlarmDatas: (data) => dispatch(putAlarmDatas(data)),
        delAlarmDatas: (index) => dispatch(delAlarmDatas(index)),
        updateLastDateTime: (date) => dispatch(updateLastDateTime(date)),
        getOnlineDevice: (onlineDevice) => dispatch(getOnlineDevice(onlineDevice)),
        /****/
        putMessageLastDateTime: (obj) => dispatch(putMessageLastDateTime(obj)),
        putMessageIsArea: (obj) => dispatch(putMessageIsArea(obj)),
        updateOnLineDevice: (data) => dispatch(updateOnLineDevice(data)),
        removeOnlineDevice: (carCode) => dispatch(removeOnlineDevice(carCode)),
        updatCarSpeed: (obj) => dispatch(updatCarSpeed(obj)),
        updateAlarmDuration: (obj) => dispatch(updateAlarmDuration(obj))
    };
}

const selectorStateToProps = createStructuredSelector({
    alertMessageData: alertMessageDataSelector(),
    alarmDatas: alarmDatasSelector(),
    onlineDevice: SelectorOnLineDevice()
});

// Wrap the component to inject dispatch and state into it
export default connect(selectorStateToProps, actionsDispatchToProps)(MainContainer);