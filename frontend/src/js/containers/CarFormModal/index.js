/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理页面 添加车辆信息框组件，可支持添加、修改、查看功能。路径为'/car'
 */

'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Input} from 'antd';
import {InputNumber} from 'antd';
import {Cascader} from 'antd';
import {Checkbox} from 'antd';
import {Select} from 'antd';
import {Row, Col} from 'antd';
import {Table} from 'antd';
import {message} from 'antd';
import {Form} from 'antd';
const {Column, ColumnGroup} = Table;
import styles from './index.less';
import {connect} from 'react-redux';
import _ from 'lodash';
const {Content} = Layout;
import {createStructuredSelector} from 'reselect';
import {
    carDataSourceSelector, carEntitySelector, modalVisibleSelector, operationRunningSelector, operationSelector,
    tableDataLoadingSelector, imgURLSelector
} from './selectors';

import {carCategorySourceSelector, areaNameSourceSelector} from '../CategoryFormModel/selectors';

import {notDeviceDataSourceSelector} from '../DeviceMgrPage/selectors';

import {carFormModalCreateCar, carFormModalHide, carFormModalModifyCar, getImgUrl} from "./actions";
import {appRegExp} from "../../utils/validation";
import {PeopleAvatar} from '../../components/PeopleAvatar';
import {createCar, modifyCar} from "../CarMgrPage/actions";

import {queryAllNotDeviceBegin} from "../DeviceMgrPage/actions";


import {AppConfig} from '../../core/appConfig';
const serviceUrl = AppConfig.serviceUrl;

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
};
const formItemLayout2 = {
    labelCol: {span: 0},
    wrapperCol: {span: 24, offset: 6},
};
const formItemLayout3 = {
    labelCol: {span: 6, offset: 6},
    wrapperCol: {span: 12},
};
const formItemLayout4 = {
    labelCol: {span: 5, offset: 4},
    wrapperCol: {span: 14},
};
const formItemLayout5 = {
    labelCol: {span: 0},
    wrapperCol: {span: 16, offset: 6},
};
const formItemLayout6 = {
    labelCol: {span: 6},
    wrapperCol: {span: 24},
};

class CarFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carCategory: [],  //车辆类别、级别集合
            notDeviceDataSource: [],
            areaName: []    //区域列表集合
        };
    }

    componentDidMount() {
        this.props.queryAllNotDeviceBegin();
    }

    //状态更新后的变化
    componentWillReceiveProps(nextProps) {
        //当车辆类别数据更新时，更新当前组件的state中对车辆类别的缓存数据
        if (_.eq(this.props.carCategory, nextProps.carCategory) == false) {
            this.deepCloneCarCategory(nextProps.carCategory)
        }

        //判断上一次的数据和此时的数据是否一致
        if (!this.props.carEntity && !nextProps.carEntity) {
            this.props.form.resetFields();
        } else if (((!this.props.carEntity) && nextProps.carEntity) || this.props.carEntity !== nextProps.carEntity) {
            this.props.form.resetFields();
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
                    value: item.id,
                    label: item.typeName + '',
                };
                tmpCarCategory.push(cagetoryItem);
            });
            this.setState({carCategory: tmpCarCategory});
        }
    };

    //取消
    onCancel = () => {
        this.props.form.resetFields();
        if (this.props.operation === 'create') {
            this.props.getImgUrl('');
        } else {
            this.props.getImgUrl(this.props.carEntity.avatarImgPath);
        }
        this.props.hideModal();
    };

    //添加
    onAdd = () => {
        const form = this.props.form;
        const imgURL = this.props.imgURL;
        form.validateFields((err, values) => {
            if (err) {
                this.setState({visible: false, confirmLoading: false});
                return;
            }
            if (_.isArray(values.carType)) {
                let carType;
                const carTypeObj = values.carType;
                carType = carTypeObj[0];
                values['carType'] = carType;
            }
            this.props.createCar(values);
            //form.resetFields();
            this.props.getImgUrl('');
        });
    };

    //修改
    onSave = () => {
        const form = this.props.form;
        let imgURL = this.props.imgURL;
        const carCategory = this.props.carCategory;
        form.validateFields((err, values) => {
            if (err) {
                this.setState({visible: false, confirmLoading: false});
                return;
            }

            if (_.isArray(values.carType)) {
                let carType;
                const carTypeObj = values.carType;
                carType = carTypeObj[0];
                values['carType'] = carType;
            }

            this.props.modifyCar(values);
            //form.resetFields();
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible, onCancel, onAdd, confirmLoading, loading, form, onSave} = this.props;
        const {modalVisible, operation, carEntity, operationRunning, carCategory, notDeviceDataSource, areaName} = this.props;
        const opText = (operation === 'create') ? '新建车辆' : '编辑车辆信息';
        const determine = (operation === 'create') ? '添加' : '保存';
        const switchBtn = (operation === 'create') ? this.onAdd : this.onSave;
        const isShow = (operation === 'create') ? false : true;
        let carTypeName, notDevice, areaNameList;

        //车辆类型的遍历渲染
        if (carCategory) {
            carTypeName = carCategory.map((item, index) => {
                return (
                    <Option key={index} value={item.typeName}>{item.typeName}</Option>
                )
            });
        }
        //未使用的设备状态
        if (notDeviceDataSource) {
            notDevice = notDeviceDataSource.map((item, index) => {
                return (
                    <Option key={index} value={item.deviceCode}>{item.deviceCode}</Option>
                )
            });
        }

        //区域列表
        if (areaName) {
            areaNameList = areaName.map((item, index) => {
                return (
                    <Option key={index} value={item.areaName}>{item.areaName}</Option>
                )
            });
        }

        return (
            <Modal
                title={<span><Icon type="user-add"/>{opText}</span>}
                visible={modalVisible}
                onOk={this.onAdd}
                onCancel={this.onCancel}
                confirmLoading={confirmLoading}
                footer={null}
                width={520}
                className={styles.redModal}
            >
                <Form layout="horizontal">
                    <Row gutter={20} type="flex">
                        <Col span={24}>
                            <FormItem label="车辆编号" {...formItemLayout} hasFeedback={true} colon={false}>
                                {getFieldDecorator('carCode', {
                                    rules: [{
                                        required: true,
                                        regexp: 'regexp',
                                        pattern: appRegExp.CARCODE,
                                        message: appRegExp.CARCODE_ERROR_MSG,
                                        min: 3,
                                        max: 15,
                                    }],
                                    initialValue: carEntity.carCode
                                })(
                                    <Input disabled={isShow} maxLength="30"/>
                                )}
                            </FormItem>
                            <FormItem label="车辆类型" {...formItemLayout} colon={false}>
                                {getFieldDecorator('carType', {
                                    rules: [{type: 'array', required: true, message: '请选择车辆类型'}],
                                    initialValue: [carEntity.carType]
                                })(
                                    <Cascader placeholder="请选择车辆类别" options={this.state.carCategory}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="所属区域"
                                colon={false}
                            >
                                {getFieldDecorator('area', {
                                    initialValue: carEntity.area
                                })(
                                    <Select>
                                        {areaNameList}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="安全速度" {...formItemLayout} hasFeedback={true} colon={false}>
                                {getFieldDecorator('safetySpeed', {
                                    rules: [{
                                        regexp: 'regexp',
                                        pattern: appRegExp.SAFETYSPEED,
                                        message: appRegExp.SAFETYSPEED_ERROR_MSG,
                                        min: 1,
                                        max: 6,
                                    }],
                                    initialValue: carEntity.safetySpeed
                                })(
                                    <Input maxLength="20"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="设备编号"
                                colon={false}
                            >
                                {getFieldDecorator('deviceCode', {
                                    initialValue: carEntity.deviceCode
                                })(
                                    <Select>
                                        <Option key={'\n'}>不选择任何设备</Option>
                                        {notDevice}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="备注" {...formItemLayout} hasFeedback={true} colon={false}>
                                {getFieldDecorator('remark', {
                                    rules: [{
                                        regexp: 'regexp',
                                        pattern: appRegExp.CARREMARK,
                                        message: appRegExp.CARREMARK_ERROR_MSG,
                                        min: 0,
                                        max: 100,
                                    }],
                                    initialValue: carEntity.remark
                                })
                                (<Input type="textarea"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <FormItem {...formItemLayout2}>
                                <Button key="submit" type="primary"
                                        loading={operationRunning} size="large"
                                        onClick={switchBtn}
                                        style={{margin: '0px 10px', width: '120px'}}>
                                    {determine}
                                </Button>
                                <Button key="back" size="large" onClick={this.onCancel}
                                        style={{margin: '0px 10px', width: '120px'}}>
                                    取消
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

}

export function actionsDispatchToProps(dispatch) {
    return {
        hideModal: () => dispatch(carFormModalHide()),
        createCar: (carEntity) => dispatch(createCar(carEntity)),
        modifyCar: (carEntity) => dispatch(modifyCar(carEntity)),
        queryAllNotDeviceBegin: () => dispatch(queryAllNotDeviceBegin()),
        getImgUrl: (imgURL) => dispatch(getImgUrl(imgURL))
    };
}

const selectorStateToProps = createStructuredSelector({
    modalVisible: modalVisibleSelector(),
    operation: operationSelector(),
    operationRunning: operationRunningSelector(),
    carEntity: carEntitySelector(),
    areaName: areaNameSourceSelector(),
    carCategory: carCategorySourceSelector(),
    notDeviceDataSource: notDeviceDataSourceSelector(),
    imgURL: imgURLSelector()
});

export default connect(selectorStateToProps, actionsDispatchToProps)(Form.create()(CarFormModal));
