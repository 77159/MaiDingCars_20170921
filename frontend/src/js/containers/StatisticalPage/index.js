/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备管理页面。路径为'/device'
 */

'use strict';
import React from 'react';
import {Layout} from 'antd';
    
const {Content} = Layout;
import {Button} from 'antd';
import {Input} from 'antd';
import {Select} from 'antd';
import {AutoComplete} from 'antd';
import {Card} from 'antd';
const Option = Select.Option;
import {Row, Col} from 'antd';
import {Table} from 'antd';
import {Popconfirm} from 'antd';
import styles from './index.less';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {showErrorMessage} from '../App/actions';
import _ from 'lodash';
import {
    queryAllDeviceBegin,
    createDevice,
    modifyDevice,
    getDevice,
    deleteDevice,
    queryAllNotDeviceBegin
} from './actions';
import {DatePicker, Icon} from 'antd';
const {MonthPicker, RangePicker} = DatePicker;
import {TimePicker} from 'antd';
import moment from 'moment';
const format = 'HH';
import echarts from 'echarts';
import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import {Progress} from 'antd';
import {
    deviceDataSourceSelector,
    tableDataLoadingSelector,
    notDeviceDataSourceSelector,
    deviceEntitySelector
} from './selectors';
import DeviceFormModal from '../StatisticalFormModal';
import {deviceFormModalShow} from "../StatisticalFormModal/actions";
import {CommonUtil} from "../../utils/util";

