/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 404页面。路径为'/notfound'
 */
'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';

const {Content} = Layout;
import {Input} from 'antd';
import {Select} from 'antd';
import {Row, Col} from 'antd';
import {Table} from 'antd';

const {Column, ColumnGroup} = Table;

import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {makeSelectRepos, makeSelectLoading, makeSelectError} from '../App/selectors';
import {loadRepos} from '../App/actions';
import {changeUsername} from './actions';
import {makeSelectUsername} from './selectors';

export class NotFoundPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        //const {visible, confirmLoading, ModalText} = this.state;
        {/*<Layout className={styles.layout}>
            <Content className={styles.content}>
                asdsdasdasdsdasdasd
            </Content>
        </Layout>*/}
        return (
            <div id='midDiv'>
                <div id='errorSquare'>404</div>
                <div id='errorText'>
                    <h4>抱歉，页面无法访问...</h4>
                    <p>可能原因：网址有错误(请检查地址是否完整或存在多余字符)</p>
                    <p>网址已失效(可能页面已删除,请刷新重试或返回首页)</p>
                    <div id='errorButtons'>
                        <a class="back" href="index.html">返回首页</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(NotFoundPage);