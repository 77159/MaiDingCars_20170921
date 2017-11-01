/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 实时监控页面，系统默认页面。路径为'/'
 */

'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';

const {SubMenu} = Menu;
const {Sider, Content, Header, Footer} = Layout;
import {Input} from 'antd';
import {Avatar} from 'antd';
import {Radio} from 'antd';
import {Card} from 'antd';
import {Badge} from 'antd';
import {notification} from 'antd';
import {AutoComplete} from 'antd';
import {Modal} from 'antd';
import {Popconfirm} from 'antd';
import {Row, Col, Select} from 'antd';
const RadioButton = Radio.Button;
const Search = Input.Search;
import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {makeSelectRepos, makeSelectLoading, makeSelectError} from '../App/selectors';
import {loadRepos} from '../App/actions';
import {changeUsername} from './actions';
import {makeSelectUsername} from './selectors';
import {DatePicker} from 'antd';
const {MonthPicker, RangePicker} = DatePicker;
import {TimePicker} from 'antd';
import moment from 'moment';
const format = 'HH';
import {Tabs, Checkbox} from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;


const siderTriggerNode = () => {
    return (<span>启用<i className={styles.greenCircle}/></span>);
}

/**
 * 显示报警信息
 * @param type
 */
const openNotificationWithIcon = (type) => {
    notification[type]({
        message: '警告：警员张保国进入重点区域',
        // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

import {Pagination} from 'antd';
import {Form} from 'antd';
import {Table} from 'antd';
import {realTimeLocationsSelector} from "../MainContainer/selectors";
import _ from 'lodash';

const CollectionCreateForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, confirmLoading, loading, form} = props;

        //区域集中报警
        const columnsCenter = [{
            title: '报警时间',
            dataIndex: 'alarmTime',
            key: 'alarmTime',
        }, {
            title: '报警区域',
            dataIndex: 'yourRegion',
            key: 'yourRegion',
        }, {
            title: '报警内容',
            dataIndex: 'alarmInfo',
            key: 'alarmInfo',
            width: 600,
        }, {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" className={styles.tableBtn} ghost>热力图</Button>
                        <Popconfirm title="确认要删除此设备吗？">
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];

        //状态报警
        const columnsStatus = [{
            title: '报警时间',
            dataIndex: 'alarmTime',
            key: 'alarmTime',
        }, {
            title: '报警车辆',
            dataIndex: 'carNum',
            key: 'carNum',
        }, {
            title: '报警内容',
            dataIndex: 'alarmInfo',
            key: 'alarmInfo',
            width: 400,
        }, {
            title: '上次工作时间',
            dataIndex: 'prevTime',
            key: 'prevTime',
        }, {
            title: '上次工作区域',
            dataIndex: 'prevArea',
            key: 'prevArea',
        }, {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" className={styles.tableBtn} ghost>定位</Button>
                        <Popconfirm title="确认要删除此设备吗？">
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];

        const columnsSpeed = [{
            title: '报警时间',
            dataIndex: 'alarmTime',
            key: 'alarmTime',
        }, {
            title: '车辆编号',
            dataIndex: 'carId',
            key: 'carId',
        }, {
            title: '报警内容',
            dataIndex: 'alarmInfo',
            key: 'alarmInfo',
        }, {
            title: '安全速度',
            dataIndex: 'SafeSpeed',
            key: 'SafeSpeed',
        }, {
            title: '报警速度',
            dataIndex: 'alarmSpeed',
            key: 'alarmSpeed',
        }, {
            title: '所在区域',
            dataIndex: 'yourRegion',
            key: 'yourRegion',
        }, {
            title: '超速时长',
            dataIndex: 'overspeedLength',
            key: 'overspeedLength',
        }, {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" className={styles.tableBtn} ghost>定位</Button>
                        <Popconfirm title="确认要删除此设备吗？">
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];
        const footer = () => '共计 6 条数据';

        const dataSource = [];
        for (let i = 1; i < 7; i++) {
            dataSource.push({
                key: i,
                alarmTime: '2017-8-21 03:27:33',
                carId: 'NO0023',
                alarmInfo: '该车辆已超速80%',
                SafeSpeed: '10.0 km/h',
                alarmSpeed: '15.0 km/h',
                yourRegion: 'B',
                overspeedLength: '60s',
                prevTime: '2017-8-20 09:27:33',
                prevArea: 'B',
                carNum: 'CL0000016'
            });
        }
        const pagination = {
            defaultCurrent: 1,
            total: 32,
            showTotal: () => {
                (total, range) => `${range[0]}-${range[1]} of ${total} items`
            },
            pageSize: 10
        };

        //联动的选择框
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
            }),
        };

        return (
            <Modal
                title={<span><Icon type="hdd"/>异常报警</span>}
                visible={visible}
                onOk={onCreate}
                onCancel={onCancel}
                confirmLoading={confirmLoading}
                footer={null}
                width={1280}
                className={styles.redModal}
            >


                <div className="card-container">
                    <Tabs type="card">
                        <TabPane tab="区域集中报警" key="1">
                            <Row type="flex" align="middle" style={{height: '100px', marginTop: '-20px'}}>
                                <Col span={5} className={styles.item}>
                                    <span>区域选择</span>
                                    <Select style={{width: '75%'}} defaultValue="all" size="large">
                                        <Option value="all">全部</Option>
                                        <Option value="1">A区</Option>
                                        <Option value="2">B区</Option>
                                    </Select>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                    <Icon style={{color: '#a8a  8a8'}} type="minus"/>&nbsp;
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？">
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？">
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table} bordered={true} footer={footer}
                                   size="middle"
                                   pagination={pagination}
                                   rowSelection={rowSelection}
                                   columns={columnsCenter} dataSource={dataSource}>
                            </Table>
                        </TabPane>

                        <TabPane tab="车辆状态报警" key="2">
                            <Row type="flex" align="middle" style={{height: '100px', marginTop: '-20px'}}>
                                <Col span={5} className={styles.item}>
                                    <span>车辆查询</span>
                                    <AutoComplete
                                        style={{width: '75%'}}
                                        allowClear={true}
                                        placeholder="请输入车辆编号" size="large"
                                    >
                                        <Input maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                    <Icon style={{color: '#a8a  8a8'}} type="minus"/>&nbsp;
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？">
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？">
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table} bordered={true} footer={footer}
                                   size="middle"
                                   pagination={pagination}
                                   rowSelection={rowSelection}
                                   columns={columnsStatus} dataSource={dataSource}>
                            </Table>
                        </TabPane>

                        <TabPane tab="车辆超速报警" key="3">
                            <Row type="flex" align="middle" style={{height: '100px', marginTop: '-20px'}}>
                                <Col span={5} className={styles.item}>
                                    <span>车辆查询</span>
                                    <AutoComplete
                                        style={{width: '75%'}}
                                        allowClear={true}
                                        placeholder="请输入车辆编号" size="large"
                                    >
                                        <Input maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                    <Icon style={{color: '#a8a  8a8'}} type="minus"/>&nbsp;
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} defaultValue={moment('09', format)}
                                                format={format}></TimePicker>
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？">
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？">
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table} bordered={true} footer={footer}
                                   size="middle"
                                   pagination={pagination}
                                   rowSelection={rowSelection}
                                   columns={columnsSpeed} dataSource={dataSource}>
                            </Table>
                        </TabPane>

                    </Tabs>

                    <Badge className={styles.badge1} count={9} overflowCount={99}/>
                    <Badge className={styles.badge2} count={19} overflowCount={99}/>
                    <Badge className={styles.badge3} count={100} overflowCount={99}/>

                </div>


            </Modal>
        );
    }
);

