/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计分析页面。路径为'/statistical'
 */

'use strict';
import React from 'react';
import {
    Layout,
    Button,
    Input,
    Select,
    AutoComplete,
    Row,
    Col,
    Table,
    DatePicker,
    Icon,
    TimePicker,
    Tabs
} from 'antd';

const {Content} = Layout;
const Option = Select.Option;
import styles from './index.less';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {showErrorMessage} from '../App/actions';
import _ from 'lodash';
import {
    queryAllCarMsgBegin,
    queryAllCarMsgListBegin,
    getDensityData,
    getSpeedData,
    getAbnormalData,
} from './actions';
const {
    MonthPicker,
    RangePicker
} = DatePicker;
import moment from 'moment';
import getHours from 'moment';
import echarts from 'echarts';
const TabPane = Tabs.TabPane;
import {
    tableDataLoadingSelector,
    statisticalEntitySelector,
    carMsgSelector,
    carMsgListSelector,
    densityEntitySelector,
    speedEntitySelector,
    abnormalEntitySelector
} from './selectors';
import {carCategorySourceSelector} from '../CategoryFormModel/selectors';
import {getCarCategory} from '../CategoryFormModel/actions';

import StatisticalFormModal from '../StatisticalFormModal';
import {
    statisticalFormModalShow,
    getCenterAreaStaticData
} from "../StatisticalFormModal/actions";


//模拟数据
const TEST_dataSource = [];
for (var i = 0; i < 24; i++) {
    TEST_dataSource.push({
        title: i + '*****',
        dataIndex: i,
        key: i + 1,
        // render: () => {
        //     return (
        //         <div className={styles.gantt} style={{width: `${101}%`}}>
        //         </div>
        //     )
        // }
    });
}

