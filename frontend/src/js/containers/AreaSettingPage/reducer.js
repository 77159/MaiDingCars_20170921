/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置页面。路径为 '/area'
 */

'use strict';

import {fromJS} from 'immutable';

import {
    QUERY_LISTGROUPS,
    QUERY_AREALIST_FINISH,

} from './constants';

const initialState = fromJS({
    listGroups: [],
    areaList: [],
    keyArea: [],
    lock: true,
});

export default (state = initialState, action) => {
    const {type, payload} = action;

    //获取当前楼层集合
    if (type === QUERY_LISTGROUPS) {
        return state.set('listGroups', payload.listGroups);
    }

    //完成获取当前地图区域
    if (type === QUERY_AREALIST_FINISH) {
        const areaList = payload.areaList;
        const keyArea = areaList.filter((item) => {
            if (item.areaType === 1) {
                return item;
            }
        });
        return state.set('areaList', areaList).set('keyArea', keyArea);
    }

    return state;
}


