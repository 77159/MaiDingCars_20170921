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

export default class HeatMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: '3D',
            begin: true,
            seconds: 0,
            level: 1,
            index: 0,
            size: 0,
        };

        this.fmapID = window.fmapID;    //地图fengmapId
        this.videoMarkerLayer = null;   //视频imageLaye

        const {emptyPlay} = this;
        this.map = {
            fmMap: null,            //地图对象
            totalTime: null,        //总共小时
            secondsSum: 0,          //总共秒数
            speed: 1000,            //速度1000毫秒
            emptyPlay: emptyPlay,
            currentPage: 0,         //当前第几页的热力图
            pageSize: 10,           //每次创建10张
            createIndex: 5          //剩余5张的时候创建新的热力图
        };

        //this.heatmapInstance = null;
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
            this.map.mapCount = this.map.secondsSum / 300;  //总热力图数
            //计时器清零
            this.setState({
                seconds: 0,
            });

            this.props.closeLoading();
        }

        if (_.eq(this.props.datas, nextProps.datas) === false) {
            if (nextProps.datas.size > 1 || nextProps.datas.length > 1) {
                //创建热力图
                const ts = this.createHeatMap(nextProps.datas);
                // 设置Texture
                this.hma.setTextures(ts);
            } else {
                const res = this.generalPoints(nextProps.datas);
                const ts = this.hma.createTextures([res, res]);
                this.hma.setTextures(ts);
                this.hma.indexTo(1);
            }
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
        window['map'] = fmMap;
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

            this.hma = new fengmap.HeatMapAnimation({
                map: fmMap,
                fadeTime: 0.5, 	// 过度时间, 默认为 .5 秒
                stayTime: 0.5,	// 停留时间, 默认为 .5 秒
                loop: false	 	// 是否循环播放, 默认为 true
            });
        });

        // 点击地图事件
        fmMap.on('mapClickNode', function (event) {
            console.log('event', event);
        });

        this.map.fmMap = fmMap;
    };

    /**
     * 获取数据
     * @param data
     * @returns {Array}
     */
    generalPoints = (data) => {
        let res = [];
        if (data.length <= 0) return res;

        for (let i = 0; i < data.length; i++) {
            if (!data[i].x) continue;
            res.push({
                x: data[i].x,
                y: data[i].y,
                value: 50
            })
        }

        // const width = map.maxX - map.minX;
        // const height = map.maxY - map.minY;
        //
        // for (let i = 0; i < 200; i++) {
        //     res.push({
        //         x: width * Math.random() + map.minX,
        //         y: height * Math.random() + map.minY,
        //         value: Math.round(Math.random() * 100)
        //         //value: 1
        //     })
        // }

        return res;
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
     * 常见热力图
     */
    createHeatMap = (datas) => {
        const {currentPage, pageSize} = this.map;
        let ps = [];
        // const datas = [
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL102', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL102', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        //     [{carCode: 'CL101', x: '', y: ''}, {carCode: 'CL103', x: '', y: ''}],
        // ];

        let result = [];
        if (datas) {
            result = datas;
        } else {
            result = this.props.datas;
        }

        //console.log('this.map.secondsSum', this.map.secondsSum);

        /*for (let i = 0; i < this.map.mapCount; i++) {
           const points = this.generalPoints();
           ps.push(points);
       }*/

        let i = currentPage * pageSize;
        let length = 0;
        //判断是或已经超出数组范围
        if (i + pageSize > this.map.mapCount) {
            length = result.length;
        } else {
            length = i + pageSize;
        }

        for (let j = i; j < length; j++) {
            const points = this.generalPoints(result[j]);
            ps.push(points);
        }

        // 将点集生成 纹理集
        const ts = this.hma.createTextures(ps);
        this.map.currentPage++;
        if (currentPage > 0) {
            this.map.maxCount = currentPage * pageSize + pageSize;
        } else {
            this.map.maxCount = pageSize;
        }

        return ts;
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
            //this.hma.pause();
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
            let {seconds, size} = this.state;
            let {secondsSum, clearID,} = this.map;

            //判断时间是否结束
            if (secondsSum <= seconds) {
                clearInterval(clearID);
                return;
            }

            //是否是当前最后一张热力图，如果是，则新一轮播放
            if (this.state.index === this.map.pageSize) {
                this.state.index = 0;
                this.hma.setTextures(this.map.ts);
            }

            //当前还剩余几张开始创建新的热力图 this.map.createIndex = 5,当前还有5张的时候创建新的地图
            if (this.map.maxCount - size - 1 === this.map.createIndex) {
                this.map.ts = this.createHeatMap();
            }

            this.hma.indexTo(this.state.index);

            this.setState({
                seconds: seconds + 300,
                size: ++this.state.size,
                index: ++this.state.index,
            }, () => {

            });
        }, speed);
    };

    /**
     * 清空
     */
    emptyPlay = () => {
        let {clearID} = this.map;
        clearInterval(clearID);
        this.hma.stop();
        this.setState({
            level: 1,
            seconds: 0,
            begin: true,
            index: 0,
            size: 0,
        });
        this.map.speed = 1000;
        this.map.currentPage = 0;

        const ts = this.createHeatMap();
        // 设置Texture
        this.hma.setTextures(ts);

        // this.hma.fadeTime = .5;
        // this.hma.stayTime = .5;
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

        //热力图速度
        //const t = this.map.speed / 1000 / 2;
        //this.hma.fadeTime = t;
        //this.hma.stayTime = t;

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
        //如果是24小时的热力图，则返回24:00:00
        if (this.state.size >= 287) {
            return '24:00:00';
        }
        return moment('00:00:00', 'HH:mm:ss').add(this.state.seconds, 's').format('HH:mm:ss');
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
                                <Button ghost size="large" onClick={this.tracePlay}>
                                    {!this.state.begin ? <i className="iconfont">&#xe6cb;</i> :
                                        <i className="iconfont">&#xe6b7;</i>}
                                </Button>
                                <Button ghost size="large" onClick={this.doublePlay}>
                                    <i className="iconfont">&#xe6bb;</i>
                                </Button>
                                <Button ghost size="large" onClick={this.emptyPlay}>
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