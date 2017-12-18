/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 顶部导航
 */
'use strict';
import React from 'react';
import {Layout, Menu, Icon, Popover, Button} from 'antd';
import {Modal, Input} from 'antd';

const {Header} = Layout;
import styles from './index.less';
import moment from 'moment';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {makeSelectRepos, makeSelectLoading, makeSelectError} from '../App/selectors';
import {loadRepos} from '../App/actions';
import {loginOut} from './actions';
import {browserHistory} from 'react-router'
import {modifyFormModalShow} from '../ModifyPasswordModel/actions';

import {Form} from 'antd';
import ModifyPasswordModel from '../ModifyPasswordModel';


export class HeadContainer extends React.Component {
    constructor(props) {

        let pathname = browserHistory.getCurrentLocation().pathname;  //获取当前页面地址
        pathname = pathname.substr(1);

        super(props);
        this.state = {
            current: pathname,
            curTime: new Date().format("yyyy 年 M 月 d 日 hh:mm"),
            modifyPasswordModalVisible: false,       //修改密码弹出框显示状态
            loading: false,
            confirmLoading: false,
            adminMenuVisible: false,
        };
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
        let path = "/" + e.key;
        let curLocation = browserHistory.getCurrentLocation().pathname;  //获取当前页面地址
        if (curLocation != path) {              //防止重复刷新
            browserHistory.push(path);          //跳转页面
            // console.log('切换页面', path);
        }
    }

    componentDidMount() {
        //设置一个计时器，用于更新时间
        setInterval(() => {
            this.setState({
                curTime: new Date().format("yyyy 年 M 月 d 日 hh:mm")
            });
        }, 60000);
    }

    /**
     * 显示/隐藏 管理员菜单
     */
    onAdminMenuVisibleChange = (visible) => {
        this.setState({
            adminMenuVisible: visible
        });
    }

    //region 修改密码
    showModifyPasswordModal = () => {
        this.props.showModifyFormModal('modify');
    }


    //退出
    dropOut = () => {
        //browserHistory.push('/');
        this.props.loginOut();
    }


    render() {

        //管理员按钮菜单
        const admin_menu = (
            <div className={styles.admin_menu}>
                <span onClick={this.showModifyPasswordModal}><Icon type="key"/>修改密码</span>
                <span onClick={this.dropOut}><Icon type="logout"/>退出系统</span>
            </div>
        );
        return (
            <Header>
                <div className={styles.logo}/>
                <div className={styles.admin_panel}>
                    <span className={styles.curDateTime}>{this.state.curTime}</span>
                    <Popover placement="bottomRight" overlayClassName={styles.userPopover} content={admin_menu}
                             visible={this.state.adminMenuVisible}
                             onVisibleChange={this.onAdminMenuVisibleChange}
                             trigger="click">
                        <Button className={styles.userBtn} ghost>您好，<b>管理员</b><Icon type="down"/></Button>
                    </Popover>
                </div>
                <Menu
                    onClick={this.handleClick.bind(this)}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    className={styles.menu}
                >
                    <Menu.Item key="monitoring">
                        <i className="iconfont icon-dongtaijiankong"/>动态监控
                    </Menu.Item>
                    <Menu.Item key="trace">
                        <i className="iconfont icon-guijihuifang"/>轨迹回放
                    </Menu.Item>

                    <Menu.Item key="heat">
                        <i className="iconfont icon-relitu"/>热力图
                    </Menu.Item>

                    <Menu.Item key="area">
                        <i className="iconfont icon-quyushezhi"/>区域设置
                    </Menu.Item>

                    <Menu.Item key="statistical">
                        <i className="iconfont icon-tongjifenxi"/>统计分析
                    </Menu.Item>

                    <Menu.Item key="device">
                        <i className="iconfont icon-shebeiguanli"/>设备管理
                    </Menu.Item>
                    <Menu.Item key="car">
                        <i className="iconfont icon-chelaingguanli"/>车辆管理
                    </Menu.Item>
                </Menu>
                <ModifyPasswordModel
                />
            </Header>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        loginOut: () => dispatch(loginOut()),
        onSubmitForm: (evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            dispatch(loadRepos());
        },
        showModifyFormModal: (operation) => dispatch(modifyFormModalShow(operation)),
    };
}

const mapStateToProps = createStructuredSelector({
    repos: makeSelectRepos(),
    loading: makeSelectLoading(),
    error: makeSelectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeadContainer);