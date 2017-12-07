/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备信息对话框（Modal）组件，可支持添加、修改、查看功能。
 */

'use strict';
import React from 'react';
import {
    Layout,
    Menu,
    Icon,
    Button,
    Modal,
    Input,
    Table,
    Select,
    Form
} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const {Content} = Layout;
const {Column, ColumnGroup} = Table;
import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {
    deviceEntitySelector,
    modalVisibleSelector,
    operationRunningSelector,
    operationSelector,
} from './selectors';
import {deviceFormModalHide,} from "./actions";
import {appRegExp} from "../../utils/validation";
import {createDevice, modifyDevice} from "../DeviceMgrPage/actions";

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
};
const formItemLayout2 = {
    labelCol: {span: 0},
    wrapperCol: {span: 24, offset: 6},
};

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

    //添加、修改
    addOrModify = () => {
        if (this.props.operation === 'create') {
            const form = this.props.form;
            form.validateFields((err, values) => {
                if (err) {
                    this.setState({visible: false, confirmLoading: false});
                    return;
                }
                values.deviceStatus = (values.deviceStatus === '1') ? 0 : 1;
                this.props.createDevice(values);
                //form.resetFields();
            });
        } else {
            const form = this.props.form;
            form.validateFields((err, values) => {
                if (err) {
                    this.setState({visible: false, confirmLoading: false});
                    return;
                }
                //values.deviceStatus = values.deviceStatus ? 0 : 1;
                values.deviceStatus = (values.deviceStatus === '1') ? 0 : 1;
                this.props.modifyDevice(values);
                //form.resetFields();
            });
        }
    }

    //取消
    onCancel = () => {
        this.props.form.resetFields();
        this.props.hideModal();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {modalVisible, operation, deviceEntity, operationRunning} = this.props;
        const opText = operation === 'create' ? '添加设备' : '编辑设备信息';
        const determine = (operation === 'create') ? '添加' : '保存';
        const isShow = (operation === 'create') ? false : true;
        const deviceStatus = (operation === 'create') ? '0' : ((deviceEntity.deviceStatus === 1) ? '0' : '1');

        return (

            <Modal
                title={<span><i className="iconfont icon-shebeiguanli"/>{opText}</span>}
                visible={modalVisible}
                onCancel={this.onCancel}
                footer={null}
                className={styles.redModal}
            >
                <Form layout="horizontal">
                    <FormItem label="设备编号" {...formItemLayout} hasFeedback={true} colon={false}>
                        {getFieldDecorator('deviceCode', {
                            rules: [{
                                required: true,
                                regexp: 'regexp',
                                pattern: appRegExp.DEVICECODE,
                                min: 3,
                                max: 15,
                                message: appRegExp.DEVICECODE_ERROR_MSG
                            }],
                            initialValue: deviceEntity.deviceCode,
                        })(
                            <Input disabled={isShow} maxLength="15"/>
                        )}
                    </FormItem>
                    <FormItem label="设备名称" {...formItemLayout} hasFeedback={true} colon={false}>
                        {getFieldDecorator('deviceName', {
                            rules: [{
                                regexp: 'regexp',
                                pattern: appRegExp.DEVICENAME,
                                min: 0,
                                max: 20,
                                message: appRegExp.DEVICENAME_ERROR_MSG
                            }],
                            initialValue: deviceEntity.deviceName,
                        })(
                            <Input maxLength="15"/>
                        )}
                    </FormItem>
                    <FormItem label="启用状态" {...formItemLayout} required={true} colon={false}>
                        {getFieldDecorator('deviceStatus', {
                            initialValue: [deviceStatus]
                        })(
                            <Select>
                                <Option value="0">启用</Option>
                                <Option value="1">禁用</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="设备标识" {...formItemLayout} colon={false}>
                        {getFieldDecorator('deviceMark', {
                            rules: [{
                                required: true,
                                regexp: 'regexp',
                                pattern: appRegExp.DEVICEINFO,
                                min: 1,
                                message: appRegExp.DEVICEINFO_ERROR_MSG
                            }],
                            initialValue: deviceEntity.deviceMark,
                        })(
                            <Input type="textarea" placeholder="(设备编号+27位标识)限制28位数字" maxLength="1000"/>
                        )}
                    </FormItem>

                    <FormItem label="备注" {...formItemLayout} colon={false}>
                        {getFieldDecorator('remark', {initialValue: deviceEntity.remark})(
                            <Input type="textarea" maxLength="200"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout2}>
                        <Button key="submit" type="primary" loading={operationRunning} size="large"
                                onClick={this.addOrModify} style={{margin: '0px 10px', width: '120px'}}>
                            {determine}
                        </Button>
                        <Button key="back" size="large" onClick={this.onCancel}
                                style={{margin: '0px 10px', width: '120px'}}>
                            取消
                        </Button>
                    </FormItem>
                </Form>
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