// end form

export class MonitoringPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            containerStyle: {
                height: '100%',
                width: '100%',
                minHeight: '100%',
                top: '0px',
                left: '0px',
                backgroundColor: '#f2f4f5'
            },
            siderCollapsed: false,         //人员信息sider当前收起状态, 【false】展开 【true】收起
            siderTrigger: null,
            peopleInfoWinClassName: styles.peopleCard,
            peopleCardHidden: false,
            alarmModalVisible: false,
            alarmLoading: false,
            alarmConfirmLoading: false,
            ModalText: 'Content of the modal',
            allPeopleLocationMap: new Map()            //所有人员的位置信息 key:personCode value:LocationEntity={...FMImageMarker}
        }

        //定义全局map变量
        this.fmMap = null;
        this.fmapID = 'md-xm-57-9';
        this.imageMarker = null;
        //this.groupLayer;
        //this.layer = null;
        //this.addMarker = true;
        //this.polygonEditor = null;
    }

    /**
     * 人员列表中，某一人员被选中时调用
     * @param item
     * @param key
     * @param selectedKeys
     */
    onPeopleItemSelected = ({item, key, selectedKeys}) => {
        console.log(item);
        this.onClosePeopleInfoWindow();
    }

    /**
     * 当人员面板展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
     * @param collapsed 当前状态（【true】收起 【false】展开）
     * @param type 触发类型
     */
    onCollapse = (collapsed, type) => {
        this.setState({siderCollapsed: !this.state.siderCollapsed});
        console.log(this.state.siderCollapsed);
        if (this.state.siderCollapsed) {  //收起状态
            //展开
            this.setState({
                siderTrigger: null
            });
            //修改指南针位置
            this.fmMap.options.compassOffset = [276, 20];
            this.fmMap.updateSize();
        } else {
            //收缩
            this.setState({
                siderTrigger: undefined
            });
            //修改指南针位置
            this.fmMap.options.compassOffset = [20, 20];
            this.fmMap.updateSize();
        }
    }

    /**
     * 显示/隐藏 人员信息窗口
     */
    onClosePeopleInfoWindow = () => {
        console.log(styles.peopleCard);
        console.log("animated fadeInUp " + styles.peopleCard);
        if (this.state.peopleCardHidden) {
            //显示人员信息窗口
            this.setState({
                peopleInfoWinClassName: "animated fadeInUp " + styles.peopleCard,
                peopleCardHidden: false
            });
        } else {
            //隐藏窗口
            this.setState({
                peopleInfoWinClassName: "animated fadeOutDown " + styles.peopleCard,
                peopleCardHidden: true
            });
        }
    }

    initPolygonEditor = () => {
        //创建 可编辑多形绘制与编辑类的实例
        this.polygonEditor = new fengmap.FMPolygonEditor({

            // fengmap 地图实例
            map: this.fmMap,

            // 绘制的 PolygonMarker 的颜色
            color: 0x22A5ee,

            // 绘制完成后的回调方法. 在这里得到绘制完成的 polygonMarker实例
            callback: function (polygonMarker) {
                //
                // 在创建完成后, 返回创建的 PolygonMarker
                // 	getPoints: 得到些PM中的所有地图坐标点
                //
                console.log(polygonMarker.getPoints());
            }
        });

        // html buttons
        //var aBtn = document.querySelectorAll('.btn');

        //添加多边形标注
        // aBtn[0].onclick = function () {
        //     // 绘制模式
        //     polygonEditor.start('create');
        //
        // };
        // //删除多边形标注
        // aBtn[1].onclick = function () {
        //     // 编辑模式
        //     polygonEditor.start('edit');
        // };
    }

    //添加Marker
    addMarker = (coord) => {
        coord = {x: 13155860.0623301, y: 2813445.34302628, z: 2};
        let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        let layer2 = group.getOrCreateLayer('imageMarker');
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
        this.imageMarker = imageMarker;
    };

    //更新Marker位置
    updateMark = (locationEntity) => {

        //     dataTime:"2017-09-12 21-57-51"
        // deviceCode:"110101"
        // direction:1
        // dumpPower:98
        // personCode:"ABCD_110101"
        // pointX:13155861.3471
        // pointY:2813452.60713
        // sid:"abcd"
        // speed:19
        // type:0

        //查找此人员当前是否已存在
        if (this.state.allPeopleLocationMap.has(locationEntity.personCode) == true) {
            //获取到之前已添加的人员位置实体
            let peopleLocation = this.state.allPeopleLocationMap.get(locationEntity.personCode);
            //更新ImageMarker的位置
            peopleLocation.imageMarker.moveTo({
                //设置imageMarker的x坐标
                x: locationEntity.pointX,
                //设置imageMarker的y坐标
                y: locationEntity.pointY,
            });
            //保存最新的位置信息
            Object.assign(peopleLocation, locationEntity);
        } else {
            //创建新的ImageMarker
            let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
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
            //将ImageMarker保存到locationEntity内
            locationEntity.imageMarker = imageMarker;
            //保存到Map中
            this.state.allPeopleLocationMap.set(locationEntity.personCode, locationEntity);
        }

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

    }

    /**
     * 初始化地图
     */
    initMap = () => {

        //放大、缩小控件配置
        let zoomCtlOpt = new fengmap.controlOptions({
            position: fengmap.controlPositon.RIGHT_TOP,
            imgURL: './img/fm_controls/',
            offset: {
                x: 15,
                y: 357
            },
            scaleLevelcallback: function (level, result) {
                console.log(result);
                /*当前级别：map.mapScaleLevel
                 最小级别：map._minMapScaleLevel
                 最大级别：map._maxMapScaleLevel*/
            }
        });

        var ctlOpt = new fengmap.controlOptions({
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
        });

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
            compassOffset: [276, 20],
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

        //var _addTestMarker2 = this.addMarker;

        //初始化绘制插件
        this.fmMap.on('loadComplete', function () {

            this.visibleGroupIDs = [1];
            this.focusGroupID = 1;

            var groupControl = new fengmap.scrollGroupsControl(this, ctlOpt);

            //放大、缩小控件
            var zoomControl = new fengmap.zoomControl(this, zoomCtlOpt);

            var toolControl = new fengmap.toolControl(this, {
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

            //添加测试用的人员Marker
            //_addTestMarker2();
        });

        //点击事件
        this.fmMap.on('mapClickNode', function (event) {
            console.log("click event.");
            var model = event;
            switch (event.nodeType) {
                case fengmap.FMNodeType.FLOOR:
                    //if (event.eventInfo.eventID == eventID) return;
                    console.log('x:' + event.eventInfo.coord.x + ";     y:" + event.eventInfo.coord.y);
                    break;
                case fengmap.FMNodeType.MODEL:
                    //过滤类型为墙的model
                    if (event.typeID == '30000') {
                        //其他操作
                        return;
                    }
                    //模型高亮
                    this.fmMap.map.storeSelect(model);
                    //弹出信息框
                    console.log('x:' + event.label ? event.label.mapCoord.x : event.mapCoord.x + ";     y:" + event.label ? event.label.mapCoord.y : event.mapCoord.y);
                    break;
                case fengmap.FMNodeType.FACILITY:
                case fengmap.FMNodeType.IMAGE_MARKER:
                    //弹出信息框
                    console.log('公共设施 x:' + event.target.x + ";     y:" + event.target.y);
                    break;
            }
        });
    }

    /**
     * 显示报警列表
     */
    onShowAlarmModal = () => {
        this.setState({
            alarmModalVisible: true
        });
    }

    handleCreate = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            alarmConfirmLoading: true,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            alarmModalVisible: false,
        });
    }

    /**
     * 组件第一次加载完成周期，创建地图
     */
    componentDidMount() {
        //初始化地图
        this.initMap();
        //打开web worker
    }

    componentWillReceiveProps(nextProps) {

        if (_.eq(this.props.realTimeLocations, nextProps.realTimeLocations) == false) {
            console.log("位置变化");
            this.updateMark(nextProps.realTimeLocations);
        }
    }


    render() {
        const {userName} = this.state;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return (
            <Layout className={styles.layout}>
                <Sider width={256} className={styles.sider} collapsible={true}
                       collapsed={this.state.siderCollapsed}
                       onCollapse={this.onCollapse}
                       trigger={this.state.siderTrigger}
                       collapsedWidth={0}>
                    <Layout style={{height: '100%'}}>
                        <div style={{
                            height: '38px',
                            background: '#302036',
                            lineHeight: '38px',
                            color: '#fff',
                            padding: '0 10px'
                        }}>
                            车辆信息&nbsp;&nbsp;&nbsp;6 / 8
                            <span className={styles.left_arrow} title="收起窗口" onClick={this.onCollapse.bind(this)}><Icon
                                type="left"/></span>
                        </div>
                        <Content>
                            <div style={{width: '100%', background: '#F6F5FC'}}>
                                <Input
                                    placeholder="请输入编号筛选"
                                    prefix={<Icon type="search"/>}
                                    suffix={suffix}
                                    value={userName}
                                    onChange={this.onChangeUserName}
                                    className={styles.searchInput}
                                    ref={node => this.userNameInput = node}
                                />
                            </div>


                            <Select className={styles.selectDrop} defaultValue="all" size="large">
                                <Option value="all">显示全部</Option>
                                <Option value="0">在线状态</Option>
                                <Option value="1">离线状态</Option>
                                <Option value="2">报警状态</Option>
                            </Select>


                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['3']}
                                className={styles.menu}
                                onClick={this.onPeopleItemSelected}
                            >
                                <Menu.Item key="1">
                                    <Avatar size="large" src="img/avatar/001.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>7.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000002</div>
                                        <div>6.9 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000003</div>
                                        <div>8.5 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000004</div>
                                        <div>7.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000005</div>
                                        <div>7.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <Avatar size="large" src="img/avatar/001.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000006</div>
                                        <div>10.2 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button shape="circle" type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button shape="circle" type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="7" disabled={true}>
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000007</div>
                                        <div>0.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button shape="circle" type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button shape="circle" type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="8" disabled={true}>
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000009</div>
                                        <div>0.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Button shape="circle" type="primary" icon="eye" title="隐藏/可见"/>
                                        <Button shape="circle" type="primary" icon="environment" title="定位"/>
                                    </div>
                                </Menu.Item>
                            </Menu>
                        </Content>
                        <Footer className={styles.footer}>
                            <Button ghost size="small" icon="eye">全部可见</Button>
                            <Button ghost size="small" icon="eye-o">全部隐藏</Button>
                        </Footer>
                    </Layout>
                </Sider>
                <Content>
                    <div id="fengMap" className="fengMap" style={this.state.containerStyle}></div>
                    <div className={styles.mapActions}>
                        <span className={styles.mapActionBtn} onClick={this.onShowAlarmModal} title="今日报警">
                            <Badge count={5}>
                              <img src="./img/fm_controls/alarm.png"></img>
                            </Badge>
                        </span>
                        <span className={styles.mapActionBtn} onClick={() => openNotificationWithIcon('error')}
                              title="摄像头点位"><img src="./img/fm_controls/video.png"></img></span>
                    </div>
                    <Card noHovering={true} bordered={false} className={this.state.peopleInfoWinClassName} title={
                        <span><Icon type="solution"/>车辆编号： KH026291</span>
                    }
                          extra={<span className={styles.peopleClose} title="关闭"
                                       onClick={this.onClosePeopleInfoWindow.bind(this)}><Icon
                              type="close"/></span>}
                    >
                        {/* <div className={styles.leftPeopleContent}>
                         <Avatar className={styles.peopleAvatar} src="img/avatar/001@90px.png"/>
                         <span className={styles.nameTag}>刘玲玲</span>
                         </div>*/}
                        <div className={styles.rightPeopleContent}>
                            <span>车辆类型：叉车</span>
                            <span>设备编号：KNfs00021</span>
                            <span>行驶里程：85km</span>
                            <span>设备电量：60%</span>
                            <span>车辆状态：车辆已超速行驶</span>
                            <span>当前位置：B区域</span>
                        </div>
                    </Card>
                    {/*<div className="operating">
                     <button className="btn btn-default" id="btn1"
                     style={{marginTop: '-50px', marginLeft: '300px', position: 'absolute'}}>绘制 可编辑多边形
                     </button>
                     <button className="btn btn-default" id="btn2"
                     style={{marginTop: '-50px', marginLeft: '450px', position: 'absolute'}}>编辑 可编辑多边形
                     </button>
                     </div>*/}
                    {/*报警信息窗口*/}
                    <CollectionCreateForm
                        ref={this.saveFormRef}
                        visible={this.state.alarmModalVisible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        loading={this.state.alarmLoading}
                        confirmLoading={this.state.alarmConfirmLoading}
                    />

                </Content>
            </Layout>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        //showDeviceFormModal: (operation, deviceCode) => dispatch(deviceFormModalShow(operation, deviceCode))
    };
}

const selectorStateToProps = createStructuredSelector({
    realTimeLocations: realTimeLocationsSelector(),
});

// Wrap the component to inject dispatch and state into it
export default connect(selectorStateToProps, actionsDispatchToProps)(MonitoringPage);