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

import {Layout, Menu, Icon} from 'antd';
import {Button, Input} from 'antd';
import {Modal, Table} from 'antd';
import {Tabs} from 'antd';
import {Row, Col, Select} from 'antd';
import {DatePicker} from 'antd';
import {Popconfirm} from 'antd';
import {AutoComplete} from 'antd';
import {Badge} from 'antd';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;
import moment from 'moment';

import styles from './index.less';


export default class AreaSettingMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaSelectedRowKeys: [],
            densitySelectedRowKeys: [],
            speedSelectedRowKeys: [],
            area: null,
            areaDateTime: null,
            areaFilter: null,
            densityCarCode: null,
            densityDateTime: null,
            densityFilter: null,
            speedCarCode: null,
            speedDateTime: null,
            speedFilter: null,

            isUpdateData: false,
            loading: false,

            speedBatchDeletion: false,      //速度批量删除
            speedHaveRead: false,           //速度标记已读
            speedDelete: false,             //速度删除
            statusBatchDeletion: false,     //状态批量删除
            statusHaveRead: false,          //状态标记已读
            statusDelete: false,            //状态删除
            areaBatchDeletion: false,       //区域批量删除
            areaHaveRead: false,            //区域标记已读
            areaDelete: false,              //区域删除

        };
        this.time = new moment();
        this.opened = true;
    }

    shouldComponentUpdate (nextprops, nextstate) {
        if(this.props.isClick !== nextprops.isClick){
            return true;
        }

        if(this.opened === this.state.isUpdateData) {
            this.setState({isUpdateData: false});
            return true;
        }

        if(this.opened === this.state.areaBatchDeletion) {
            this.setState({areaBatchDeletion: false});
            return true;
        }

        if(this.opened === this.state.areaHaveRead) {
            this.setState({areaHaveRead: false});
            return true;
        }

        if(this.opened === this.state.areaDelete) {
            this.setState({areaDelete: false});
            return true;
        }

        if(this.opened === this.state.statusBatchDeletion) {
            this.setState({statusBatchDeletion: false});
            return true;
        }

        if(this.opened === this.state.statusHaveRead) {
            this.setState({statusHaveRead: false});
            return true;
        }

        if(this.opened === this.state.statusDelete) {
            this.setState({statusDelete: false});
            return true;
        }

        if(this.opened === this.state.speedBatchDeletion) {
            this.setState({speedBatchDeletion: false});
            return true;
        }

        if(this.opened === this.state.speedHaveRead) {
            this.setState({speedHaveRead: false});
            return true;
        }

        if(this.opened === this.state.speedDelete) {
            this.setState({speedDelete: false});
            return true;
        }

        if(_.eq(this.state.areaSelectedRowKeys, nextstate.areaSelectedRowKeys) == false) {
            return true;
        }
        if(_.eq(this.state.densitySelectedRowKeys, nextstate.densitySelectedRowKeys) == false) {
            return true;
        }
        if(_.eq(this.state.speedSelectedRowKeys, nextstate.speedSelectedRowKeys) == false) {
            return true;
        }
        if(_.eq(this.state.area, nextstate.area) == false) {
            return true;
        }
        if(_.eq(this.state.areaDateTime, nextstate.areaDateTime) == false) {
            return true;
        }
        if(_.eq(this.state.areaFilter, nextstate.areaFilter) == false) {
            return true;
        }
        if(_.eq(this.state.densityCarCode, nextstate.densityCarCode) == false) {
            return true;
        }
        if(_.eq(this.state.densityDateTime, nextstate.densityDateTime) == false) {
            return true;
        }
        if(_.eq(this.state.densityFilter, nextstate.densityFilter) == false) {
            return true;
        }
        if(_.eq(this.state.speedCarCode, nextstate.speedCarCode) == false) {
            return true;
        }
        if(_.eq(this.state.speedDateTime, nextstate.speedDateTime) == false) {
            return true;
        }
        if(_.eq(this.state.speedFilter, nextstate.speedFilter) == false) {
            return true;
        }

        return false;
    }

    /**
     * 区域密度选择改变事件
     * @value 勾选
     */
    onChangeAreaSelection = (value) => {
        this.setState({
            areaSelectedRowKeys: value,
        });
    };

    /**
     * 车辆状态勾选事件
     * @param value 车辆状态列表勾选集合
     */
    onChangeDensitySelection = (value) => {
        this.setState({
            densitySelectedRowKeys: value,
        });
    };

    /**
     * 速度报警列表勾选事件
     * @param value 速度报警列表勾选集合
     */
    onChangeSpeedSelection = (value) => {
        this.setState({
            speedSelectedRowKeys: value
        })
    };

    /**
     * 选择区域
     * @param value 区域id
     */
    handleChangeArea = (value) => {
        this.setState({
            area: value
        })
    };

    /**
     * 区域密度报警时间范围选择
     * @param value 报警信息
     */
    handleChangeAraeDateTime = (value) => {
        this.setState({
            areaDateTime: value
        })
    };

    /**
     * 设置密度报警条件
     */
    setAreaFilter = () => {
        const {area, areaDateTime} = this.state;
        const beiginDateTime = areaDateTime && areaDateTime.length > 0 ? areaDateTime[0].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        const endDateTime = areaDateTime && areaDateTime.length > 0 ? areaDateTime[1].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        this.setState({
            areaFilter: `${area ? area : ''}&&${beiginDateTime}&&${endDateTime}`,
        })
    };

    /**
     * 密度报警筛选逻辑处理
     * @param value
     * @param record
     */
    areaDataFilter = (value, record) => {
        if (!value) return record;
        const {areaId, dateTime} = record;
        let filters = value.split('&&');
        const areaIds = filters[0];
        const beiginDateTime = filters[1];
        const endDateTime = filters[2];

        if ((areaIds === '' || areaIds == areaId) && (beiginDateTime === '' || new Date(beiginDateTime) < new Date(dateTime)) && (endDateTime === '' || new Date(dateTime) < new Date(endDateTime))) {
            return record;
        }
    };

    handleChangeDensityCarCode = (value) => {
        this.setState({
            densityCarCode: value
        })
    };

    handleChangeDensityDateTime = (value) => {
        this.setState({
            densityDateTime: value
        })
    };

    /**
     * 设置密度报警条件
     */
    setDensityFilter = () => {
        const {densityCarCode, densityDateTime} = this.state;
        const beiginDateTime = densityDateTime && densityDateTime.length > 0 ? densityDateTime[0].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        const endDateTime = densityDateTime && densityDateTime.length > 0 ? densityDateTime[1].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        this.setState({
            densityFilter: `${densityCarCode ? densityCarCode : ''}&&${beiginDateTime}&&${endDateTime}`,
        });
    };

    densityDataFilter = (value, record) => {
        if (!value) return record;
        const {carCode, dateTime} = record;
        let filters = value.split('&&');
        const densityCarCode = filters[0];
        const beiginDateTime = filters[1];
        const endDateTime = filters[2];

        if ((densityCarCode === '' || carCode.toUpperCase() == densityCarCode.toUpperCase()) && (beiginDateTime === '' || new Date(beiginDateTime) < new Date(dateTime)) && (endDateTime === '' || new Date(dateTime) < new Date(endDateTime))) {
            return record;
        }
    };

    handleChangeSpeedCarCode = (value) => {
        this.setState({
            speedCarCode: value
        })
    };

    handleChangeSpeedDateTime = (value) => {
        this.setState({
            speedDateTime: value
        })
    };

    /**
     * 设置报警速度筛选条件
     */
    setSpeedFilter = () => {
        const {speedCarCode, speedDateTime} = this.state;
        const beiginDateTime = speedDateTime && speedDateTime.length > 0 ? speedDateTime[0].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        const endDateTime = speedDateTime && speedDateTime.length > 0 ? speedDateTime[1].second(0).format('YYYY-MM-DD HH:mm:ss') : '';
        this.setState({
            speedFilter: `${speedCarCode ? speedCarCode : ''}&&${beiginDateTime}&&${endDateTime}`,
        });
    };

    /**
     * 报警速度筛选方法
     * @param value
     * @param record
     * @returns {*}
     */
    speedDataFilter = (value, record) => {
        if (!value) return record;
        const {carCode, dateTime} = record;
        let filters = value.split('&&');
        const speedCarCode = filters[0];
        const beiginDateTime = filters[1];
        const endDateTime = filters[2];

        if ((speedCarCode === '' || carCode.toUpperCase() == speedCarCode.toUpperCase()) && (beiginDateTime === '' || new Date(beiginDateTime) < new Date(dateTime)) && (endDateTime === '' || new Date(dateTime) < new Date(endDateTime))) {
            return record;
        }
    };

    /**
     * 关闭model信息框
     */
    closeModel = () => {
        this.props.onShowAlarmModal();
        this.setState({
            area: null,
            areaDateTime: null,
            areaFilter: null,
            densityCarCode: null,
            densityDateTime: null,
            densityFilter: null,
            speedCarCode: null,
            speedDateTime: null,
            speedFilter: null,
        });
    };


    getLatestData = () => {
        this.setState({
            isUpdateData: true,
        })
    };

    render() {

        //报警信息，区域列表 //已读，删除报警信息
        const {alertMessageData, areaList,updateUnReadMessage, deleteAlarmMessageByKeys} = this.props;
        const {area, areaDateTime,densityCarCode, densityDateTime,speedCarCode, speedDateTime,areaSelectedRowKeys, speedSelectedRowKeys, densitySelectedRowKeys} = this.state;

        let areaDatas = []; //区域报警
        let densityDatas = [];//密度报警
        let speedDatas = [];//速度报警
        let sortData;
        let sortData2;
        let sortData3;
        let areaUnRead = 0;
        let densityUnRead = 0;
        let speedUnRead = 0;
        
        for (let i = 0; i < alertMessageData.size; i++) {
            const item = alertMessageData.get(i);

            if (!item) return;
            const type = item.type;

            //密度报警
            if (type === 98) {
                areaDatas.push(item);
                if (item.isRead) {
                    areaUnRead++;
                }
            }

            //排序
            sortData = areaDatas;
            sortData.map((item) => {
                let date = item.date;
                sortData.sort(function(a, b){
                    return Date.parse(b.date) - Date.parse(a.date);//时间正序
                })
            });

            //闲置报警
            if (type === 97) {
                densityDatas.push(item);
                if (item.isRead) {
                    densityUnRead++;
                }
            }

            //排序
            sortData2 = densityDatas;
            sortData2.map((item) => {
                let date = item.date;
                sortData2.sort(function(a, b){
                    return Date.parse(b.date) - Date.parse(a.date);//时间正序
                })
            });

            //超速报警
            if (type === 99) {
                speedDatas.push(item);
                if (item.isRead) {
                    speedUnRead++;
                }
            }

            //排序
            sortData3 = speedDatas;
            sortData3.map((item) => {
                let date = item.date;
                sortData3.sort(function(a, b){
                    return Date.parse(b.date) - Date.parse(a.date);
                })
            })
        }

        //区域集中报警
        const areaColumns = [
            {
                title: '报警时间',
                dataIndex: 'dateTime',
                key: 'dateTime',
                filteredValue: [this.state.areaFilter],
                onFilter: (value, record) => this.areaDataFilter(value, record),
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.dateTime}</span>
                }
            }, {
                title: '车辆编号',
                dataIndex: 'carCode',
                key: 'carCode',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.carCode}</span>
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
                            <Popconfirm title="确认要删除此信息吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
                                this.setState({
                                    areaDelete: true,
                                });
                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        //状态
        const densityColumns = [
            {
                title: '报警时间',
                dataIndex: 'alarmTime',
                key: 'alarmTime',
                filteredValue: [this.state.densityFilter],
                onFilter: (value, record) => this.densityDataFilter(value, record),
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.dateTime}</span>
                }
            }, {
                title: '车辆编号',
                dataIndex: 'carCode',
                key: 'carCode',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.carCode}</span>
                }
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
                            {/*<Button type="primary" className={styles.tableBtn} ghost>定位</Button>*/}
                            <Popconfirm title="确认要删除此信息吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
                                this.setState({
                                    statusDelete: true,
                                });
                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        //速度
        const speedColumns = [
            {
                title: '报警时间',
                dataIndex: 'dateTime',
                key: 'dateTime',
                filteredValue: [this.state.speedFilter],
                onFilter: (value, record) => this.speedDataFilter(value, record),
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.dateTime}</span>
                }
            }, {
                title: '车辆编号',
                dataIndex: 'carCode',
                key: 'carCode',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.carCode}</span>
                }
            }, {
                title: '报警内容',
                dataIndex: 'remark',
                key: 'remark',
                render: function (text, record, index) {
                    return <span className={record.isRead === true ? styles.bold : styles.normal}>{record.remark}</span>
                }
            }, {
                title: '安全速度(km/h)',
                dataIndex: 'safetySpeed',
                key: 'safetySpeed',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{parseInt(record.safetySpeed ? record.safetySpeed : 0)}</span>
                }
            }, {
                title: '报警速度(km/h)',
                dataIndex: 'speed',
                key: 'speed',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{parseInt(record.speed)}</span>
                }
            }, {
                title: '所在区域',
                dataIndex: 'reaName',
                key: 'reaName',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.areaName}</span>
                }
            }, {
                title: '超速时长(s)',
                dataIndex: 'time',
                key: 'time',
                render: function (text, record, index) {
                    return <span
                        className={record.isRead === true ? styles.bold : styles.normal}>{record.time}</span>
                }
            }, {
                title: '操作',
                key: 'operation',
                width: 200,
                render: (text, record) => {
                    return (
                        <div>
                            {/*<Button type="primary" className={styles.tableBtn} ghost>定位</Button>*/}
                            <Popconfirm title="确认要删除此信息吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
                                this.setState({
                                    speedDelete: true,
                                });
                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        //如果当前没有选择报警信息，则批量删除按钮禁用
        const areaAllDisabled = areaSelectedRowKeys.length > 0;  //区域密度批量删除按钮是否禁用
        const speedaAllDisabled = speedSelectedRowKeys.length > 0;//超速报警批量删除按钮是否禁用
        const densityAllDisabled = densitySelectedRowKeys.length > 0;//闲置报警批量删除按钮是否禁用

        return (<Modal
                title={<span><i className="iconfont">&#xe6ba;</i>异常报警</span>}
                width={1280}
                className={styles.redModal}
                visible={this.props.visible}
                onCancel={this.closeModel}
                footer={[
                    <Button key="realTime" type="primary" size="large" onClick={this.getLatestData} style={{marginRight: '20px'}}>获取实时数据</Button>,
                    <Button key="cancel" type="primary" size="large" onClick={this.closeModel}>确定</Button>
                ]}>
                <div className="card-container">
                    <Tabs type="card">
                        {/*密度*/}
                        <TabPane tab="区域集中报警" key="1">
                            <Row type="flex" align="middle" style={{height: '100px', marginTop: '-20px'}}>
                                <Col span={5} className={styles.item}>
                                    <span>区域选择</span>
                                    <Select
                                        style={{width: '75%'}}
                                        size="large"
                                        placeholder="请选择区域"
                                        value={!area ? [] : area}
                                        onChange={this.handleChangeArea}
                                        allowClear={true}>
                                        {
                                            areaList.map((item) => {
                                                return <Option key={item.id}
                                                               value={`${item.id}`}>{item.areaName}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <RangePicker
                                        showTime={{format: 'HH:mm'}}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.handleChangeAraeDateTime}
                                        value={areaDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn} onClick={() => {
                                        this.setAreaFilter();
                                    }}>查询</Button>
                                    <Button disabled={!areaAllDisabled} type="primary" icon="hdd"
                                            className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.areaSelectedRowKeys);
                                        this.setState({
                                            areaHaveRead: true,
                                        });
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.areaSelectedRowKeys);
                                        this.setState({
                                            areaBatchDeletion: true,
                                        });
                                    }}>
                                        <Button disabled={!areaAllDisabled} type="primary" icon="delete"
                                                className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table}
                                   bordered={true}
                                   footer={(record) => {
                                       return `共计 ${record.length} 条数据`;
                                   }}
                                   size="middle"
                                   rowSelection={{
                                       onChange: this.onChangeAreaSelection,
                                       selectedRowKeys: this.state.areaSelectedRowKeys
                                   }}
                                   columns={areaColumns}
                                   dataSource={sortData}>
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
                                        placeholder="请输入车辆编号"
                                        size="large"
                                        value={densityCarCode}
                                        onChange={this.handleChangeDensityCarCode}
                                    >
                                        <Input maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <RangePicker
                                        showTime={{format: 'HH:mm'}}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        value={densityDateTime}
                                        onChange={this.handleChangeDensityDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}
                                            onClick={this.setDensityFilter}>查询</Button>
                                    <Button disabled={!densityAllDisabled} type="primary" icon="hdd"
                                            className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.densitySelectedRowKeys);
                                        this.setState({
                                            statusHaveRead: true,
                                        });
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.densitySelectedRowKeys);
                                        this.setState({
                                            statusBatchDeletion: true,
                                        });
                                    }}>
                                        <Button disabled={!densityAllDisabled} type="primary" icon="delete"
                                                className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table className={styles.table}
                                   bordered={true}
                                   footer={(record) => {
                                       return `共计 ${record.length} 条数据`;
                                   }}
                                   size="middle"
                                   rowSelection={{
                                       onChange: this.onChangeDensitySelection,
                                       selectedRowKeys: this.state.densitySelectedRowKeys
                                   }}
                                   columns={densityColumns}
                                   dataSource={sortData2}>
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
                                        value={speedCarCode}
                                        onChange={this.handleChangeSpeedCarCode}
                                    >
                                        <Input maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <RangePicker
                                        showTime={{format: 'HH:mm'}}
                                        format="YYYY-MM-DD HH:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        value={speedDateTime}
                                        onChange={this.handleChangeSpeedDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}
                                            onClick={this.setSpeedFilter}>查询</Button>
                                    <Button disabled={!speedaAllDisabled} type="primary" icon="hdd"
                                            className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.speedSelectedRowKeys);
                                        this.setState({
                                            speedHaveRead: true,
                                        });
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.speedSelectedRowKeys);
                                        this.setState({
                                            speedSelectedRowKeys: [],
                                            speedBatchDeletion: true,
                                        });
                                    }}>
                                        <Button disabled={!speedaAllDisabled} type="primary" icon="delete"
                                                className={styles.addBtn}>批量删除</Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Table
                                className={styles.table}
                                bordered={true}
                                footer={(record) => {
                                return `共计 ${record.length} 条数据`;
                                }}
                                size="middle"
                                rowSelection={{
                                onChange: this.onChangeSpeedSelection,
                                selectedRowKeys: this.state.speedSelectedRowKeys
                                }}
                                columns={speedColumns}
                                dataSource={sortData3}>
                            </Table>
                        </TabPane>
                    </Tabs>
                    <Badge className={styles.badge1} count={areaUnRead}/>
                    <Badge className={styles.badge2} count={densityUnRead}/>
                    <Badge className={styles.badge3} count={speedUnRead}/>
                </div>
            </Modal>
        )
    }
}