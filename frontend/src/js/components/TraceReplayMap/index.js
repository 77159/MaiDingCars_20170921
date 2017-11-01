/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/22
 * @describe 轨迹回放 地图
 */
'use strict';
import React from 'react';

//antd-ui
import {Slider, Button, Icon} from 'antd';

//工具类
import moment from 'moment';    //时间
import _ from 'lodash';

import styles from './index.less';

export default class TraceReplayMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allPeopleLocationMap: new Map(),
            beginTime: '00:00:00',
        };

        this.fmapID = window.fmapID;
        this.polygonMarkers = {};
        this.polygonsIds = [];
        this.start = false; //开始/暂停
        this.setIntervalID = 0;//计时器标识；
        this.personMarkers = {};   //人员
    }

    componentDidMount = () => {
        this.initMap();
    };

    componentWillReceiveProps(nextProps) {
        if (_.eq(this.props.keyArea, nextProps.keyArea) == false) {
            this.createPolygon(nextProps.keyArea);
        }
    };

    shouldComponentUpdate(nexrProps, nextState) {
        //判断是轨迹回放的数据是否有变化，如果有变化刷新
        return _.eq(this.props.traceDataSource, nexrProps.traceDataSource) === false || _.eq(this.state.beginTime, nextState.beginTime) === false;
    };

    /**
     * 初始化地图
     */
    initMap = () => {
        const {loadComplete} = this.props;
        const _this = this;

        //放大、缩小控件配置
        const zoomCtlOpt = new fengmap.controlOptions({
            position: fengmap.controlPositon.RIGHT_TOP,
            imgURL: './img/fm_controls/',
            offset: {
                x: 15,
                y: 262
            },
            scaleLevelcallback: function (level, result) {
                console.log(result);
                /*当前级别：map.mapScaleLevel
                最小级别：map._minMapScaleLevel
                最大级别：map._maxMapScaleLevel*/
            }
        });

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
            defaultMapScaleLevel: 21,
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
            defaultMinTiltAngle: 5,
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
            new fengmap.zoomControl(this, zoomCtlOpt);

            //2D/3D
            new fengmap.toolControl(this, {
                //初始化2D模式
                init2D: false,
                position: fengmap.controlPositon.RIGHT_TOP,
                imgURL: '/img/fm_controls/',
                //设置为false表示只显示2D,3D切换按钮
                groupsButtonNeeded: false,
                offset: {
                    x: 15,
                    y: 210
                },
                //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
                clickCallBack: function (type, value) {
                    console.log(type, value);
                }
            });

            if (loadComplete) {
                loadComplete(this);
            }
        });

        //点击事件
        this.fmMap.on('mapClickNode', function (event) {

        });
    };

    //更新Marker位置
    updateMark = (personCode, locationEntity) => {
        if (!this.fmMap) return;
        const personMarker = this.personMarkers[personCode];

        if (personMarker) {
            //更新ImageMarker的位置
            personMarker.moveTo({
                //设置imageMarker的x坐标
                x: locationEntity.pointX,
                //设置imageMarker的y坐标
                y: locationEntity.pointY,
            });
        } else {
            //创建ImageMarker
            let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
            if (!group) return;
            //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
            let imageMarkerLayer = group.getOrCreateLayer('imageMarker');

            let imageMarker = new fengmap.FMImageMarker({
                x: locationEntity.pointX,
                y: locationEntity.pointY,
                height: 2,
                //设置图片路径
                url: './img/peopleMarker.png',
                //设置图片显示尺寸
                size: 46,
                callback: () => {
                    imageMarker.alwaysShow();
                }
            });
            //添加至图层
            imageMarkerLayer.addMarker(imageMarker);
            //保存全局
            this.personMarkers[personCode] = imageMarker;
        }

        //查找此人员当前是否已存在
        // if (this.state.allPeopleLocationMap.has(locationEntity.personCode) == true) {
        //     //获取到之前已添加的人员位置实体
        //     let peopleLocation = this.state.allPeopleLocationMap.get(locationEntity.personCode);
        //     //更新ImageMarker的位置
        //     peopleLocation.imageMarker.moveTo({
        //         //设置imageMarker的x坐标
        //         x: locationEntity.pointX,
        //         //设置imageMarker的y坐标
        //         y: locationEntity.pointY,
        //     });
        //     //保存最新的位置信息
        //     Object.assign(peopleLocation, locationEntity);
        // } else {
        //     //创建新的ImageMarker
        //     let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        //     if (!group) return;
        //     //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        //     let imageMarkerLayer = group.getOrCreateLayer('imageMarker');
        //
        //     let imageMarker = new fengmap.FMImageMarker({
        //         x: locationEntity.pointX,
        //         y: locationEntity.pointY,
        //         height: 2,
        //         //设置图片路径
        //         url: './img/peopleMarker.png',
        //         //设置图片显示尺寸
        //         size: 46,
        //         callback: () => {
        //             imageMarker.alwaysShow();
        //         }
        //     });
        //     //添加至图层
        //     imageMarkerLayer.addMarker(imageMarker);
        //     //将ImageMarker保存到locationEntity内
        //     locationEntity.imageMarker = imageMarker;
        //     //保存到Map中
        //     this.state.allPeopleLocationMap.set(locationEntity.personCode, locationEntity);
        // }

        // this.imageMarker.moveTo({
        //     //设置imageMarker的x坐标
        //     x: locationEntity.pointX,
        //     //设置imageMarker的y坐标
        //     y: locationEntity.pointY,
        //     moveTo时间设置为6秒,默认为1秒。
        //     time: 3,
        //     判断目标点是否进入围栏区域
        //     update: function (p) {
        //         // p: 返回Marker当前位置
        //         // 判断PolygonMarker是否包含Marker当前的位置
        //         var isContained = polygonMarker.contain(p);
        //
        //         //未进入围栏
        //         if (!isContained) {
        //             oPolygonInfo.classList.add('hidden');
        //
        //         } else {
        //             if (pointIndex < 1) {
        //                 oPolygonInfo.classList.remove('hidden');
        //                 oPolygonInfo.classList.add('alert-info');
        //                 oStrang.innerHTML = '提示：目标点已进入电子围栏区域';
        //             }
        //         }
        //     },
        //     callback: function () {
        //         if (pointIndex < 1) {
        //
        //             oPolygonInfo.classList.remove('alert-info');
        //             oPolygonInfo.classList.add('alert-success');
        //             oStrang.innerHTML = '提示：目标点已进入围栏';
        //         }
        //         moveMarker = true;
        //         pointIndex++;
        //     },
        // });

    };


    //添加目标点标注
    addTestMarker = () => {
        let coord = {x: 13155860.0623301, y: 2813445.34302628, z: 2};
        this.addMarker(coord);
    };

    //添加Marker
    addMarker = (coord) => {
        let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        let layer2 = group.getOrCreateLayer('imageMarker');
        let loadedCallBack = () => {
            this.imageMarker.alwaysShow();
        };
        let imageMarker = new fengmap.FMImageMarker({
            x: coord.x,
            y: coord.y,
            height: coord.z,
            //设置图片路径
            url: './img/peopleMarker.png',
            //设置图片显示尺寸
            size: 46,
            callback: () => {
                imageMarker.alwaysShow();
            }
        });

        layer2.addMarker(imageMarker);
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


    test = (time, s) => {
        const {traceDataSource} = this.props;

        let t = _.cloneDeep(time);
        const dataTime = t.add(s, 's').format('YYYY-MM-DD HH:mm:ss')


        for (let key in traceDataSource) {
            const data = traceDataSource[key];

            let i = data.filter((item) => {
                return item.dataTime === dataTime;
            });

            if (i[0]) {
                this.updateMark(key, i[0]);
            }
        }
    };

    tracePlay = () => {
        const {seconds, startValue} = this.props;
        let s = 0;

        if (!this.start) {
            //开始播放
            this.setIntervalID = setInterval(() => {
                //判断是否播放完毕
                if (seconds === s) {
                    clearInterval(this.setIntervalID);
                    console.log('播放完毕');
                    return;
                }

                this.test(startValue, s);
                const beginTime = moment(this.state.beginTime, 'HH:mm:ss').add(1, 's').format('HH:mm:ss');
                this.setState({
                    beginTime: beginTime,
                });
                s++;
                this.s = s;
            }, 1000);
            this.start = true;
        } else {
            //暂停播放
            this.start = false;
            clearInterval(this.setIntervalID);
        }
    };

    render() {

        const {startValue, endValue, totalTime, visibleReplay, seconds} = this.props;

        console.log('刷新');

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div id="fengMap" style={{width: '100%', height: '100%'}}></div>
                {/*播放器*/}
                <div className={styles.replayPanel} style={{display: visibleReplay ? 'block' : 'none'}}>
                    <div className={styles.replayItemRow}>
                        <div className={styles.playTimeTag}>
                            <span>{this.state.beginTime}</span><span> / {totalTime}</span>
                        </div>
                        <span className={styles.speedTag}>快进×16</span>
                    </div>
                    <Slider tipFormatter={() => {
                        return this.state.beginTime;
                    }} min={0} max={seconds} className={styles.palySlider} onChange={this.onPalySliderChange}
                            value={this.s} step={1}/>
                    <div className={styles.replayItemRow}>
                        <div>
                            <span>{startValue ? startValue.format('YYYY-MM-DD') : ''}<br/>{startValue ? startValue.format('HH:mm:ss') : ''}</span>
                        </div>
                        <div className={styles.ctlButtons}>
                            <Button ghost size="large" onClick={this.tracePlay}><Icon type="pause-circle"/></Button>
                            <Button ghost size="large"><Icon type="forward"/></Button>
                            <Button ghost size="large"><Icon type="minus-square"/></Button>
                        </div>
                        <div>
                            <span>{endValue ? endValue.format('YYYY-MM-DD') : ''}<br/>{endValue ? endValue.format('HH:mm:ss') : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}