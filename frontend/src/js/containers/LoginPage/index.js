/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 登录页面。路径为'/login'
 */
'use strict';
import React from 'react';
import {
    Icon
} from 'antd';
import {
    Button
} from 'antd';
import md5 from 'js-md5';

import {
    Input
} from 'antd';
import {
    Table
} from 'antd';

const {
    Column,
    ColumnGroup
} = Table;

import styles from './index.less';

import {
    createStructuredSelector
} from 'reselect';
import {
    connect
} from 'react-redux';
import {
    loadRepos
} from '../App/actions';
import {
    changeUsername
} from './actions';
import {
    operationRunningSelector
} from './selectors';

import {
    Form
} from 'antd';
const FormItem = Form.Item;
import {
    appRegExp
} from "../../utils/validation";

export class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            loginLoading: false,
        };
    }

    //用户登陆
    login = () => {
        this.setState({
            loginLoading: true,
        });
        const form = this.props.form;
        form.validateFields((err, loginMsg) => {
            if (err) {
                this.setState({
                    visible: false,
                    confirmLoading: false
                });
                return;
            }
            console.log('收集到的人员登陆信息', loginMsg);
            loginMsg['password'] = md5(loginMsg.password);
            this.props.changeUsername(loginMsg);
            this.setState({
                loginLoading: false
            });
        })
    }


    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            operationRunning
        } = this.props;
        const formItemLayout = {
            labelCol: {
                span: 0
            },
            wrapperCol: {
                span: 24
            },
        };
        const formItemLayout2 = {
            labelCol: {
                span: 0
            },
            wrapperCol: {
                span: 24,
                offset: 6
            },
        };

        return (
            <div className={styles.pageBg}>
                <div className={styles.info}>
                </div>
                <div className={styles.login}>
                    {/*<div className={styles.leftImg}/>*/}
                    <div className={styles.rightForm}>
                        <Form className="login-form">
                            <FormItem className={styles.loginTitle}>
                                <label>用户登录</label><label>User Login</label>
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                hasFeedback={true}
                                validateStatus={this.state.userName.validateStatus}
                                help={this.state.userName.errorMsg}
                                className={styles.formItem}
                            >{getFieldDecorator('username', {
                                rules: [{
                                    required: true,
                                    regexp: 'regexp',
                                    pattern: appRegExp.USERNAME,
                                    message: appRegExp.USERNAME_ERROR_MSG,
                                    min: 3,
                                    max: 15,
                                }],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 21}}/>} maxLength="30"
                                       placeholder="用户名" className={styles.userName}/>
                            )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                hasFeedback={true}
                                validateStatus={this.state.password.validateStatus}
                                help={this.state.password.errorMsg}
                                className={styles.formItem}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        regexp: 'regexp',
                                        pattern: appRegExp.PASSWORD,
                                        message: appRegExp.PASSWORD_ERROR_MSG,
                                        min: 6,
                                        max: 16,
                                    }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 21}}/>} maxLength="30"
                                           type="password" className={styles.userName}
                                           placeholder="密码"
                                           onPressEnter={this.login}/>
                                )}
                            </FormItem>

                            <FormItem>
                                <Button className={styles.loginBtn} onClick={this.login}
                                        loading={operationRunning}>
                                    登 录
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <div className={styles.support}>
                    <a href="http://www.madintech.com/">技术支持：北京麦钉艾特科技有限公司&蜂鸟云</a>
                </div>
            </div>
        );
    }
}


export function actionsDispatchToProps(dispatch) {
    return {
        changeUsername: (loginMsg) => dispatch(changeUsername(loginMsg)),
    };
}

const selectorStateToProps = createStructuredSelector({
    //loginMsg: makeSelectUsername(),
    operationRunning: operationRunningSelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(Form.create()(LoginPage));