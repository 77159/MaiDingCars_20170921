/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理页面。路径为'/car'
 */

'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Popconfirm} from 'antd';

const {Content} = Layout;
import {Input} from 'antd';
import {Select} from 'antd';

const Option = Select.Option;
import {Row, Col} from 'antd';
import {Table} from 'antd';
import {Avatar} from 'antd';
import {Cascader} from 'antd';
import {Checkbox} from 'antd';
import {InputNumber} from 'antd';
import {AutoComplete} from 'antd';
import {Popover} from 'antd';
import _ from 'lodash';

import {AppConfig} from '../../core/appConfig';

const serviceUrl = AppConfig.serviceUrl;

const SubMenu = Menu.SubMenu;
import styles from './index.less';

import {carDataSourceSelector, tableDataLoadingSelector} from './selectors';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {loadRepos} from '../App/actions';
import {queryAllCarBegin, deleteCar} from './actions';

import CategoryFormModel from '../CategoryFormModel';

//region 添加车辆
import {Form} from 'antd';
import {Switch} from 'antd';
import {CommonUtil} from "../../utils/util";



import CarFormModal from '../CarFormModal';
import {carFormModalShow} from "../CarFormModal/actions";
import {carCategorySourceSelector} from '../CategoryFormModel/selectors';

const FormItem = Form.Item;