export class DeviceMgrPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter_deviceCode: '',             //设备编号-筛选条件，需要初始化，不要设置为null
            filter_carCode: '',             //安保编号-筛选条件，需要初始化，不要设置为null
            filter_workStatus: 'all',          //工作状态-筛选条件 [all] 全部（默认）[0] 离线 [1] 工作
            filter_deviceStatus: 'all',        //设备状态-筛选条件 [all] 全部（默认）[0] 禁用 [1] 启用
            dataFilter: null,                  //数据过滤器数组，只有一条记录，将筛选条件用&&连接。格式：['设备编号'&&'安保编号'&&'工作状态'&&'设备状态']
            curSelectedRowKeys: [],
            autoComplete_deviceCode: [],       //设备编号自动完成提示数组
            autoComplete_carCode: [],       //车辆编号自动完成提示数组
        };
    }

    componentDidMount() {
        //加载设备数据
        this.props.queryAllDevice();
        this.props.queryAllNotDevice();

        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));
        let myChart2 = echarts.init(document.getElementById('main2'));
        let myChart3 = echarts.init(document.getElementById('main3'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}, {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x2: 'right',
                top: '50',
                right: '20',
                textStyle: {
                    fontSize: 14,
                    padding: [3, 4, 5, 6],
                },
                //name: ['区域A\n密集程度', '区域B', '区域C', '区域D'],
                data: [
                    '区域A\n密集程度：10% 报警次数：5',
                    '区域B\n密集程度：30% 报警次数：8',
                    '区域C\n密集程度：20% 报警次数：6',
                    '区域D\n密集程度：40% 报警次数：15',
                ]
            },
            color: ['#F44336', '#1D9FF2', '#F9A825', '#00897B'],
            series: [
                {
                    name: '区域密度',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    //center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        /*emphasis: {
                         show: true,
                         textStyle: {
                         fontSize: '30',
                         fontWeight: 'bold'
                         }
                         }*/
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: 10, name: '区域A\n密集程度：10% 报警次数：5'},
                        {value: 40, name: '区域B\n密集程度：30% 报警次数：8'},
                        {value: 20, name: '区域C\n密集程度：20% 报警次数：6'},
                        {value: 10, name: '区域D\n密集程度：40% 报警次数：15'},
                    ]
                },
            ]
        });
        window.onresize = myChart.resize;

        myChart2.setOption({
            baseOption:{
                xAxis:{
                    name: '数量（辆）',
                    data:['20','40','60','80','100'],
                },
                yAxis:{
                    name: '速度\nkm/h',
                    splitNumber: 2,
                },
                series:[{
                    color: ['#95CFFA'],
                    type:'bar',
                    data:[11, 9, 12, 10, 15],
                }]
            },
        });
        window.onresize = myChart2.resize;

        myChart3.setOption({
            baseOption:{
                legend:{
                    data:['超过五小时无位置信息','超速车辆']
                },
                xAxis:{
                    name: '日期（天）',
                    data:['9.4','9.6','9.7','9.8','9.9','9.10','9.11'],
                },
                yAxis:{
                    name: '数量（辆）',
                    splitNumber: 2,
                },
                series:[{
                    name:'超过五小时无位置信息',
                    color: ['#95CFFA'],
                    type:'bar',
                    data:[45,25,36,47,89,60,38],
                },{
                    name:'超速车辆',
                    color: ['#FE1C69'],
                    type:'line',
                    data:[75,12,45,86,95,15,66],
                }]
            },
        });
        window.onresize = myChart3.resize;

    }

    //数据过滤器 value:筛选条件 record 设备数据 index 数据索引
    deviceDataFilter = (value, record) => {
        let filters = value.split('&&');
        if (filters.length != 2) {
            console.error('设备筛选条件长度错误');
            return true; //忽略过滤器
        }
        //筛选数据
        return record != null &&
            (_.isEmpty(filters[0]) || (_.isNull(record.deviceCode) == false && record.deviceCode.includes(filters[0]))) &&
            (_.isEmpty(filters[1]) || (_.isNull(record.carCode) == false && record.carCode.includes(filters[1])))
    }

    //查询设备（筛选）
    onFilterDevice = () => {
        //保证参数不能为null、undefined
        let deviceCode = _.isEmpty(this.state.filter_deviceCode) ? '' : this.state.filter_deviceCode.trim();
        let carCode = _.isEmpty(this.state.filter_carCode) ? '' : this.state.filter_carCode.trim();
        let filterStr = `${deviceCode}&&${carCode}`;
        this.setState({
            //将多个筛选条件拼接为一个条件，利于后续在一次循环中集中判断，减少[deviceDataFilter]循环判断次数
            dataFilter: [
                filterStr
            ]
        });
    }

    //重置
    onResetSearch = () => {
        this.setState({
            filter_deviceCode: '',
            filter_carCode: '',
            filter_workStatus: 'all',
            filter_deviceStatus: 'all',
            dataFilter: null,
            autoComplete_deviceCode: [],
            autoComplete_carCode: [],
        });
        //刷新数据
        this.props.queryAllDevice();
    }

    //添加设备
    showCreateDeviceModal = () => {
        //显示添加设备对话框
        this.props.showDeviceFormModal('create', {deviceStatus: 1});
    };

    //查看设备
    onViewDeviceInfo = (record) => {
        //显示添加设备对话框
        this.props.showDeviceFormModal('modify', record);
    };

    //改变设备状态
    onChangeDeviceStatus = (record) => {
        record.deviceStatus = record.deviceStatus ? 0 : 1;
        console.log('修改设备状态收集到的信息: ', record);
        this.props.modifyDevice(record);
    }

    //删除设备
    onDeleteDevice = (deviceCode) => {
        this.props.deleteDevice(deviceCode);
    }

    onSelectChange = (keys) => {
        console.log('selectedRowKeys changed: ', keys);
        this.setState({curSelectedRowKeys: keys});
    }

    //设备编号自动完成填充
    onDeviceCodeAutoCompleteSearch = (value) => {
        let deviceDataSource = this.props.deviceDataSource;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将设备编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            deviceDataSource.forEach(deviceEntity => {
                if (deviceEntity.deviceCode.includes(value)) {
                    data.push(deviceEntity.deviceCode);
                }
            });
        }
        this.setState({
            autoComplete_deviceCode: data,
        });
    };

    //车辆编号自动完成填充
    onCarCodeAutoCompleteSearch = (value) => {
        let deviceDataSource = this.props.deviceDataSource;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将车辆编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            deviceDataSource.forEach(deviceEntity => {
                if (deviceEntity.carCode.includes(value)) {
                    data.push(deviceEntity.carCode);
                }
            });
        }
        this.setState({
            autoComplete_carCode: data,
        });
    };

    //点击切换车辆信息
    switchInfo = () => {
        this.refs.carInfo.style.display = 'none';
        this.refs.carInfo2.style.display = 'block';
    };

    //点击返回车辆信息页面
    returnBtn = () => {
        this.refs.carInfo.style.display = 'block';
        this.refs.carInfo2.style.display = 'none';
    };

    render() {
        const {curSelectedRowKeys} = this.state;
        const selection = {
            selectedRowKeys: curSelectedRowKeys,
            onChange: this.onSelectChange,
        };

        const {deviceDataSource, tableDataLoading} = this.props;
        //数据总数
        const dataCount = deviceDataSource != null ? deviceDataSource.length : 0;
        
        const columns = [{
            title: '车辆编号',
            dataIndex: 'carCode',
            key: 'carCode',
            filteredValue: this.state.dataFilter,      //设置过滤条件
            onFilter: (value, record) => this.deviceDataFilter(value, record),   //每条数据都通过指定的函数进行过滤
        }, {
            title: '车辆类别',
            dataIndex: 'carType',
            key: 'carType',
        }, {
            title: '设备编号',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
        }, {
            title: '工作时间',
            dataIndex: 'workStatus',
            key: 'workStatus',
        }, {
            title: '行走里程',
            dataIndex: 'dumpPower',
            key: 'dumpPower',
        }, {
            title: '最快速度',
            dataIndex: 'deviceStatus',
            key: 'deviceStatus',
        }, {
            title: '平均速度',
            dataIndex: 'remark',
            key: 'remark',
        }, /*{
         title: '安保编号',
         dataIndex: 'carCode',
         key: 'carCode',
         },*/ {
            title: '使用日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 220,
            render: (text) => {
                if (_.isNumber(text)) {
                    return new Date(text).format("yyyy-M-d hh:mm");
                } else {
                    return text;
                }
            },
        }, {
            title: '集中区域分析',
            key: 'operation',
            width: 200,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button type="primary" className={styles.tableBtn} ghost
                                onClick={() => this.onViewDeviceInfo(record)}>查看</Button>
                    </div>
                );
            },
        }];

        const columnsBusy = [{
            title: '车辆数量：2/88',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
            width: 130,
            fixed: 'left',
            filteredValue: this.state.dataFilter,      //设置过滤条件
            onFilter: (value, record) => this.deviceDataFilter(value, record),   //每条数据都通过指定的函数进行过滤
        }, {
            title: '公里数',
            dataIndex: 'deviceName',
            key: 'deviceName',
            width: 70,
            fixed: 'left'
        }, {
            title: '时间',
            dataIndex: 'workStatus',
            key: 'workStatus',
            width: 70,
            fixed: 'left',
        }, {
            title: '09',
            dataIndex: '09',
            key: '09',
            render: () => {
                return (
                    <div className={styles.gantt} style={{width: `${101}%`}}>
                    </div>
                )
            }
        }, {
            title: '10',
            dataIndex: '10',
            key: '10',
            render: () => {
                return (
                    <div className={styles.gantt} style={{width: `${60}%`}}>
                    </div>
                )
            }
        }, {
            title: '11',
            dataIndex: '11',
            key: '11',
        }, {
            title: '12',
            dataIndex: '12',
            key: '12',
        }, {
            title: '13',
            dataIndex: '13',
            key: '13',
        }, {
            title: '14',
            dataIndex: '14',
            key: '14',
        }, {
            title: '15',
            dataIndex: '15',
            key: '15',
            render: () => {
                return (
                    <div className={styles.gantt} style={{width: `${101}%`}}>
                    </div>
                )
            }
        }, {
            title: '16',
            dataIndex: '16',
            key: '16',
            render: () => {
                return (
                    <div className={styles.gantt} style={{width: `${101}%`}}>
                    </div>
                )
            }
        }, {
            title: '17',
            dataIndex: '17',
            key: '17',
            render: () => {
                return (
                    <div className={styles.gantt} style={{width: `${30}%`}}>
                    </div>
                )
            }
        }, {
            title: '18',
            dataIndex: '18',
            key: '18',
        }, {
            title: '19',
            dataIndex: '19',
            key: '19',
        }, {
            title: '20',
            dataIndex: '20',
            key: '20',
        }, {
            title: '21',
            dataIndex: '21',
            key: '21',
        }, {
            title: '22',
            dataIndex: '22',
            key: '22',
        }, {
            title: '23',
            dataIndex: '23',
            key: '23',
        }, {
            title: '24',
            dataIndex: '24',
            key: '24',
        }, {
            title: '(9.11)00',
            dataIndex: '00',
            key: '00',
            //width: '80'
        }, {
            title: '01',
            dataIndex: '01',
            key: '01',
        }, {
            title: '02',
            dataIndex: '02',
            key: '02',
        }, {
            title: '03',
            dataIndex: '03',
            key: '03',
        }, {
            title: '04',
            dataIndex: '04',
            key: '04',
        }, {
            title: '05',
            dataIndex: '05',
            key: '05',
        }, {
            title: '06',
            dataIndex: '06',
            key: '06',
        }, {
            title: '07',
            dataIndex: '07',
            key: '07',
        }];

        return (
            <Layout className={styles.layout}>
                <div className="cardContainer">
                    <Tabs type="card" className={styles.tabs}>
                        <TabPane className={styles.tabPane} tab="车辆统计" key="1">
                            <div ref='carInfo'>
                                <Row type="flex" align="middle">
                                    <Col span={10}>
                                        <span style={{marginRight: '20px'}}>时间选择</span>
                                        <DatePicker style={{width: '18%'}}></DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('09', format)}
                                                    format={format}></TimePicker>&nbsp;
                                        <Icon style={{color: '#a8a8a8'}} type="minus"/>&nbsp;
                                        <DatePicker style={{width: '18%'}}></DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('09', format)} format={format}></TimePicker>
                                    </Col>
                                    <Col span={6}>
                                        <Button type="primary" icon="search" className={styles.searchBtn}>查询</Button>
                                        <Button type="primary" icon="sync" className={styles.resetBtn} onClick={this.onResetSearch}>重置</Button>
                                    </Col>
                                </Row>
                                <Row type="flex" align="middle">
                                    <Col span={12} className={styles.item}>
                                        <p style={{cursor: 'pointer'}} onClick={this.switchInfo}>车辆信息统计<span style={{fontSize: '12px'}}>（点击查看详情）</span></p>
                                        <div className={styles.carsMsg}>
                                            <span>车辆总数：88</span>
                                            <span>单位：辆</span>
                                        </div>
                                        <div className={styles.carsMsg2}>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>叉车<br/><span>20</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>汽车<br/><span>12</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>客车<br/><span>12</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>挖掘机<br/><span>2</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>拖车<br/><span>15</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>其它<br/><span>3</span></div></div>
                                        </div>
                                        <div className={styles.carsMsg3}>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/online.png" alt=""/><div>在线数量<br/><span>80</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/offline.png" alt=""/><div>离线数量<br/><span>8</span></div></div>
                                            <div className={styles.carsMsg_div} style={{width: '50%'}}><img src="../../img/Statistical/none.png" alt=""/><div>未绑定设备<br/><span>7</span></div></div>
                                        </div>
                                    </Col>

                                    <Col span={12} className={styles.item}>
                                        <p>区域密度统计</p>
                                        <div id="main" style={{height: 320}}></div>
                                    </Col>
                                </Row>

                                <Row type="flex" align="middle">
                                    <Col span={12} className={styles.item}>
                                        <p>车辆速度统计</p>
                                        <div id="main2" style={{height: 350}}></div>
                                    </Col>

                                    <Col span={12} className={styles.item}>
                                        <p>车辆异常统计</p>
                                        <div id="main3" style={{height: 350}}></div>
                                    </Col>
                                </Row>

                            </div>


                            {/*点击查看车辆信息统计时进入到另一个表格*/}
                            <div ref='carInfo2' style={{display: 'none'}}>
                                <Content className={styles.content}>
                                    <Row type="flex" align="middle">
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>车辆编号</span>
                                            <AutoComplete
                                                dataSource={this.state.autoComplete_carCode}
                                                onSearch={this.onCarCodeAutoCompleteSearch}
                                                allowClear={true}
                                                placeholder="车辆编号" size="large"
                                                onChange={(value) => this.setState({filter_carCode: value})}
                                                value={this.state.filter_carCode}
                                            >
                                                <Input maxLength="15"/>
                                            </AutoComplete>
                                        </Col>
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>设备编号</span>
                                            <AutoComplete
                                                dataSource={this.state.autoComplete_deviceCode}
                                                onSearch={this.onDeviceCodeAutoCompleteSearch}
                                                allowClear={true}
                                                placeholder="设备编号" size="large"
                                                onChange={(value) => this.setState({filter_deviceCode: value})}
                                                value={this.state.filter_deviceCode}
                                            >
                                                <Input maxLength="15"/>
                                            </AutoComplete>
                                        </Col>
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>车辆类别</span>
                                            <Select defaultValue="all" size="large">
                                                <Option value="all">全部</Option>
                                                <Option value="0">叉车</Option>
                                                <Option value="1">拖车</Option>
                                                <Option value="2">其它</Option>
                                            </Select>
                                        </Col>
                                        <Col span={8}>
                                            <Button type="primary" icon="search" size="large"
                                                    className={styles.searchBtn}
                                                    onClick={this.onFilterDevice}>查询统计</Button>
                                            <Button type="primary" icon="sync" size="large" className={styles.resetBtn}
                                                    onClick={this.onResetSearch}>重置查询</Button>
                                            <Button type="primary" icon="left" size="large"
                                                    onClick={this.returnBtn}
                                                    className={styles.returnBtn}>返回</Button>
                                        </Col>
                                    </Row>
                                    <Row className={styles.tableRow}>
                                        <Col span={24}>
                                            <Table rowSelection={selection} rowKey={record => record.carCode}
                                                   className={styles.table} bordered={true}
                                                   footer={() => '共计 ' + dataCount + ' 条数据'}
                                                   size="middle"
                                                   loading={tableDataLoading}
                                                   columns={columns} dataSource={deviceDataSource}>
                                            </Table>
                                        </Col>
                                    </Row>
                                    <DeviceFormModal/>
                                </Content>
                            </div>

                        </TabPane>

                        <TabPane className={styles.tabPane} tab="繁忙统计" key="2">
                            <Content className={styles.content}>

                                <Row type="flex" align="middle">
                                    <Col span={4} className={styles.itemTabs}>
                                        <span>车辆编号</span>
                                        <AutoComplete
                                            dataSource={this.state.autoComplete_deviceCode}
                                            onSearch={this.onDeviceCodeAutoCompleteSearch}
                                            allowClear={true}
                                            placeholder="设备编号" size="large"
                                            onChange={(value) => this.setState({filter_deviceCode: value})}
                                            value={this.state.filter_deviceCode}
                                        >
                                            <Input maxLength="15"/>
                                        </AutoComplete>
                                    </Col>

                                    <Col span={10}>
                                        <span style={{marginRight: '20px'}}>时间选择</span>
                                        <DatePicker style={{width: '18%'}}></DatePicker>&nbsp;&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('09', format)}
                                                    format={format}></TimePicker>&nbsp;&nbsp;
                                        <Icon style={{color: '#a8a8a8'}} type="minus"/>&nbsp;&nbsp;
                                        <DatePicker style={{width: '18%'}}></DatePicker>&nbsp;&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('09', format)} format={format}></TimePicker>
                                    </Col>

                                    <Col span={6}>
                                        <Button type="primary" icon="search" className={styles.searchBtn} onClick={this.onFilterDevice}>查询</Button>
                                        <Button type="primary" icon="sync" className={styles.resetBtn} onClick={this.onResetSearch}>重置</Button>
                                    </Col>
                                </Row>

                                {/*甘特图*/}
                                <Row className={styles.tableRow}>
                                    <Col span={24}>
                                        <Table rowSelection={selection} rowKey={record => record.carCode}
                                               className={styles.table} bordered={true}
                                               footer={() => '共计 ' + dataCount + ' 条数据'}
                                               size="middle"
                                               loading={tableDataLoading}
                                               scroll={{x: 1500}}
                                               columns={columnsBusy}
                                               dataSource={deviceDataSource}>
                                        </Table>
                                    </Col>
                                </Row>

                            </Content>
                        </TabPane>
                    </Tabs>
                </div>
            </Layout>
        );
    }
}
;

export function actionsDispatchToProps(dispatch) {
    return {
        queryAllDevice: () => dispatch(queryAllDeviceBegin()),
        queryAllNotDevice: () => dispatch(queryAllNotDeviceBegin()),
        showErrorMessage: (message) => dispatch(showErrorMessage(message)),
        showDeviceFormModal: (operation, deviceCode) => dispatch(deviceFormModalShow(operation, deviceCode)),
        deleteDevice: (deviceCodes) => dispatch(deleteDevice(deviceCodes)),
        modifyDevice: (deviceEntity) => dispatch(modifyDevice(deviceEntity)),
    };
}

const selectorStateToProps = createStructuredSelector({
    deviceDataSource: deviceDataSourceSelector(),
    tableDataLoading: tableDataLoadingSelector(),
    notDeviceDataSource: notDeviceDataSourceSelector(),
    deviceEntity: deviceEntitySelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(DeviceMgrPage);