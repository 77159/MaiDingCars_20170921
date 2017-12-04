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

import moment from 'moment';

import {getHours} from '../../utils/tools';
import _ from 'lodash';

import styles from './index.less';

export default class TraceReplayMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: '3D',
            begin: true,
            seconds: 0,
            level: 1,
        };

        this.fmapID = window.fmapID;    //地图fengmapId
        this.videoMarkerLayer = null;   //视频imageLaye

        const {emptyPlay, visibleNaviLineMarkers} = this;

        this.map = {
            fmMap: null,            //地图对象
            totalTime: null,        //总共小时
            secondsSum: 0,          //总共秒数
            speed: 1000,            //速度1000毫秒
            preCoords: {},
            naviCoords: {},
            naviLineMarkers: {},
            carMarkers: {},
            emptyPlay: emptyPlay,
            visibleNaviLineMarkers: visibleNaviLineMarkers, //显示/隐藏marker
            positionCarCode: '',
        }
    }

    /**
     * 组件加载完事件
     */
    componentDidMount() {
        this.initMap();
    };

    componentWillReceiveProps(nextProps) {
        const {startValue, endValue} = nextProps;
        //是否开始轨迹回放
        if (this.props.isPlay !== nextProps.isPlay && nextProps.isPlay === true) {
            //获取当前时间差，秒数
            const secondsSum = endValue.diff(startValue, 'seconds');
            if (secondsSum > 0) {
                //转换小时，并格式化00:00:00
                this.map.totalTime = getHours(secondsSum);
            }
            this.map.secondsSum = secondsSum;
            //计时器清零
            this.setState({
                seconds: 0,
            })
        }

        //判断当前是否有定位的车辆
        if (this.props.positionMarker !== nextProps.positionMarker && nextProps.positionMarker) {
            const fmMap = this.map.fmMap;
            const carCode = nextProps.positionMarker;
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

        const fmMap = new fengmap.FMMap({
            container: document.getElementById('fengMap'),  //渲染dom
            mapServerURL: 'assets/map', //地图数据位置
            mapThemeURL: 'assets/theme',  //主题数据位置
            defaultThemeName: '3006',       //设置主题 2001, 2002, 3006, 746199
            defaultMapScaleLevel: 21, // 默认比例尺级别设置为20级
            key: 'b559bedc3f8f10662fe7ffdee1e360ab', //开发者申请应用下web服务的key
            appName: '麦钉艾特',   //开发者申请应用名称
            compassOffset: [278, 20], //初始指北针的偏移量
            compassSize: 48, //指北针大小默认配置
            viewModeAnimateMode: true, //开启2维，3维切换的动画显示
            defaultVisibleGroups: [1],
            defaultFocusGroup: 1,
            useStoreApply: true, //使用storeapply
        });


        fmMap.openMapById(this.fmapID);  //打开Fengmap服务器的地图数据和主题
        fmMap.showCompass = true;   //显示指北针
        // 点击指南针事件, 使角度归0
        fmMap.on('mapClickCompass', function () {
            this.rotateTo({
                to: 0,
                duration: .3,
            })
        });

        //地图加载完成事件
        fmMap.on('loadComplete', () => {
            if (getMap) {
                getMap(this.map);
            }
        });

        // 点击地图事件
        fmMap.on('mapClickNode', function (event) {

        });

        this.map.fmMap = fmMap;

    };

    /**
     * 显示视频images
     * @param event
     * @param gid
     */
    visibleVideo = (event, gid = 1) => {
        const fmMap = this.map.fmMap;
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
        if (!this.map.fmMap) return;
        const viewMode = this.state.viewMode === '2D' ? '3D' : '2D';
        this.map.fmMap.viewMode = viewMode.toLocaleLowerCase();
        this.setState({
            viewMode: viewMode,
        })
    };

    /**
     * 放大
     */
    setZoomIn = () => {
        const map = this.map.fmMap;
        if (!map) return;
        map.zoomIn();
    };

    /**
     * 缩小
     */
    setZoomOut = () => {
        const map = this.map.fmMap;
        if (!map) return;
        map.zoomOut();
    };

    /**
     * 开始
     */
    tracePlay = () => {

        const {begin} = this.state;

        if (begin) {
            //开始
            this.timer();
        } else {
            //暂停
            const {clearID} = this.map;
            clearInterval(clearID);
        }

        this.setState({
            begin: !begin
        })
    };

    /**
     * 定时器
     */
    timer = () => {
        //速度
        const {speed} = this.map;
        this.map.clearID = setInterval(() => {
            let {seconds} = this.state;
            let {secondsSum, clearID} = this.map;

            //判断时间是否结束
            if (secondsSum <= seconds) {
                clearInterval(clearID);
                return;
            }

            let t = _.cloneDeep(this.props.startValue);
            const dataTime = t.add(seconds, 's').format('YYYY-MM-DD HH:mm:ss');

            //开始轨迹
            this.move(dataTime);
            this.setState({
                seconds: ++seconds,
            });
        }, speed);
    };

    /**
     * 清空
     */
    emptyPlay = () => {
        let {fmMap, clearID, preCoords, naviCoords, naviLineMarkers, carMarkers} = this.map;
        clearInterval(clearID);

        //清除人员
        for (let item in carMarkers) {
            const marker = carMarkers[item];
            if (!marker) continue;
            marker.dispose();
            carMarkers[item] = null;
        }

        //清除路劲线
        for (let item in naviLineMarkers) {
            let naviLineMarker = naviLineMarkers[item];
            for (let key in naviLineMarker) {
                fmMap.clearLineMark(naviLineMarker[key]);
            }
            naviLineMarkers[item] = {};
        }

        //清空点
        for (let item in naviCoords) {
            naviCoords[item] = {};
        }

        for (let item in preCoords) {
            preCoords[item] = {};
        }

        this.setState({
            level: 1,
            seconds: 0,
            begin: true,
        });
        this.map.speed = 1000;

    };

    /**
     * 加速
     */
    doublePlay = () => {
        let {clearID} = this.map;
        let {level} = this.state;
        let l = 1;
        //先暂停
        clearInterval(clearID);

        if (level !== 16) {
            //级别
            l = level * 2;
        }

        //速度
        this.map.speed = 1000 / l;

        this.setState({
            level: l,
            begin: false
        }, function () {
            this.timer();
        });
    };

    /**
     * 获取当前已经回放的秒数
     */
    getBeginTime = () => {
        return moment('00:00:00', 'HH:mm:ss').add(this.state.seconds, 's').format('HH:mm:ss');
    };

    /**
     * 移动
     * @param dataTime
     */
    move = (dataTime) => {
        const {traceDataSource} = this.props;

        for (let carCode in traceDataSource) {
            const data = traceDataSource[carCode];

            if (!data) continue;
            let coords = data.filter((item) => {
                return item.dataTime === dataTime;
            });

            const coord = coords[0];
            if (coord) {
                this.updateMark(carCode, coord);

                //画线
                const lineCoords = {x: coord.pointX, y: coord.pointY, z: 0, groupID: 1};
                this.addLines(carCode, lineCoords);
                this.drawLines(carCode);
            }
        }
    };

    //添加线
    addLines = (carCode, lineCoords) => {
        const preCoords = this.map.preCoords[carCode];
        if (preCoords) {
            const x = preCoords.x;
            const y = preCoords.y;
            if (_.trim(x) === _.trim(lineCoords.x) && _.trim(y) === _.trim(lineCoords.y)) {
                return;
            }
        }

        let naviCoords = this.map.naviCoords[carCode];
        if (!naviCoords) {
            naviCoords = {};
        }

        let key = 0;
        if (!_.isEmpty(naviCoords)) {
            for (let i in naviCoords) {
                key = i;
            }
        }

        if (!naviCoords[key]) {
            naviCoords[key] = [lineCoords];
        } else {
            if (naviCoords[key].length === 20) {
                naviCoords[parseInt(key) + 1] = [naviCoords[key][19], lineCoords];
            } else {
                naviCoords[key].push(lineCoords);
            }
        }
        this.map.preCoords[carCode] = lineCoords;
        this.map.naviCoords[carCode] = naviCoords;
    };

    //绘制线图层
    drawLines = (carCode) => {
        const map = this.map.fmMap;

        let naviCoords = this.map.naviCoords[carCode];
        let key = 0;
        if (!_.isEmpty(naviCoords)) {
            for (let i in naviCoords) {
                key = i;
            }
        }

        const naviLineMarker = this.map.naviLineMarkers[carCode];
        if (!_.isEmpty(naviLineMarker) && !_.isEmpty(naviLineMarker[key])) {
            map.clearLineMark(naviLineMarker[key]);
        }

        const results = this.map.naviCoords[carCode][key];

        const lineStyle = {
            lineWidth: 4,
            //alpha: this.carMarkers[carCode].alpha,
            alpha: .8,
            offsetHeight: 1,
            lineType: fengmap.FMLineType.FMARROW,
            noAnimate: false,
        };

        //绘制部分
        const line = new fengmap.FMLineMarker();
        let gid = 1;
        let points = results;
        let seg = new fengmap.FMSegment();
        seg.groupId = gid;
        seg.points = points;
        line.addSegment(seg);
        let lineObject = map.drawLineMark(line, lineStyle);

        if (lineObject) {
            const lineVisible = this.map.carMarkers[carCode].visible;

            if (!_.isEmpty(lineObject.brothers)) {
                lineObject.brothers.map((item) => {
                    item.visible = lineVisible;
                })
            }

            lineObject.visible = lineVisible;
        }

        if (!this.map.naviLineMarkers[carCode]) {
            this.map.naviLineMarkers[carCode] = {};
        }

        this.map.naviLineMarkers[carCode][key] = lineObject;
    };

    //更新Marker位置
    updateMark = (carCode, locationEntity) => {
        if (!this.map.fmMap) return;
        const personMarker = this.map.carMarkers[carCode];

        if (personMarker) {
            const speed = this.map.speed / 1000;
            //更新ImageMarker的位置
            personMarker.moveTo({
                time: speed,
                //设置imageMarker的x坐标
                x: locationEntity.pointX,
                //设置imageMarker的y坐标
                y: locationEntity.pointY,
            });

            //移动到中心点
            if (this.map.positionCarCode === carCode) {
                this.map.fmMap.moveToCenter({
                    x: locationEntity.pointX,
                    //设置imageMarker的y坐标
                    y: locationEntity.pointY,
                    groupID: 1
                });
            }
        } else {
            //创建ImageMarker
            let group = this.map.fmMap.getFMGroup(this.map.fmMap.groupIDs[0]);
            if (!group) return;
            //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
            let imageMarkerLayer = group.getOrCreateLayer('imageMarker');
            let imageMarker = new fengmap.FMImageMarker({
                x: locationEntity.pointX,
                y: locationEntity.pointY,
                height: 0,
                url: './img/car.png',//设置图片路径
                size: 46, //设置图片显示尺寸
                callback: () => {
                    imageMarker.alwaysShow();
                }
            });
            //添加至图层
            imageMarkerLayer.addMarker(imageMarker);
            //保存全局
            imageMarker.visible = true;
            this.map.carMarkers[carCode] = imageMarker;
            this.props.addCarImageVisible(carCode);
            //this.props.addPersonMarker({carCode: carCode, imageMarker: imageMarker});
        }
    };

    //添加Marker
    addMarker = (coord) => {
        if (!this.map.fmMap) return;
        let group = this.map.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        if (!group) return;
        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        let layer2 = group.getOrCreateLayer('imageMarker');
        let imageMarker = new fengmap.FMImageMarker({
            x: coord.x,
            y: coord.y,
            height: 1,
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

    visibleNaviLineMarkers = (carCode, visible) => {
        //暂停
        clearInterval(this.map.clearID);
        const naviLineMarker = this.map.naviLineMarkers[carCode];
        if (naviLineMarker) {
            for (let key in naviLineMarker) {
                let line = naviLineMarker[key];
                if (!line) continue;
                if (!_.isEmpty(line.brothers)) {
                    line.brothers.map((item) => {
                        item.visible = visible;
                    })
                }
                line.visible = visible;
            }
        }

        //开始
        this.setState({
            begin: false,
        }, function () {
            this.timer();
        });
    };

    render() {
        const {startValue, endValue} = this.props;
        const {totalTime, secondsSum} = this.map;


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
                {this.props.isPlay ?
                    <div className={styles.replayPanel}>
                        <div className={styles.replayItemRow}>
                            <div className={styles.playTimeTag}>
                                <span>{this.getBeginTime()}</span>
                                <span> / {totalTime}</span>
                            </div>
                            <span onClick={this.doublePlay}
                                  className={styles.speedTag}>{`快进×${this.state.level}`}</span>
                        </div>
                        <Slider
                            tipFormatter={() => {
                                return this.getBeginTime();
                            }}
                            min={0}
                            max={secondsSum}
                            value={this.state.seconds}
                            className={styles.palySlider}
                            step={1}/>
                        <div className={styles.replayItemRow}>
                            <div>
                                <span>{startValue.format('YYYY-MM-DD')}<br/>{startValue.format('HH:mm:ss')}</span>
                            </div>
                            <div className={styles.ctlButtons}>
                                <Button ghost size="large" title={'开始/暂停'} onClick={this.tracePlay}>
                                    {!this.state.begin ? <i className="iconfont">&#xe6cb;</i> :
                                        <i className="iconfont">&#xe6b7;</i>}
                                </Button>
                                <Button ghost size="large" title={'快进'} onClick={this.doublePlay}>
                                    <i className="iconfont">&#xe6bb;</i>
                                </Button>
                                <Button ghost size="large" title={'清空'} onClick={this.emptyPlay}>
                                    <i className="iconfont">&#xe6bd;</i>
                                </Button>
                            </div>
                            <div>
                                <span>{endValue.format('YYYY-MM-DD')}<br/>{endValue.format('HH:mm:ss')}</span>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}