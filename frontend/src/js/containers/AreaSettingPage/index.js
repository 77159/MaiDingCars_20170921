/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/14
 * @describe 区域设置页面。路径为 '/area'
 */

'use strict';

import React from 'react';

//antd-ui
import {Layout, Icon} from 'antd';

//css
import styles from './index.less';

//redux
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

//actions
import {
    queryListGroups,
    queryAreaListBegin,
    deleteAreaById
} from './actions';

//areaForm actions
import {
    queryAreaByIdBegin,
    unLockForm,
    emptyAreaForm,
    lockForm,
    curentPoints,
} from '../AreaFormPanel/actions';

//store
import {
    SelectorListGroups,
    SelectorAreaList
} from './selectors';


import {diffPolygons, intersectPolygons, geoJson, getArray, getFMArray} from '../../utils/tools';

//自定义组件
import {AreaSubMenu} from '../../components/AreaSubMenu/index';
import AreaFormPanel from "../AreaFormPanel/index";
import AreaSettingMap from '../../components/AreaSettingMap/index';

import _ from 'lodash';

import {showErrorMessage} from "../App/actions";

const {Footer, Sider, Content} = Layout;

export class AreaSettingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            siderTrigger: null,
            status: null
        };

        this.polygonMarkers = [];
        this.polygonsIds = [];
        this.polygonEditor = null;
    };

    componentWillUnmount = () => {
        this.props.lockForm();
        this.props.emptyAreaForm();
    };

    /**
     * 侧边栏搜索
     */
    onCollapse = () => {
        this.setState({siderCollapsed: !this.state.siderCollapsed});
        if (this.state.siderCollapsed) {  //收起状态
            this.map.options.compassOffset = [278, 20];
            //展开
            this.setState({
                siderTrigger: null,
            });
        } else {
            //收缩
            this.map.options.compassOffset = [28, 20];
            this.setState({
                siderTrigger: undefined,
            });
        }
        this.map.updateSize();
    };

    /**
     * 获取地图创建后的map对象
     * @param map 地图map对象
     */
    getMap = (map) => {
        this.map = map;
        map.on('loadComplete', () => {
            //初始化左侧菜单
            this.initSubMenu(map);
            //初始化地图区域绘制功能
            this.initFMPolygonEditor(map);
        });
    };

    /**
     * 初始化左侧菜单
     * @param map 地图对象
     */
    initSubMenu = (map) => {
        const listGroups = map.listGroups;
        //获取地图楼层集合
        this.props.queryListGroups(listGroups.map((item) => {
            return {
                gid: item.gid,
                gname: item.gname,
            }
        }));
        //获取地图区域集合
        this.props.queryAreaListBegin();
    };

    /**
     * 初始化地图区域绘制功能
     * @param map 地图对象
     */
    initFMPolygonEditor = (map) => {
        this.polygonEditor = new fengmap.FMPolygonEditor({
            map: map,
            color: 0x22A5ee,
            Alpha: 1,
            height: .5,
            callback: (polygonMarker) => {
                const points = _.cloneDeep(polygonMarker.getPoints());
                const result = this.getDiffPoints(points);
                polygonMarker.dispose();
                if (!result) {
                    this.props.showErrorMessage('区域完全超出地图边界');
                    return;
                }
                this.currentPolygon = [];
                result.map((p) => {
                    this.currentPolygon.push(this.addPolygon(p, 1, 0x22A5ee, .5));
                });
                this.props.curentPoints([result]);
                this.props.unLockForm();
                this.setState({
                    status: 'editing',
                });
            }
        });
    };

    /**
     * 销毁当前未保存的polygon区域面
     */
    disposeCurrentPolygon = () => {
        const currentPolygon = this.currentPolygon;
        if (currentPolygon && currentPolygon.length > 0) {
            currentPolygon.map((polygon) => {
                polygon.dispose();
            })
        }
        this.currentPolygon = [];
    };

    /**
     * 与当前地图进行比对坐标
     * @param points
     */
    getDiffPoints = (points, floorid = 1) => {
        //最新的区域坐标
        let lastPoly = new geoJson();
        lastPoly.coordinates.push(getArray(points));
        //地图polygon坐标
        const vertices = this.getExtentVertices();
        let extentJson = new geoJson();
        let result = null;
        for (let i = 0; i < vertices.length; i++) {
            extentJson.coordinates.push(getFMArray(vertices[i]));
            let res = intersectPolygons(lastPoly, [extentJson]);
            if (res.length === 0) {
                continue;
            }
            //在地图上已经存在的区域坐标
            let desPolys = [];
            for (const key in this.polygonMarkers) {
                const pms = this.polygonMarkers[key];
                pms.map((pm) => {
                    let poly = new geoJson();
                    let coords = getArray(pm._ps);
                    poly.coordinates.push(coords);
                    desPolys.push(poly);
                })
            }
            const resJSON = new geoJson();
            res.pop();
            resJSON.coordinates.push(getArray(res));
            result = diffPolygons(resJSON, desPolys);
            if (!result) break;
        }
        return result;
    };

    /**
     * 获取地图polygon坐标点
     * @param groupID
     */
    getExtentVertices = (groupID = 1) => {
        const group = this.map.listGroups[groupID - 1];
        const extents = group.a_.geo_extentlayers[0].extents;
        return extents.map((item) => {
            return item.vertices;
        });
    };

    /**
     * polygon绘制状态
     */
    polygonCraete = () => {
        const polygonEditor = this.polygonEditor;
        if (this.state.status) {
            this.props.showErrorMessage('当前地图有未保存的区域');
            return;
        }
        if (polygonEditor) {
            this.props.lockForm();
            this.props.emptyAreaForm();
            polygonEditor.start('create');
        }
    };

    /**
     * 更新polygon样式
     * @param polygonStyle
     */
    updatePolygonStyle = (polygonStyle) => {
        if (polygonStyle) {
            const id = polygonStyle.id;
            if (id) {
                const polygonMarkers = this.polygonMarkers[id];
                polygonMarkers.map((pm) => {
                    pm.setAlpha(polygonStyle.opacity);
                    pm.setColor(polygonStyle.backgroundColor);
                });
            }
        }
    };

    /**
     * 取消当前polygon
     */
    cancelPolygon = () => {
        const currentPolygon = this.currentPolygon;
        if (currentPolygon) {
            currentPolygon.map((polygon) => {
                polygon.dispose();
            })
        }
        this.setState({
            status: null,
        });
    };

    /**
     * 刷新当前地图的区域
     * @param areaList 当前楼层区域列表
     * @param focusFloorid 当前楼层gid
     */
    freshenPolygon = (areaList, focusFloorid = '1') => {
        if (!this.map) return;
        //获取当前楼层区域集合
        const focusAreaList = areaList.filter((item) => {
            return item.floorId === focusFloorid;
        });

        //当前地图区域id集合
        const areaIds = focusAreaList.map((item) => {
            return item.id;
        });

        //需要创建的ids
        const createIds = _.difference(areaIds, this.polygonsIds);
        //需要删除的ids
        const deleteIds = _.difference(this.polygonsIds, areaIds);
        //创建
        this.createPolygon(createIds, focusAreaList, focusFloorid);
        //删除
        this.disposePolygon(deleteIds);
    };

    /**
     * 创建地图区域polygon面
     * @param ids 创建区域面的id数组
     * @param areaList 楼层区域列表信息
     * @param focusFloorid 当前楼层gid
     */
    createPolygon = (ids, areaList, focusFloorid = '1') => {
        //const map = this.map;
        ids.map((id) => {
            areaList.map((area) => {
                    if (id === area.id) {
                        const polygon = JSON.parse(area.polygon);
                        const polygonStyle = JSON.parse(area.areaStyle);
                        let ps = [];
                        polygon[0].map((p) => {
                            ps.push(this.addPolygon(p, focusFloorid, polygonStyle.backgroundColor, polygonStyle.opacity));
                        });
                        this.polygonMarkers[id] = ps;    //polygon对象
                        this.polygonsIds.push(id);
                    }
                }
            );
        });
    };

    /**
     * 添加polygon
     * @param points 数组坐标
     * @param focusFloorid 当前楼层
     * @param color 区域填充颜色 16进制
     * @param opacity 透明度
     * @returns {fengmap.FMPolygonMarker}
     */
    addPolygon = (points, focusFloorid, color, opacity) => {
        const map = this.map;
        if (!map) return;
        const group = map.getFMGroup(focusFloorid);
        if (!group) return;
        const layer = group.getOrCreateLayer('polygonMarker');
        const polygonMarker = new fengmap.FMPolygonMarker({
            map: map,
            points: points,
            lineWidth: 1,
            color: color,
        });
        polygonMarker.setAlpha(opacity);
        polygonMarker.height = 0.5;                     //高度
        polygonMarker._ps = points;
        polygonMarker._vs = points.map(function (o, index) {
            let v = map.toSceneCoord(o);
            v.index = index;
            return v;
        });
        layer.addMarker(polygonMarker);
        return polygonMarker;
    };

    /**
     * 删除当前地图区域
     * @ids 删除区域的id集合
     */
    disposePolygon = (ids) => {
        const polygonIds = this.polygonsIds;
        ids.map((item) => {
            const polygonMarker = this.polygonMarkers[item];
            polygonMarker.map((pm) => {
                pm.dispose();
            });
            delete this.polygonMarkers[item];
            this.polygonsIds.splice(polygonIds.indexOf(item), 1)
        });
    };

    /**
     * 将polygon当前为id的移动到视野中心点
     * @param id 需要移动的中心点id
     */
    moveToCenter = (id) => {
        const polygonEditor = this.polygonEditor;
        const polygonMarkers = this.polygonMarkers;
        const map = this.map;

        if (polygonEditor && polygonMarkers && id) {
            const points = polygonMarkers[id][0]._ps;
            const centerPoints = polygonEditor.getCenter(map, points);
            map.mapScaleLevel = {
                level: 24,
                duration: 1,
                callback: () => {
                    map.moveToCenter(centerPoints)
                }
            };
        }
    };

    /**
     * 更新地图绘制区域状态
     * @param status 状态
     */
    changeStatus = (status) => {
        this.setState({
            status: status
        })
    };

    /**
     * 修改区域边线
     * @param 当前区域主键id
     */
    updatePolygonLineStyle = (id) => {
        if (!id) return;
        const polygonMarkers = this.polygonMarkers;

        for (const key in polygonMarkers) {
            const pms = polygonMarkers[key];
            if (key == id) {
                pms.map((pm) => {
                    pm.line.updateStyle({color: 0x1700ff});
                })
            } else {
                pms.map((pm) => {
                    pm.line.updateStyle({color: pm.color});
                })
            }
        }
    };

    render() {
        const {listGroups, areaList} = this.props;                                                  //数据源
        const {deleteAreaById, queryAreaByIdBegin, lockForm, unLockForm, emptyAreaForm} = this.props;//action

        return (
            <Layout className={styles.layout}>
                <Sider width={256} className={styles.sider} collapsible={true}
                       collapsed={this.state.siderCollapsed}
                       onCollapse={this.onCollapse}
                       trigger={this.state.siderTrigger}
                       collapsedWidth={0}>
                    <Layout style={{height: '100%'}}>
                        <div style={{
                            height: '38px',
                            background: '#45484A',
                            lineHeight: '38px',
                            color: '#fff',
                            padding: '0 10px'
                        }}>
                            区域列表
                            <span
                                className={styles.left_arrow}
                                title="收起窗口"
                                onClick={this.onCollapse}>
                                <Icon type="left"/>
                            </span>
                        </div>
                        <Content>
                            {/*左侧菜单*/}
                            <AreaSubMenu
                                listGroups={listGroups}                     //楼层集合
                                areaList={areaList}                         //楼层区域集合
                                deleteAreaById={deleteAreaById}             //根据主键id删除区域
                                queryAreaByIdBegin={queryAreaByIdBegin}     //根据主键id查询区域
                                unLockForm={unLockForm}                     //区域表单解锁
                                emptyAreaForm={emptyAreaForm}               //清空表单
                                lockForm={lockForm}                         //显示/隐藏表单
                                polygonCraete={this.polygonCraete}          //创建地图区域
                                moveToCenter={this.moveToCenter}            //地图视野中心点
                                updatePolygonLineStyle={this.updatePolygonLineStyle}    //修改地图区域边线
                            />
                        </Content>
                        <Footer style={{background: '#fff'}}>
                            {/*区域设置表单*/}
                            <AreaFormPanel
                                cancelPolygon={this.cancelPolygon}          //取消表单
                                updatePolygonStyle={this.updatePolygonStyle}//修改表单样式
                                changeStatus={this.changeStatus}            //改变当前绘制状态
                                disposeCurrentPolygon={this.disposeCurrentPolygon}//删除当前未保存的区域
                            />
                        </Footer>
                    </Layout>
                </Sider>
                <Content className={styles.content}>
                    {/*区域地图*/}
                    <AreaSettingMap
                        getMap={this.getMap}                                //获取地图map对象
                        areaList={areaList}                                 //当前地图区域列表
                        freshenPolygon={this.freshenPolygon}                //刷新当前地图区域图形
                    />
                </Content>
            </Layout>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        queryListGroups: (listGroups) => dispatch(queryListGroups(listGroups)),
        queryAreaListBegin: () => dispatch(queryAreaListBegin()),
        deleteAreaById: (areaName) => dispatch(deleteAreaById(areaName)),
        queryAreaByIdBegin: (id) => dispatch(queryAreaByIdBegin(id)),
        unLockForm: () => dispatch(unLockForm()),
        emptyAreaForm: () => dispatch(emptyAreaForm()),
        lockForm: () => dispatch(lockForm()),
        curentPoints: (points) => dispatch(curentPoints(points)),
        showErrorMessage: (msg) => dispatch(showErrorMessage(msg))
    }
}

const mapStateToProps = createStructuredSelector({
    listGroups: SelectorListGroups(),
    areaList: SelectorAreaList(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaSettingPage);