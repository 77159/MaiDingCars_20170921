/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 轨迹回放页面。路径为'/trace'
 */
'use strict';
import React from 'react';

//antd
import {Layout, Menu, Icon} from 'antd';
import {Input} from 'antd';
import {Select} from 'antd';
import {Avatar} from 'antd';
import {Checkbox} from 'antd';
import {Button} from 'antd';
import {DatePicker} from 'antd';

//react-redux
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';

//action
import {changeTraceReplay, emptyTraceData} from './actions';
//selectors
import {SelectorTraceDataSource} from './selectors';

//car action
import {queryAllCarBegin} from '../CarMgrPage/actions';
//car reselect
import {carDataSourceSelector} from '../CarMgrPage/selectors';
//carCategory cation
import {carFormModalOpBegin} from '../CategoryFormModel/actions';
//caCategory reselect
import {carCategory} from '../CategoryFormModel/selectors'

//工具类
import _ from 'lodash';
import moment from 'moment';

//sytles
import styles from './index.less';

//自定义组件
import TraceReplayMap from '../../components/TraceReplayMap';
import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

const {Sider, Content, Footer} = Layout;
const Option = Select.Option;

export class TraceReplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            siderCollapsed: false,
            siderTrigger: null,
            selectedkeys: [],
            checkedKeys: [],
            startValue: null,
            //startValue: moment('2017-11-16 11:29:15'),
            endValue: null,
            //endValue: moment('2017-11-16 12:00:00'),
            endOpen: false,
            isPlay: false,
            markerVisible: true,
            positionMarker: '',
            carDtasSource: props.carDtasSource,
            carImageVisible: [],
        };
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            carDtasSource: nextProps.carDtasSource
        })
    }

    componentWillMount() {
        //车辆列表
        this.props.queryAllCarBegin();
    }

    onCollapse = () => {
        const {fmMap} = this.map;
        this.setState({siderCollapsed: !this.state.siderCollapsed});
        if (this.state.siderCollapsed) {  //收起状态
            this.setState({
                siderTrigger: null
            });
            //修改指南针位置
            fmMap.options.compassOffset = [276, 20];
            fmMap.updateSize();
        } else {
            this.setState({
                siderTrigger: undefined
            });
            //修改指南针位置
            fmMap.options.compassOffset = [20, 20];
            fmMap.updateSize();
        }
    };

    getMap = (map) => {
        this.map = map;
    };

    /**
     * 创建菜单
     */
    createMenu = () => {
        const {carDtasSource} = this.state;
        if (!carDtasSource) return null;

        if (this.state.isPlay) {
            return this.getCarListMenu();
        }

        //列表排序
        let carData = carDtasSource;
        carData.sort((a, b) => {
            const m = a.carCode;
            const n = b.carCode;
            return (m < n ? -1 : (m === n ? 0 : 1))
        });

        return carData.map((item) => {
            return (
                <Menu.Item key={item.id}>
                    <Avatar size="large" src={window.serviceUrl + item.imgurl}/>
                    <div className={styles.content}>
                        <div className={styles.code} style={{margin: '10px 0 0 0'}}>{item.carCode}</div>
                        {/*<div>0 km/h</div>*/}
                    </div>
                    <div className={styles.btnContent}>
                        <Checkbox className={styles.peopleChk}
                                  onChange={(e) => {
                                      this.onChangeChecked(e, item.carCode);
                                  }}></Checkbox>
                    </div>
                </Menu.Item>
            )
        })
    };

    /**
     * 根据车辆编号获取当前车辆在地图上是显示(true)/隐藏(false)状态
     * @carCode 车辆编号
     */
    getVisibleCarImageMarkerStatus = (carCode) => {
        if (!this.map.fmMap) return;
        const {carMarkerLayer} = this.map.fmMap;
        if (!carMarkerLayer) return;
        //如果当前carMarkerLayer是隐藏状态，则所有车辆隐藏，反之则根据当前imageMarker的visible返回当前显示/隐藏状态
        if (carMarkerLayer.visible) {
            return this.getVisibleCarStatus(carCode);
        } else {
            return false;
        }
    };

    /**
     * 获取车辆菜单
     * @returns {null}
     */
    getCarListMenu = () => {
        const {checkedKeys, carDtasSource} = this.state;
        
        if (!carDtasSource) return null;

        return checkedKeys.map((key) => {
            let item = null;
            let flag = false;
            for (let i = 0; i < carDtasSource.length; i++) {
                item = carDtasSource[i];
                if (item.carCode === key) {
                    flag = true;
                    break;
                }
            }

            if (!item) return;

            const carCode = item.carCode;
            const carImageVisible = this.state.carImageVisible;
            const carImagePosition = this.state.positionMarker === carCode ? true : false;

            return (
                <Menu.Item key={item.carCode}>
                    <Avatar size="large" src={window.serviceUrl + item.imgurl}/>
                    <div className={styles.content}>
                        <div className={styles.code}>{item.carCode}</div>
                        <div>0 km/h</div>
                    </div>
                    <div className={styles.btnContent}>
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            this.visibleCarImageMarkerByCarCode(carCode);
                            this.setState({
                                positionCode: ''
                            })
                        }}
                                type="primary"
                                icon={carImageVisible.length > 0 && carImageVisible.indexOf(carCode) >= 0 ? 'eye-o' : 'eye'}
                            //icon={'eye-o'}
                                title="隐藏/可见"/>
                        <Button style={{color: '#5B5B5B'}} onClick={(e) => {
                            e.stopPropagation();
                            //this.getCarInfoByCarCode(carCode);
                            this.positionCarMarker(carCode);
                            this.showVisibleCarImageMarkerByCarCode(carCode, true);
                        }}
                                type="primary"
                                icon={carImagePosition ? 'environment-o' : 'environment'}
                            // icon={'environment-o'}
                                title="定位"/>
                    </div>
                </Menu.Item>
            );
        })
    };

    /**
     * 定位marker
     * @param carCode
     */
    positionCarMarker = (carCode) => {
        const {positionMarker} = this.state;
        let positionCode = '';
        if (positionMarker === carCode) {
            positionCode = '';
        } else {
            positionCode = carCode;
        }
        this.map.positionCarCode = positionCode;
        this.setState({
            positionMarker: positionCode
        });
    };

    showVisibleCarImageMarkerByCarCode = (carCode, visible) => {
        const {visibleNaviLineMarkers, carMarkers} = this.map;
        if (!carMarkers) return;
        const marker = carMarkers[carCode];
        if (!marker) return;
        if (!marker.visible) {
            visibleNaviLineMarkers(carCode, visible);
            marker.visible = visible;
            this.updateCarImageVisible(visible, carCode);
        }
    };

    /**
     * 根据车辆编号显示/隐藏地图marker
     * @param carCode
     */
    visibleCarImageMarkerByCarCode = (carCode) => {
        const {visibleNaviLineMarkers, carMarkers} = this.map;
        if (!carMarkers) return;
        const marker = carMarkers[carCode];
        if (!marker) return;
        visibleNaviLineMarkers(carCode, !marker.visible);
        marker.visible = !marker.visible;
        this.updateCarImageVisible(marker.visible, carCode);
    };

    /**
     * 更新车辆在线/上线状态
     * @param visible
     * @param carCode
     */
    updateCarImageVisible = (visible, carCode) => {
        if (visible) {
            this.state.carImageVisible.push(carCode);
            this.setState({
                carImageVisible: this.state.carImageVisible
            })
        } else {
            const index = this.state.carImageVisible.indexOf(carCode);
            if (index < 0) return;
            let carVisibleArr = _.cloneDeep(this.state.carImageVisible);
            carVisibleArr.splice(index, 1);
            this.setState({
                carImageVisible: carVisibleArr
            })
        }
    };

    /**
     * 添加显示车辆carCode
     * @param carCode
     */
    addCarImageVisible = (carCode) => {
        const carImageVisible = this.state.carImageVisible;
        if (carImageVisible.indexOf(carCode) < 0) {
            this.state.carImageVisible.push(carCode);
            this.setState({
                carImageVisible: this.state.carImageVisible,
            })
        }
    };

    /**
     * 当前勾选事件
     * @param e 事件
     * @param key 当前选择的key
     */
    onChangeChecked = (e, key) => {
        e.stopPropagation();
        let keys = this.state.checkedKeys;
        if (e.target.checked) {
            if (keys.length >= 10) {
                this.props.showErrorMessage('最多只能选择10辆车辆');
                return;
            }
            keys.push(key);
        } else {
            keys = keys.filter((code) => {
                return code != key;
            });
        }
        this.setState({
            checkedKeys: keys
        });
    };

    /**
     * 选择当前Item事件
     * @param obj 当前点击返回的对象
     */
    onClickItem = (obj) => {
        const {key} = obj;
        this.setState({
            selectedkeys: [key]
        });
    };

    onStartChange = (status) => {
        this.setState({
            startValue: status,
        })
    };

    onEndChange = (status) => {
        this.setState({
            endValue: status,
        })
    };

    disabledStartDate = (endValue) => {
        // const endValue = this.state.endValue;
        // if (!startValue || !endValue) {
        //     return false;
        // }
        return endValue && endValue.valueOf() >= Date.now();
    };

    disabledEndDate = (endValue) => {
        // const startValue = this.state.startValue;
        // if (!endValue || !startValue) {
        //     return false;
        // }
        return endValue && endValue.valueOf() >= Date.now();
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    };

    /**
     * 开始轨迹回放
     */
    startReplay = () => {
        const {checkedKeys} = this.state;
        const {startValue, endValue,} = this.state;
        const {showErrorMessage} = this.props;

        //时间不能为空
        if (!startValue || !endValue) {
            showErrorMessage('请选择开始/结束时间');
            return;
        }

        //最多不能超过1天的数据
        const ss = _.cloneDeep(startValue);
        let maxEndDate = ss.add(1, 'd');
        if (endValue > maxEndDate) {
            this.onEndChange(maxEndDate);
            showErrorMessage('最多只能选择一天的轨迹回放数据');
            return;
        }

        //是否选择车辆
        if (checkedKeys.length <= 0) {
            showErrorMessage('请选择车辆');
            return;
        }

        //请求路劲回放数据
        this.props.changeTraceReplay([checkedKeys.join(','), startValue.format('YYYY-MM-DD HH:mm:ss'), endValue.format('YYYY-MM-DD HH:mm:ss')]);

        //开启播放状态
        this.setState({
            isPlay: true
        })
    };

    /**
     * 停止轨迹回放
     */
    stopReplay = () => {
        this.setState({
            isPlay: false,
            checkedKeys: [],
            startValue: null,
            endValue: null
        });

        this.map.totalTime = null;
        this.map.secondsSum = 0;
        this.props.emptyTraceData();
        this.map.emptyPlay();
    };

    /**
     * 显示/隐藏地图上所有的marker
     * @param visible 显示/隐藏 true/false
     */
    visibleMarker = (visible) => {
        const {carMarkers, visibleNaviLineMarkers} = this.map;
        let carCodes = [];
        for (let key in carMarkers) {
            carCodes.push(key);
            carMarkers[key].visible = visible;
            visibleNaviLineMarkers(key, visible);
        }


        if (visible) {
            this.setState({
                carImageVisible: carCodes
            })
        } else {
            this.setState({
                carImageVisible: []
            })
        }
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
                const carDtasSource = this.getCarListBykeyword(value);
                this.setState({
                    carDtasSource: carDtasSource,
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
        const carDtasSource = this.props.carDtasSource;
        const {isPlay, checkedKeys} = this.state;
        const keys = checkedKeys.map((key) => {
            return key.toLocaleLowerCase()
        });
        let list = [];
        if (keyword) {
            keyword = keyword.toLocaleLowerCase();
            list = carDtasSource.filter((item) => {
                const carCode = item.carCode.toLocaleLowerCase();
                if (isPlay) {
                    return carCode.indexOf(keyword) >= 0 && keys.indexOf(carCode) >= 0;
                } else {
                    return carCode.indexOf(keyword) >= 0;
                }
            });
        } else {
            list = carDtasSource;
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
        const {startValue, endValue, endOpen} = this.state;

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
                            background: '#45484a',
                            lineHeight: '38px',
                            color: '#fff',
                            padding: '0 10px'
                        }}>
                            车辆列表
                            <span className={styles.left_arrow} title="收起窗口" onClick={this.onCollapse.bind(this)}><Icon
                                type="left"/></span>
                        </div>
                        <Content>
                            <div style={{padding: '10px 13px'}}>
                                <div style={{width: '100%', background: '#F6F5FC'}}>
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
                                </div>
                            </div>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={this.state.selectedkeys}
                                className={styles.menu}
                                positionCarMarker={this.state.positionCarMarker}
                                onClcik={this.onClickItem}>
                                {this.createMenu()}
                            </Menu>
                        </Content>
                        <Footer className={styles.footer}>
                            {/*开始轨迹回放*/}
                            {this.state.isPlay ?
                                <div>
                                    <div className={styles.stopPlayback}>
                                        <Button
                                            type="danger"
                                            className={styles.startReplay}
                                            onClick={this.stopReplay}>停止播放</Button>
                                    </div>
                                    <div className={styles.allChkPanel}>
                                        <Button ghost size="small" onClick={() => {
                                            this.visibleMarker(true);
                                        }}>全部显示</Button>
                                        <Button ghost size="small" onClick={() => {
                                            this.visibleMarker(false);
                                        }}>全部隐藏</Button>
                                    </div>
                                </div>
                                :
                                <div className={styles.datePanel}>
                                    <div className={styles.dtPickerItem}>开始
                                        <DatePicker
                                            disabledDate={this.disabledStartDate}
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="开始日期"
                                            className={styles.dtPicker}
                                            value={startValue}
                                            onChange={this.onStartChange}
                                            onOpenChange={this.handleStartOpenChange}
                                            onKeyDown={() => {
                                            }}
                                        />
                                    </div>
                                    <div className={styles.dtPickerItem}>结束
                                        <DatePicker
                                            disabledDate={this.disabledEndDate}
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="结束日期"
                                            className={styles.dtPicker}
                                            value={endValue}
                                            open={endOpen}
                                            onChange={this.onEndChange}
                                            onOpenChange={this.handleEndOpenChange}
                                        />
                                    </div>
                                    <div className={styles.dtPickerItem}>
                                        <Button type="danger" className={styles.startReplay} onClick={this.startReplay}>
                                            <Icon type="caret-right"/>开始轨迹回放
                                        </Button>
                                    </div>
                                </div>
                            }
                        </Footer>
                    </Layout>
                </Sider>
                <Content className={styles.content}>
                    <TraceReplayMap
                        isPlay={this.state.isPlay}
                        startValue={this.state.startValue}
                        endValue={this.state.endValue}
                        addCarImageVisible={this.addCarImageVisible}
                        traceDataSource={this.props.traceDataSource}
                        positionMarker={this.state.positionMarker}
                        getMap={this.getMap}/>
                    {/* <div id="fengMap" className="fengMap" style={this.state.containerStyle}></div>*/}

                </Content>
            </Layout>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        queryAllCarBegin: () => dispatch(queryAllCarBegin()),
        showErrorMessage: (msg) => dispatch(showErrorMessage(msg)),
        changeTraceReplay: (traceReplayMsg) => dispatch(changeTraceReplay(traceReplayMsg)),
        emptyTraceData: () => dispatch(emptyTraceData()),

    };
}

const mapStateToProps = createStructuredSelector({
    carDtasSource: carDataSourceSelector(),
    traceDataSource: SelectorTraceDataSource(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TraceReplayPage);