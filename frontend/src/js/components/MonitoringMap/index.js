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

import styles from './index.less';


export default class MonitoringMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allCarLocationMap: new Map(),
            modelView: '3D',
        };

        this.fmapID = window.fmapID;

        this.polygonMarkers = {};
        this.polygonsIds = [];
        this.visibleLayer = [];
    }

    componentDidMount = () => {
        this.initMap();
    };

    componentWillReceiveProps(nextProps) {
        // 更新最新位置
        if (_.eq(this.props.realTimeLocations, nextProps.realTimeLocations) == false) {
            this.updateMark(nextProps.realTimeLocations);
        }

        // 更新地图重点区域
        if (_.eq(this.props.keyArea, nextProps.keyArea) == false) {
            this.createPolygon(nextProps.keyArea);
        }

        // 显示/隐藏视频marker
        if (_.eq(this.props.layerVisible, nextProps.layerVisible) == false) {
            this.changeVideoImageMarker(nextProps.layerVisible);
        }
    };

    /**
     * 初始化地图
     */
    initMap = () => {
        const {createImageMarker} = this;
        const {loadComplete} = this.props;

        //放大、缩小控件配置
        // const zoomCtlOpt = new fengmap.controlOptions({
        //     position: fengmap.controlPositon.RIGHT_TOP,
        //     imgURL: './img/fm_controls/',
        //     offset: {
        //         x: 15,
        //         y: 262
        //     },
        //     scaleLevelcallback: function (level, result) {
        //         console.log(result);
        //         /*当前级别：map.mapScaleLevel
        //         最小级别：map._minMapScaleLevel
        //         最大级别：map._maxMapScaleLevel*/
        //     }
        // });

        /*const ctlOpt = new fengmap.controlOptions({
            //设置显示的位置为右上角
            position: fengmap.controlPositon.RIGHT_TOP,
            showBtnCount: 5,
            allLayer: false,
            imgURL: './img/fm_controls/',
            //位置x,y的偏移量
            offset: {
                x: 15,
                y: 262
            }
        });*/

        //创建地图对象
        this.fmMap = new fengmap.FMMap({
            //渲染dom
            container: document.getElementById('fengMap'),
            //地图数据位置
            mapServerURL: 'assets/map/',
            //主题数据位置
            mapThemeURL: 'assets/theme',
            //设置主题
            defaultThemeName: '3006',        //2001, 2002, 3006, 746199
            // 默认比例尺级别设置为20级
            defaultMapScaleLevel: 20,
            //开发者申请应用下web服务的key
            key: 'b559bedc3f8f10662fe7ffdee1e360ab',
            //开发者申请应用名称
            appName: '麦钉艾特',
            //初始指北针的偏移量
            compassOffset: [278, 20],
            //指北针大小默认配置
            compassSize: 48,
            viewModeAnimateMode: true, //开启2维，3维切换的动画显示
            defaultVisibleGroups: [1],
            defaultFocusGroup: 1,
            // defaultMinTiltAngle: 5,
            useStoreApply: true, //使用storeapply
        });

        //打开Fengmap服务器的地图数据和主题
        this.fmMap.openMapById(this.fmapID);
        //显示指北针
        this.fmMap.showCompass = true;

        // 点击指南针事件, 使角度归0
        this.fmMap.on('mapClickCompass', function () {
            this.rotateTo({
                to: 0,
                duration: .3,
            })
        });

        //初始化绘制插件
        this.fmMap.on('loadComplete', function () {
            this.visibleGroupIDs = [1];
            this.focusGroupID = 1;

            //楼层
            //new fengmap.scrollGroupsControl(this, ctlOpt);

            //放大、缩小控件
            //new fengmap.zoomControl(this, zoomCtlOpt);

            //2D/3D
            // new fengmap.toolControl(this, {
            //     //初始化2D模式
            //     init2D: false,
            //     position: fengmap.controlPositon.RIGHT_TOP,
            //     imgURL: '/img/fm_controls/',
            //     //设置为false表示只显示2D,3D切换按钮
            //     groupsButtonNeeded: false,
            //     offset: {
            //         x: 15,
            //         y: 210
            //     },
            //     //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
            //     clickCallBack: function (type, value) {
            //         console.log(type, value);
            //     }
            // });

            //getMap(this);
            //添加测试用的人员Marker
            //_addTestMarker2();
            if (loadComplete) {
                loadComplete(this);
            }

            //显示视频marker
            createImageMarker();
        });

        //点击事件
        this.fmMap.on('mapClickNode', function (event) {
            var model = event;
            switch (event.nodeType) {
                case fengmap.FMNodeType.FLOOR:
                    //if (event.eventInfo.eventID == eventID) return;
                    //console.log('x:' + event.eventInfo.coord.x + ";     y:" + event.eventInfo.coord.y);
                    break;
                case fengmap.FMNodeType.MODEL:
                    //过滤类型为墙的model
                    if (event.typeID == '30000') {
                        //其他操作
                        return;
                    }
                    //模型高亮
                    //this.fmMap.storeSelect(model);
                    //弹出信息框
                    //console.log('x:' + event.label ? event.label.mapCoord.x : event.mapCoord.x + ";     y:" + event.label ? event.label.mapCoord.y : event.mapCoord.y);
                    break;
                case fengmap.FMNodeType.FACILITY:
                case fengmap.FMNodeType.IMAGE_MARKER:
                    //弹出信息框
                    //console.log('公共设施 x:' + event.target.x + ";     y:" + event.target.y);
                    break;
            }
        });

    };

    //添加Marker
    addMarker = (coord) => {
        coord = {x: 13155860.0623301, y: 2813445.34302628, z: 2};
        let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        let layer2 = group.getOrCreateLayer('imageMarker');
        let imageMarker = new fengmap.FMImageMarker({
            x: coord.x,
            y: coord.y,
            height: 1,      //人物marker在地图的显示高度
            //设置图片路径
            url: './img/carMarker.png',
            //设置图片显示尺寸
            size: 46,
            callback: () => {
                imageMarker.alwaysShow();
            }
        });

        layer2.addMarker(imageMarker);
        this.imageMarker = imageMarker;
    };


    //更新Marker位置
    updateMark = (locationEntity) => {
        if (!this.fmMap) return;
        //查找此人员当前是否已存在
        if (this.state.allCarLocationMap.has(locationEntity.personCode) == true) {
            //获取到之前已添加的人员位置实体
            let carLocation = this.state.allCarLocationMap.get(locationEntity.personCode);
            //更新ImageMarker的位置
            carLocation.imageMarker.moveTo({
                //设置imageMarker的x坐标
                x: locationEntity.pointX,
                //设置imageMarker的y坐标
                y: locationEntity.pointY,
            });
            //保存最新的位置信息
            Object.assign(carLocation, locationEntity);

            if (this.props.positionPersonCode) {
                if (locationEntity.personCode === this.props.positionPersonCode) {
                    this.fmMap.moveToCenter({
                        x: locationEntity.pointX,
                        //设置imageMarker的y坐标
                        y: locationEntity.pointY,
                        groupID: 1
                    });
                }
            }
        } else {
            //创建新的ImageMarker
            let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
            if (!group) return;
            //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
            let imageMarkerLayer = group.getOrCreateLayer('imageMarker');

            let imageMarker = new fengmap.FMImageMarker({
                x: locationEntity.pointX,
                y: locationEntity.pointY,
                name: locationEntity.personCode,
                height: 0,      //人物marker在地图的显示高度
                //设置图片路径
                url: './img/carMarker.png',
                //设置图片显示尺寸
                size: 46,
                callback: () => {
                    imageMarker.alwaysShow();
                }
            });
            //添加至图层
            imageMarkerLayer.addMarker(imageMarker);
            //将ImageMarker保存到locationEntity内
            locationEntity.imageMarker = imageMarker;
            //保存到Map中
            this.state.allCarLocationMap.set(locationEntity.personCode, locationEntity);
            //获取人员
            this.props.personImageMarker(locationEntity.personCode, imageMarker);
        }
    };

    /**
     * 创建地图区域polygon面
     * @param ids 创建区域面的id数组
     * @param areaList 楼层区域列表信息
     * @param focusFloorid 当前楼层gid
     */
    createPolygon = (areaList, focusFloorid = '1') => {
        //const map = this.map;
        areaList.map((area) => {
                const id = area.id;
                const polygon = JSON.parse(area.polygon);
                const polygonStyle = JSON.parse(area.areaStyle);
                let ps = [];
                polygon[0].map((p) => {
                    ps.push(this.addPolygon(p, focusFloorid, polygonStyle.backgroundColor, polygonStyle.opacity));
                });
                this.polygonMarkers[id] = ps;    //polygon对象
                this.polygonsIds.push(id);
            }
        );
    };

    /**
     * 添加polygon
     * @param points 数组坐标
     * @param focusFloorid 当前楼层
     * @param color 区域填充颜色 16进制
     * @param opacity 透明度
     * @returns {fengmap.FMPolygonMarker}
     */
    addPolygon = (points, focusFloorid, color, opacity) => {
        const map = this.fmMap;
        const group = map.getFMGroup(focusFloorid);
        const layer = group.getOrCreateLayer('polygonMarker');
        const polygonMarker = new fengmap.FMPolygonMarker({
            map: map,
            points: points,
            lineWidth: 1,
            color: color,
        });
        polygonMarker.setAlpha(opacity);
        polygonMarker.height = 0.5;                     //高度
        polygonMarker._ps = points;
        polygonMarker._vs = points.map(function (o, index) {
            let v = map.toSceneCoord(o);
            v.index = index;
            return v;
        });
        layer.addMarker(polygonMarker);
        return polygonMarker;
    };

    /**
     * 添加ImageMarker图层
     */
    createImageMarker = () => {
        let {visibleLayer} = this;
        const fmMap = this.fmMap;
        if (!fmMap) return;
        //TODO 需要替换数据
        const coord = [
            {x: 13155870.738162346, y: 2813451.6467325822, z: 1},
            {x: 13155893.214267865, y: 2813441.1497168844, z: 1}
        ];

        let layer;
        const group = fmMap.getFMGroup(1); //TODO 默认只有1层
        layer = group.getOrCreateLayer('imageMarker');

        coord.map((item, index) => {
            //图标标注对象，默认位置为该楼层中心点
            const im = new fengmap.FMImageMarker({
                //设置图片路径
                url: './img/videoImageMarker.png', //TODO 需替换资源
                //设置图片显示尺寸
                x: item.x,
                y: item.y,
                height: 1,
                size: 24,
                callback: function () {
                    // 在图片载入完成后，设置 "一直可见"
                    // im.alwaysShow();
                    im.visible = false;
                    visibleLayer.push(im);
                }
            });

            layer.addMarker(im);
        });

        this.layer = layer;
    };

    /**
     * 显示/隐藏视频marker
     * @param layerVisible
     */
    changeVideoImageMarker = (layerVisible) => {
        const {visibleLayer} = this;
        visibleLayer.map((item) => {
            item.visible = layerVisible;
        });
    };

    /**
     * 切换3D/2D效果；
     */
    changeModelView = () => {
        const map = this.fmMap;
        if (!map) return;
        let modelView = this.state.modelView;
        if (modelView === '3D') {
            map.viewMode = fengmap.FMViewMode.MODE_2D;
            modelView = '2D';
        } else {
            map.viewMode = fengmap.FMViewMode.MODE_3D;
            modelView = '3D';
        }
        this.setState({
            modelView: modelView
        })
    };

    /**
     * 地图收缩功能
     */
    setZoomIn = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomIn();
    };

    /**
     * 地图放大功能
     */
    setZoomOut = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomOut();
    };

    render() {
        return (
            <div id="fengMap" style={{width: '100%', height: '100%', positio: 'relative'}}>
                <div style={{position: 'absolute', width: 48, right: '20px', top: '214px', display: 'flex', justifyContent: 'baseline', flexDirection: 'column'}}>
                    <span className={styles.mapActionBtn} onClick={this.changeModelView}>
                        <img src={`./img/fm_controls/${this.state.modelView}.png`}></img>
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