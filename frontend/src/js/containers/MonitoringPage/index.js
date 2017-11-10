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

const {Sider, Content, Footer} = Layout;
import {Input} from 'antd';
import {Avatar} from 'antd';
import {Card} from 'antd';
import {Badge} from 'antd';
import {notification} from 'antd';
import {AutoComplete} from 'antd';
import {Modal} from 'antd';
import {Popconfirm} from 'antd';
import {Row, Col, Select} from 'antd';
import {Form} from 'antd';
import {Table} from 'antd';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {DatePicker} from 'antd';
import {TimePicker} from 'antd';
import moment from 'moment';
import {Tabs} from 'antd';

import {realTimeLocationsSelector} from "../MainContainer/selectors";
//action car
import {queryAllCarBegin} from '../CarMgrPage/actions';
//selectors car
import {carListSelector} from '../CarMgrPage/selectors';
//action area
import {queryAreaListBegin} from '../AreaSettingPage/actions';
//action category
import {getCarCategory} from '../CategoryFormModel/actions';
//selectors category
import {carCategorySourceSelector} from '../CategoryFormModel/selectors';
//action main
import {
    updateMessageShow,
    updateUnReadMessage,
    deleteAlarmMessageByKeys
} from '../MainContainer/actions';
//selectors main
import {alertMessageDataSelector, alarmDatasSelector} from '../MainContainer/selectors';

import styles from './index.less';

//自定义组件
import MonitoringMap from '../../components/MonitoringMap';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const format = 'HH';


