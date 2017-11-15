/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/13
 * @describe 地图区域中的操作
 */
'use strict';

import React from 'react';

//antd-ui
import {Icon} from 'antd';

//css
import styles from './index.less';


export default class AreaSettingMap extends React.Component {
    constructor(props) {
        super(props);

        this.fmapID = window.fmapID;

        this.state = {
            visibleImgMarker: true,
            modelView: '3D',
        };

        this.fmMap = null;
    }

    componentDidMount = () => {
        this.initMap();
    };


    initMap = () => {
        const {createImageMarker} = this;
        const {getMap} = this.props;

        // let zoomCtlOpt = new fengmap.controlOptions({
        //     position: fengmap.controlPositon.RIGHT_TOP,
        //     imgURL: './img/fm_controls/',
        //     offset: {
        //         x: 15,
        //         y: 160
        //     },
        //     scaleLevelcallback: function (level, result) {
        //         console.log(result);
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
            defaultThemeName: '3006',
            // 默认比例尺级别设置为20级
            defaultMapScaleLevel: 20,
            //开发者申请应用下web服务的key
            key: 'b559bedc3f8f10662fe7ffdee1e360ab',
            //开发者申请应用名称
            appName: '麦钉艾特',
            //指北针大小默认配置
            compassSize: 48,
            viewModeAnimateMode: true, //开启2维，3维切换的动画显示
            defaultVisibleGroups: [1],
            defaultFocusGroup: 1,
            defaultMinTiltAngle: 5,
            useStoreApply: true, //使用storeapply
            compassOffset: [278, 20],
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

        //加载完事件
        this.fmMap.on('loadComplete', function () {
            this.visibleGroupIDs = [1];
            this.focusGroupID = 1;

            //楼层
            //new fengmap.scrollGroupsControl(this, ctlOpt);

            //放大、缩小控件
            // new fengmap.zoomControl(this, zoomCtlOpt);

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
            //         y: 108
            //     },
            //     //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
            //     clickCallBack: function (type, value) {
            //         console.log(type, value);
            //     }
            // });

            //加载摄像头img
            createImageMarker();

            //获取地图对象
            getMap(this);

        });

        //点击事件
        this.fmMap.on('mapClickNode', function (event) {
            console.log('event', event);
        });
    };

    /**
     * 添加ImageMarker图层
     */
    createImageMarker = () => {
        const fmMap = this.fmMap;
        if (!fmMap) return;
        //TODO 需要替换数据
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
            {x: 13155843.211299567, y: 2813412.5509811016, z: 1},
            {x: 13155871.786315676, y: 2813397.336743834, z: 1},
            {x: 13155899.016915446, y: 2813382.6496430608, z: 1},
            {x: 13155894.795881886, y: 2813373.4280466917, z: 1},
            {x: 13155888.261727432, y: 2813361.00866185, z: 1},
            {x: 13155857.971036207, y: 2813376.0443887454, z: 1},
            {x: 13155830.915004658, y: 2813390.5495471875, z: 1},
            {x: 13155838.726187173, y: 2813406.081152393, z: 1},
        ];

        let layer;
        const group = fmMap.getFMGroup(1); //TODO 默认只有1层
        if (!group) return;
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
                }
            });

            layer.addMarker(im);
        });

        layer.visible = false;
        this.layer = layer;
    };

    /**
     * 显示/隐藏摄像头图标
     */
    changeVisibleImgMarker = () => {
        let layer = this.layer;
        if (!layer) {
            return;
        }
        layer.visible = this.state.visibleImgMarker;
        this.setState({
            visibleImgMarker: !this.state.visibleImgMarker,
        })
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

    setZoomIn = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomIn();
    };

    setZoomOut = () => {
        const map = this.fmMap;
        if (!map) return;
        map.zoomOut();
    };

    render() {
        const {areaList} = this.props;
        this.props.freshenPolygon(areaList);

        return (
            <div style={{width: '100%', height: '100%'}}>
                {/*地图*/}
                <div id="fengMap" style={{width: '100%', height: '100%'}}>
                    <div style={{position: 'absolute', width: 48, right: '20px', bottom: '70px', display: 'flex', justifyContent: 'baseline', flexDirection: 'column'}}>
                        <span onClick={this.changeVisibleImgMarker} className={styles.mapActionBtn} title="摄像头点位">
                            <img src="./img/fm_controls/video.png"></img>
                        </span>
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
            </div>
        )
    }
};
