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
    console.log('进入设备serverAPI');
    return invokeServerAPI(`devices`, 'POST', deviceEntity);
}

/**
 * 删除设备（一台或多台）
 * @param deviceCodes 设备编号
 * @returns {Promise.<TResult>|*}
 */
export function deleteDevicesAPI(deviceCode) {
    console.log('进入删除设备serverAPI', deviceCode);
    return invokeServerAPI(`devices`, 'DELETE', deviceCode);
}

/**
 * 修改设备信息
 * @param deviceEntity 设备实体对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyDeviceAPI(deviceEntity) {
    console.log('进入修改设备信息service', deviceEntity);
    return invokeServerAPI(`devices`, 'PUT', deviceEntity);
}


/**
 * 查询所有未被使用的设备编号
 * @returns {Promise.<TResult>|*}
 */
export function queryAllNotDeviceAPI() {
    console.log('进入未被使用的设备serverAPI');
    return invokeServerAPI(`devices/unbounded`, 'GET', null);
}

/*************************人员操作*************************/

/**
 * 查询所有人员信息
 * @returns {Promise.<TResult>|*}
 */
export function queryAllCarAPI() {
    return invokeServerAPI(`cars?pageNum=1&pageSize=1000&accessToken=${token}`, 'GET', null);
}

/**
 * 查询单个人员信息
 * @param carCode  需要根据carCode来查询
 * @returns {Promise.<TResult>|*}
 */
export function queryCarAPI(carCode) {
    return invokeServerAPI(`cars/${carCode}?accessToken=${token}`, 'GET', null);
}

/**
 * 添加人员
 * @param carEntity  人员实体对象
 * @returns {Promise.<TResult>|*}
 */
export function createCarAPI(carEntity) {
    console.log('进入添加人员serverAPI');
    return invokeServerAPI(`cars`, 'POST', carEntity);
}

/**
 * 删除人员
 * @param carCode  人员编号
 * @returns {Promise.<TResult>|*}
 */
export function deleteCarsAPI(carCode) {
    return invokeServerAPI(`cars`, 'DELETE', carCode);
}

/**
 * 修改人员信息
 * @param carEntity  人员实体对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyCarAPI(carEntity) {
    console.log('进入修改人员信息service', carEntity);
    return invokeServerAPI(`cars`, 'PUT', carEntity);
}

/*************************人员类型操作*************************/

/**
 * 查询所有人员类型信息
 * @returns {Promise.<TResult>|*}
 */
export function getAllCarCategoryAPI() {
    console.log('进入查询人员类型service');
    return invokeServerAPI(`cartype`, 'GET', null);
}

/**
 * 添加所有人员类型
 * @param carCategory 人员类型的实体
 * @returns {Promise.<TResult>|*}
 */
export function postCarCategory(carCategory) {
    console.log('进入创建人员类型service', carCategory);
    return invokeServerAPI(`cartype`, 'POST', carCategory);
}

/**
 * 删除人员类型根据     人员类型id
 * @param id
 * @returns {Promise.<TResult>|*}
 */
export function deleteCarCategory(id) {
    return invokeServerAPI(`cartype/${id}`, 'DELETE', null);
}

/**
 * 根据人员类型id查询人员类型
 * @param id
 * @returns {Promise.<TResult>|*}
 */
export function getCarCategoryById(id) {
    return invokeServerAPI(`cartype/${id}`, 'GET', null);
}

/**
 * 修改人员类型
 * @param carCategory  人员类型的实体
 * @returns {Promise.<TResult>|*}
 */
export function putCarCategory(carCategory) {
    console.log('修改车辆类型service', carCategory);
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


/************************* 人员登陆操作 *************************/
/**
 * @param loginMsg 人员登陆信息对象
 * @returns {Promise.<TResult>|*}
 */
export function changeUsernameAPI(loginMsg) {
    console.log('进入登陆人员serverAPI');
    return invokeServerAPI(`user/login`, 'POST', loginMsg);
}

/**
 * @param passwordMsg 修改密码信息对象
 * @returns {Promise.<TResult>|*}
 */
export function modifyPasswordAPI(passwordMsg) {
    console.log('进入修改密码serverAPI', passwordMsg);
    return invokeServerAPI(`user/getpass`, 'PUT', passwordMsg);
}

/**
 * 登出
 * @returns {Promise.<TResult>|*}
 */
export function loginOutAPI() {
    console.log('进入退出serverAPI');
    return invokeServerAPI(`user/logout`, 'POST');
}

