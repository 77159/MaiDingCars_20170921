/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备信息对话框（Modal）组件，可支持添加、修改、查看功能。
 */

'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';

const {Content} = Layout;
import {Input} from 'antd';
import {Table} from 'antd';

const {Column, ColumnGroup} = Table;

import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {
    makeSelectRepos, makeSelectLoading, makeSelectError, errorMessageSelector,
    messageSelector
} from '../App/selectors';
import {
    deviceDataSourceSelector, deviceEntitySelector, modalVisibleSelector, operationRunningSelector, operationSelector,
    tableDataLoadingSelector
} from './selectors';
import {Form} from 'antd';
import {Switch} from 'antd';
import {deviceFormModalCreateDevice, deviceFormModalHide, deviceFormModalModifyDevice} from "./actions";
import {createDevice, modifyDevice, viewCarMsgDetail} from "../DeviceMgrPage/actions";

const FormItem = Form.Item;

import echarts from 'echarts';

class DeviceFormModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    //状态更新后的变化
    componentWillReceiveProps(nextProps) {
        //判断上一次的数据和此时的数据是否一致
        if (!this.props.deviceEntity && !nextProps.deviceEntity) {
            this.props.form.resetFields();
        } else if (((!this.props.deviceEntity) && nextProps.deviceEntity) || this.props.deviceEntity !== nextProps.deviceEntity) {
            this.props.form.resetFields();
        }
    };


    getDensity = () => {
        return (<div id="main4" style={{height: 320}}></div>)
    };

    componentDidUpdate() {

        console.log(this.props.deviceEntity);

        let myChart = echarts.init(document.getElementById('main4'));
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
                right: '30',
                textStyle: {
                    fontSize: 14,
                    padding: [3, 4, 5, 6],
                },
                data: [
                    '区域A：15h（20%）',
                    '区域B：49h（36%）',
                    '区域C：31h（28%）',
                    '区域D：9h（16%）',
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
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: 10, name: '区域A：15h（20%）'},
                        {value: 40, name: '区域B：49h（36%）'},
                        {value: 20, name: '区域C：31h（28%）'},
                        {value: 10, name: '区域D：9h（16%）'},
                    ]
                },
            ]
        });
        window.onresize = myChart.resize;

    }


    //取消
    onCancel = () => {
        this.props.form.resetFields();
        this.props.hideModal();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {modalVisible, operation, deviceEntity, operationRunning} = this.props;
        const getDensity = this.getDensity();
        
        return (
            <Modal
                title={<span><i className="iconfont icon-shebeiguanli"/>{deviceEntity.carCode} - 集中区域分析</span>}
                visible={modalVisible}
                onCancel={this.onCancel}
                footer={null}
                width={700}
                className={styles.redModal}
            >
                <div className={styles.carsDensity}>
                    <spsn style={{position: 'relative', left: '50px'}}>工作总时长：104h</spsn>
                    {getDensity}
                </div>
            </Modal>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        hideModal: () => dispatch(deviceFormModalHide()),
        createDevice: (deviceEntity) => dispatch(createDevice(deviceEntity)),
        modifyDevice: (deviceEntity) => dispatch(modifyDevice(deviceEntity)),
    };
}

const selectorStateToProps = createStructuredSelector({
    modalVisible: modalVisibleSelector(),
    operation: operationSelector(),
    operationRunning: operationRunningSelector(),
    deviceEntity: deviceEntitySelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(Form.create()(DeviceFormModal));