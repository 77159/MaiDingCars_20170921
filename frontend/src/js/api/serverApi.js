/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2016/11/27
 * @describe API接口封装类(封装通用的请求方法)
 */
import {
    invokeServerAPI,
} from './restApi.js';

import * as cookies from './cookies.js';

/**
 * 查询所有设备信息
 * @returns {Promise.<TResult>|*}
 */
export function queryAllDeviceAPI() {
    //在客户端进行分页处理，此处单页数据最大条数设置为1000条,以后如果超过了1000条的数量，需要调整为更大
    return invokeServerAPI(`devices?pageNum=1&pageSize=1000&accessToken=${token}`, 'GET', null);
}

/**
 * 查询单台设备信息
 * @param deviceCode 设备编号
 * @returns {Promise.<TResult>|*}
 */
export function queryDeviceAPI(deviceCode) {
    return invokeServerAPI(`device/${deviceCode}?accessToken=${token}`, 'GET', null);
}

/**
 * 添加设备
 * @param deviceEntity 设备实体
 * @returns {Promise.<TResult>|*}
 */
export function createDeviceAPI(deviceEntity) {
    return invokeServerAPI(`devices`, 'POST', deviceEntity);
}

/**
 * 删除设备（一台或多台）
 * @param deviceCodes 设备编号
 * @returns {Promise.<TResult>|*}
 */
export function deleteDevicesAPI(deviceCode) {
    return invokeServerAPI(`devices`, 'DELETE', deviceCode);
}

/**
 * 修改设备信息
 * @param deviceEntity 设备实体对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyDeviceAPI(deviceEntity) {
    return invokeServerAPI(`devices`, 'PUT', deviceEntity);
}


/**
 * 查询所有未被使用的设备编号
 * @returns {Promise.<TResult>|*}
 */
export function queryAllNotDeviceAPI() {
    return invokeServerAPI(`devices/unbounded`, 'GET', null);
}

/*************************车辆操作*************************/

/**
 * 查询所有车辆信息
 * @returns {Promise.<TResult>|*}
 */
export function queryAllCarAPI() {
    return invokeServerAPI(`cars?pageNum=1&pageSize=1000&accessToken=${token}`, 'GET', null);
}

/**
 * 查询单个车辆信息
 * @param carCode  需要根据carCode来查询
 * @returns {Promise.<TResult>|*}
 */
export function queryCarAPI(carCode) {
    return invokeServerAPI(`cars/${carCode}?accessToken=${token}`, 'GET', null);
}

/**
 * 添加车辆
 * @param carEntity  车辆实体对象
 * @returns {Promise.<TResult>|*}
 */
export function createCarAPI(carEntity) {
    return invokeServerAPI(`cars`, 'POST', carEntity);
}

/**
 * 删除车辆
 * @param carCode  车辆编号
 * @returns {Promise.<TResult>|*}
 */
export function deleteCarsAPI(carCode) {
    return invokeServerAPI(`cars`, 'DELETE', carCode);
}

/**
 * 修改车辆信息
 * @param carEntity  车辆实体对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyCarAPI(carEntity) {
    return invokeServerAPI(`cars`, 'PUT', carEntity);
}

/*************************车辆类型操作*************************/

/**
 * 查询所有车辆类型信息
 * @returns {Promise.<TResult>|*}
 */
export function getAllCarCategoryAPI() {
    return invokeServerAPI(`cartype`, 'GET', null);
}

/**
 * 添加所有车辆类型
 * @param carCategory 车辆类型的实体
 * @returns {Promise.<TResult>|*}
 */
export function postCarCategory(carCategory) {
    return invokeServerAPI(`cartype`, 'POST', carCategory);
}

/**
 * 删除车辆类型根据     车辆类型id
 * @param id
 * @returns {Promise.<TResult>|*}
 */
export function deleteCarCategory(id) {
    return invokeServerAPI(`cartype/${id}`, 'DELETE', null);
}

/**
 * 根据车辆类型id查询车辆类型
 * @param id
 * @returns {Promise.<TResult>|*}
 */
export function getCarCategoryById(id) {
    return invokeServerAPI(`cartype/${id}`, 'GET', null);
}

/**
 * 修改车辆类型
 * @param carCategory  车辆类型的实体
 * @returns {Promise.<TResult>|*}
 */
export function putCarCategory(carCategory) {
    return invokeServerAPI(`cartype`, 'PUT', carCategory);
}