export class CarMgrPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            workState: 'all',
            curSelectedRowKeys: [],
            visible: false,
            confirmLoading: false,
            loading: false,
            postVisible: false,
            postConfirmLoading: false,
            postLoading: false,
            current: '1',
            openKeys: [],
            autoComplete_carCode: [],
            autoComplete_deviceCode: [],
            filter_deviceCode: '',
            filter_carCode: '',
            dataFilter: null,
            postFormType: 'none',
            carCategory: [],
            filter_carType: 'all',
        };
    }

    //加载所有车辆数据
    componentDidMount() {
        this.props.queryAllCar();
    }

    //状态更新后的变化
    componentWillReceiveProps(nextProps) {
        //当车辆类别数据更新时，更新当前组件的state中对车辆类别的缓存数据
        if (_.eq(this.props.carCategory, nextProps.carCategory) == false) {
            this.deepCloneCarCategory(nextProps.carCategory)
        }
    };

    //将车辆类别数据进行深拷贝，修改结构后存储到当前组件的state中
    deepCloneCarCategory = (orginCarCategory) => {
        //复制车辆类别数据，改变对象结构
        if (_.isArray(orginCarCategory)) {
            let tmpCarCategory = [];
            orginCarCategory.forEach((item) => {
                //创建类别
                let cagetoryItem = {
                    value: item.id + '',
                    label: item.typeName + '',
                };
                tmpCarCategory.push(cagetoryItem);
            });
            this.setState({carCategory: tmpCarCategory});
        }
    };

    //重置
    onResetSearch = () => {
        this.setState({
            workState: 'all',   //工作状态 默认:全部
            curSelectedRowKeys: [],
            visible: false,
            confirmLoading: false,
            loading: false,
            postVisible: false,
            postConfirmLoading: false,
            postLoading: false,
            dataFilter: null,
            filter_deviceCode: '',
            filter_carCode: '',
            current: '1',
            openKeys: [],
            autoComplete_deviceCode: [],
            autoComplete_carCode: [],
            filter_carType: 'all',
        });

        //刷新
        this.props.queryAllCar();
    };

    //安保编号自动完成填充
    onCarCodeAutoCompleteSearch = (value) => {
        let carDataSource = this.props.carDataSource;
        let data = [];
        //输入字符不能为空且必须输入3个字符及以上
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历所有数据，并将对应的完整数据写入自动完成提示数据集合中
            carDataSource.forEach(carEntity => {
                if (carEntity.carCode.includes(value)) {
                    data.push(carEntity.carCode);
                }
            });
        }
        this.setState({
            autoComplete_carCode: data,
        })
    };

    //设备编号自动完成填充
    onDeviceCodeAutoCompleteSearch = (value) => {
        let carDataSource = this.props.carDataSource;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将设备编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            carDataSource.forEach(carEntity => {
                if (carEntity.deviceCode) {
                    if (carEntity.deviceCode.includes(value)) {
                        data.push(carEntity.deviceCode);
                    }
                }
            });
        }
        this.setState({
            autoComplete_deviceCode: data
        });
    };

    //数据过滤器 value：筛选条件  record 车辆数据
    carDataFilter = (value, record) => {
        let filters = value.split('&&');
        if (filters.length != 3) {
            console.error('车辆筛选条件长度错误');
            return true; //忽略过滤器
        }
        //筛选数据
        return record != null &&
            (_.isEmpty(filters[0]) || (_.isNull(record.deviceCode) == false && record.deviceCode.includes(filters[0]))) &&
            (_.isEmpty(filters[1]) || (_.isNull(record.carCode) == false && record.carCode.includes(filters[1]))) &&
            (record.carType == filters[2] || filters[2] == 'all')
    }

    //查询车辆（筛选）
    onFilterCar = () => {
        //保证参数不能为null、undefined
        let deviceCode = _.isEmpty(this.state.filter_deviceCode) ? '' : this.state.filter_deviceCode.trim();
        let carCode = _.isEmpty(this.state.filter_carCode) ? '' : this.state.filter_carCode.trim();
        let filterStr = `${deviceCode}&&${carCode}&&${this.state.filter_carType}`;
        this.setState({
            //TODO zxg:此处注意，尽量使用一个参数，antd 的性能优化有些问题。项目完成后可以提交 issue
            //将多个筛选条件拼接为一个条件，利于后续在一次循环中集中判断，减少[carDataFilter]循环判断次数
            dataFilter: [
                filterStr
            ]
        });
    };

    //添加车辆
    showAddCarModal = () => {
        this.props.showCarFormModal('create', {deviceStatus: 1});
    };

    //查看车辆信息
    onViewCarInfo = (record) => {
        this.props.showCarFormModal('modify', record);
    };


    onSelectChange = (keys) => {
        this.setState({curSelectedRowKeys: keys});
    };


    /**
     * 切换车辆类型设置
     * @param type    车辆类型表单类型 [none：空；category：车辆类型表单；level：车辆级别表单]
     */
    changePostFormType = (type) => {
        this.setState({
            postFormType: type
        })
    };

    /**
     * 关闭车辆类型设置面板
     */
    closePostSettingModal = () => {
        this.setState({
            postVisible: false,
            postFormType: 'none'
        });
    };

    /**
     * 显示车辆类型设置面板
     */
    showPostSettingModal = () => {
        this.setState({
            postVisible: true,
        });
    };

    delCar = (carCode) => {
        this.props.deleteCar(carCode);
        this.setState({
            curSelectedRowKeys: [],
        });
    };



    render() {
        const {carDataSource, tableDataLoading, carCategory} = this.props;

        const rowSelection = {
            curSelectedRowKeys,
            onChange: this.onSelectChange,
        };
        let carTypeList;
        if (carCategory) {
            carTypeList = carCategory.map((item, index) => {
                return (
                    <Option key={index} value={item.id + ''}>{item.typeName}</Option>
                )
            })
        }

        const {curSelectedRowKeys} = this.state;
        const isDisabled = curSelectedRowKeys.length > 0;//禁止批量删除按钮

        
        const columns = [{
            title: '车辆编号',
            dataIndex: 'carCode',
            key: 'carCode',
            filteredValue: this.state.dataFilter,   //设置过滤条件
            onFilter: (value, record) => this.carDataFilter(value, record)   //对每条数据都通过指定函数进行过滤
        }, {
            title: '车辆类型',
            dataIndex: 'carType',
            key: 'carType',
            render: (carType) => {
                let typeName = null;
                if (_.isArray(carCategory)) {
                    if (carCategory.length) {
                        carCategory.forEach((item) => {
                            if (carType == item.id) {
                                typeName = item.typeName;
                            }
                        });
                    }
                }
                return <span>{typeName}</span>
            }
        }, {
            title: '设备编号',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
        }, {
            title: '所属区域',
            dataIndex: 'area',
            key: 'area',
        }, {
            title: '车辆状态',
            dataIndex: 'carStatus',
            key: 'carStatus',
            render: (text) => {
                if (text === 1) {
                    return (<span>在线<i className={styles.greenCircle}/></span>);
                } else {
                    return (<span>离线<i className={styles.redCircle}/></span>);
                }
            }
        }, {
            title: '最大速度',
            dataIndex: 'maxSpeed',
            key: 'maxSpeed',
            render: (text) => {
                return Math.floor(text * 100) / 100 + ' km/h';
            },
        }, {
            title: '平均速度',
            dataIndex: 'averageSpeed',
            key: 'averageSpeed',
            render: (text) => {
                return Math.floor(text * 100) / 100 + ' km/h';
            },
        }, {
            title: '安全速度',
            dataIndex: 'safetySpeed',
            key: 'safetySpeed',
            render: (text) => {
                return Math.floor(text * 100) / 100 + ' km/h';
            },
        }, {
            title: '行驶里程',
            dataIndex: 'mileage',
            key: 'mileage',
            render: (text) => {
                return Math.floor(text / 1000 * 100) / 100 + ' km';
            },
        }, {
            title: '报警次数',
            dataIndex: 'warningNum',
            key: 'warningNum',
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '修改日期',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            render: (text, record, index) => {
                return (
                    <div>
                        <Button className={styles.tableBtn} ghost
                                onClick={() => this.onViewCarInfo(record)}
                        >查看</Button>
                        <Popconfirm title="确认要删除此车辆吗？" onConfirm={() => this.delCar([record.carCode])}>
                            <Button className={styles.tableBtn} ghost>删除</Button>
                        </Popconfirm>
                    </div>
                );
            },
        }];

        return (
            <Layout className={styles.layout}>
                <Content className={styles.content}>
                    <Row type="flex" align="middle">
                        <Col span={4} className={styles.item}>
                            <span>设备编号</span>
                            <AutoComplete
                                dataSource={this.state.autoComplete_deviceCode}
                                onSearch={this.onDeviceCodeAutoCompleteSearch}
                                onChange={(value) => this.setState({filter_deviceCode: value})}
                                value={this.state.filter_deviceCode}
                                allowClear={true}
                                placeholder="设备编号"
                                size="large"
                            >
                                <Input maxLength="30"/>
                            </AutoComplete>
                        </Col>
                        <Col span={4} className={styles.item}>
                            <span>车辆编号</span>
                            <AutoComplete
                                dataSource={this.state.autoComplete_carCode}
                                onSearch={this.onCarCodeAutoCompleteSearch}
                                onChange={(value) => this.setState({filter_carCode: value})}
                                value={this.state.filter_carCode}
                                allowClear={true}
                                placeholder="车辆编号"
                                size="large"
                            >
                                <Input maxLength="30"/>
                            </AutoComplete>
                        </Col>
                        <Col span={4} className={styles.item}>
                            <span>车辆类别</span>
                            <Select defaultValue="all" size="large" value={this.state.filter_carType}
                                    onChange={(value) => this.setState({filter_carType: value})}>
                                <Option value="all">全部</Option>
                                {carTypeList}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" icon="search" size="large" className={styles.searchBtn}
                                    onClick={this.onFilterCar}>查询</Button>
                            <Button icon="sync" size="large" className={styles.searchBtn} onClick={this.onResetSearch}>重置</Button>
                        </Col>
                        <Col span={8} className={styles.textRight}>
                            <Button type="primary" icon="car" size="large" onClick={this.showAddCarModal}
                                    className={styles.addBtn}>新建车辆</Button>
                            <Popconfirm title="确认要批量删除所选车辆吗？"
                                        onConfirm={() => this.delCar(this.state.curSelectedRowKeys)}>
                                <Button type="primary" icon="delete" size="large"
                                        className={styles.addBtn} disabled={!isDisabled}>批量删除</Button>
                            </Popconfirm>
                            <Button type="primary" icon="bars" size="large" className={styles.addBtn}
                                    onClick={this.showPostSettingModal}>类别设置</Button>
                        </Col>
                    </Row>
                    <Row className={styles.tableRow}>
                        <Col span={24}>
                            <Table rowSelection={rowSelection}
                                   rowKey={record => record.carCode}
                                   className={styles.table} bordered={true}
                                   footer={(record) => '共计 ' + `${record.length}` + ' 条数据'}
                                   size="middle"
                                   loading={tableDataLoading}
                                   columns={columns} dataSource={carDataSource}>
                            </Table>
                        </Col>
                    </Row>
                    <CarFormModal/>
                    {/*车辆类型设置面板*/}
                    <CategoryFormModel
                        postVisible={this.state.postVisible}
                        postFormType={this.state.postFormType}
                        changePostFormType={this.changePostFormType}
                        closePostSettingModal={this.closePostSettingModal}
                    />
                </Content>
            </Layout>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        queryAllCar: () => dispatch(queryAllCarBegin()),
        showErrorMessage: (message) => dispatch(showErrorMessage(message)),
        showCarFormModal: (operation, carCode) => dispatch(carFormModalShow(operation, carCode)),
        onSubmitForm: (evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            dispatch(loadRepos());
        },
        deleteCar: (carCodes) => dispatch(deleteCar(carCodes)),
    }
}

const selectorStateToProps = createStructuredSelector({
    carDataSource: carDataSourceSelector(),
    tableDataLoading: tableDataLoadingSelector(),
    carCategory: carCategorySourceSelector()
});

export default connect(selectorStateToProps, actionsDispatchToProps)(CarMgrPage);