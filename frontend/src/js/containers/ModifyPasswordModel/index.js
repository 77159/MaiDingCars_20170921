/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 修改密码
 */
'use strict';
import React from 'react';
import {Layout, Menu, Icon, Popover, Button} from 'antd';
import {Modal, Input} from 'antd';

const {Header} = Layout;
import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {loadRepos} from '../App/actions';
import {modifyPassword, modifyFormModalHide} from './actions';
import {makeSelectUsername, operationRunningSelector, modalVisibleSelector, operationSelector} from './selectors';
import {browserHistory} from 'react-router'
import md5 from 'js-md5';
import {appRegExp} from "../../utils/validation";

import {Form} from 'antd';
import {CommonUtil} from "../../utils/util";

const FormItem = Form.Item;
const bH = browserHistory;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
};
const formItemLayout2 = {
    labelCol: {span: 0},
    wrapperCol: {span: 24, offset: 6},
};


class ModifyPasswordModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //监测两次输入的密码是否一致
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newpwd')) {
            callback('输入的密码不一致');
        } else {
            callback();
        }
    }

    //修改密码
    clickModifyPassword = () => {
        this.setState({
            modifyLoading: true
        });
        const form = this.props.form;
        form.validateFields((err, passwordMsg) => {
            if (err) {
                this.setState({visible: false, confirmLoading: false});
                return;
            }
            passwordMsg['oripwd'] = md5(passwordMsg.oripwd);
            passwordMsg['newpwd'] = md5(passwordMsg.newpwd);
            passwordMsg['confirm'] = md5(passwordMsg.confirm);
            console.log('收集到的修改密码的信息', passwordMsg);
            this.props.modifyPassword(passwordMsg);
            this.setState({modifyLoading: false});
            this.props.form.resetFields();
        });
    };

    //取消
    onCancel = () => {
        this.props.form.resetFields();
        this.props.hideModal();
    };

    render() {
        const {onCancel, onCreate, confirmLoading, loading, form, operationRunning, modalVisible} = this.props;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal
                title={<span><Icon type="hdd"/>修改密码</span>}
                visible={modalVisible}
                width={480}
                onOk={onCreate}
                confirmLoading={confirmLoading}
                footer={null}
                className={styles.redModal}
                onCancel={this.onCancel}
            >
                <Form layout="horizontal">
                    <FormItem label="旧密码" {...formItemLayout} hasFeedback={true} colon={false}>
                        {getFieldDecorator('oripwd', {
                            rules: [{required: true, message: '请输入当前的密码'}],
                        })(
                            <Input maxLength="16" type="password"/>
                        )}
                    </FormItem>
                    <FormItem label="新密码" {...formItemLayout} hasFeedback={true} colon={false}>
                        {getFieldDecorator('newpwd', {
                            rules: [{
                                required: true,
                                regexp: 'regexp',
                                pattern: appRegExp.PASSWORD,
                                message: appRegExp.PASSWORD_ERROR_MSG,
                                min: 6,
                                max: 16,
                            },
                                {
                                    validator: this.checkConfirm,
                                }],
                        })(
                            <Input maxLength="16" type="password"/>
                        )}
                    </FormItem>
                    <FormItem label="确认密码" {...formItemLayout} hasFeedback={true} colon={false}>
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true,
                                regexp: 'regexp',
                                pattern: appRegExp.PASSWORD,
                                message: appRegExp.PASSWORD_ERROR_MSG,
                                min: 6,
                                max: 16,
                            },
                                {
                                    validator: this.checkPassword,
                                }],
                        })(
                            <Input maxLength="16" type="password"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout2}>
                        <Button key="submit" type="primary" loading={operationRunning} size="large"
                                onClick={this.clickModifyPassword} style={{margin: '0px 10px', width: '120px'}}>修改</Button>
                        <Button key="back" size="large" onClick={this.onCancel} style={{margin: '0px 10px', width: '120px'}}>
                            取消
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        modifyPassword: (passwordMsg) => dispatch(modifyPassword(passwordMsg)),
        hideModal: () => dispatch(modifyFormModalHide()),
    };
}

const mapStateToProps = createStructuredSelector({
    passwordMsg: makeSelectUsername(),
    operation: operationSelector(),
    modalVisible: modalVisibleSelector(),
    operationRunning: operationRunningSelector(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModifyPasswordModel));