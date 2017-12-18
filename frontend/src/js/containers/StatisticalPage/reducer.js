/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计分析页面 reducer
 */

'use strict';
import {
    fromJS
} from 'immutable';

import {
    STATISTICAL_OP_BEGIN,
    STATISTICAL_OP_FINISH,
    CAR_MSG_FINISH,
    CAR_MSG_LIST_FINISH,
    GET_DENSITY_DATA_DONE,
    GET_SPEED_DATA_DONE,
    GET_ABNORMAL_DATA_DONE,
    GET_GANTT_FINISH,
    DENSITY_OPERATING_BEGIN,
    DENSITY_OPERATING_FINISH,
    SPEED_OPERATING_BEGIN,
    SPEED_OPERATING_FINISH,
    ABNORMAL_OPERATING_BEGIN,
    ABNORMAL_OPERATING_FINISH
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //表格数据加载状态  【True】加载中 【False】加载完成
    tableDataLoading: true,
    //设备数据
    carMsg: null,
    carMsgList: null,
    densityEntity: {},
    speedEntity: {},
    abnormalEntity: {},
    densityIsShow: ['block'],
    speedIsShow: ['block'],
    abnormalIsShow: ['block']
});

//获取密度统计数据
function getdensityEntity(origindata, totalCarNum) {

    let tmpEntity_ = {},
        totalNum = 0;
    tmpEntity_.data = [];
    tmpEntity_.legendData = [];
    let totalTimeArr = [];
    let mijichengdu;
    tmpEntity_.data = origindata.map((item) => {
        totalTimeArr.push(item.totalTime);
        mijichengdu = eval(totalTimeArr.join('+'));
    });
    
    tmpEntity_.data = origindata.map((item) => {
        let percent = item.totalTime == 0 ? 0 : parseFloat((item.totalTime / mijichengdu) * 100),
            name = item.areaName + '\n密集程度：' + percent.toFixed(2) + '% 报警次数：' + item.warnNum;
        tmpEntity_.legendData.push(name);
        totalNum += parseInt(item.warnNum);
        return {
            value: item.totalTime,
            name: name
        };
    });

    if (totalNum == 0 && tmpEntity_.data) {
        let allname = '其他区域\n密集程度：' + (totalCarNum > 0 ? 100 : 0.00) + '% 报警次数：0';
        tmpEntity_.legendData.push(allname);
        tmpEntity_.data.push({
            value: totalCarNum,
            name: allname
        });
    }

    return tmpEntity_;
}

//获取车辆速度统计数据
function getSpeedEntity(origindata) {
    let tmpEntity_ = {};
    tmpEntity_.carNum = [];
    //tmpEntity_.ydata = [];
    // tmpEntity_.ymax = parseFloat(origindata.totalMaxSpeed).toFixed(2);
    //let averageSpeed_ = origindata.carsNum == 0 ? 0 : parseFloat(origindata.totalMaxSpeed / origindata.carsNum).toFixed(2);;
    // tmpEntity_.ydata.push(averageSpeed_);
    // tmpEntity_.ydata.push(parseFloat(origindata.totalMaxSpeed).toFixed(2));

    // if (origindata.carsNum <= 5) {
    //     for (var i = 0; i < origindata.carsNum; i++) {
    //         tmpEntity_.carNum.push(i + 1);
    //     }
    // } else {
    //     let xAverage_ = parseFloat(origindata.carsNum / 5).toFixed(1);
    //     for (var i = 0; i < 5; i++) {
    //         if (i == 5) {
    //             tmpEntity_.carNum.push(origindata.carsNum);
    //         } else
    //             tmpEntity_.carNum.push(i * xAverage_);
    //     }
    // }

    tmpEntity_.speedData = tmpEntity_.carNum.map((item, index) => {
        return 0.0;
    });
    
    let avgMax = [];
    let avgSpeed = [];
    let avgMin = [];
    let speed = [];
    let avgMin_ = [];
    let avgSpeed_ = [];
    let avgMax_ = [];
    let carNum = [];
    
    if(origindata.result) {
        origindata.result.map((item, index) => {
            //最小速度
            if(item.minSpeed) {
                avgMin.push(parseFloat(item.minSpeed).toFixed(2));
            }
            //平均速度
            if(item.avgSpeed) {
                avgSpeed.push(parseFloat(item.avgSpeed).toFixed(2));
            }
            //最大速度
            if(item.maxSpeed) {
                avgMax.push(parseFloat(item.maxSpeed).toFixed(2));
            }
        });
        
        avgMin_ = parseFloat((avgMin.reduce((x ,y)=>{return x*1+y*1;}))/origindata.result.length).toFixed(2);
        avgSpeed_ = parseFloat((avgSpeed.reduce((x ,y)=>{return x*1+y*1;}))/origindata.result.length).toFixed(2);
        avgMax_ = parseFloat((avgMax.reduce((x ,y)=>{return x*1+y*1;}))/origindata.result.length).toFixed(2);
        
        speed.push(avgMin_);
        speed.push(avgSpeed_);
        speed.push(avgMax_);

        let num1 = 0;
        let arrNum1 = [];
        let num2 = 0;
        let arrNum2 = [];
        let num3 = 0;
        let arrNum3 = [];
        origindata.result.map((item, index) => {
            if((parseFloat(item.avgSpeed).toFixed(2)) > 0 && ((parseFloat(item.avgSpeed).toFixed(2)) < (avgSpeed_ - 1))){
                num1++;
                arrNum1.push(num1);
            }else {
                arrNum1.push(num1);
            }
        });
        carNum.push(arrNum1[arrNum1.length-1]);
        origindata.result.map((item, index) => {
            if(((avgSpeed_ - 1) < (parseFloat(item.avgSpeed).toFixed(2))) && ((avgSpeed_*1 + 1) > (parseFloat(item.avgSpeed).toFixed(2)))){
                num2++;
                arrNum2.push(num2);
            }else {
                arrNum2.push(num2);
            }
        });
        carNum.push(arrNum2[arrNum2.length-1]);
        origindata.result.map((item, index) => {
            if(((avgSpeed_*1 + 1) < (parseFloat(item.avgSpeed).toFixed(2))) && ((parseFloat(item.avgSpeed).toFixed(2)) < avgMax_)){
                num3++;
                arrNum3.push(num3);
            }else {
                arrNum3.push(num3);
            }
        });
        carNum.push(arrNum3[arrNum3.length-1]);
        
        tmpEntity_.speedData = speed;
        tmpEntity_.carNum = carNum;
    }
    return tmpEntity_;
}

