/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 实时监控页面，系统默认页面。路径为'/'
 */

'use strict';
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Input} from 'antd';
import {Avatar} from 'antd';
import {Card} from 'antd';
import {Badge} from 'antd';
import {notification} from 'antd';
import {AutoComplete} from 'antd';
import {Modal} from 'antd';
import {Popconfirm} from 'antd';
import {Row, Col, Select} from 'antd';
import {Form} from 'antd';
import {Table} from 'antd';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {DatePicker} from 'antd';
import {Tabs} from 'antd';
import moment from 'moment';

import {realTimeLocationsSelector} from "../MainContainer/selectors";
//action car
import {queryAllCarBegin} from '../CarMgrPage/actions';
//selectors car
import {carListSelector, carDataSourceSelector} from '../CarMgrPage/selectors';
//action area
import {queryAreaListBegin} from '../AreaSettingPage/actions';
//action category
import {getCarCategory} from '../CategoryFormModel/actions';
//selectors category
import {carCategorySourceSelector} from '../CategoryFormModel/selectors';
//selectors areaList
import {SelectorAreaList} from '../AreaSettingPage/selectors';
//action main
import {
    updateMessageShow,
    updateUnReadMessage,
    deleteAlarmMessageByKeys
} from '../MainContainer/actions';
//selectors main
import {alertMessageDataSelector, alarmDatasSelector, SelectorOnLineDevice} from '../MainContainer/selectors';

import styles from './index.less';

//自定义组件
import MonitoringMap from '../../components/MonitoringMap';
import AlarmTable from '../../components/AlarmTable';

const Option = Select.Option;
const {Sider, Content, Footer} = Layout;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;


