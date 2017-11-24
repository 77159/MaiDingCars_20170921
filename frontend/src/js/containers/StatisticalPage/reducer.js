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
    GET_ABNORMAL_DATA_DONE
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
    abnormalEntity: {}
});

//获取密度统计数据
function getdensityEntity(origindata, totalCarNum) {
    let tmpEntity_ = {},
        totalNum = 0;
    tmpEntity_.data = [];
    tmpEntity_.legendData = [];
    tmpEntity_.data = origindata.map((item) => {
        let percent = item.totalTime == 0 ? 0 : parseFloat((item.warnNum / item.totalTime) * 100),
            name = item.areaName + '\n密集程度：' + percent.toFixed(2) + '% 报警次数：' + item.warnNum;
        tmpEntity_.legendData.push(name);
        totalNum += parseInt(item.warnNum);
        return {
            value: item.warnNum,
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

function getSpeedEntity(origindata) {
    let tmpEntity_ = {};
    tmpEntity_.xdata = [];
    //tmpEntity_.ydata = [];
    tmpEntity_.ymax = parseFloat(origindata.totalMaxSpeed).toFixed(2);
    //let averageSpeed_ = origindata.carsNum == 0 ? 0 : parseFloat(origindata.totalMaxSpeed / origindata.carsNum).toFixed(2);;
    // tmpEntity_.ydata.push(averageSpeed_);
    // tmpEntity_.ydata.push(parseFloat(origindata.totalMaxSpeed).toFixed(2));

    if (origindata.carsNum <= 5) {
        for (var i = 0; i < origindata.carsNum; i++) {
            tmpEntity_.xdata.push(i + 1);
        }
    } else {
        let xAverage_ = parseFloat(origindata.carsNum / 5).toFixed(1);
        for (var i = 0; i < 5; i++) {
            if (i == 5) {
                tmpEntity_.xdata.push(origindata.carsNum);
            } else
                tmpEntity_.xdata.push(i * xAverage_);
        }
    }

    tmpEntity_.data = tmpEntity_.xdata.map((item, index) => {
        return 0.0;
    });

    if(origindata.result) {
        origindata.result.map((item, index) => {
            tmpEntity_.data[index] = parseFloat(item.maxSpeed).toFixed(2);
        });
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

    return state;
}