/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理 Actions
 */
'use strict';
import {
    CAR_OP_BEGIN,
    CAR_OP_FINISH,
    QUERY_ALL_CAR_BEGIN,
    QUERY_ALL_CAR_FINISH,
    CREATE_CAR,
    MODIFY_CAR,
    GET_CAR,
    DELETE_CAR,
    UPDAT_CAR_SPEED
} from './constants';

/**
 * 对车辆数据的操作开始
 */
export const carOpBegin = () => ({
    type: CAR_OP_BEGIN
});

/**
 * 对车辆数据的操作结束
 */
export const carOpFinish = () => ({
    type: CAR_OP_FINISH
});

/**
 * 查询所有车辆信息开始
 */
export const queryAllCarBegin = () => ({
    type: QUERY_ALL_CAR_BEGIN
});

/**
 * 查询所有车辆信息结束
 * @param carData
 */
export const queryAllCarFinish = (carData) => ({
    type: QUERY_ALL_CAR_FINISH,
    payload: carData
});

/**
 * 添加车辆
 * @param carEntity      待添加的车辆对象
 */
export const createCar = (carEntity) => ({
    type: CREATE_CAR,
    payload: carEntity
});

/**
 * 修改车辆信息
 * @param carEntity      要修改的车辆对象
 */
export const modifyCar = (carEntity) => ({
    type: MODIFY_CAR,
    carEntity
});

/**
 * 根据车辆编号，查询一个车辆的的信息
 * @param carCode        车辆编号
 */
export const getCar = (carCode) => ({
    type: GET_CAR,
    payload: {
        carCode
    }
});

/**
 * 删除车辆（一个或多个）
 * @param carCode       要删除的carCode数组
 */
export const deleteCar = (carCode) => ({
    type: DELETE_CAR,
    carCode
});

/**
 * 修改车辆速度（实时更新）
 * @param obj
 */
export const updatCarSpeed = (obj) => ({
    type: UPDAT_CAR_SPEED,
    payload: obj
});