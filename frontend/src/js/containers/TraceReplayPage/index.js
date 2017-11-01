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
import {Layout, Menu, Icon} from 'antd';
import {Button} from 'antd';
import {Checkbox} from 'antd';
import {DatePicker} from 'antd';
import {Slider} from 'antd';

const {Sider, Content, Footer} = Layout;
import {Input} from 'antd';
import {Avatar} from 'antd';
import {Radio} from 'antd';
import {Card} from 'antd';
import {Badge} from 'antd';
import {notification} from 'antd';
import {Modal, Select} from 'antd';
const Option = Select.Option;

const RadioButton = Radio.Button;
const Search = Input.Search;
import styles from './index.less';

import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {makeSelectRepos, makeSelectLoading, makeSelectError} from '../App/selectors';
import {loadRepos} from '../App/actions';
import {changeUsername} from './actions';
import {makeSelectUsername} from './selectors';


const siderTriggerNode = () => {
    return (<span>启用<i className={styles.greenCircle}/></span>);
}

/**
 * 显示报警信息
 * @param type
 */
const openNotificationWithIcon = (type) => {
    notification[type]({
        message: '警告：警员张保国进入重点区域',
        // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};
import {Pagination} from 'antd';
import {Form} from 'antd';
import {Table} from 'antd';

/*const CollectionCreateForm = Form.create()(
 (props) => {
 const {visible, onCancel, onCreate, confirmLoading, loading, form} = props;
 //报警信息
 const columns = [{
 title: '序号',
 dataIndex: 'alarmId',
 key: 'alarmId',
 }, {
 title: '报警时间',
 dataIndex: 'alarmTime',
 key: 'alarmTime',
 }, {
 title: '涉警人员',
 dataIndex: 'peopleName',
 key: 'peopleName',
 }, {
 title: '人员编号',
 dataIndex: 'peopleId',
 key: 'peopleId',
 }, {
 title: '类别',
 dataIndex: 'level',
 key: 'level',
 }, {
 title: '设备编号',
 dataIndex: 'deviceId',
 key: 'deviceId',
 }, {
 title: '报警内容',
 dataIndex: 'alarmInfo',
 key: 'alarmInfo',
 }, {
 title: '操作',
 key: 'operation',
 width: 110,
 render: (text, record) => {
 return (
 <Button type="primary" className={styles.tableBtn} ghost>定位区域</Button>
 );
 },
 }];
 const footer = () => '共计 46 条数据';

 const dataSource = [];
 for (let i = 1; i < 32; i++) {
 dataSource.push({
 key: i,
 alarmId: i,
 alarmTime: '2017-8-21 03:27:33',
 peopleName: '刘国锋',
 peopleId: 'NO0023',
 level: '武警',
 deviceId: 'DW0001',
 alarmInfo: '刘国锋进入西侧档案室重点区域'
 });
 }
 const pagination = {
 defaultCurrent: 1,
 total: 32,
 showTotal: () => {
 (total, range) => `${range[0]}-${range[1]} of ${total} items`
 },
 pageSize: 5
 };

 return (
 <Modal
 title={<span><Icon type="hdd"/>今日报警</span>}
 visible={visible}
 onOk={onCreate}
 onCancel={onCancel}
 confirmLoading={confirmLoading}
 footer={null}
 width={840}
 className={styles.redModal}
 >
 <Table className={styles.table} bordered={true} footer={footer}
 size="middle"
 pagination={pagination}
 columns={columns} dataSource={dataSource}>
 </Table>
 </Modal>
 );
 }
 );*/

// end form

export class TraceReplayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            containerStyle: {
                height: '100%',
                width: '100%',
                minHeight: '100%',
                top: '0px',
                left: '0px',
                backgroundColor: '#f2f4f5'
            },
            siderCollapsed: false,         //人员信息sider当前收起状态, 【false】展开 【true】收起
            siderTrigger: null,
            peopleInfoWinClassName: styles.peopleCard,
            peopleCardHidden: false,
            alarmModalVisible: false,
            alarmLoading: false,
            alarmConfirmLoading: false,
            ModalText: 'Content of the modal',
            startValue: null,
            endValue: null,
            endOpen: false,
            palySliderValue: 3,
            isPalying: false
        }

        //定义全局map变量
        this.fmMap = null;
        this.fmapID = 'md-xm-57-9';
        this.groupLayer;
        this.layer = null;
        //this.addMarker = true;
        this.polygonEditor = null;
        //this.imageMarker = null;
    }

    //添加目标点标注
    addTestMarker = () => {
        let coord = {x: 13155860.0623301, y: 2813445.34302628, z: 2};
        this.addMarker(coord);
    }

    //添加Marker
    addMarker = (coord) => {
        let group = this.fmMap.getFMGroup(this.fmMap.groupIDs[0]);
        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
        let layer2 = group.getOrCreateLayer('imageMarker');
        let loadedCallBack = () => {
            this.imageMarker.alwaysShow();
        };
        let imageMarker = new fengmap.FMImageMarker({
            x: coord.x,
            y: coord.y,
            height: coord.z,
            //设置图片路径
            url: './img/peopleMarker.png',
            //设置图片显示尺寸
            size: 46,
            callback: () => {
                imageMarker.alwaysShow();
            }
        });

        layer2.addMarker(imageMarker);
    };

    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({userName: ''});
    }
    onChangeUserName = (e) => {
        this.setState({userName: e.target.value});
    }

    /**
     * 人员列表中，某一人员被选中时调用
     * @param item
     * @param key
     * @param selectedKeys
     */
    onPeopleItemSelected = ({item, key, selectedKeys}) => {
        console.log(item);
        this.onClosePeopleInfoWindow();
    }
    /**
     * 当人员面板展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
     * @param collapsed 当前状态（【true】收起 【false】展开）
     * @param type 触发类型
     */
    onCollapse = (collapsed, type) => {
        this.setState({siderCollapsed: !this.state.siderCollapsed});
        console.log(this.state.siderCollapsed);
        if (this.state.siderCollapsed) {  //收起状态
            //展开状态
            this.setState({
                siderTrigger: null
            })
        } else {
            this.setState({
                siderTrigger: undefined
            })
        }
    }

    /**
     * 显示/隐藏 人员信息窗口
     */
    onClosePeopleInfoWindow = () => {
        console.log(styles.peopleCard);
        console.log("animated fadeInUp " + styles.peopleCard);
        if (this.state.peopleCardHidden) {
            //显示人员信息窗口
            this.setState({
                peopleInfoWinClassName: "animated fadeInUp " + styles.peopleCard,
                peopleCardHidden: false
            });
        } else {
            //隐藏窗口
            this.setState({
                peopleInfoWinClassName: "animated fadeOutDown " + styles.peopleCard,
                peopleCardHidden: true
            });
        }
    }

    initPolygonEditor = () => {
        //创建 可编辑多形绘制与编辑类的实例
        this.polygonEditor = new fengmap.FMPolygonEditor({

            // fengmap 地图实例
            map: this.fmMap,

            // 绘制的 PolygonMarker 的颜色
            color: 0x22A5ee,

            // 绘制完成后的回调方法. 在这里得到绘制完成的 polygonMarker实例
            callback: function (polygonMarker) {
                //
                // 在创建完成后, 返回创建的 PolygonMarker
                // 	getPoints: 得到些PM中的所有地图坐标点
                //
                console.log(polygonMarker.getPoints());
            }
        });

        // html buttons
        //var aBtn = document.querySelectorAll('.btn');

        //添加多边形标注
        // aBtn[0].onclick = function () {
        //     // 绘制模式
        //     polygonEditor.start('create');
        //
        // };
        // //删除多边形标注
        // aBtn[1].onclick = function () {
        //     // 编辑模式
        //     polygonEditor.start('edit');
        // };
    }

    /**
     * 初始化地图
     */
    initMap = () => {

        //放大、缩小控件配置
        var ctlOpt1 = new fengmap.controlOptions({
            //设置显示的位置为左上角
            position: fengmap.controlPositon.LEFT_TOP,
            //位置x,y的偏移量
            offset: {
                x: 220,
                y: 300
            },
            scaleLevelcallback: function (level, result) {
                carInfo(result);
                /*当前级别：map.mapScaleLevel
                 最小级别：map._minMapScaleLevel
                 最大级别：map._maxMapScaleLevel*/
            }
        });

        //创建地图对象
        this.fmMap = new fengmap.FMMap({
            //渲染dom
            container: document.getElementById('fengMap'),
            //地图数据位置
            mapServerURL: 'assets/map/',
            //主题数据位置
            mapThemeURL: 'assets/theme',
            //设置主题
            defaultThemeName: '3006',
            // 默认比例尺级别设置为20级
            defaultMapScaleLevel: 21,
            //开发者申请应用下web服务的key
            key: 'b559bedc3f8f10662fe7ffdee1e360ab',
            //开发者申请应用名称
            appName: '麦钉艾特',
            //初始指北针的偏移量
            compassOffset: [276, 20],
            //指北针大小默认配置
            compassSize: 48,
        });

        //打开Fengmap服务器的地图数据和主题
        this.fmMap.openMapById(this.fmapID);
        //显示指北针
        this.fmMap.showCompass = true;

        var _addTestMarker = this.addTestMarker;

        //初始化绘制插件
        this.fmMap.on('loadComplete', function () {
            //放大、缩小控件
            var zoomControl = new fengmap.zoomControl(this.fmMap, ctlOpt1);

            //2D/3D切换控件
            var toolControl = new fengmap.toolControl(this.fmMap, {
                //初始化2D模式
                init2D: false,
                //设置为false表示只显示2D,3D切换按钮
                groupsButtonNeeded: false,
                //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
                clickCallBack: function (type, value) {
                    // console.log(type,value);
                }
            });

            //单层多层楼层控件配置
            var mulitFloor = new fengmap.toolControl(this.fmMap, {
                //设置初始单楼层状态。
                allLayer: false,
                //设置为false,表示只显示楼层切换按钮.两个都为false,则不显示.
                viewModeButtonNeeded: false,
                //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
                clickCallBack: function (type, value) {
                    // console.log(type,value);
                }
            });

            //添加测试用的人员Marker
            _addTestMarker();
        });
        //点击事件
        this.fmMap.on('mapClickNode', function (event) {
            console.log("click event.");
            var model = event;
            switch (event.nodeType) {
                case fengmap.FMNodeType.FLOOR:
                    //if (event.eventInfo.eventID == eventID) return;
                    console.log('x:' + event.eventInfo.coord.x + ";     y:" + event.eventInfo.coord.y);
                    break;
                case fengmap.FMNodeType.MODEL:
                    //过滤类型为墙的model
                    if (event.typeID == '30000') {
                        //其他操作
                        return;
                    }
                    //模型高亮
                    this.fmMap.map.storeSelect(model);
                    //弹出信息框
                    console.log('x:' + event.label ? event.label.mapCoord.x : event.mapCoord.x + ";     y:" + event.label ? event.label.mapCoord.y : event.mapCoord.y);
                    break;
                case fengmap.FMNodeType.FACILITY:
                case fengmap.FMNodeType.IMAGE_MARKER:
                    //弹出信息框
                    console.log('公共设施 x:' + event.target.x + ";     y:" + event.target.y);
                    break;
            }
        });
    }

    /**
     * 显示报警列表
     */
    onShowAlarmModal = () => {
        this.setState({
            alarmModalVisible: true
        });
    }

    handleCreate = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            alarmConfirmLoading: true,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            alarmModalVisible: false,
        });
    }

    onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }

    //region 日期选择

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onDateChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onDateChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onDateChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        // if (!open) {
        //     this.setState({endOpen: true});
        // }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    //endregion

    //region 播放器
    onPalySliderChange = (value) => {
        this.setState({
            palySliderValue: value,
        });
    }

    //endregion

    /**
     * 组件第一次加载完成周期，创建地图
     */
    componentDidMount() {
        //初始化地图
        this.initMap();
    }

    render() {
        const {userName} = this.state;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;
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
                            background: '#302036',
                            lineHeight: '38px',
                            color: '#fff',
                            padding: '0 10px'
                        }}>
                            车辆信息&nbsp;&nbsp;&nbsp;6 / 8
                            <span className={styles.left_arrow} title="收起窗口" onClick={this.onCollapse.bind(this)}><Icon
                                type="left"/></span>
                        </div>
                        <Content>
                            <div style={{width: '100%', background: '#F6F5FC'}}>
                                <Input
                                    placeholder="请输入编号筛选"
                                    prefix={<Icon type="search"/>}
                                    suffix={suffix}
                                    value={userName}
                                    onChange={this.onChangeUserName}
                                    className={styles.searchInput}
                                    ref={node => this.userNameInput = node}
                                />
                            </div>


                            <Select className={styles.selectDrop} defaultValue="all" size="large">
                                <Option value="all">显示全部</Option>
                                <Option value="0">在线状态</Option>
                                <Option value="1">离线状态</Option>
                                <Option value="2">报警状态</Option>
                            </Select>

                            {/*默认列表展示*/}
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['3']}
                                className={styles.menu}
                                onSelect={this.onPeopleItemSelected}
                            >
                                <Menu.Item key="1">
                                    <Avatar size="large" src="img/avatar/001.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>7.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>8.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>9.0 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>6.9 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>7.1 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <Avatar size="large" src="img/avatar/001.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>6.5 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox shape="circle" className={styles.peopleChk}
                                                  onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="7" disabled={true}>
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>8.1 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="8" disabled={true}>
                                    <Avatar size="large" src="img/avatar/002.jpg"/>
                                    <div className={styles.content}>
                                        <div className={styles.code}>CL0000001</div>
                                        <div>7.9 km/h</div>
                                    </div>
                                    <div className={styles.btnContent}>
                                        <Checkbox className={styles.peopleChk} onChange={this.onChange}></Checkbox>
                                    </div>
                                </Menu.Item>
                            </Menu>

                            {/*轨迹回放时列表展示*/}
                            {/*<Menu
                             mode="inline"
                             defaultSelectedKeys={['3']}
                             className={styles.planMenu}
                             onSelect={this.onPeopleItemSelected}
                             >
                             <Menu.Item key="1">
                             <div className={styles.planContent}>
                             <div className={styles.code}>CL0000001</div>
                             <div>里程数：8km/h</div>
                             </div>
                             <div className={styles.planBtnContent}>
                             <span style={{color: '#2C56C0'}}>5.3km/h</span>
                             <Button type="primary" icon="eye" title="隐藏/可见"/>
                             <Button type="primary" icon="environment" title="定位"/>
                             </div>
                             </Menu.Item>
                             <Menu.Item key="2">
                             <div className={styles.planContent}>
                             <div className={styles.code}>CL0000001</div>
                             <div>里程数：8km/h</div>
                             </div>
                             <div className={styles.planBtnContent}>
                             <span style={{color: '#2C56C0'}}>5.3km/h</span>
                             <Button type="primary" icon="eye" title="隐藏/可见"/>
                             <Button type="primary" icon="environment" title="定位"/>
                             </div>
                             </Menu.Item>
                             <Menu.Item key="3">
                             <div className={styles.planContent}>
                             <div className={styles.code}>CL0000001</div>
                             <div>里程数：8km/h</div>
                             </div>
                             <div className={styles.planBtnContent}>
                             <span style={{color: '#2C56C0'}}>5.3km/h</span>
                             <Button type="primary" icon="eye" title="隐藏/可见"/>
                             <Button type="primary" icon="environment" title="定位"/>
                             </div>
                             </Menu.Item>
                             </Menu>*/}

                        </Content>
                        <Footer className={styles.footer}>


                            {/*轨迹回放*/}
                            <div className={styles.datePanel}>
                                <div className={styles.dtPickerItem}>开始
                                    <DatePicker
                                        disabledDate={this.disabledStartDate}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        value={startValue}
                                        placeholder="开始日期"
                                        className={styles.dtPicker}
                                        onChange={this.onStartChange}
                                        onOpenChange={this.handleStartOpenChange}
                                    />
                                </div>
                                <div className={styles.dtPickerItem}>结束
                                    <DatePicker
                                        disabledDate={this.disabledEndDate}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        value={endValue}
                                        placeholder="结束日期"
                                        className={styles.dtPicker}
                                        onChange={this.onEndChange}
                                        open={endOpen}
                                        onOpenChange={this.handleEndOpenChange}
                                    /></div>
                                <div className={styles.dtPickerItem}>
                                    <Button type="danger" className={styles.startReplay}><Icon type="caret-right"/>开始轨迹回放</Button>
                                </div>
                            </div>

                            {/*停止回放按钮*/}
                            {/*<div className={styles.stopPlayback}>
                             <Button type="danger" className={styles.startReplay}>停止回放</Button>
                             </div>*/}

                            <div className={styles.allChkPanel}>
                                <Button ghost size="small">全部选择</Button>
                                <Button ghost size="small">全部取消</Button>
                            </div>
                        </Footer>
                    </Layout>
                </Sider>
                <Content>
                    <div id="fengMap" className="fengMap" style={this.state.containerStyle}></div>
                    <div className={styles.mapActions}>
                        {/* <span className={styles.mapActionBtn} onClick={this.onShowAlarmModal}>
                         <Badge count={5}>
                         <Icon type="message"/>
                         </Badge>
                         </span>*/}
                        <span className={styles.mapActionBtn} onClick={() => openNotificationWithIcon('error')}><Icon
                            type="edit"/></span>
                        <span className={styles.mapActionBtn}><Icon type="credit-card"/></span>
                        <span className={styles.mapActionBtn}><Icon type="plus"/></span>
                        <span className={styles.mapActionBtn}><Icon type="minus"/></span>
                    </div>
                    <Card noHovering={true} bordered={false} className={this.state.peopleInfoWinClassName} title={
                        <span><Icon type="solution"/>车辆编号： CL0000001</span>
                    }
                          extra={<span className={styles.peopleClose} title="关闭"
                                       onClick={this.onClosePeopleInfoWindow.bind(this)}><Icon
                              type="close"/></span>}
                    >
                        <div className={styles.rightPeopleContent}>
                            <span>车辆类型：叉车</span>
                            <span>设备编号：KNfs00021</span>
                            <span>行驶里程：85km</span>
                            <span>行驶速度：8.5km/h</span>
                            <span>设备电量：60%</span>
                            <span>车辆状态：车辆已超速行驶</span>
                            <span>当前位置：B区域</span>
                        </div>
                    </Card>
                    <div className={styles.replayPanel}>
                        <div className={styles.replayItemRow}>
                            <div className={styles.playTimeTag}>
                                <span>00:12</span>
                                <span> / 1:20:22</span>
                            </div>
                            <span className={styles.speedTag}>快进×16</span>
                        </div>
                        <Slider min={0} max={10} className={styles.palySlider} onChange={this.onPalySliderChange}
                                value={this.state.palySliderValue} step={0.01}/>
                        <div className={styles.replayItemRow}>
                            <div>
                                <span>2017-6-13<br/>0:39:28</span>
                            </div>
                            <div className={styles.ctlButtons}>
                                <Button ghost size="large"><Icon type="pause-circle"/></Button>
                                <Button ghost size="large"><Icon type="forward"/></Button>
                                <Button ghost size="large"><Icon type="minus-square"/></Button>
                            </div>
                            <div>
                                <span>2017-8-22<br/>0:39:28</span>
                            </div>
                        </div>
                    </div>
                    {/*<div className="operating">
                     <button className="btn btn-default" id="btn1"
                     style={{marginTop: '-50px', marginLeft: '300px', position: 'absolute'}}>绘制 可编辑多边形
                     </button>
                     <button className="btn btn-default" id="btn2"
                     style={{marginTop: '-50px', marginLeft: '450px', position: 'absolute'}}>编辑 可编辑多边形
                     </button>
                     </div>*/}
                    {/*报警信息窗口*/}
                    {/*<CollectionCreateForm
                     ref={this.saveFormRef}
                     visible={this.state.alarmModalVisible}
                     onCancel={this.handleCancel}
                     onCreate={this.handleCreate}
                     loading={this.state.alarmLoading}
                     confirmLoading={this.state.alarmConfirmLoading}
                     />*/}

                </Content>
            </Layout>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
        onSubmitForm: (evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            dispatch(loadRepos());
        },
    };
}

const mapStateToProps = createStructuredSelector({
    repos: makeSelectRepos(),
    //username: makeSelectUsername(),
    loading: makeSelectLoading(),
    error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TraceReplayPage);