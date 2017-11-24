/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计信息对话框（Modal） reducer
 */
'use strict';
import {
    fromJS
} from 'immutable';
import {
    STATISTICAL_FORM_MODAL_SHOW,
    STATISTICAL_FORM_MODAL_OP_BEGIN,
    STATISTICAL_FORM_MODAL_OP_FINISH,
    STATISTICAL_FORM_MODAL_HIDE,
    GET_CENTER_AREA_DATA_DONE
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //Modal显示状态  [True]显示 [False]隐藏
    modalVisible: false,
    //操作执行状态  [True] 执行中 [False] 未执行
    operationRunning: false,
    //操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
    operation: 'view',
    //设备实体对象 当操作类型为 [view | modify ] 时，需要传入设备对象
    deviceEntity: false,
    centerAreaEntity: {}
});

function getCenterAreaEntity(origindata, totalcount) {
    let tmpEntity_ = {},
        totalCarNum = 0;
    tmpEntity_.totalTime = Math.floor(origindata.totalTime / 3600 * 10) / 10;
    tmpEntity_.data = [];
    tmpEntity_.legendData = [];
    tmpEntity_.data = origindata.workTimeList.map((item) => {
        let percent = tmpEntity_.totalTime == 0 ? 0 : parseFloat(((Math.floor(item.totalTime / 3600 * 10) / 10) / tmpEntity_.totalTime) * 100),
            name = item.areaName + ': ' + Math.floor(item.totalTime / 3600 * 10) / 10 + 'h（' + percent.toFixed(1) + '%）';
        tmpEntity_.legendData.push(name);
        totalCarNum += parseInt(item.totalTime);
        return {
            value: item.totalTime,
            name: name
        };
    });

    if (totalCarNum == 0) {
        let totalname = '其他: ' + Math.floor(totalcount / 3600 * 10) / 10 + 'h（' + (totalcount > 0 ? 100 : 0.00) + '%）';
        tmpEntity_.legendData.push(totalname);
        tmpEntity_.data.push({
            value: totalcount,
            name: totalname
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
    if (type === STATISTICAL_FORM_MODAL_OP_BEGIN) {
        return state
            .set('operationRunning', true);
    }

    //对设备数据的操作（CURD）结束
    if (type === STATISTICAL_FORM_MODAL_OP_FINISH) {
        return state
            .set('operationRunning', false);
    }

    //显示设备信息对话框
    if (type === STATISTICAL_FORM_MODAL_SHOW) {
        return state
            .set('modalVisible', true)
            .set('operation', payload.operation)
            .set('deviceEntity', payload.deviceEntity)
    }

    //隐藏设备信息对话框
    if (type === STATISTICAL_FORM_MODAL_HIDE) {
        return state
            .set('modalVisible', false)
            .set('operation', 'view')
            .set('deviceCode', false)
    }

    //接收数据
    if (type === GET_CENTER_AREA_DATA_DONE) {
        let tmpEntity_ = getCenterAreaEntity(payload.centerAreaEntity, payload.count);
        return state.set('centerAreaEntity', tmpEntity_);
    }

    return state;
}