export class MonitoringPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siderCollapsed: false,
            siderTrigger: null,
            carList: props.carList,
            positionCarCode: '',
            carInfo: null,           //车辆详细信息
            cardVisible: 'hidden',
            carInfoWinClassName: styles.carCard,
            carCardHidden: true,
            alarmModalVisible: false,
            carStatus: 'all',
        };

        //定义全局map变量
        this.fmMap = null;
        this.notificationKeys = []; //当前提示框
    };

    componentWillMount() {
        //查询所有车辆
        this.props.queryAllCarBegin();
        //查询车辆类型
        this.props.getCarCategory();
        //查询区域列表
        this.props.queryAreaListBegin();
    };

    componentDidUpdate() {
        this.showNotification();
    };

    componentWillReceiveProps(nextProps) {
        if (_.eq(this.props.carList, nextProps.carList) == false) {
            this.setState({
                carList: nextProps.carList
            });
        }

        if (_.eq(this.onLineDevice, nextProps.onLineDevice) == false) {
            this.onLineDevice = nextProps.onLineDevice;
            this.state.carList.map((car) => {
                if (!this.onLineDevice) return;
                car.onLine = false;
                this.onLineDevice.map((device) => {
                    if (device.deviceCode === car.deviceCode) {
                        car.onLine = true;
                    }
                });
            });

            this.setState({
                carList: nextProps.carList
            });
        }
    };

    /**
     * 显示警报信息
     */
    showNotification = () => {
        const alarmDatas = this.props.alarmDatas;

        alarmDatas.map((item) => {
            if (item.isShow && this.notificationKeys.length < 3) {
                const key = item.key;
                notification['error']({
                    key: key,
                    message: `警告：【${item.carCode}】${item.remark}`,
                    duration: 3,
                    onClose: () => {
                        //如果当前所在重点区域的消息框关闭，此次重点区域中移动不再弹出信息框，直到下次再次进入重点区域再弹出信息框；
                        const index = this.notificationKeys.indexOf(key);
                        this.notificationKeys.splice(index, 1);
                    },
                    icon: <Icon type="close-circle" style={{color: '#ff0000', fontSize: 18}}/>,
                    style: {
                        width: 'auto',
                        height: 38,
                        padding: 7,
                    }
                });
                this.props.updateMessageShow(key);
                this.notificationKeys.push(key);
            }
        });
    };


    /**
     * 当人员面板展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
     * @param collapsed 当前状态（【true】收起 【false】展开）
     * @param type 触发类型
     */
    onCollapse = (collapsed, type) => {
        this.setState({siderCollapsed: !this.state.siderCollapsed});
        if (this.state.siderCollapsed) {  //收起状态
            //展开
            this.setState({
                siderTrigger: null
            });
            //修改指南针位置
            this.fmMap.options.compassOffset = [276, 20];
            this.fmMap.updateSize();
        } else {
            //收缩
            this.setState({
                siderTrigger: undefined
            });
            //修改指南针位置
            this.fmMap.options.compassOffset = [20, 20];
            this.fmMap.updateSize();
        }
    };

    getCarImage = () => {
        const {carCategory} = this.props;
    };


    /**
     * 获取左侧菜单
     */
    getMenu = () => {
        const carList = this.state.carList;
        this.onLineCount = 0;   //在线人数

        //检查在线人数
        // carList.map((car) => {
        //     if (!this.onLineDevice) return;
        //     this.onLineDevice.map((device) => {
        //         if (device.deviceCode === car.deviceCode) {
        //             car.onLine = true;
        //             this.onLineCount++;
        //         }
        //     });
        // });

        //根据在线排序
        carList.sort((a, b) => {
            const x = a.onLine ? 1 : 0;
            const y = b.onLine ? 1 : 0;

            if (x > y) {
                return -1;
            }
            if (x < y) {
                return 1;
            }
            if (x === y) {
                return 0;
            }
        });

        //const {onLineDevice} = this.props;

        //菜单列表
        let menuList = [];

        for (let i = 0; i < carList.length; i++) {
            const car = carList[i];
            const carCode = car.carCode;

            //定位当前车辆
            const carImagePosition = this.state.positionCarCode === carCode ? true : false;
            //当前车辆在地图上显示(true)/隐藏(false)状态
            const carImageVisible = this.getVisibleCarImageMarkerStatus(carCode);

            // if (onLineDevice) {
            //     for (let i = 0; i < onLineDevice.length; i++) {
            //         if (onLineDevice[i].carCode === carCode) {
            //             car.onLine = false;
            //             break;
            //         }
            //     }
            // }

            if (carImageVisible === true && car.onLine === false) {
                //TODO 等待测试
                console.log('车辆下线，删除车辆');
            }

            if (car.onLine) {
                this.onLineCount++;
            }

            if (this.state.carStatus === 'online' && !car.onLine) {
                continue;
            } else if (this.state.carStatus === 'offline' && car.onLine) {
                continue;
            }

            menuList.push(
                <Menu.Item key={carCode} disabled={!carImageVisible}>
                    <Avatar size="large" src={window.serviceUrl + car.imgurl}/>
                    <div className={styles.content}>
                        <div className={styles.code}>{car.carCode}</div>
                        <div>{car.speed ? Math.ceil(car.speed) : 0} km/h</div>
                    </div>
                    <div className={styles.btnContent}>
                        <Button disabled={!car.onLine} onClick={(e) => {
                            e.stopPropagation();
                            this.visibleCarImageMarkerByCarCode(carCode);
                        }}
                                type="primary"
                                icon={carImageVisible ? 'eye-o' : 'eye'}
                                title="隐藏/可见"/>
                        <Button disabled={!car.onLine} onClick={(e) => {
                            e.stopPropagation();
                            this.getCarInfoByCarCode(carCode);
                            this.positionCarMarker(carCode);
                        }}
                                type="primary"
                                icon={carImagePosition ? 'environment' : 'environment-o'}
                                title="定位"/>
                    </div>
                </Menu.Item>
            )
        }
        return menuList;
    };


    /**
     * 显示/隐藏 人员信息窗口
     */
    onCloseCarInfoWindow = () => {
        //当前车辆详细信息对象不为空，并车辆详细信息卡隐藏，则显示信息卡片
        if (this.state.cardVisible === 'hidden') {
            this.setState({
                cardVisible: 'visible'
            })
        }
        if (this.state.carCardHidden) {
            //显示人员信息窗口
            this.setState({
                carInfoWinClassName: "animated fadeInUp " + styles.carCard,
                carCardHidden: false
            });
        } else {
            //隐藏窗口
            this.setState({
                carInfoWinClassName: "animated fadeOutDown " + styles.carCard,
                carCardHidden: true
            });
        }
    };

    /**
     * 获取fengmap对象
     * @fmMap fengmap对象
     */
    getMap = (fmMap) => {
        this.fmMap = fmMap;
    };

    /**
     * 显示/隐藏所有carImageMarker
     * @visible 显示/隐藏
     */
    visibleAllCarImageMarker = (visible) => {
        if (!this.fmMap) return;
        const {carMarkerLayer} = this.fmMap;
        if (!carMarkerLayer) return;
        const markers = carMarkerLayer.markers;
        markers.map((item) => {
            if (item.visible !== visible) {
                item.visible = visible;
            }
        });
    };

    /**
     * 根据车辆编号显示/隐藏车辆在地图上的显示
     * @carCode 车辆编号
     */
    visibleCarImageMarkerByCarCode = (carCode) => {
        if (!carCode) return;
        if (!this.fmMap) return;
        const {carImageMarkers} = this.fmMap;
        if (!carImageMarkers) return;
        const carImageMarker = carImageMarkers[carCode];
        if (!carImageMarker) return;
        carImageMarker.visible = !carImageMarker.visible;
    };

    /**
     * 根据车辆编号获取当前carImageMarker是显示(true)/隐藏(false)状态(visible)
     * @carCode 车辆编号
     */
    getVisibleCarStatus = (carCode) => {
        if (!carCode) return;
        if (!this.fmMap || !this.fmMap.carImageMarkers) return;
        const carImageMarker = this.fmMap.carImageMarkers[carCode];
        if (!carImageMarker) return;
        return carImageMarker.visible;
    };

    /**
     * 根据车辆编号获取当前车辆在地图上是显示(true)/隐藏(false)状态
     * @carCode 车辆编号
     */
    getVisibleCarImageMarkerStatus = (carCode) => {
        if (!this.fmMap) return;
        const {carMarkerLayer} = this.fmMap;
        if (!carMarkerLayer) return;
        //如果当前carMarkerLayer是隐藏状态，则所有车辆隐藏，反之则根据当前imageMarker的visible返回当前显示/隐藏状态
        if (carMarkerLayer.visible) {
            return this.getVisibleCarStatus(carCode);
        } else {
            return false;
        }
    };

    /**
     * 定位当前车辆，根据车辆编号，将当前编号的车辆移至到当前地图视野中心，并始终跟随移动
     * @carCode 车辆编号
     */
    positionCarMarker = (carCode) => {
        //当前没有定位的车辆，则直接定位该车辆；
        //当前有定位车辆，如果当前车辆编号与该车辆编号相同，则取消当前定位车辆
        //当前有定位车辆，如果当前车辆编号与该车辆不相同，则直接更换该车辆定位编号

        const statePositionCarCode = this.state.positionCarCode;
        let positionCarCode = '';

        if (carCode && statePositionCarCode !== carCode) {
            positionCarCode = carCode;
        } else if (!carCode) {
            positionCarCode = carCode;
        }
        this.setState({
            positionCarCode: positionCarCode
        })
    };

    /**
     * 根据车辆编号获取当前车辆详细信息
     * @carCode 车辆编号
     */
    getCarInfoByCarCode = (carCode) => {
        if (!carCode) return;
        const {carList} = this.props;
        if (!carList) return;
        const carInfos = carList.filter((item) => {
            return item.carCode === carCode;
        });

        let carInfo = null;
        if (carInfos.length > 0) {
            carInfo = carInfos[0];
        }

        //如果当前卡片关闭状态则显示
        //如果当前卡片展开状态，并且当前carCode与点击的carCode相同则关闭，反正则只更新数据不进行关闭
        //关闭
        if (this.state.carCardHidden) {
            this.onCloseCarInfoWindow();
        } else if (!this.state.carCardHidden && this.state.carInfo.carCode === carCode) {
            this.onCloseCarInfoWindow();
        }

        this.setState({
            carInfo: carInfo,
        });
    };

    /**
     * 获取信息卡的详细信息
     */
    getCarInfoByCard = () => {
        let cardInfo = {
            carCode: '',
            mileage: '',
            electric: '',
            status: '',
            area: '',
            carType: '',
        };
        const carInfo = this.state.carInfo;
        if (!carInfo) return cardInfo;
        cardInfo.carCode = carInfo.carCode;
        cardInfo.carType = carInfo.carType ? this.getCarTypeById(carInfo.carType) : '';
        return cardInfo;
    };

    /**
     * 根据车辆类型id获取车辆类型对象
     * @id 车辆类型id
     */
    getCarTypeById = (id) => {
        if (!id) return '';
        let carType = '';
        const carCategory = this.props.carCategory;
        if (carCategory && carCategory.length > 0) {
            const cType = carCategory.filter((item) => {
                return item.id === id;
            });

            if (cType && cType.length > 0) {
                carType = cType[0].typeName;
            }
        }
        return carType;
    };

    /**
     * 显示报警信息列表
     */
    onShowAlarmModal = () => {
        this.setState({
            alarmModalVisible: !this.state.alarmModalVisible,
        });
    };

    /**
     * 选择当前速度报警信息列表
     * @param keys
     */
    setSelectedRowKeys = (keys, type) => {
        let selectedkeys = {};
        selectedkeys[type] = keys;

        this.setState(selectedkeys);
    };

    /**
     * 更新报警信息已读
     */
    updateUnReadMessage = (selectedRowKeys) => {
        this.props.updateUnReadMessage(selectedRowKeys);
    };

    /**
     * 批量删除报警信息
     */
    deleteAlarmMessageByKeys = (speedSelectedRowKeys) => {
        this.props.deleteAlarmMessageByKeys(speedSelectedRowKeys);
    };

    /**
     * 当前显示车辆列表的状态
     * @param value 车辆状态
     */
    onChangeHandleCarStatus = (value) => {
        this.setState({
            carStatus: value,
        });
    };

    /**
     * 信息搜索（模糊搜索，根据车辆编号）
     * @parm e 事件对象
     */
    onSearchKeyword = (e) => {
        e.persist();
        const value = e.target.value;
        this.timeStamp = e.timeStamp;

        this.setState({
            userName: value
        });

        setTimeout(() => {
            if (this.timeStamp === e.timeStamp) {
                const carList = this.getCarListBykeyword(value);
                this.setState({
                    carList: carList,
                })
            }
        }, 500);
    };

    /**
     * 模糊查询车辆列表
     * @param keyword
     * @returns {Array}
     */
    getCarListBykeyword = (keyword) => {
        const carList = this.props.carList;
        let list = [];
        if (keyword) {
            list = carList.filter((item) => {
                if (this.state.carStatus === 'all') {
                    return item.carCode.indexOf(keyword) >= 0;
                } else if (this.state.carStatus === 'online' && !item.onLine) {
                    return item.carCode.indexOf(keyword) >= 0;
                } else if (this.state.carStatus === 'online' && item.onLine) {
                    return item.carCode.indexOf(keyword) >= 0;
                }
            });
        } else {
            list = carList;
        }
        return list;
    };

    /**
     * 清空搜索框
     */
    emitEmpty = () => {
        this.userNameInput.focus();
        this.userNameInput.refs.input.value = '';
        this.setState({
            carDtasSource: this.props.carDtasSource,
        })
    };

    render() {
        const {userName} = this.state;
        const suffix = userName ?
            <Icon type="close-circle" style={{color: '#5B5B5B'}} onClick={this.emitEmpty}/> : null;

        //车辆菜单
        const menu = this.getMenu();

        //获取当前车辆详细信息
        const {carCode, mileage, electric, status, area, carType} = this.getCarInfoByCard();

        const {alertMessageData, carList} = this.props;

        //获取未读信息集合
        const unReadMessage = alertMessageData.filter((item) => {
            return item.isRead === true;
        });

        return (
            <Layout className={styles.layout}>
                <Sider width={256} className={styles.sider} collapsible={true}
                       collapsed={this.state.siderCollapsed}
                       onCollapse={this.onCollapse}
                       trigger={this.state.siderTrigger}
                       collapsedWidth={0}>
                    <Layout style={{height: '100%'}}>
                        <div style={{
                            height: '38px',
                            background: '#45484A',
                            lineHeight: '38px',
                            color: '#fff',
                            padding: '0 10px'
                        }}>车辆信息&nbsp;&nbsp;&nbsp;{this.onLineCount}
                            / {this.props.carList ? this.props.carList.length : 0}
                            <span className={styles.left_arrow} title="收起窗口" onClick={this.onCollapse.bind(this)}>
                                <Icon type="left"/>
                            </span>
                        </div>
                        <Content>
                            <div className={styles.headContainer}>
                                <Input
                                    placeholder="请输入编号筛选"
                                    prefix={<Icon type="search"/>}
                                    suffix={suffix}
                                    //value={userName}
                                    onInput={this.onSearchKeyword}
                                    className={styles.searchInput}
                                    ref={(ref) => {
                                        this.userNameInput = ref;
                                    }}
                                />
                                <Select className={styles.selectDrop} value={this.state.carStatus} size="large"
                                        onChange={
                                            this.onChangeHandleCarStatus
                                        }>
                                    <Option value="all">显示全部</Option>
                                    <Option value="online">在线状态</Option>
                                    <Option value="offline">离线状态</Option>
                                </Select>
                            </div>
                            {/*菜单*/}
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[this.state.carInfo ? this.state.carInfo.carCode : '']}
                                className={styles.menu}
                                onClick={(record) => {
                                    const {item, key, keyPath} = record;
                                    this.getCarInfoByCarCode(key);
                                }}>
                                {menu}
                            </Menu>
                        </Content>
                        {/*尾部功能区域*/}
                        <Footer className={styles.footer}>
                            <Button ghost size="small" icon="eye" onClick={() => {
                                this.visibleAllCarImageMarker(true);
                            }}>全部可见</Button>
                            <Button ghost size="small" icon="eye-o" onClick={() => {
                                this.visibleAllCarImageMarker(false)
                            }}>全部隐藏</Button>
                        </Footer>
                    </Layout>
                </Sider>
                <Content className={styles.content}>
                    {/*显示地图*/}
                    <MonitoringMap
                        realTimeLocations={this.props.realTimeLocations}
                        getMap={this.getMap}
                        positionCarCode={this.state.positionCarCode}/>
                    {/*报警信息*/}
                    <div className={styles.mapActions}>
                        <span className={styles.mapActionBtn} onClick={this.onShowAlarmModal} title="今日报警">
                            <Badge count={unReadMessage.size}><img src="./img/fm_controls/alarm.png"></img></Badge>
                        </span>
                    </div>
                    {/*车辆信息*/}
                    <Card style={{visibility: this.state.cardVisible}} noHovering={true} bordered={false}
                          className={this.state.carInfoWinClassName} title={
                        <span><Icon type="solution"/>车辆编号： {carCode}</span>}
                          extra={<span className={styles.carClose} title="关闭"
                                       onClick={() => {
                                           this.getCarInfoByCarCode(carCode);
                                       }}><Icon type="close"/></span>}>
                        <div className={styles.rightCarContent}>
                            <span>车辆类型：{carType}</span>
                            <span>设备编号：{carCode}</span>
                            <span>行驶里程：{mileage}</span>
                            <span>设备电量：{electric}</span>
                            <span>车辆状态：{status}</span>
                            <span>当前位置：{area}</span>
                        </div>
                    </Card>
                    {/*报警信息列表*/}
                    <AlarmTable
                        visible={this.state.alarmModalVisible}
                        onShowAlarmModal={this.onShowAlarmModal}
                        alertMessageData={alertMessageData}
                        areaList={this.props.areaList}
                        updateUnReadMessage={this.updateUnReadMessage}
                        deleteAlarmMessageByKeys={this.deleteAlarmMessageByKeys}
                    />
                </Content>
            </Layout>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        queryAllCarBegin: () => dispatch(queryAllCarBegin()),
        getCarCategory: () => dispatch(getCarCategory()),
        queryAreaListBegin: () => dispatch(queryAreaListBegin()),
        updateMessageShow: (key) => dispatch(updateMessageShow(key)),
        updateUnReadMessage: (ids) => dispatch(updateUnReadMessage(ids)),
        deleteAlarmMessageByKeys: (keys) => dispatch(deleteAlarmMessageByKeys(keys)),
    };
}

const selectorStateToProps = createStructuredSelector({
    realTimeLocations: realTimeLocationsSelector(),
    carCategory: carCategorySourceSelector(),
    carList: carListSelector(),
    alarmDatas: alarmDatasSelector(),
    alertMessageData: alertMessageDataSelector(),
    areaList: SelectorAreaList(),
    onLineDevice: SelectorOnLineDevice(),
    carDataSource: carDataSourceSelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(MonitoringPage);