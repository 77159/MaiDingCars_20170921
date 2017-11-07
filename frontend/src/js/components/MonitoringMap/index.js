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

//工具类
import _ from 'lodash';

//样式
import styles from './index.less';


export default class MonitoringMap extends React.Component {
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

    /**
     * 更新props事件
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        //判断此当前坐标数据是否与上一次相同，如果相同不做处理
        if (_.eq(this.props.realTimeLocations, nextProps.realTimeLocations) == false) {
            this.updateMark(nextProps.realTimeLocations);
        }
    };

    /**
     * 初始化地图
     */
    initMap = () => {
        const {getMap} = this.props;

        this.fmMap = new fengmap.FMMap({
            container: document.getElementById('fengMap'),  //渲染dom
            mapServerURL: 'assets/map/', //地图数据位置
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
                {x: 13155879.262894774, y: 2813434.3748671124, z: 1},
                {x: 13155849.552118609, y: 2813444.1627199077, z: 1},
                {x: 13155910.160209117, y: 2813424.2834379645, z: 1},
                {x: 13155856.806917202, y: 2813466.9958207505, z: 1},
                {x: 13155852.881658334, y: 2813455.432382258, z: 1},
                {x: 13155881.193788545, y: 2813461.3959688926, z: 1},
                {x: 13155900.462375376, y: 2813454.1607708493, z: 1},
                {x: 13155904.09549146, y: 2813466.616971347, z: 1},
                {x: 13155923.325809158, y: 2813479.4329843214, z: 1},
                {x: 13155929.397945976, y: 2813454.6551750996, z: 1},
                {x: 13155915.801642923, y: 2813440.025870851, z: 1},
                {x: 13155910.75592826, y: 2813424.5772141065, z: 1},
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
            <div id="fengMap" className={styles.fengmap}>
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