const CollectionCreateForm = Form.create()(
    (props) => {
        const {alertMessageData, visible, onCancel, updateUnReadMessage} = props;
        const {speedSelectedRowKeys, setSelectedRowKeys, deleteAlarmMessageByKeys, deleteAlarmMessageByKey} = props;
        const {areaSelectedRowKeys, densitySelectedRowKeys} = props;
        const {setDatasFiter} = props;
        let speedDatas = [];//速度报警
        let areaDatas = []; //区域报警
        let densityDatas = [];//密度报警

        let speedUnRead = 0;
        let densityUnRead = 0;
        let areaUnRead = 0;


        for (let i = 0; i < alertMessageData.size; i++) {
            const item = alertMessageData.get(i);
            if (!item) return;
            const type = item.type;

            //闲置报警
            if (type === 97) {
                densityDatas.push(item);
                densityUnRead++;
            }

            //密度报警
            if (type === 98) {
                areaDatas.push(item);
                areaUnRead++;
            }

            //超速报警
            if (type === 99) {
                speedDatas.push(item);
                speedUnRead++;
            }

        }

        //区域集中报警
        const columnsCenter = [
            {
                title: '报警时间',
                dataIndex: 'dateTime',
                key: 'dateTime',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.dateTime}</span>
                }
            }, {
                title: '报警区域',
                dataIndex: 'areaName',
                key: 'areaName',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.areaName}</span>
                }
            }, {
                title: '报警内容',
                dataIndex: 'remark',
                key: 'remark',
                width: 600,
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.remark}</span>
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 200,
                render: (text, record) => {
                    return (
                        <div>
                            <Button type="primary" className={styles.tableBtn} ghost>热力图</Button>
                            <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                                deleteAlarmMessageByKey('areaSelectedRowKeys', record.key);
                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        //区域密度
        const areaFooter = () => `共计 ${areaDatas.length} 条数据`;

        //区域密度分页
        const areaPagination = {
            defaultCurrent: 1,
            total: areaDatas.length,
            pageSize: 10
        };

        //区域密度选择列表
        const areaRowSelection = {
            onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys, 'areaSelectedRowKeys');
            },
            selectedRowKeys: areaSelectedRowKeys
        };

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
                        <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                            deleteAlarmMessageByKey('densitySelectedRowKeys', record.key);
                        }}>
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];


        //闲置
        const densityFooter = () => `共计 ${densityDatas.length} 条数据`;

        //闲置分页
        const densityPagination = {
            defaultCurrent: 1,
            total: densityDatas.length,
            pageSize: 10
        };

        //闲置选择列表
        const densityRowSelection = {
            onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys, 'densitySelectedRowKeys');
            },
            selectedRowKeys: densitySelectedRowKeys
        };


        /*********************** 超速报警 ***********************/
        const SpeedColumns = [{
            title: '报警时间',
            dataIndex: 'dateTime',
            key: 'dateTime',
            render: function (text, record, index) {
                return <span className={record.isRead === true ? styles.bold : styles.normal}>{record.dateTime}</span>
            }
        }, {
            title: '车辆编号',
            dataIndex: 'carCode',
            key: 'carCode',
            render: function (text, record, index) {
                return <span className={record.isRead === true ? styles.bold : styles.normal}>{record.carCode}</span>
            }
        }, {
            title: '报警内容',
            dataIndex: 'remark',
            key: 'remark',
            render: function (text, record, index) {
                return <span className={record.isRead === true ? styles.bold : styles.normal}>{record.remark}</span>
            }
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
            dataIndex: 'reaName',
            key: 'reaName',
            render: function (text, record, index) {
                return <span className={record.isRead === true ? styles.bold : styles.normal}>{record.areaName}</span>
            }
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
                        <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                            deleteAlarmMessageByKey('speedSelectedRowKeys', record.key);
                        }}>
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];

        //车辆超速
        const speedFooter = () => `共计 ${speedDatas.length} 条数据`;

        //车辆超速分页
        const speedPagination = {
            defaultCurrent: 1,
            total: speedDatas.length,
            pageSize: 10
        };

        //车辆超速选择列表
        const speedRowSelection = {
            onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys, 'speedSelectedRowKeys');
            },
            selectedRowKeys: speedSelectedRowKeys
        };

        return (
            <Modal
                title={<span><Icon type="hdd"/>异常报警</span>}
                visible={visible}
                onCancel={onCancel}
                width={1280}
                className={styles.redModal}
                footer={[
                    <Button key="cancel" type="primary" size="large" onClick={onCancel}>确定</Button>,
                ]}
            >
                <div className="card-container">
                    <Tabs type="card">
                        {/*密度*/}
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
                                    <Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {
                                        updateUnReadMessage('areaSelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys('areaSelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table}
                                   bordered={true}
                                   footer={areaFooter}
                                   size="middle"
                                   pagination={areaPagination}
                                   rowSelection={areaRowSelection}
                                   columns={columnsCenter}
                                   dataSource={areaDatas}>
                            </Table>
                        </TabPane>
                        {/*闲置*/}
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
                                    <Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {
                                        updateUnReadMessage('densitySelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys('densitySelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table}
                                   bordered={true}
                                   footer={densityFooter}
                                   size="middle"
                                   pagination={densityPagination}
                                   rowSelection={densityRowSelection}
                                   columns={columnsStatus}
                                   dataSource={densityDatas}>
                            </Table>
                        </TabPane>
                        {/*超速*/}
                        <TabPane tab="车辆超速报警" key="3">
                            <Row type="flex" align="middle" style={{height: '100px', marginTop: '-20px'}}>
                                <Col span={5} className={styles.item}>
                                    <span>车辆查询</span>
                                    <AutoComplete
                                        style={{width: '75%'}}
                                        allowClear={true}
                                        placeholder="请输入车辆编号" size="large"
                                    >
                                        <Input ref="aaa" maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} format={format}></TimePicker>
                                    <Icon style={{color: '#a8a  8a8'}} type="minus"/>&nbsp;
                                    <DatePicker style={{width: '26%'}}></DatePicker>
                                    <TimePicker style={{width: '15%'}} format={format}></TimePicker>
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" onClick={() => {
                                        this.setDatasFiter();
                                    }} icon="search"
                                            className={styles.searchBtn}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {
                                        updateUnReadMessage('speedSelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys('speedSelectedRowKeys');
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn} onClick={() => {
                                        }}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            {/*超速报警信息列表*/}
                            <Table
                                className={styles.table}
                                bordered={true}
                                footer={speedFooter}
                                size="middle"
                                pagination={speedPagination}
                                rowSelection={speedRowSelection}
                                columns={SpeedColumns}
                                dataSource={speedDatas}>
                            </Table>
                        </TabPane>
                    </Tabs>
                    <Badge className={styles.badge1} count={areaUnRead}/>
                    <Badge className={styles.badge2} count={densityUnRead}/>
                    <Badge className={styles.badge3} count={speedUnRead}/>
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
            siderCollapsed: false,
            siderTrigger: null,
            carList: props.carList,
            positionCarCode: '',
            carInfo: null,           //车辆详细信息
            cardVisible: 'hidden',
            carInfoWinClassName: styles.carCard,
            carCardHidden: true,
            alarmModalVisible: false,
            speedSelectedRowKeys: [],   //速度列表keys集合
            densitySelectedRowKeys: [], //闲置列表keys集合
            areaSelectedRowKeys: [],    //区域密度列表keys集合
            speedFliter: null
        };


        this.imageMarker = null;
        this.personImageMarkers = {};        //地图人员marker对象

        //定义全局map变量
        this.fmMap = null;
        this.notificationKeys = []; //当前提示框
        this.keys = [];             //批量/单个选择报警信息key值

    }

    componentWillMount() {
        //查询所有车辆
        this.props.queryAllCarBegin();
        //查询人员类型
        this.props.getCarCategory();
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            carList: nextProps.carList
        });
    };

    componentDidUpdate() {
        this.showNotification();
    };

    /**
     * 显示警报信息
     */
    showNotification = () => {
        const alarmDatas = this.props.alarmDatas;

        alarmDatas.map((item) => {
            if (item.isShow && this.notificationKeys.length < 3) {
                const key = item.key;
                notification['error']({
                    key: key,
                    message: `警告：【${item.carCode}】${item.remark}`,
                    duration: 3,
                    onClose: () => {
                        //如果当前所在重点区域的消息框关闭，此次重点区域中移动不再弹出信息框，直到下次再次进入重点区域再弹出信息框；
                        const index = this.notificationKeys.indexOf(key);
                        this.notificationKeys.splice(index, 1);
                    },
                    icon: <Icon type="close-circle" style={{color: '#ff0000', fontSize: 18}}/>,
                    style: {
                        width: 'auto',
                        height: 38,
                        padding: 7,
                    }
                });
                this.props.updateMessageShow(key);
                this.notificationKeys.push(key);
            }
        });
    };


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
    };

    /**
     * 获取左侧菜单
     */
    getMenu = () => {
        const carList = this.state.carList;
        this.onLineCount = 0;   //在线人数
        //检查在线人数
        // carList.map((car) => {
        //     if (!this.onLineDevice) return;
        //     this.onLineDevice.map((device) => {
        //         console.log(device);
        //         if (device.deviceCode === car.deviceCode) {
        //             car.onLine = true;
        //             this.onLineCount++;
        //         }
        //     });
        // });

        //根据在线排序
        // carList.sort((a, b) => {
        //     const x = a.onLine ? 1 : 0;
        //     const y = b.onLine ? 1 : 0;
        //
        //     if (x < y) {
        //         return 1;
        //     }
        //     if (x > y) {
        //         return -1;
        //     }
        //     if (x === y) {
        //         return 0;
        //     }
        // });

        return carList.map((car) => {
            const carCode = car.carCode;
            car.onLine = true;

            //定位当前车辆
            const carImagePosition = this.state.positionCarCode === carCode ? true : false;
            //当前车辆在地图上显示(true)/隐藏(false)状态
            const carImageVisible = this.getVisibleCarImageMarkerStatus(carCode);

            return (
                <Menu.Item key={carCode} disabled={!car.onLine}>
                    <Avatar size="large" src="img/avatar/avatar.png"/>
                    <div className={styles.content}>
                        <div className={styles.code}>{car.carCode}</div>
                        <div>{car.safetySpeed} km/h</div>
                    </div>
                    {
                        car.onLine
                            ?
                            <div className={styles.btnContent}>
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                    this.visibleCarImageMarkerByCarCode(carCode);
                                }}
                                        type="primary"
                                        icon={carImageVisible ? 'eye-o' : 'eye'}
                                        title="隐藏/可见"/>
                                <Button style={{color: '#5B5B5B'}} onClick={(e) => {
                                    e.stopPropagation();
                                    this.getCarInfoByCarCode(carCode);
                                    this.positionCarMarker(carCode);
                                }}
                                        type="primary"
                                        icon={carImagePosition ? 'environment-o' : 'environment'}
                                        title="定位"/>
                            </div>
                            :
                            null
                    }
                </Menu.Item>
            )
        })
    };


    /**
     * 显示/隐藏 人员信息窗口
     */
    onCloseCarInfoWindow = () => {
        //当前车辆详细信息对象不为空，并车辆详细信息卡隐藏，则显示信息卡片
        if (this.state.cardVisible === 'hidden') {
            this.setState({
                cardVisible: 'visible'
            })
        }

        if (this.state.carCardHidden) {
            //显示人员信息窗口
            this.setState({
                carInfoWinClassName: "animated fadeInUp " + styles.carCard,
                carCardHidden: false
            });
        } else {
            //隐藏窗口
            this.setState({
                carInfoWinClassName: "animated fadeOutDown " + styles.carCard,
                carCardHidden: true
            });
        }
    };

    /**
     * 获取fengmap对象
     * @fmMap fengmap对象
     */
    getMap = (fmMap) => {
        this.fmMap = fmMap;
    };

    /**
     * 显示/隐藏所有carImageMarker
     * @visible 显示/隐藏
     */
    visibleAllCarImageMarker = (visible) => {
        if (!this.fmMap) return;
        const {carMarkerLayer} = this.fmMap;
        if (!carMarkerLayer) return;
        carMarkerLayer.visible = visible;
    };

    /**
     * 根据车辆编号显示/隐藏车辆在地图上的显示
     * @carCode 车辆编号
     */
    visibleCarImageMarkerByCarCode = (carCode) => {
        if (!carCode) return;
        if (!this.fmMap) return;
        const {carImageMarkers} = this.fmMap;
        if (!carImageMarkers) return;
        const carImageMarker = carImageMarkers[carCode];
        if (!carImageMarker) return;
        carImageMarker.visible = !carImageMarker.visible;
    };

    /**
     * 根据车辆编号获取当前carImageMarker是显示(true)/隐藏(false)状态(visible)
     * @carCode 车辆编号
     */
    getVisibleCarStatus = (carCode) => {
        if (!carCode) return;
        if (!this.fmMap || !this.fmMap.carImageMarkers) return;
        const carImageMarker = this.fmMap.carImageMarkers[carCode];
        if (!carImageMarker) return;
        return carImageMarker.visible;
    };

    /**
     * 根据车辆编号获取当前车辆在地图上是显示(true)/隐藏(false)状态
     * @carCode 车辆编号
     */
    getVisibleCarImageMarkerStatus = (carCode) => {
        if (!this.fmMap) return;
        const {carMarkerLayer} = this.fmMap;
        if (!carMarkerLayer) return;
        //如果当前carMarkerLayer是隐藏状态，则所有车辆隐藏，反之则根据当前imageMarker的visible返回当前显示/隐藏状态
        if (carMarkerLayer.visible) {
            return this.getVisibleCarStatus(carCode);
        } else {
            return false;
        }
    };

    /**
     * 定位当前车辆，根据车辆编号，将当前编号的车辆移至到当前地图视野中心，并始终跟随移动
     * @carCode 车辆编号
     */
    positionCarMarker = (carCode) => {
        //当前没有定位的车辆，则直接定位该车辆；
        //当前有定位车辆，如果当前车辆编号与该车辆编号相同，则取消当前定位车辆
        //当前有定位车辆，如果当前车辆编号与该车辆不相同，则直接更换该车辆定位编号

        const statePositionCarCode = this.state.positionCarCode;
        let positionCarCode = '';

        if (carCode && statePositionCarCode !== carCode) {
            positionCarCode = carCode;
        } else if (!carCode) {
            positionCarCode = carCode;
        }
        this.setState({
            positionCarCode: positionCarCode
        })
    };

    /**
     * 根据车辆编号获取当前车辆详细信息
     * @carCode 车辆编号
     */
    getCarInfoByCarCode = (carCode) => {
        if (!carCode) return;
        const {carList} = this.props;
        if (!carList) return;
        const carInfos = carList.filter((item) => {
            return item.carCode === carCode;
        });

        let carInfo = null;
        if (carInfos.length > 0) {
            carInfo = carInfos[0];
        }


        //如果当前卡片关闭状态则显示
        //如果当前卡片展开状态，并且当前carCode与点击的carCode相同则关闭，反正则只更新数据不进行关闭
        //关闭
        if (this.state.carCardHidden) {
            this.onCloseCarInfoWindow();
        } else if (!this.state.carCardHidden && this.state.carInfo.carCode === carCode) {
            this.onCloseCarInfoWindow();
        }

        this.setState({
            carInfo: carInfo,
        });
    };

    /**
     * 获取信息卡的详细信息
     */
    getCarInfoByCard = () => {
        let cardInfo = {
            carCode: '',
            mileage: '',
            electric: '',
            status: '',
            area: '',
            carType: '',
        };
        const carInfo = this.state.carInfo;
        if (!carInfo) return cardInfo;
        cardInfo.carCode = carInfo.carCode;
        cardInfo.carType = carInfo.carType ? this.getCarTypeById(carInfo.carType) : '';
        return cardInfo;
    };

    /**
     * 根据车辆类型id获取车辆类型对象
     * @id 车辆类型id
     */
    getCarTypeById = (id) => {
        if (!id) return '';
        let carType = '';
        const carCategory = this.props.carCategory;
        if (carCategory && carCategory.length > 0) {
            const cType = carCategory.filter((item) => {
                return item.id === id;
            });

            if (cType && cType.length > 0) {
                carType = cType[0].typeName;
            }
        }
        return carType;
    };

    /**
     * 显示报警信息列表
     */
    onShowAlarmModal = () => {
        this.setState({
            alarmModalVisible: !this.state.alarmModalVisible,
            speedSelectedRowKeys: []    //超速列表
        })
    };

    /**
     * 选择当前速度报警信息列表
     * @param keys
     */
    setSelectedRowKeys = (keys, type) => {
        let selectedkeys = {};
        selectedkeys[type] = keys;

        this.setState(selectedkeys);
    };

    /**
     * 更新报警信息已读
     */
    updateUnReadMessage = (type) => {
        const selectedRowKeys = this.state[type];
        if (selectedRowKeys.length <= 0) return;
        this.props.updateUnReadMessage(selectedRowKeys);
    };

    /**
     * 批量删除报警信息
     */
    deleteAlarmMessageByKeys = (type) => {
        let speedSelectedRowKeys = this.state[type];
        if (speedSelectedRowKeys.length <= 0) return;
        this.props.deleteAlarmMessageByKeys(speedSelectedRowKeys);
        this.updateSelectedKeys(type, speedSelectedRowKeys);
    };

    /**
     * 根据当前主键删除报警信息
     * @key 当前要删除的主键/key
     */
    deleteAlarmMessageByKey = (type, key) => {
        if (!key) return;
        this.props.deleteAlarmMessageByKeys([key]);
        this.updateSelectedKeys(type, [key]);
    };

    /**
     * 需要排除key的集合
     * @keys 当前排除的key集合
     */
    updateSelectedKeys = (type, keys) => {
        let selectedRowKeys = this.state[type];
        const rowKeys = selectedRowKeys.filter((item) => {
            let flag = false;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === item) {
                    flag = true;
                    break;
                }
            }
            return flag === false;
        });

        let stateKeys = {};
        stateKeys[type] = rowKeys;
        console.log('stateKeys', stateKeys);
        this.setState(stateKeys);
    };

    setDatasFiter = (type, datas) => {
        let filter = {};
        filter[type] = datas;
        this.setState({
            speedFliter: filter
        })
    };


    render() {
        const {userName} = this.state;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        //车辆菜单
        const menu = this.getMenu();

        //获取当前车辆详细信息
        const {carCode, mileage, electric, status, area, carType} = this.getCarInfoByCard();

        const {alertMessageData} = this.props;

        //获取未读信息集合
        const unReadMessage = alertMessageData.filter((item) => {
            return item.isRead === true;
        });


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
                        }}>车辆信息&nbsp;&nbsp;&nbsp;6 / 8
                            <span className={styles.left_arrow} title="收起窗口" onClick={this.onCollapse.bind(this)}><Icon
                                type="left"/></span>
                        </div>
                        <Content>
                            <div className={styles.headContainer}>
                                <Input
                                    placeholder="请输入编号筛选"
                                    prefix={<Icon type="search"/>}
                                    suffix={suffix}
                                    value={userName}
                                    onChange={this.onChangeUserName}
                                    className={styles.searchInput}
                                    ref={node => this.userNameInput = node}
                                />
                                <Select className={styles.selectDrop} defaultValue="all" size="large">
                                    <Option value="all">显示全部</Option>
                                    <Option value="0">在线状态</Option>
                                    <Option value="1">离线状态</Option>
                                    <Option value="2">报警状态</Option>
                                </Select>
                            </div>
                            {/*菜单*/}
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[this.state.carInfo ? this.state.carInfo.carCode : '']}
                                className={styles.menu}
                                onClick={(record) => {
                                    const {item, key, keyPath} = record;
                                    this.getCarInfoByCarCode(key);
                                }}>
                                {menu}
                            </Menu>
                        </Content>
                        {/*尾部功能区域*/}
                        <Footer className={styles.footer}>
                            <Button ghost size="small" icon="eye" onClick={() => {
                                this.visibleAllCarImageMarker(true);
                            }}>全部可见</Button>
                            <Button ghost size="small" icon="eye-o" onClick={() => {
                                this.visibleAllCarImageMarker(false)
                            }}>全部隐藏</Button>
                        </Footer>
                    </Layout>
                </Sider>
                <Content className={styles.content}>
                    {/*显示地图*/}
                    <MonitoringMap
                        realTimeLocations={this.props.realTimeLocations}
                        getMap={this.getMap}
                        positionCarCode={this.state.positionCarCode}/>
                    {/*报警信息*/}
                    <div className={styles.mapActions}>
                        <span className={styles.mapActionBtn} onClick={this.onShowAlarmModal} title="今日报警">
                            <Badge count={unReadMessage.size}><img src="./img/fm_controls/alarm.png"></img></Badge>
                        </span>
                    </div>
                    {/*车辆信息*/}
                    <Card style={{visibility: this.state.cardVisible}} noHovering={true} bordered={false}
                          className={this.state.carInfoWinClassName} title={
                        <span><Icon type="solution"/>车辆编号： {carCode}</span>}
                          extra={<span className={styles.carClose} title="关闭"
                                       onClick={() => {
                                           this.getCarInfoByCarCode(carCode);
                                       }}><Icon type="close"/></span>}>
                        <div className={styles.rightCarContent}>
                            <span>车辆类型：{carType}</span>
                            <span>设备编号：{carCode}</span>
                            <span>行驶里程：{mileage}</span>
                            <span>设备电量：{electric}</span>
                            <span>车辆状态：{status}</span>
                            <span>当前位置：{area}</span>
                        </div>
                    </Card>
                    {/*北京信息列表*/}
                    <CollectionCreateForm
                        ref={this.saveFormRef}
                        visible={this.state.alarmModalVisible}
                        onCancel={this.onShowAlarmModal}
                        alertMessageData={alertMessageData}
                        setSelectKeys={this.setSelectKeys}
                        updateUnReadMessage={this.updateUnReadMessage}
                        speedSelectedRowKeys={this.state.speedSelectedRowKeys}
                        setSelectedRowKeys={this.setSelectedRowKeys}
                        deleteAlarmMessageByKeys={this.deleteAlarmMessageByKeys}
                        deleteAlarmMessageByKey={this.deleteAlarmMessageByKey}
                        densitySelectedRowKeys={this.state.densitySelectedRowKeys}
                        areaSelectedRowKeys={this.state.areaSelectedRowKeys}
                        speedFliter={this.state.speedFliter}
                    />
                </Content>
            </Layout>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        queryAllCarBegin: () => dispatch(queryAllCarBegin()),
        getCarCategory: () => dispatch(getCarCategory()),
        queryAreaListBegin: () => dispatch(queryAreaListBegin()),
        updateMessageShow: (key) => dispatch(updateMessageShow(key)),
        updateUnReadMessage: (ids) => dispatch(updateUnReadMessage(ids)),
        deleteAlarmMessageByKeys: (keys) => dispatch(deleteAlarmMessageByKeys(keys))
    };
}

const selectorStateToProps = createStructuredSelector({
    realTimeLocations: realTimeLocationsSelector(),
    carCategory: carCategorySourceSelector(),
    carList: carListSelector(),
    alarmDatas: alarmDatasSelector(),
    alertMessageData: alertMessageDataSelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(MonitoringPage);