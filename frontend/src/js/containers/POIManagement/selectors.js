/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  {zxg} (zhangxiaoguang@fengmap.com)
 * @date     {2016/7/11}
 * @describe 图标管理（Dialog），可以通过Esc关闭，或点击遮罩区域。
 */
import {
	createStructuredSelector
} from 'reselect';

export const modelSelector = createStructuredSelector({
	//deskPageModel: state => state.deskPage,
	componentModel: state => state.pOIManagement,
	drawPOICardModel: state => state.drawPOICard //绘制面板-绘制-POI图标绘制面板（用于添加点元素）
});