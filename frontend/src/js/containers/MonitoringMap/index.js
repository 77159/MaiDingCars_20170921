/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/22
 * @describe 动态监控 地图
 */
'use strict';

import React from 'react';
import {Layout} from 'antd';
import HeadContainer from '../HeadContainer';
import {openWS, closeWS, createWebWorker} from "../../api/locationWebWorker";

//工具类
import _ from 'lodash';

//样式
import styles from './index.less';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';


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

import {realTimeLocationsSelector} from "../MonitoringMap/selectors";

const OPEN_SOCKET_CONNECTION_BEGIN = 'OPEN_SOCKET_CONNECTION_BEGIN';            //正在打开与服务器的WS连接
const OPEN_SOCKET_CONNECTION_SUCCESS = 'OPEN_SOCKET_CONNECTION_SUCCESS';        //成功建立与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_BEGIN = 'CLOSE_SOCKET_CONNECTION_BEGIN';          //正在关闭与服务器的WS连接
const CLOSE_SOCKET_CONNECTION_SUCCESS = 'CLOSE_SOCKET_CONNECTION_SUCCESS';      //成功关闭与服务器的WS连接
const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';                                    //接收到来自服务器的消息
const ERROR_SOCKET_CONNECTION = 'ERROR_SOCKET_CONNECTION';                      //与服务器的连接发生错误
const UNKNOWN_COMMAND = 'UNKNOWN_COMMAND';                                      //未识别的命令

class MonitoringMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: '3D',
        };

        this.fmapID = window.fmapID;    //地图fengmapId
        this.fmMap = null;              //地图对象
        this.videoMarkerLayer = null;   //视频imageLayer
    }

    /**
     * 组件加载完事件
     */
    componentDidMount() {
        this.initMap();
    };


    shouldComponentUpdate(nextProps, nextState) {

        if (_.eq(this.props.realTimeLocations, nextProps.realTimeLocations) == false) {
            this.updateMark(nextProps.realTimeLocations);
        }

        return false;
    }

    /**
     * 更新props事件
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        //判断此当前坐标数据是否与上一次相同，如果相同不做处理
        // if (_.eq(this.props.realTimeLocations, nextProps.realTimeLocations) == false) {
        //     this.updateMark(nextProps.realTimeLocations);
        // }
        
        // console.log(nextProps.realTimeLocations);

        //判断当前是否有定位的车辆
        if (this.props.positionCarCode !== nextProps.positionCarCode && nextProps.positionCarCode) {
            const fmMap = this.fmMap;
            const carCode = nextProps.positionCarCode;
            //放大地图效果
            fmMap.mapScaleLevel = {
                level: 24,
                duration: 1,
                callback: () => {
                    const {carImageMarkers} = fmMap;
                    if (!carImageMarkers) return;
                    const carImageMarker = carImageMarkers[carCode];
                    if (!carImageMarker) return;
                    const {x, y, groupID} = carImageMarker;
                    const coords = {x, y, groupID};
                    fmMap.moveToCenter(coords);
                }
            };
        }
    };



    /**
     * 初始化地图
     */
    initMap = () => {
        const {getMap} = this.props;

        this.fmMap = new fengmap.FMMap({
            container: document.getElementById('fengMap'),  //渲染dom
            mapServerURL: 'assets/map', //地图数据位置
            mapThemeURL: 'assets/theme',  //主题数据位置
            defaultThemeName: '3006',       //设置主题 2001, 2002, 3006, 746199
            defaultMapScaleLevel: 20, // 默认比例尺级别设置为20级
            key: 'b559bedc3f8f10662fe7ffdee1e360ab', //开发者申请应用下web服务的key
            appName: '麦钉艾特',   //开发者申请应用名称
            compassOffset: [278, 20], //初始指北针的偏移量
            compassSize: 48, //指北针大小默认配置
            viewModeAnimateMode: true, //开启2维，3维切换的动画显示
            defaultVisibleGroups: [1],
            defaultFocusGroup: 1,
            useStoreApply: true, //使用storeapply
        });


        this.fmMap.openMapById(this.fmapID);  //打开Fengmap服务器的地图数据和主题
        this.fmMap.showCompass = true;   //显示指北针
        // 点击指南针事件, 使角度归0
        this.fmMap.on('mapClickCompass', function () {
            this.rotateTo({
                to: 0,
                duration: .3,
            })
        });

        //地图加载完成事件
        this.fmMap.on('loadComplete', function () {
            getMap(this);
        });

        // 点击地图事件
        this.fmMap.on('mapClickNode', function (event) {

        });
    };

    /**
     * 更新车辆ImageMarker
     * @param realTimeLocations
     */
    updateMark = (realTimeLocations) => {
        if (!this.fmMap || !realTimeLocations) return;
        const {carCode} = realTimeLocations;

        const {carImageMarkers} = this.fmMap;

        if (carImageMarkers && carImageMarkers[carCode]) {
            this.moveCarImageMarker(realTimeLocations);
        } else {
            this.createCarImageMarker(realTimeLocations);
        }
    };

    /**
     * 创建汽车imageMarker
     * @param realTimeLocations marker信息
     * @param gid 默认楼层1c层
     */
    createCarImageMarker = (realTimeLocations, gid = 1) => {
        if (!this.fmMap) return;

        if (!this.fmMap.carImageMarkers) {
            this.fmMap.carImageMarkers = {};
        }

        const {carCode, pointX, pointY} = realTimeLocations;

        const group = this.fmMap.getFMGroup(gid);
        if (!group) return;

        if (!this.fmMap.carMarkerLayer) {
            const carMarkerLayer = new fengmap.FMImageMarkerLayer();
            this.fmMap.carMarkerLayer = carMarkerLayer;
            group.addLayer(carMarkerLayer);
        }

        let imageMarker = new fengmap.FMImageMarker({
            x: pointX,
            y: pointY,
            name: carCode,
            height: 0,      //人物marker在地图的显示高度
            url: './img/car.png',//设置图片路径
            size: 46, //设置图片显示尺寸
            callback: () => {
                //imageMarker.alwaysShow();
            }
        });
        this.fmMap.carMarkerLayer.addMarker(imageMarker);
        this.fmMap.carImageMarkers[carCode] = imageMarker;
    };

    /**
     * 车辆imageMarker移动
     * @param realTimeLocations
     */
    moveCarImageMarker = (realTimeLocations) => {
        if (!this.fmMap) return;
        const {carCode, pointX, pointY} = realTimeLocations;
        const carImageMarker = this.fmMap.carImageMarkers[carCode];
        if (carImageMarker) {
            carImageMarker.moveTo({
                x: pointX,
                y: pointY,
            });
        }
        //定位车辆，将当前车辆作为中心点坐标，始终在视野的中心点移动
        this.carImageMarkerMoveToCenter(carCode, {x: pointX, y: pointY, groupID: 1});
    };

    /**
     * 根据当前的车辆编号，将当前车辆作为中心点，始终在视野中心点移动
     * @param carCode 车辆编号
     * @param coords 当前车辆的坐标信息
     */
    carImageMarkerMoveToCenter = (carCode, coords) => {
        if (!this.fmMap) return;
        //判断当前移动的车辆是否是当前定位的车辆
        if (carCode === this.props.positionCarCode) {
            this.fmMap.moveToCenter(coords);
        }
    };

    /**
     * 添加/显示/隐藏摄像头(imageMarker)操作
     * @param event 事件对象
     * @param gid    楼层gid，默认只有1层
     */
    visibleVideo = (event, gid = 1) => {
        const fmMap = this.fmMap;
        if (!fmMap) return;

        //判断是否已经添加摄像头，如果没有，则执行添加摄像头并显示；如果已经添加摄像头，则显示执行显示/隐藏操作；
        if (!this.videoMarkerLayer) {
            const coord = [
                {x: 12961698.59373515, y: 4860178.818219011, z: 1},
                {x: 12961636.02474005, y: 4860229.473547427, z: 1},
                {x: 12961677.888478693, y: 4860284.574363407, z: 1},
                {x: 12961744.46568206, y: 4860227.997212034, z: 1},
            ];

            const group = fmMap.getFMGroup(gid);
            if (!group) return;

            let videoMarkerLayer = new fengmap.FMImageMarkerLayer();
            group.addLayer(videoMarkerLayer);

            coord.map((item, index) => {
                const im = new fengmap.FMImageMarker({
                    url: './img/videoImageMarker.png', //TODO 需替换资源
                    x: item.x,
                    y: item.y,
                    height: 1,
                    size: 24,
                    callback: function (im) {
                        //im.alwaysShow();
                    }
                });
                videoMarkerLayer.addMarker(im);
            });
            this.videoMarkerLayer = videoMarkerLayer;
        } else {
            this.videoMarkerLayer.visible = !this.videoMarkerLayer.visible;
        }
    };

    /**
     * 切换地图3D/2D视角
     */
    changeViewMode = () => {
        if (!this.fmMap) return;
        const viewMode = this.state.viewMode === '2D' ? '3D' : '2D';
        this.fmMap.viewMode = viewMode.toLocaleLowerCase();
        this.setState({
            viewMode: viewMode,
        })
    };

    /**
     * 放大
     */
    setZoomIn = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomIn();
    };

    /**
     * 缩小
     */
    setZoomOut = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomOut();
    };

    render() {
        
        return (
            <div style={{width: '100%', height: '100%'}}>
                <div id="fengMap" style={{width: '100%', height: '100%', overflow: 'hidden'}}></div>
                <div className={styles.mapActions}>
                     <span className={styles.mapActionBtn} onClick={this.visibleVideo}
                           title="摄像头点位"><img src="./img/fm_controls/video.png"></img>
                     </span>
                    <span className={styles.mapActionBtn} onClick={this.changeViewMode}>
                        <img src={`./img/fm_controls/${this.state.viewMode}.png`}></img>
                    </span>
                    <span className={styles.mapActionBtn} onClick={this.setZoomIn}>
                        <img src="./img/fm_controls/zoomin.png"></img>
                    </span>
                    <span className={styles.mapActionBtn} onClick={this.setZoomOut}>
                        <img src="./img/fm_controls/zoomout.png"></img>
                    </span>
                </div>
            </div>
        )
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
    onlineDevice: SelectorOnLineDevice(),
    realTimeLocations: realTimeLocationsSelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(MonitoringMap);