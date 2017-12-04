/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计页面 Actions
 */
'use strict';
import {
    STATISTICAL_OP_BEGIN,
    STATISTICAL_OP_FINISH,
    CAR_MSG_BEGIN,
    CAR_MSG_FINISH,
    CAR_MSG_LIST_BEGIN,
    CAR_MSG_LIST_FINISH,
    GET_DENSITY_DATA,
    GET_DENSITY_DATA_DONE,
    GET_SPEED_DATA,
    GET_SPEED_DATA_DONE,
    GET_ABNORMAL_DATA,
    GET_ABNORMAL_DATA_DONE,
    GET_GANTT_BEGIN,
    GET_GANTT_FINISH,
    OPERATING_BEGIN,
    OPERATING_FINISH
} from './constants';

/**
 * 对设备数据的操作（CURD）开始
 */
export const statisticalOpBegin = () => ({
    type: STATISTICAL_OP_BEGIN
});

/**
 * 对设备数据的操作（CURD）结束
 */
export const statisticalOpFinish = () => ({
    type: STATISTICAL_OP_FINISH
});

/**
 * 查询所有车辆信息-开始
 */
export const queryAllCarMsgBegin = () => ({
    type: CAR_MSG_BEGIN
});

/**
 * 查询车辆信息-结束
 * @param carMsg 信息集合
 */
export const queryAllCarMsgFinish = (carMsg) => ({
    type: CAR_MSG_FINISH,
    payload: carMsg
});

/**
 * 查询所车辆信息列表-开始
 */
export const queryAllCarMsgListBegin = () => ({
    type: CAR_MSG_LIST_BEGIN
});

/**
 * 查询车辆信息列表-结束
 * @param carMsgList 信息列表集合
 */
export const queryAllCarMsgListFinish = (carMsgList) => ({
    type: CAR_MSG_LIST_FINISH,
    payload: carMsgList
});

/**
 * [查询区域密度统计数据]
 * @param  {[type]} startdate [起点日期]
 * @param  {[type]} enddate   [终点日期]
 * @return {[type]}           [发送后台请求]
 */
export const getDensityData = (startdate, enddate) => ({
    type: GET_DENSITY_DATA,
    payload: {
        startdate,
        enddate
    }
});

/**
 * [查询区域密度统计数据-请求完成回调]
 **/
export const getDensityDataDone = (response) => ({
    type: GET_DENSITY_DATA_DONE,
    payload: response
});

/**
 * [查询车辆速度统计数据]
 * @param  {[type]} startdate [起点日期]
 * @param  {[type]} enddate   [终点日期]
 * @return {[type]}           [发送后台请求]
 */
export const getSpeedData = (startdate, enddate) => ({
    type: GET_SPEED_DATA,
    payload: {
        startdate,
        enddate
    }
});

/**
 * [查询车辆速度统计数据-请求完成回调]
 **/
export const getSpeedDataDone = (response) => ({
    type: GET_SPEED_DATA_DONE,
    payload: response
});


/**
 * [查询车辆异常统计数据]
 * @param  {[type]} startdate [起点日期]
 * @param  {[type]} enddate   [终点日期]
 * @return {[type]}           [发送后台请求]
 */
export const getAbnormalData = (startdate, enddate) => ({
    type: GET_ABNORMAL_DATA,
    payload: {
        startdate,
        enddate
    }
});


/**
 * [查询车辆异常统计数据-请求完成回调]
 **/
export const getAbnormalDataDone = (response) => ({
    type: GET_ABNORMAL_DATA_DONE,
    payload: response
});


/**
 * [查询甘特图统计数据]
 * @param  {[type]} startdate [起点日期]
 * @param  {[type]} enddate   [终点日期]
 * @return {[type]}           [发送后台请求]
 */
export const getGantt = (startdate, enddate) => ({
    type: GET_GANTT_BEGIN,
    payload: {
        startdate,
        enddate
    }
});

/**
 * [查询甘特图统计数据-请求完成回调]
 **/
export const getGanttDone = (response) => ({
    type: GET_GANTT_FINISH,
    payload: response
});


/**
 * 查询统计数据（CURD）开始
 */
export const operatingBegin = () => ({
    type: OPERATING_BEGIN
});

/**
 * 查询统计数据（CURD）结束
 */
export const operatingFinish = () => ({
    type: OPERATING_FINISH
});
