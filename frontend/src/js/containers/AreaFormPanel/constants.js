/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置面板
 */
'use strict';

export const CREATE_AREA = 'AreaFormPanel/CREATE_AREA';                             //添加地图区域设置
export const QUERY_AREA_BY_ID_BEGIN = 'AreaFormPanel/QUERY_AREA_BY_ID_BEGIN';       //根据主键id获取当前区域开始
export const QUERY_AREA_BY_ID_FINISH = 'AreaFormPanel/QUERY_AREA_BY_ID_FINISH';     //根据主键id获取当前区域完成
export const MODIFY_AREA = 'AreaFormPanel/MODIFY_AREA';                             //修改区域
export const LOCK_FORM = 'AreaSettingPage/LOCK_FORM';                               //锁定表单
export const UNLOCK_FORM = 'AreaSettingPage/UNLOCK_FORM';                           //解锁表单
export const EMPTY_AREA_FORM = 'AreaSettingPage/EMPTY_AREA_FORM';                   //清空表单
export const CURENTPOINTS = 'AreaSettingPage/CURENTPOINTS';                         //当前地图绘制的区域坐标点