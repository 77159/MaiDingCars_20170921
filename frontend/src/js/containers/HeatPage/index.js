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


import {selectPlaying, selectDatas} from './selectors'
import {updateLoading, requestHeatMapData} from './actions';
//car action
import {queryAllCarBegin,} from '../CarMgrPage/actions';
//car reselect
import {carDataSourceSelector} from '../CarMgrPage/selectors';

//工具类
import _ from 'lodash';
import moment from 'moment';

//sytles
import styles from './index.less';

//自定义组件
import HeatMap from '../../components/HeatMap';
import {
    showErrorMessage,
} from "../App/actions";

const {Sider, Content, Footer} = Layout;
const Option = Select.Option;

export class HeatPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            siderCollapsed: false,
            siderTrigger: null,
            selectedkeys: [],
            checkedKeys: [],
            startValue: null,
            endValue: null,
            endOpen: false,
            isPlay: false,
            isCPlay: false,
            carDtasSource: props.carDtasSource
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

    /**
     * 获取map对象
     * @param map
     */
    getMap = (map) => {
        this.map = map;
    };

    /**
     * 创建左侧菜单
     * @returns {null}
     */
    createMenu = () => {
        const {carDtasSource} = this.state;
        if (!carDtasSource) return null;

        if (this.state.isPlay || this.state.isCPlay) {
            return this.getCarListMenu();
        }

        return carDtasSource.map((item) => {
            return (
                <Menu.Item key={item.id}>
                    <Avatar size="large" src={window.serviceUrl + item.imgurl}/>
                    <div className={styles.content}>
                        <div className={styles.code} style={{margin: '10px 0 0 0'}}>{item.carCode}</div>
                        {/*<div>0 km/h</div>*/}
                    </div>
                    <div className={styles.btnContent}>
                        <Checkbox className={styles.peopleChk}
                                  checked={this.getCarChecked(item.carCode)}
                                  onChange={(e) => {
                                      this.onChangeChecked(e, item.carCode);
                                  }}></Checkbox>
                    </div>
                </Menu.Item>
            )
        })
    };

    /**
     * 获取车辆菜单
     * @returns {null}
     */
    getCarListMenu = () => {
        const {carDtasSource, checkedKeys} = this.state;

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

            return (
                <Menu.Item key={item.carCode}>
                    <Avatar size="large" src={window.serviceUrl + item.imgurl}/>
                    <div className={styles.content}>
                        <div className={styles.code}>{item.carCode}</div>
                        <div>0 km/h</div>
                    </div>
                    <div className={styles.btnContent}>
                        {/*<Button onClick={(e) => {*/}
                        {/*// e.stopPropagation();*/}
                        {/*// this.visibleCarImageMarkerByCarCode(carCode);*/}
                        {/*}}*/}
                        {/*type="primary"*/}
                        {/*// icon={carImageVisible ? 'eye-o' : 'eye'}*/}
                        {/*icon={'eye-o'}*/}
                        {/*title="隐藏/可见"/>*/}
                        {/*<Button style={{color: '#5B5B5B'}} onClick={(e) => {*/}
                        {/*// e.stopPropagation();*/}
                        {/*// this.getCarInfoByCarCode(carCode);*/}
                        {/*// this.positionCarMarker(carCode);*/}
                        {/*}}*/}
                        {/*type="primary"*/}
                        {/*// icon={carImagePosition ? 'environment-o' : 'environment'}*/}
                        {/*icon={'environment-o'}*/}
                        {/*title="定位"/>*/}
                    </div>
                </Menu.Item>
            );
        })
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
            // if (keys.length >= 10) {
            //     this.props.showErrorMessage('最多只能选择10辆车辆');
            //     return;
            // }
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
     * 全部选择
     * allSelect
     */
    allSelect = () => {
        let keys = [];
        if(this.state.carDtasSource) {
            this.state.carDtasSource.map((item) => {
                keys.push(item.carCode);
            });
        }
        this.setState({
            checkedKeys: keys
        });
    };

    /**
     * 全部取消
     * allCancel
     */
    allCancel = () => {
        this.setState({
            checkedKeys: []
        });
    };

    /**
     * 车辆是否勾选状态
     * @param carCode
     * @returns {boolean}
     */
    getCarChecked = (carCode) => {
        return this.state.checkedKeys.indexOf(carCode) >= 0;
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

    /**
     * 选择开始时间
     * @param status
     */
    onStartChange = (status) => {
        const endValue = this.state.endValue;
        const startValue = status.minute(0).second(0);

        //如果结束时间为空或者开始时间大于结束时间，则自动填充最小结束时间
        if (!endValue || endValue.diff(startValue, 'seconds') <= 0) {
            const minEndValue = _.cloneDeep(startValue).add(1, 'h');
            this.setState({
                endValue: minEndValue,
            })
        }
        this.setState({
            startValue: startValue,
        });
    };

    /**
     * 选择结束时间
     * @param status
     */
    onEndChange = (status) => {
        const startValue = _.cloneDeep(this.state.startValue);
        let endValeu = status.minute(0).second(0);

        //选择结束大于开始时间
        if (endValeu.diff(startValue, 'seconds') <= 0) {
            this.props.showErrorMessage('结束时间不能大于开始时间');
            console.log('startValue', startValue.format('YYYY-MM-DD HH'));
            endValeu = startValue.add(1, 'h');
        }

        this.setState({
            endValue: endValeu,
        })
    };

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        //console.log('startValue', startValue.format('YYYY-MM-DD hh'), startValue.valueOf());
        //console.log('endValue', endValue.format('YYYY-MM-DD hh'), endValue.valueOf());
        return endValue.valueOf() <= startValue.valueOf();
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    };

    closeLoading = () => {
        this.props.updateLoading(false);
    };

    startReplay = () => {

        const {checkedKeys} = this.state;
        const {startValue, endValue,} = this.state;
        const {showErrorMessage} = this.props;

        //时间不能为空
        if (!startValue || !endValue) {
            showErrorMessage('请选择开始/结束时间');
            return;
        }

        //时间不能为空
        if (startValue.format('YYYY-MM-DD HH') === endValue.format('YYYY-MM-DD HH')) {
            showErrorMessage('选择时间不能相同');
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

        // 请求热力图数据
        this.props.requestHeatMapData({
            checkedKeys: checkedKeys.join(','),
            startValue: this.state.startValue.format('YYYY-MM-DD HH:00:00'),
            endValue: this.state.endValue.format('YYYY-MM-DD HH:00:00')
        });

        //打开loading
        this.props.updateLoading(true);

        setTimeout(() => {
            //开启播放状态
            this.setState({
                isPlay: true
            })
        }, 500);

        this.refs.isAllCheck.style.display = 'none';

    };

    /**
     * 停止轨迹回放
     */
    stopReplay = () => {
        if (this.state.isPlay) {
            this.setState({
                isPlay: false,
                checkedKeys: [],
                startValue: null,
                endValue: null
            });

            this.map.totalTime = null;
            this.map.secondsSum = 0;

            //this.props.emptyTraceData();
            this.map.emptyPlay();
        } else {
            this.setState({
                isCPlay: false,
                checkedKeys: [],
            })
        }
        this.refs.isAllCheck.style.display = 'block';
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

    /**
     * 获取当前热力图
     */
    getCurrentHeatMap = () => {
        const {checkedKeys} = this.state;
        const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        //是否选择车辆
        if (checkedKeys.length <= 0) {
            this.props.showErrorMessage('请选择车辆');
            return;
        }
        this.setState({
            isCPlay: !this.state.isCPlay,
        });
        this.props.requestHeatMapData({endValue: dateTime, startValue: dateTime, checkedKeys: checkedKeys.join(',')});
        this.refs.isAllCheck.style.display = 'none';
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
                                onClcik={this.onClickItem}>
                                {this.createMenu()}
                            </Menu>
                        </Content>
                        <Footer className={styles.footer}>
                            {/*开始热力图回放*/}
                            {this.state.isPlay || this.state.isCPlay ?
                                <div className={styles.stopPlayback}>
                                    <Button
                                        type="danger"
                                        className={styles.startReplay}
                                        onClick={this.stopReplay}>停止播放</Button>
                                </div>
                                :
                                <div>
                                    <div className={styles.datePanel}>
                                        <div className={styles.dtPickerItem}>开始
                                            <DatePicker
                                                disabledDate={this.disabledStartDate}
                                                showTime={{format: 'HH'}}
                                                format="YYYY-MM-DD HH"
                                                placeholder="开始日期"
                                                className={styles.dtPicker}
                                                value={startValue}
                                                onChange={this.onStartChange}
                                                onOpenChange={this.handleStartOpenChange}
                                            />
                                        </div>
                                        <div className={styles.dtPickerItem}>结束
                                            <DatePicker
                                                disabledDate={this.disabledEndDate}
                                                showTime={{format: 'HH'}}
                                                format="YYYY-MM-DD HH"
                                                placeholder="结束日期"
                                                className={styles.dtPicker}
                                                value={endValue}
                                                open={endOpen}
                                                onChange={this.onEndChange}
                                                onOpenChange={this.handleEndOpenChange}
                                            />
                                        </div>
                                        <div className={styles.dtPickerItem}>
                                            <Button loading={this.props.playing} type="danger"
                                                    className={styles.startReplay}
                                                    onClick={this.startReplay}>
                                                <Icon type="caret-right"/>动态查询
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={styles.stopPlayback}>
                                        <Button type="danger" className={styles.startReplay}
                                                onClick={() => {
                                                    this.getCurrentHeatMap();
                                                }}>
                                            <Icon type="caret-right"/>当前查询
                                        </Button>
                                    </div>
                                </div>
                            }
                            {/*<div className={styles.allChkPanel}>
                                <Button ghost size="small">全部显示</Button>
                                <Button ghost size="small">全部隐藏</Button>
                            </div>
                            停止回访

                            选择回访*/}
                            <div ref='isAllCheck' className={styles.allChkPanel}>
                                <Button ghost size="small" onClick={this.allSelect}>全部选择</Button>
                                <Button ghost size="small" onClick={this.allCancel}>全部取消</Button>
                            </div>
                        </Footer>
                    </Layout>
                </Sider>
                <Content className={styles.content}>
                    <HeatMap
                        isPlay={this.state.isPlay}
                        startValue={this.state.startValue}
                        endValue={this.state.endValue}
                        closeLoading={this.closeLoading}
                        datas={this.props.datas}
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
        updateLoading: (palying) => dispatch(updateLoading(palying)),
        requestHeatMapData: (param) => dispatch(requestHeatMapData(param))
    };
}

const mapStateToProps = createStructuredSelector({
    carDtasSource: carDataSourceSelector(),
    playing: selectPlaying(),
    datas: selectDatas(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HeatPage);