/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/19
 * @describe
 */
'use strict';

import * as jsts from '../../assets/libs/jsts.min';
import _ from 'lodash';

/**
 * [diffPolygons A 异同 B，保留A和B不同的部分]
 * @param  {[geojson]} poly 如：{"type":"MultiPolygon","coordinates":[[[[12665335.589355564,2636622.885702547],[12665360.670255471,2636622.885702547],[12665383.362498242,2636642.8907060437],[12665335.589355564,2636636.6204810673],[12665335.589355564,2636622.885702547]]]]}
 * @param  {[array<geojson>]} poly
 * @return {[array<coordiats>]} res 返回计算后的点集
 */
export function diffPolygons(startPoly, desPolys) {
    var jsonParser = new jsts.io.GeoJSONReader();
    var geoResult = jsonParser.read(startPoly); //先记录第一个
    var res = [];

    //和目标多边形逐个取不同
    for (var i = 0, ilen = desPolys.length; i < ilen; i++) {
        // let start = jsonParser.read(geoResult);
        let start = geoResult;
        let end = jsonParser.read(desPolys[i]);
        let geom = start.difference(end); //A异同B
        //如果A和B完全重合 则返回空数组
        if (geom.getNumPoints() <= 1) {
            break;
        }
        geoResult = geom;
    }

    //存在切出多个多边形的情况
    let geometryNum = geoResult.getNumGeometries();
    for (var j = 0, jlen = geometryNum; j < jlen; j++) {
        let g = geoResult.getGeometryN(j).getCoordinates();
        if (!_.isEqual(g[0], g[g.length - 1]))
            g.pop();
        res.push(g);
    }

    return res;
}

/**
 * [diffPolygons A 异同 B，保留A和B不同的部分]
 * @param  {[geojson]} poly 如：{"type":"MultiPolygon","coordinates":[[[[12665335.589355564,2636622.885702547],[12665360.670255471,2636622.885702547],[12665383.362498242,2636642.8907060437],[12665335.589355564,2636636.6204810673],[12665335.589355564,2636622.885702547]]]]}
 * @param  {[array<geojson>]} poly
 * @return {[array<coordiats>]} res 返回计算后的点集
 */
export function intersectPolygons(startPoly, desPolys) {
    var jsonParser = new jsts.io.GeoJSONReader();
    var geoResult = jsonParser.read(startPoly); //先记录第一个
    var existSame = false,
        res = [];

    //和目标多边形逐个取不同
    for (var i = 0, ilen = desPolys.length; i < ilen; i++) {
        let start = geoResult;
        let end = jsonParser.read(desPolys[i]);

        let intersection = start.intersection(end); //相交
        //如果两多边形无交集,则不取异同
        if (intersection.getNumPoints() <= 1) {
            continue;
        }

        geoResult = intersection;
        existSame = true;
    }

    if (existSame) res = geoResult.getCoordinates();

    return res;
}

export const geoJson = function () {
    this.type = "MultiPolygon";
    this.coordinates = [];
}

export const getArray = (points) => {
    var arr = [],
        poly = [];
    if (points.length <= 0) return;
    if (!_.isEqual(points[0], points[points.length - 1]))
        points.push(points[0]);

    points.map((item) => {
        arr.push([item.x, item.y]);
    });
    poly.push(arr);
    return poly;
}

/**
 * 转换fengmap polygon 坐标数组
 * @param points
 * @returns {Array}
 */
export const getFMArray = (points) => {
    var arr = [],
        poly = [];
    if (points.length <= 0) return;

    if (!_.isEqual(points[0], points[points.length - 1]))
        points.push(points[0]);

    for (let i = 0, ilen = points.length; i < ilen - 1; i = i + 2) {
        arr.push([Math.abs(points[i]), Math.abs(points[i + 1])]);
    }

    arr.push(arr[0]);

    poly.push(arr);
    return poly;
};

/**
 * 转换fengmap polygon 坐标数组
 * @param points
 * @returns {Array}
 */
export const getFMArray2 = (points) => {
    var arr = [],
        poly = [];
    if (points.length <= 0) return;

    if (!_.isEqual(points[0], points[points.length - 1]))
        points.push(points[0]);

    for (let i = 0, ilen = points.length; i < ilen - 1; i = i + 2) {
        arr.push([Math.abs(points[i].x), Math.abs(points[i].y)]);
    }

    arr.push(arr[0]);

    poly.push(arr);
    return poly;
};

/**
 * 获取区域的
 * @param poly
 * @returns {*}
 */
export const getFMCenter = (vertices) => {
    let extentJson = new geoJson();
    const v = vertices[0][0];
    if (!v) return;
    extentJson.coordinates.push(getArray(v));
    var jsonParser = new jsts.io.GeoJSONReader();
    var geoResult = jsonParser.read(extentJson); //先记录第一个
    let centerPnt = geoResult.getCentroid();
    return centerPnt.getCoordinates();
};
export const getHours = (seconds) => {
    const m = Math.floor(seconds / 60);  //分钟
    const mm = m % 60;                //秒 取余
    const s = seconds % 60;            //分钟 取余
    const h = Math.floor(m / 60);        //小时
    return formatNum(h) + ':' + formatNum(mm) + ':' + formatNum(s);
};

const formatNum = (num) => {
    return num.toString().length <= 1 ? '0' + num : num;
};