/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 系统入口页面,路由的顶层
 */

'use strict';
import React from 'react';
import {message} from 'antd';
import {messageSelector} from "./selectors";
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import _ from 'lodash';

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        //消息提示全局配置
        message.config({
            top: 70,
            duration: 2,
        });
    }

    /**
     * 显示全局提示信息
     * @param msg
     * @link actions.showMessage
     */
    showGlobalMessage = (msg) => {
        if (_.isEmpty(msg.content)) {
            return;
        }
        if (msg.type === 'success') {
            message.success(msg.content, msg.duration);
        }
        else if (msg.type === 'error') {
            message.error(msg.content, msg.duration);
        }
        else if (msg.type === 'info') {
            message.info(msg.content, msg.duration);
        }
        else if (msg.type === 'warning') {
            message.warning(msg.content, msg.duration);
        }
        else if (msg.type === 'warn') {
            message.warning(msg.content, msg.duration);
        }
        else if (msg.type === 'loading') {
            message.warning(msg.content, msg.duration);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.message != this.props.message) {
            this.showGlobalMessage(this.props.message);
        }
    }

    render() {
        return (
            <div style={{height: '100%', background: '#f2f4f5'}}>
                {React.Children.toArray(this.props.children)}
            </div>
        );
    }
}

const selectorStateToProps = createStructuredSelector({
    message: messageSelector()
});

// Wrap the component to inject dispatch and state into it
export default connect(selectorStateToProps)(App);