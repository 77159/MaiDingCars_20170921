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
        }
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
        const beiginDateTime = areaDateTime && areaDateTime.length > 0 ? areaDateTime[0].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
        const endDateTime = areaDateTime && areaDateTime.length > 0 ? areaDateTime[1].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
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
        const {id, dateTime} = record;
        let filters = value.split('&&');
        const areaId = filters[0];
        const beiginDateTime = filters[1];
        const endDateTime = filters[2];

        if ((areaId === '' || areaId == id) && (beiginDateTime === '' || new Date(beiginDateTime) < new Date(dateTime)) && (endDateTime === '' || new Date(dateTime) < new Date(endDateTime))) {
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
        const beiginDateTime = densityDateTime && densityDateTime.length > 0 ? densityDateTime[0].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
        const endDateTime = densityDateTime && densityDateTime.length > 0 ? densityDateTime[1].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
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
        const beiginDateTime = speedDateTime && speedDateTime.length > 0 ? speedDateTime[0].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
        const endDateTime = speedDateTime && speedDateTime.length > 0 ? speedDateTime[1].second(0).format('YYYY-MM-DD hh:mm:ss') : '';
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

    render() {
        //报警信息，区域列表
        const {alertMessageData, areaList} = this.props;
        //已读，删除报警信息
        const {updateUnReadMessage, deleteAlarmMessageByKeys} = this.props;
        const {area, areaDateTime} = this.state;
        const {densityCarCode, densityDateTime} = this.state;
        const {speedCarCode, speedDateTime} = this.state;

        let areaDatas = []; //区域报警
        let densityDatas = [];//密度报警
        let speedDatas = [];//速度报警

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

            //闲置报警
            if (type === 97) {
                densityDatas.push(item);
                if (item.isRead) {
                    densityUnRead++;
                }
            }

            //超速报警
            if (type === 99) {
                speedDatas.push(item);
                if (item.isRead) {
                    speedUnRead++;
                }
            }
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
                            <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
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
                            <Button type="primary" className={styles.tableBtn} ghost>定位</Button>
                            <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
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
                            <Button type="primary" className={styles.tableBtn} ghost>定位</Button>
                            <Popconfirm title="确认要删除此设备吗？" onConfirm={() => {
                                deleteAlarmMessageByKeys([record.key]);
                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        return (
            <Modal
                title={<span><Icon type="hdd"/>异常报警</span>}
                width={1280}
                className={styles.redModal}
                visible={this.props.visible}
                onCancel={this.closeModel}
                footer={[
                    <Button key="cancel" type="primary" size="large" onClick={this.closeModel}>确定</Button>,
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
                                        showTime={{format: 'hh:mm'}}
                                        format="YYYY-MM-DD hh:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.handleChangeAraeDateTime}
                                        value={areaDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn} onClick={() => {
                                        this.setAreaFilter();
                                    }}>查询</Button>
                                    <Button type="primary" icon="hdd" className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.areaSelectedRowKeys);
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.areaSelectedRowKeys);
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
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
                                        showTime={{format: 'hh:mm'}}
                                        format="YYYY-MM-DD hh:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        value={densityDateTime}
                                        onChange={this.handleChangeDensityDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}
                                            onClick={this.setDensityFilter}>查询</Button>
                                    <Button type="primary" icon="hdd" className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.densitySelectedRowKeys);
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.densitySelectedRowKeys);
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
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
                                        value={speedCarCode}
                                        onChange={this.handleChangeSpeedCarCode}
                                    >
                                        <Input maxLength="15"/>
                                    </AutoComplete>
                                </Col>
                                <Col span={12} className={styles.item}>
                                    <span>报警时间</span>
                                    <RangePicker
                                        showTime={{format: 'hh:mm'}}
                                        format="YYYY-MM-DD hh:mm"
                                        placeholder={['开始时间', '结束时间']}
                                        value={speedDateTime}
                                        onChange={this.handleChangeSpeedDateTime}
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn}
                                            onClick={this.setSpeedFilter}>查询</Button>
                                    <Button type="primary" icon="hdd" className={styles.addBtn} onClick={() => {
                                        updateUnReadMessage(this.state.speedSelectedRowKeys);
                                    }}>标记已读</Button>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        deleteAlarmMessageByKeys(this.state.speedSelectedRowKeys);
                                        this.setState({
                                            speedSelectedRowKeys: []
                                        });
                                    }}>
                                        <Button type="primary" icon="delete" className={styles.addBtn}>批量删除</Button>
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
                                dataSource={speedDatas}>
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