//获取异常车辆的统计数据
function getAbnormalEntity(origindata) {
    let tmpEntity_ = {};
    tmpEntity_.xdata = [];
    tmpEntity_.yAxis = origindata.carsNum;
    tmpEntity_.series = {};

    //先根据时间排序
    let sortArr = [];
    for (var key in origindata.warn) {
        sortArr.push(new Date(key));
    }

    //升序
    sortArr = sortArr.sort(function(a, b) {
        return a > b ? 1 : -1;
    });

    //对排序后的数组整合echart所需的数组
    for (var i = 0, ilen = sortArr.length; i < ilen; i++) {
        let key = sortArr[i].format('yyyy-MM-dd');
        let items = origindata.warn[key];
        tmpEntity_.xdata.push(key);
        items.map((item) => {
            if (!tmpEntity_.series[item.type]) tmpEntity_.series[item.type] = [];
            tmpEntity_.series[item.type].push(item.count);
        });
    }

    return tmpEntity_;
}

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //对设备数据的操作（CURD）开始
    if (type === STATISTICAL_OP_BEGIN) {
        return state
            .set('tableDataLoading', true);
    }

    //对设备数据的操作（CURD）结束
    if (type === STATISTICAL_OP_FINISH) {
        return state
            .set('tableDataLoading', false);
    }

    //查询所有车辆信息-结束
    if (type === CAR_MSG_FINISH) {
        return state
            .set('carMsg', payload);
    }

    //查询所有车辆信息列表-结束
    if (type === CAR_MSG_LIST_FINISH) {
        return state
            .set('carMsgList', payload);
    }

    //区域密度统计
    if (type === GET_DENSITY_DATA_DONE) {
        let totalCarNum = state.get('carMsgList');
        if(totalCarNum) {
            let tmpEntity_ = getdensityEntity(payload.working, totalCarNum.length);
            return state
                .set('densityEntity', tmpEntity_);
        }
    }

    //车辆速度统计
    if (type === GET_SPEED_DATA_DONE) {
        let tmpEntity_ = getSpeedEntity(payload);
        return state
            .set('speedEntity', tmpEntity_);
    }

    //车辆异常统计
    if (type === GET_ABNORMAL_DATA_DONE) {
        let tmpEntity_ = getAbnormalEntity(payload);
        return state
            .set('abnormalEntity', tmpEntity_);
    }


    //查询甘特图数据-结束
    if (type === GET_GANTT_FINISH) {
        return state
            .set('ganttEntity', payload);
    }

    //查询密度统计数据（CURD）开始
    if (type === DENSITY_OPERATING_BEGIN) {
        return state
            .set('densityIsShow', ['block']);
    }

    //查询密度统计数据（CURD）结束
    if (type === DENSITY_OPERATING_FINISH) {
        return state
            .set('densityIsShow', ['none']);
    }

    //查询车辆速度统计数据（CURD）开始
    if (type === SPEED_OPERATING_BEGIN) {
        return state
            .set('speedIsShow', ['block']);
    }

    //查询车辆速度统计数据（CURD）结束
    if (type === SPEED_OPERATING_FINISH) {
        return state
            .set('speedIsShow', ['none']);
    }

    //查询车辆异常统计数据（CURD）开始
    if (type === ABNORMAL_OPERATING_BEGIN) {
        return state
            .set('abnormalIsShow', ['block']);
    }

    //查询车辆异常统计数据（CURD）结束
    if (type === ABNORMAL_OPERATING_FINISH) {
        return state
            .set('abnormalIsShow', ['none']);
    }

    return state;
}