export class StatisticalPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter_deviceCode: '', //设备编号-筛选条件，需要初始化，不要设置为null
            filter_carCode: '', //安保编号-筛选条件，需要初始化，不要设置为null
            filter_workStatus: 'all', //工作状态-筛选条件 [all] 全部（默认）[0] 离线 [1] 工作
            filter_deviceStatus: 'all', //设备状态-筛选条件 [all] 全部（默认）[0] 禁用 [1] 启用
            dataFilter: null, //数据过滤器数组，只有一条记录，将筛选条件用&&连接。格式：['设备编号'&&'安保编号'&&'工作状态'&&'设备状态']
            curSelectedRowKeys: [],
            autoComplete_deviceCode: [], //设备编号自动完成提示数组
            autoComplete_carCode: [], //车辆编号自动完成提示数组

            TEST_dataSource: TEST_dataSource,
            filter_carType: 'all',
            carsBeginDate: new moment(),
            carsBeginTime: null,
            carsEndDate: new moment(),
            carsEndTime: new getHours(),
            carsDateTime: null,

            busyCarsBeginDate: new moment(),
            busyCarsBeginTime: null,
            busyCarsEndDate: new moment(),
            busyCarsEndTime: null,
            busyCarsDateTime: null,
        };
    }

    componentWillReceiveProps(nextProps, nextStates) {
        let densityData_ = nextProps.densityEntity;
        if (densityData_ && densityData_.data) {
            let densityDom_ = document.getElementById('main');
            if (!densityDom_) return;
            // 初始化echarts实例
            let myChart = echarts.init(densityDom_);
            // 绘制图表
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}, {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x2: 'right',
                    top: '50',
                    right: '20',
                    textStyle: {
                        fontSize: 14,
                        padding: [3, 4, 5, 6],
                    },
                    data: densityData_.legendData
                },
                // color: ['#F44336', '#1D9FF2', '#00897B', '#F9A825'],
                series: [{
                    name: '区域密度',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    data: densityData_.data,
                    // itemStyle: {
                    //     normal: {
                    //         //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    //         color: function(params) {
                    //             console.log('color', params, arguments);
                    //             if (params.value == 0) return 'yellow';
                    //         }
                    //     }
                    // }
                }]
            });
        }

        let speedData_ = nextProps.speedEntity;
        if (speedData_ && speedData_.xdata) {
            let speedDom_ = document.getElementById('main2');
            if (!speedDom_) return;

            //换算series渲染值取小数点后两位
            let data = [];
            speedData_.data.map((item, index) => {
                let data_arr = Math.floor(item / 1000 * 100) / 100;
                data.push(data_arr);
            });
            //换算速度取小数点后两位
            let ymax = Math.floor(speedData_.ymax / 1000 * 100) / 100;

            let myChart2 = echarts.init(speedDom_);
            myChart2.setOption({
                baseOption: {
                    xAxis: {
                        name: '数量（辆）',
                        data: speedData_.xdata,
                        // splitNumber: 2,
                    },
                    yAxis: {
                        name: '速度 km/h',
                        max: ymax,
                        //data: speedData_.ydata
                        splitNumber: 2,
                        // interval: 5,
                    },
                    series: [{
                        color: ['#95CFFA'],
                        type: 'bar',
                        data: data,
                        // barWidth: '80%',
                        // barGap: '0',
                        // barCategoryGap: '0',
                        // itemStyle: {
                        //     normal: {
                        //         //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        //         color: function(params) {
                        //             let colorList = ['#C2D7AF', '#AFEBFE', '#95D0F7'];
                        //             return colorList[params.dataIndex];
                        //         }
                        //     },
                        // },
                    }]
                },
            });
        }

        let abnormalData_ = nextProps.abnormalEntity;
        if (abnormalData_ && abnormalData_.xdata) {
            let abnormalDom_ = document.getElementById('main3');
            if (!abnormalDom_) return;

            let myChart3 = echarts.init(abnormalDom_);
            myChart3.setOption({
                baseOption: {
                    legend: {
                        data: ['超过五小时无位置信息', '超速车辆']
                    },
                    xAxis: {
                        name: '日期（天）',
                        data: abnormalData_.xdata,
                    },
                    yAxis: {
                        name: '数量（辆）',
                        splitNumber: abnormalData_.yAxis,
                    },
                    series: [{
                        name: '超过五小时无位置信息',
                        color: ['#95CFFA'],
                        type: 'bar',
                        barWidth: '20%',
                        data: abnormalData_.series[97],
                    }, {
                        name: '超速车辆',
                        color: ['#FE1C69'],
                        type: 'line',
                        data: abnormalData_.series[99],
                    }]
                },
            });
        }
        /*if (this.state.carsBeginDate != nextStates.carsBeginDate || this.state.carsBeginTime != nextStates.carsBeginTime || this.state.carsEndDate != nextStates.carsEndDate || this.state.carsEndTime != nextStates.carsEndTime) {}*/
    };

    componentWillMount() {
        //加载数据
        this.props.queryAllCarMsg();
        this.props.queryAllCarMsgList();
        this.props.getCarCategory();
        this.props.getDensityStatic(`${this.state.carsBeginDate.format('YYYY-MM-DD')} 00:00:00`, `${this.state.carsEndDate.format('YYYY-MM-DD')} ${this.state.carsEndTime.format('HH:mm:ss')}`);
        this.props.getSpeedStatic(`${this.state.carsBeginDate.format('YYYY-MM-DD')} 00:00:00`, `${this.state.carsEndDate.format('YYYY-MM-DD')} ${this.state.carsEndTime.format('HH:mm:ss')}`);
        this.props.getAbnormalStatic(`${this.state.carsBeginDate.format('YYYY-MM-DD')} 00:00:00`, `${this.state.carsEndDate.format('YYYY-MM-DD')} ${this.state.carsEndTime.format('HH:mm:ss')}`);
    };

    //密度统计图
    getDensity = () => {
        return (<div id="main" style={{height: 320}}></div>)
    };
    //速度统计图
    getSpeed = () => {
        return (<div id="main2" style={{height: 350}}></div>)
    };
    //异常统计图
    abnormal = () => {
        return (<div id="main3" style={{height: 350}}></div>)
    };

    //重置
    onResetSearch = () => {
        this.setState({
            filter_deviceCode: '',
            filter_carCode: '',
            filter_workStatus: 'all',
            filter_deviceStatus: 'all',
            dataFilter: null,
            autoComplete_deviceCode: [],
            autoComplete_carCode: [],
            filter_carType: 'all',
        });
        //刷新数据
        this.props.queryAllCarMsgList();
    };

    //数据过滤器 value:筛选条件 record 设备数据 index 数据索引
    deviceDataFilter = (value, record) => {
        let filters = value.split('&&');
        if (filters.length != 3) {
            console.error('设备筛选条件长度错误');
            return true; //忽略过滤器
        }
        //筛选数据
        return record != null &&
            (_.isEmpty(filters[0]) || (_.isNull(record.deviceCode) == false && record.deviceCode.includes(filters[0]))) &&
            (_.isEmpty(filters[1]) || (_.isNull(record.carCode) == false && record.carCode.includes(filters[1]))) &&
            (record.carType == filters[2] || filters[2] == 'all')
    }

    //查询（筛选）
    onFilterDevice = () => {
        //保证参数不能为null、undefined
        let deviceCode = _.isEmpty(this.state.filter_deviceCode) ? '' : this.state.filter_deviceCode.trim();
        let carCode = _.isEmpty(this.state.filter_carCode) ? '' : this.state.filter_carCode.trim();
        let filterStr = `${deviceCode}&&${carCode}&&${this.state.filter_carType}`;
        this.setState({
            //将多个筛选条件拼接为一个条件，利于后续在一次循环中集中判断，减少[deviceDataFilter]循环判断次数
            dataFilter: [
                filterStr
            ]
        });
    };

    //查看集中区域分析
    onViewDeviceInfo = (carCode, count) => {
        //显示添加设备对话框
        this.props.showStatisticalFormModal('modify', carCode);
        this.props.queryCenterAreaData(carCode, count);
    };

    //设备编号自动完成填充
    onDeviceCodeAutoCompleteSearch = (value) => {
        let carMsgList = this.props.carMsgList;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将设备编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            carMsgList.forEach(carMsgList => {
                if(carMsgList.deviceCode) {
                    if (carMsgList.deviceCode.includes(value)) {
                        data.push(carMsgList.deviceCode);
                    }
                }
            });
        }
        this.setState({
            autoComplete_deviceCode: data,
        });
    };

    //车辆编号自动完成填充
    onCarCodeAutoCompleteSearch = (value) => {
        let carMsgList = this.props.carMsgList;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将车辆编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            carMsgList.forEach(carMsgList => {
                if (carMsgList.carCode.includes(value)) {
                    data.push(carMsgList.carCode);
                }
            });
        }
        this.setState({
            autoComplete_carCode: data,
        });
    };

    //点击切换车辆信息
    switchInfo = () => {
        this.refs.carInfo.style.display = 'none';
        this.refs.carInfo2.style.display = 'block';
    };

    //点击返回车辆信息页面
    returnBtn = () => {
        this.refs.carInfo.style.display = 'block';
        this.refs.carInfo2.style.display = 'none';
    };

    //车辆统计开始日期
    handleCarsBeginDate = (value) => {
        this.setState({
            carsBeginDate: value
        });
    };

    //车辆统计开始时间
    handleCarsBeginTime = (value) => {
        this.setState({
            carsBeginTime: value
        });
    };

    //车辆统计结束日期
    handleCarsEndDate = (value) => {
        this.setState({
            carsEndDate: value
        });
    };

    //车辆统计结束时间
    handleCarsEndTime = (value) => {
        this.setState({
            carsEndTime: value
        });
    };

    //根据用户选择的时间段查询车辆统计页面的信息
    getCars = () => {
        const {
            carsBeginDate,
            carsBeginTime,
            carsEndDate,
            carsEndTime,
        } = this.state;

        //获取前一天的日期
        // function GetDateStr(AddDayCount) {
        //     let dd = new Date();
        //     dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        //     let y = dd.getFullYear();
        //     let m = dd.getMonth()+1;//获取当前月份的日期
        //     let d = dd.getDate();
        //     return y+"-"+m+"-"+d;
        // }
        // console.log(GetDateStr(-1));

        const beiginDate = carsBeginDate ? carsBeginDate.format('YYYY-MM-DD') : '';
        const beiginTime = carsBeginTime ? carsBeginTime.format('HH') : '00';
        const endDate = carsEndDate ? carsEndDate.format('YYYY-MM-DD') : '';
        const endTime = carsEndTime ? carsEndTime.format('HH') : '';
        if (!beiginDate) {
            this.props.showErrorMessage('请选择开始日期');
            return;
        }
        if (!endDate) {
            this.props.showErrorMessage('请选择结束日期');
            return;
        }
        if((Date.parse(new Date(beiginDate)) - Date.parse(new Date(endDate))) > 0) {
            this.props.showErrorMessage('结束日期不能早于开始日期');
            return;
        }
        this.setState({
            carsDateTime: `${beiginDate}&&${beiginTime}&&${endDate}&&${endTime}`,
        }, () => {
            //查询的时候重新查询统计信息
            this.props.getDensityStatic(`${beiginDate} ${beiginTime}:00:00`, `${endDate} ${endTime}:59:59`);
            this.props.getSpeedStatic(`${beiginDate} ${beiginTime}:00:00`, `${endDate} ${endTime}:59:59`);
            this.props.getAbnormalStatic(`${beiginDate} ${beiginTime}:00:00`, `${endDate} ${endTime}:59:59`);
        });
        console.log(beiginDate, beiginTime, endDate, endTime);
    };


    ///////////////////////////////////////////////繁忙统计///////////////////////////////////////////////////


    //繁忙统计页面车辆编号自动完成填充 TODO 此处需要修改过滤数据来源
    onBusyCarCodeAutoCompleteSearch = (value) => {
        let carMsgList = this.props.carMsgList;
        let data = [];
        //非空，且自动提示最少需要输入3个字符
        if (_.isEmpty(value) == false && value.trim().length > 2) {
            //遍历设备数据集合，将车辆编号中包含输入字符的完整编号数据写入自动完成提示数据集合中。
            carMsgList.forEach(carMsgList => {
                if (carMsgList.carCode.includes(value)) {
                    data.push(carMsgList.carCode);
                }
            });
        }
        this.setState({
            autoComplete_carCode: data,
        });
    };

    //根据用户选择的时间轴动态显示table的横向滑动距离
    scrollBar = () => {
        let dataNum;
        if (TEST_dataSource.length) {
            dataNum = TEST_dataSource.length * 100 + 330;
            return dataNum;
        }
    };

    //繁忙统计开始日期
    handleBusyCarsBeginDate = (value) => {
        this.setState({
            busyCarsBeginDate: value
        });
    };

    //繁忙统计开始时间
    handleBusyCarsBeginTime = (value) => {
        this.setState({
            busyCarsBeginTime: value
        });
    };

    //繁忙统计结束日期
    handleBusyCarsEndDate = (value) => {
        this.setState({
            busyCarsEndDate: value
        });
    };

    //繁忙统计结束时间
    handleBusyCarsEndTime = (value) => {
        this.setState({
            busyCarsEndTime: value
        });
    };

    //繁忙统计查询
    onFilterCarBusy = () => {

        const {
            busyCarsBeginDate,
            busyCarsBeginTime,
            busyCarsEndDate,
            busyCarsEndTime
        } = this.state;
        const beiginDate = busyCarsBeginDate ? busyCarsBeginDate.format('YYYY-MM-DD') : '';
        const beiginTime = busyCarsBeginTime ? busyCarsBeginTime.format('HH') : '00';
        const endDate = busyCarsEndDate ? busyCarsEndDate.format('YYYY-MM-DD') : '';
        const endTime = busyCarsEndTime ? busyCarsEndTime.format('HH') : '23';
        if (!beiginDate) {
            this.props.showErrorMessage('请选择开始日期');
            return;
        }
        if (!endDate) {
            this.props.showErrorMessage('请选择结束日期');
            return;
        }
        this.setState({
            carsDateTime: `${beiginDate}&&${beiginTime}&&${endDate}&&${endTime}`,
        });

        if((beiginDate === endDate) && ((endTime*1 - beiginTime*1) !== 23)) {
            this.props.showErrorMessage('选择的时间不能少于24小时');
            return;
        }
        if((Date.parse(new Date(beiginDate)) - Date.parse(new Date(endDate))) > 0) {
            this.props.showErrorMessage('结束日期不能早于开始日期');
            return;
        }

        //判断日期差值天数
        let strSeparator = "-";
        let strDateArrayStart, strDateArrayEnd, intDay;
        strDateArrayStart = beiginDate.split(strSeparator);
        strDateArrayEnd = endDate.split(strSeparator);
        let strDateS = new Date(strDateArrayStart[0] + "/" + strDateArrayStart[1] + "/" + strDateArrayStart[2]);
        let strDateE = new Date(strDateArrayEnd[0] + "/" + strDateArrayEnd[1] + "/" + strDateArrayEnd[2]);
        intDay = (strDateE-strDateS)/(1000*3600*24);
        if((intDay === 1) && (((24 - beiginTime*1) + (endTime*1)) < 24)) {
            this.props.showErrorMessage('选择的时间不能少于24小时');
            return;
        }
        console.log(beiginDate, beiginTime, endDate, endTime);
    };

    render() {
        const selection = {
            selectedRowKeys: curSelectedRowKeys,
            onChange: this.onSelectChange,
        };
        const format = 'HH';
        const {
            curSelectedRowKeys,
            carsBeginDate,
            carsEndDate,
            busyCarsBeginDate,
            busyCarsEndDate,
            carsEndTime,
            carsBeginTime
        } = this.state;
        const {
            tableDataLoading,
            carMsg,
            carMsgList,
            carCategory
        } = this.props;

        //车辆信息显示
        let carMsgShow, carTypeList, carMsgs;
        if (carMsg) {
            carMsgs = carMsg.typeCarnum;
            carMsgShow = carMsgs.map((item, index) => {
                return (
                    <div key={index} className={styles.carsMsg_div}><img src="../../img/Statistical/other.png" alt=""/><div>{item.type_name}<br/><span>{item.count}</span></div></div>
                )
            })
        }

        //显示车辆类别下拉选项
        if (carCategory) {
            carTypeList = carCategory.map((item, index) => {
                return (
                    <Option key={index} value={item.id + ''}>{item.typeName}</Option>
                )
            })
        }

        //echarts统计图
        const getDensity = this.getDensity();
        const getSpeed = this.getSpeed();
        const abnormal = this.abnormal();

        //车辆信息列表
        const columns = [{
            title: '车辆编号',
            dataIndex: 'carCode',
            key: 'carCode',
            filteredValue: this.state.dataFilter, //设置过滤条件
            onFilter: (value, record) => this.deviceDataFilter(value, record), //每条数据都通过指定的函数进行过滤
        }, {
            title: '车辆类别',
            dataIndex: 'carType',
            key: 'carType',
            render: (carType) => {
                let typeName = null;
                if (_.isArray(carCategory)) {
                    if (carCategory.length) {
                        carCategory.forEach((item) => {
                            if (carType == item.id) {
                                typeName = item.typeName;
                            }
                        });
                    }
                }
                return <span>{typeName}</span>
            }
        }, {
            title: '设备编号',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
        }, {
            title: '工作时间',
            dataIndex: 'count',
            key: 'count',
            render: (text) => {
                return Math.floor(text / 3600 * 10) / 10 + ' h';
            },
        }, {
            title: '行走里程',
            dataIndex: 'totalMileage',
            key: 'totalMileage',
            render: (text) => {
                return Math.floor(text / 1000 * 100) / 100 + ' km';
            },
        }, {
            title: '最快速度',
            dataIndex: 'maxSpeed',
            key: 'maxSpeed',
            render: (text) => {
                return Math.floor(text / 1000 * 100) / 100 + ' km/h';
            },
        }, {
            title: '平均速度',
            dataIndex: 'avgSpeed',
            key: 'avgSpeed',
            render: (text) => {
                return Math.floor(text * 100) / 100 + ' km/h';
            },
        }, {
            title: '使用日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 220,
            render: (text) => {
                if (_.isNumber(text)) {
                    return new Date(text).format("yyyy-M-d hh:mm");
                } else {
                    return text;
                }
            },
        }, {
            title: '集中区域分析',
            key: 'operation',
            width: 200,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button type="primary" className={styles.tableBtn} ghost
                                onClick={() => this.onViewDeviceInfo(record.carCode,record.count)}>查看</Button>
                    </div>
                );
            },
        }];

        //甘特图列表
        const columnsBusy = [{
            title: '车辆数量：2/88',
            dataIndex: 'carCode',
            key: 'carCode',
            width: 130,
            fixed: 'left',
            filteredValue: this.state.dataFilter, //设置过滤条件
            onFilter: (value, record) => this.deviceDataFilter(value, record), //每条数据都通过指定的函数进行过滤
        }, {
            title: '公里数',
            dataIndex: 'totalMileage',
            key: 'totalMileage',
            width: 100,
            fixed: 'left',
            sorter: (a, b) => a.kilometers - b.kilometers, //排序
            render: (text) => {
                return Math.floor(text / 1000 * 100) / 100 + ' km';
            },
        }, {
            title: '时间',
            dataIndex: 'workStatus',
            key: 'workStatus',
            width: 100,
            fixed: 'left',
            sorter: (a, b) => a.timer - b.timer,
        }, {
            children: this.state.TEST_dataSource.map((item, index) => {
                let title;
                if (index === 0) {
                    title = `11.11 ${index}:00`
                } else {
                    title = `${index}:00`
                }
                return ({
                    title: title,
                    dataIndex: index,
                    key: index + 1,
                    width: 100,
                    render: () => {
                        return (
                            <div className={styles.InscribedClock}>
                                <div className={styles.inscribedDiv}>
                                    <div key={index} className={styles.gantt} style={{width: `${0}%`}}>
                                    </div>
                                </div>
                                <div className={styles.inscribedDiv}>
                                    <div key={index} className={styles.gantt} style={{width: `${100 + 1}%`}}>
                                    </div>
                                </div>
                                <div className={styles.inscribedDiv}>
                                    <div key={index} className={styles.gantt} style={{width: `${0}%`}}>
                                    </div>
                                </div>
                                <div className={styles.inscribedDiv}>
                                    <div key={index} className={styles.gantt} style={{width: `${0}%`}}>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            })
        }];

        return (
            <Layout className={styles.layout}>
                <div className="cardContainer">
                    <Tabs type="card" className={styles.tabs}>
                        {/*车辆统计页面*/}
                        <TabPane className={styles.tabPane} tab="车辆统计" key="1">
                            <div ref='carInfo'>
                                <Row type="flex" align="middle">
                                    <Col span={10}>
                                        <span style={{marginRight: '20px'}}>时间选择</span>

                                        <DatePicker style={{width: '18%'}} defaultValue={carsBeginDate}
                                                    format="YYYY-MM-DD"
                                                    onChange={this.handleCarsBeginDate}>
                                        </DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('00', format)}
                                                    format="HH"
                                                    onChange={this.handleCarsBeginTime}>
                                        </TimePicker>&nbsp;

                                        <Icon style={{color: '#a8a8a8'}} type="minus"/>&nbsp;
                                        <DatePicker style={{width: '18%'}} defaultValue={carsEndDate}
                                                    format="YYYY-MM-DD"
                                                    onChange={this.handleCarsEndDate}>
                                        </DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={carsEndTime}
                                                    format="HH"
                                                    onChange={this.handleCarsEndTime}>
                                        </TimePicker>
                                    </Col>
                                    <Col span={6}>
                                        <Button type="primary" icon="search" className={styles.searchBtn} onClick={this.getCars}>查询</Button>
                                    </Col>
                                </Row>

                                <Row type="flex" align="middle">
                                    <Col span={12} className={styles.item}>
                                        <p style={{cursor: 'pointer'}} onClick={this.switchInfo}>车辆信息统计<span style={{fontSize: '12px', color: 'blue'}}>（点击查看详情）</span></p>
                                        <div className={styles.carsMsg}>
                                            <span>车辆总数：{carMsg ? carMsg.carsTotal : ''}</span>
                                            <span>单位：辆</span>
                                        </div>
                                        <div className={styles.carsMsg2}>
                                            {carMsgShow}
                                        </div>
                                        <div className={styles.carsMsg3}>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/online.png" alt=""/><div>在线数量<br/><span>{carMsg ? carMsg.onLineCarNum : ''}</span></div></div>
                                            <div className={styles.carsMsg_div}><img src="../../img/Statistical/offline.png" alt=""/><div>离线数量<br/><span>{carMsg ? carMsg.offLineCarNum : ''}</span></div></div>
                                            <div className={styles.carsMsg_div} style={{width: '50%'}}><img src="../../img/Statistical/none.png" alt=""/><div>未绑定设备<br/><span>{carMsg ? carMsg.noDeviceCarNum : ''}</span></div></div>
                                        </div>
                                    </Col>
                                    <Col span={12} className={styles.item}>
                                        <p>区域密度统计</p>
                                        {getDensity}
                                    </Col>
                                </Row>

                                <Row type="flex" align="middle">
                                    <Col span={12} className={styles.item}>
                                        <p>车辆速度统计</p>
                                        {getSpeed}
                                    </Col>

                                    <Col span={12} className={styles.item}>
                                        <p>车辆异常统计</p>
                                        {abnormal}
                                    </Col>
                                </Row>

                            </div>

                            {/*点击查看车辆信息统计时进入到另一个表格*/}
                            <div ref='carInfo2' style={{display: 'none'}}>
                                <Content className={styles.content}>
                                    <Row type="flex" align="middle">
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>车辆编号</span>
                                            <AutoComplete
                                                dataSource={this.state.autoComplete_carCode}
                                                onSearch={this.onCarCodeAutoCompleteSearch}
                                                allowClear={true}
                                                placeholder="车辆编号" size="large"
                                                onChange={(value) => this.setState({filter_carCode: value})}
                                                value={this.state.filter_carCode}
                                            >
                                                <Input maxLength="15"/>
                                            </AutoComplete>
                                        </Col>
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>设备编号</span>
                                            <AutoComplete
                                                dataSource={this.state.autoComplete_deviceCode}
                                                onSearch={this.onDeviceCodeAutoCompleteSearch}
                                                allowClear={true}
                                                placeholder="设备编号" size="large"
                                                onChange={(value) => this.setState({filter_deviceCode: value})}
                                                value={this.state.filter_deviceCode}
                                            >
                                                <Input maxLength="15"/>
                                            </AutoComplete>
                                        </Col>
                                        <Col span={4} className={styles.itemTabs}>
                                            <span>车辆类别</span>
                                            <Select defaultValue="all" size="large" value={this.state.filter_carType}
                                                    onChange={(value) => this.setState({filter_carType: value})}>
                                                <Option value="all">全部</Option>
                                                {carTypeList}
                                            </Select>
                                        </Col>
                                        <Col span={8}>
                                            <Button type="primary" icon="search" size="large"
                                                    className={styles.searchBtn}
                                                    onClick={this.onFilterDevice}>查询统计</Button>
                                            <Button type="primary" icon="sync" size="large" className={styles.resetBtn}
                                                    onClick={this.onResetSearch}>重置查询</Button>
                                            <Button type="primary" icon="left" size="large"
                                                    onClick={this.returnBtn}
                                                    className={styles.returnBtn}>返回</Button>
                                        </Col>
                                    </Row>
                                    <Row className={styles.tableRow}>
                                        <Col span={24}>
                                            <Table rowSelection={selection} rowKey={record => record.carCode}
                                                   className={styles.table} bordered={true}
                                                   footer={(record) => '共计 ' + record.length + ' 条数据'}
                                                   size="middle"
                                                   loading={tableDataLoading}
                                                   columns={columns} dataSource={carMsgList}>
                                            </Table>
                                        </Col>
                                    </Row>
                                    <StatisticalFormModal/>
                                </Content>
                            </div>
                        </TabPane>

                        {/*繁忙统计页面*/}
                        <TabPane className={styles.tabPane} tab="繁忙统计" key="2">
                            <Content className={styles.content}>
                                <Row type="flex" align="middle">
                                    <Col span={4} className={styles.itemTabs}>
                                        <span>车辆编号</span>
                                        <AutoComplete
                                            dataSource={this.state.autoComplete_carCode}
                                            onSearch={this.onBusyCarCodeAutoCompleteSearch}
                                            allowClear={true}
                                            placeholder="车辆编号" size="large"
                                            onChange={(value) => this.setState({filter_carCode: value})}
                                            value={this.state.filter_carCode}>
                                            <Input maxLength="15"/>
                                        </AutoComplete>
                                    </Col>

                                    <Col span={10}>
                                        <span style={{marginRight: '20px'}}>时间选择</span>
                                        <DatePicker style={{width: '18%'}} defaultValue={busyCarsBeginDate}
                                                    format="YYYY-MM-DD"
                                                    onChange={this.handleBusyCarsBeginDate}>
                                        </DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('00', format)}
                                                    format="HH"
                                                    onChange={this.handleBusyCarsBeginTime}>
                                        </TimePicker>&nbsp;

                                        <Icon style={{color: '#a8a8a8'}} type="minus"/>&nbsp;
                                        <DatePicker style={{width: '18%'}} defaultValue={busyCarsEndDate}
                                                    format="YYYY-MM-DD"
                                                    onChange={this.handleBusyCarsEndDate}>
                                        </DatePicker>&nbsp;
                                        <TimePicker style={{width: '18%'}} defaultValue={moment('23:59', format)}
                                                    format="HH"
                                                    onChange={this.handleBusyCarsEndTime}>
                                        </TimePicker>
                                    </Col>

                                    <Col span={6}>
                                        <Button type="primary" icon="search" className={styles.searchBtn} onClick={this.onFilterCarBusy}>查询</Button>
                                        <Button type="primary" icon="sync" className={styles.resetBtn} onClick={this.onResetSearch}>重置</Button>
                                    </Col>
                                </Row>

                                {/*甘特图*/}
                                <Row className={styles.tableRow2}>
                                    <Col span={24}>
                                        <Table rowKey={record => record.carCode}
                                               className={styles.table} bordered={true}
                                               footer={(record) => '共计 ' + record.length + ' 条数据'}
                                               size="middle"
                                               loading={tableDataLoading}
                                               columns={columnsBusy}
                                               dataSource={carMsgList}
                                               scroll={{x: this.scrollBar()}}>
                                        </Table>
                                    </Col>
                                </Row>

                            </Content>
                        </TabPane>
                    </Tabs>
                </div>
            </Layout>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        showErrorMessage: (message) => dispatch(showErrorMessage(message)),
        showStatisticalFormModal: (operation, deviceCode) => dispatch(statisticalFormModalShow(operation, deviceCode)),
        queryCenterAreaData: (deviceCode, count) => dispatch(getCenterAreaStaticData(deviceCode, count)),
        queryAllCarMsg: () => dispatch(queryAllCarMsgBegin()),
        queryAllCarMsgList: () => dispatch(queryAllCarMsgListBegin()),
        getCarCategory: () => dispatch(getCarCategory()),
        getDensityStatic: (startdate, enddate) => dispatch(getDensityData(startdate, enddate)),
        getSpeedStatic: (startdate, enddate) => dispatch(getSpeedData(startdate, enddate)),
        getAbnormalStatic: (startdate, enddate) => dispatch(getAbnormalData(startdate, enddate))
    };
}

const selectorStateToProps = createStructuredSelector({
    tableDataLoading: tableDataLoadingSelector(),
    statisticalEntity: statisticalEntitySelector(),

    carMsg: carMsgSelector(),
    carMsgList: carMsgListSelector(),
    carCategory: carCategorySourceSelector(),

    densityEntity: densityEntitySelector(),
    speedEntity: speedEntitySelector(),
    abnormalEntity: abnormalEntitySelector()
});

export default connect(selectorStateToProps, actionsDispatchToProps)(StatisticalPage);