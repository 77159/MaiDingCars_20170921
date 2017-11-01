/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  {zxg} (zhangxiaoguang@fengmap.com)
 * @date     {2017/2/25}
 * @describe 图标管理 Dialog Actions 集合
 */
import {
	bindActionCreators
} from 'redux';

//引用canvas actions
//@author cwj
import * as mapCanvasActions from '../MapCanvas/actions.js';
import * as fmapThemeCtrlActions from '../FMapThemeCtrl/actions';

/**
 * Action 类型常量
 */
//显示&隐藏 图标管理窗口
export const SHOW_POI_MANAGEMENT_DIALOG = "POIManagement/SHOW_POI_MANAGEMENT_DIALOG";
//获取系统默认图标数据
export const GET_SYSTEM_POIICON_DATA = "POIManagement/GET_SYSTEM_POIICON_DATA";

//获取用户图标
export const GET_USER_POI_ICON = 'MapContainer/GET_USER_POI_ICON';
//获取用户图标数据成功
export const GET_USER_POI_ICON_DONE = 'MapContainer/GET_USER_POI_ICON_DONE';

//获取系统默认图标
export const GET_DEFAULT_POI_ICON = 'MapContainer/GET_DEFAULT_POI_ICON';
//获取用户图标数据成功
export const GET_DEFAULT_POI_ICON_DONE = 'MapContainer/GET_DEFAULT_POI_ICON_DONE';

//编辑用户图标
export const UPDATE_USER_POI_ICON = 'MapContainer/UPDATE_USER_POI_ICON';

//编辑用户图标保存成功
export const UPDATE_USER_POI_ICON_DONE = 'MapContainer/UPDATE_USER_POI_ICON_DONE';

//删除用户图标
export const REMOVE_USER_POI_ICON = 'MapContainer/REMOVE_USER_POI_ICON';

//成功删除用户图标
export const REMOVE_USER_POI_ICON_DONE = 'MapContainer/REMOVE_USER_POI_ICON_DONE';

//显示默认图标&用户图标 管理窗口
export const SHOW_POI_TYPE = "POIManagement/SHOW_POI_TYPE";

/**
 * 显示&隐藏 图标管理弹出框
 * @param visible 是否显示 【True】显示 【False】隐藏
 */
export const showPOIManagementDialog = (visible) => ({
	type: SHOW_POI_MANAGEMENT_DIALOG,
	payload: visible
});

/**
 * 显示默认图标&用户图标 管理窗口
 * @param visible 是否显示 【True】显示 【False】隐藏
 */
export const showPOItype = (poiType) => ({
	type: SHOW_POI_TYPE,
	payload: poiType
});

/**
 * 获取系统默认图标数据
 */
export const getSystemPOIIconData = () => ({
	type: GET_SYSTEM_POIICON_DATA
});


/**
 * 获取用户图标
 * @param  {[type]} layerType [description]
 * @return {[type]}           [description]
 */
export const getUserPoiIcon = () => ({
	type: GET_USER_POI_ICON
});

/**
 * 获取用户图标数据完成
 * @param  {[Array]} userPoi [description]
 * @return {[type]}         [description]
 */
export const getUserPoiIconDone = (userPoi) => ({
	type: GET_USER_POI_ICON_DONE,
	payload: userPoi
});

/**
 * 获取系统默认图标
 * @param token 用户登录token。从蜂鸟云后台传过来
 */
export const getDefaultPoiIcon = () => ({
	type: GET_DEFAULT_POI_ICON
});

/**
 * 获取系统默认图标
 * @param  {[Array]} defaultPoi [系统默认图标数据]
 */
export const getDefaultPoiIconDone = (defaultPoi) => ({
	type: GET_DEFAULT_POI_ICON_DONE,
	payload: defaultPoi
});

/**
 * 删除用户图标
 * @param  {[type]} delePoi [删除图标的详细信息]
 * @param mapId 地图ID。从蜂鸟云后台传过来
 */
export const removeUserPoiIcon = (removePoi, callback) => ({
	type: REMOVE_USER_POI_ICON,
	payload: {
		removePoi,
		callback
	}
});

/**
 * 删除用户图标成功
 * @param  {[type]} delePoi [删除图标的详细信息]
 * @param mapId 地图ID。从蜂鸟云后台传过来
 */
export const removeUserPoiIconDone = (removePoi, callback) => ({
	type: REMOVE_USER_POI_ICON_DONE,
	payload: {
		removePoi,
		callback
	}
});

/**
 * 修改用户图标数据
 * @param  {[type]} updataPoi [修改图标的详细信息]
 * * @param mapId 地图ID。从蜂鸟云后台传过来
 */
export const updateUserPoiIcon = (updataPoi, callback) => ({
	type: UPDATE_USER_POI_ICON,
	payload: {
		updataPoi,
		callback

	}
});

/**
 * 修改用户图标数据成功
 * @param  {[type]} updataPoi [修改图标的详细信息]
 * * @param mapId 地图ID。从蜂鸟云后台传过来
 */
export const updateUserPoiIconDone = (updataPoi, callback) => ({
	type: UPDATE_USER_POI_ICON_DONE,
	payload: {
		updataPoi,
		callback
	}
});


export const containerActions = (dispatch) => bindActionCreators({
	//POIManagement actions
	showPOIManagementDialog,
	getSystemPOIIconData,
	getUserPoiIcon,
	getUserPoiIconDone,
	getDefaultPoiIcon,
	getDefaultPoiIconDone,
	removeUserPoiIcon,
	removeUserPoiIconDone,
	updateUserPoiIcon,
	updateUserPoiIconDone,
	showPOItype,

	//mapCanvas actions
	updateTheme: mapCanvasActions.updateTheme,
	operateThemeLists: fmapThemeCtrlActions.operateThemeLists,
}, dispatch);