/************************* 地图区域操作 *************************/

/**
 * 查询地图区域列表
 * @returns {Promise.<TResult>|*}
 */
export function queryArea() {
    return invokeServerAPI(`area`, 'GET', null);
}

/**
 * 删除地图区域
 * @param areaName 当前区域主键id
 * @returns {Promise.<TResult>|*}
 */
export function delteAreaById(areaName) {
    return invokeServerAPI(`area/${areaName}`, 'DELETE', null);
}

/**
 * 创建地图区域
 * @param area 地图区域实体对象
 * @returns {Promise.<TResult>|*}
 */
export function createArea(area) {
    return invokeServerAPI(`area`, 'POST', area);
}

/**
 * 根据区域主键id获取地图区域对象
 * @param id 区域主键id
 * @returns {Promise.<TResult>|*}
 */
export function queryAreaById(id) {
    return invokeServerAPI(`area/${id}`, 'GET', null);
}

/**
 * 更新地图区域信息
 * @param area 地图区域对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyArea(area) {
    return invokeServerAPI(`area`, 'PUT', area);
}


/************************* 车辆登陆操作 *************************/
/**
 * @param loginMsg 车辆登陆信息对象
 * @returns {Promise.<TResult>|*}
 */
export function changeUsernameAPI(loginMsg) {
    return invokeServerAPI(`user/login`, 'POST', loginMsg);
}

/**
 * @param passwordMsg 修改密码信息对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyPasswordAPI(passwordMsg) {
    return invokeServerAPI(`user/getpass`, 'PUT', passwordMsg);
}

/**
 * 登出
 * @returns {Promise.<TResult>|*}
 */
export function loginOutAPI() {
    let token = {
        token: window.token
    };
    return invokeServerAPI(`user/logout?token=${token}`, 'POST', null);
}

/************************* 统计分析 *************************/
/**
 * 查询车辆信息
 * @returns {Promise.<TResult>|*}
 */
export function queryAllCarMsgAPI() {
    return invokeServerAPI(`statisticalAnalysis`, 'GET', null);
}

/**
 * 查询车辆信息列表
 * @returns {Promise.<TResult>|*}
 */
export function queryAllCarMsgListAPI() {
    return invokeServerAPI(`cars/carinfoproportion`, 'GET', null);
}

/**
 * [getCenterAreaStaticData 查询集中区域单条统计信息]
 * @param  {[type]} deviceId [description]
 * @return {[type]}          [description]
 */
export function getCenterAreaStaticData(deviceId) {
    return invokeServerAPI(`cars/jzqu/${deviceId}`, 'GET', null);
}

/**
 * 查询一个车辆信息
 * @returns {Promise.<TResult>|*}
 */
export function queryOneCarMsgAPI(carCode) {
    return invokeServerAPI(`cars/jzqu/${carCode}`, 'GET', null);
}

/**
 * 轨迹回放
 * @returns {Promise.<TResult>|*}
 */
export function traceReplayAPI(traceReplayMsg) {
    return invokeServerAPI(`cars/history?carCode=${traceReplayMsg[0]}&beginTime=${traceReplayMsg[1]}&endTime=${traceReplayMsg[2]}`, 'GET');
}

export function queryDensityStatics(startdate, enddate) {
    return invokeServerAPI(`area/areadensestatistics?beginTime=${startdate}&endTime=${enddate}`, 'GET');
}

export function querySpeedStatics(startdate, enddate) {
    return invokeServerAPI(`cars/speedStatistics?beginTime=${startdate}&endTime=${enddate}`, 'GET');
}

export function queryAbnormalStatics(startdate, enddate) {
    return invokeServerAPI(`cars/carsException?beginTime=${startdate}&endTime=${enddate}`, 'GET');
}

/**
 * 查询甘特图
 * @returns {Promise.<TResult>|*}
 */
export function queryGanttAPI(startdate, enddate) {
    return invokeServerAPI(`ganttChart?beginTime=${startdate}&endTime=${enddate}`, 'GET');
}


/**
 * 请求热力图数据信息
 * @param param
 * @returns {Promise.<TResult>|*}
 */
export function requestHeatMapDatas(param) {
    return invokeServerAPI(`thermogram?beginTime=${param.startValue}&endTime=${param.endValue}&carCode=${param.checkedKeys}`, 'GET');
}