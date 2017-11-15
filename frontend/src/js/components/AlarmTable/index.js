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
            speedSelectedRowKeys: []
        }
    }

    onChangeAreaSelection = (value) => {
        this.setState({
            areaSelectedRowKeys: value,
        });
    };

    onChangeDensitySelection = (value) => {
        this.setState({
            densitySelectedRowKeys: value,
        });
    };

    onChangeSpeedSelection = (value) => {
        this.setState({
            speedSelectedRowKeys: value
        })
    };

    render() {
        //报警信息，区域列表
        const {alertMessageData, areaList} = this.props;


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
                areaUnRead++;
            }

            //闲置报警
            if (type === 97) {
                densityDatas.push(item);
                densityUnRead++;
            }

            //超速报警
            if (type === 99) {
                speedDatas.push(item);
                speedUnRead++;
            }
        }

        //区域集中报警
        const areaColumns = [
            {
                title: '报警时间',
                dataIndex: 'dateTime',
                key: 'dateTime',
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

                            }}>
                                <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            }];

        const densityColumns = [{
            title: '报警时间',
            dataIndex: 'alarmTime',
            key: 'alarmTime',
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
                            deleteAlarmMessageByKey('densitySelectedRowKeys', record.key);
                        }}>
                            <Button type="primary" className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];


        const speedColumns = [{
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
        }]
        return (
            <Modal
                title={<span><Icon type="hdd"/>异常报警</span>}
                width={1280}
                className={styles.redModal}
                visible={this.props.visible}
                onCancel={this.props.onShowAlarmModal}
                footer={[
                    <Button key="cancel" type="primary" size="large" onClick={this.props.onShowAlarmModal}>确定</Button>,
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

                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn} onClick={() => {
                                        /*setFilterType('area');*/
                                    }}>查询</Button>
                                    {/*<Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {
                                    }}>*/}
                                    <Button type="primary" icon="hdd" className={styles.addBtn} onClick={() => {
                                        this.props.updateUnReadMessage(this.state.areaSelectedRowKeys);
                                    }}>标记已读</Button>
                                    {/*</Popconfirm>*/}
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {
                                        this.props.deleteAlarmMessageByKeys(this.state.areaSelectedRowKeys);
                                        this.setState({
                                            areaSelectedRowKeys: []
                                        });
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
                                        placeholder="请输入车辆编号" size="large"
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
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn} onClick={() => {

                                    }}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {

                                    }}>
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所que选信息吗？" onConfirm={() => {

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
                                    />
                                </Col>
                                <Col span={7}>
                                    <Button type="primary" icon="search" className={styles.searchBtn} onClick={() => {

                                    }}>查询</Button>
                                    <Popconfirm title="确认要标记为已读状态吗？" onConfirm={() => {

                                    }}>
                                        <Button type="primary" icon="hdd" className={styles.addBtn}>标记已读</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认要批量删除所选信息吗？" onConfirm={() => {

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