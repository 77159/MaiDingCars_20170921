//react
import React from 'react';

//material-ui 组件
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

//样式
const styles = {
    customContentStyle: {
        width: '100%',
        maxWidth: 'none',
        height: (document.body.clientHeight - 32),
        position: 'relative',
        display: 'block',
        transform: 'translate(0px, 0px)',
        paddingTop: '0'
    },
    dialogSubmit: {
        width: '240px',
    },
};

export default class PreviewDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
        this.map = null;
    }

    /**
     * 关闭预览窗口
     * @return {[type]} [description]
     */
    handleOnCloseDialog = () => {
        if(this.map) {
            this.map.dispose();
            this.map = null;
        }
        this.props.handleCloseDialog();
    }

    /**
     * [createFengMap 创建fengmap 预览地图]
     * @param  {[string]} mapPath [fengmap server url]
     * @param  {[string]} mapid   [fengmap mapid]
     * @param  {[json]} theme     [地图主题数据]
     * @param  {[HTMLDOM]} dom    [map container]
     */
    createFengMap = (mapPath, mapid, theme, mapCurGroupId, poiHeight,dom) =>{
        let scope = this;
        if(scope.map) {
            scope.map.dispose();
            scope.map = null;
        }
        let navi;
        let groupControl = null;
        let ctlOpt = new fengmap.controlOptions({
            position: fengmap.controlPositon.RIGHT_TOP,
            showBtnCount: 5,
            allLayer: false,
            imgURL: './images/fm_controls/',
            offset: {
                x: 10,
                y: 0
            }
        });

        let zoomCtlOpt = new fengmap.controlOptions({
            position: fengmap.controlPositon.LEFT_TOP,
            imgURL: './images/fm_controls/',
            offset: {
                x: 10,
                y: 120
            },
        });
        //地图配置
        var config = {
            container: dom, //渲染dom
            mapServerURL: mapPath, //地图数据位置
            //mapThemeURL: window.serviceUrl, //主题数据位置
            themeServerURL:window.imgServiceUrl,
            focusAlphaMode: false, //对不可见图层启用透明设置 默认为true
            focusAnimateMode: false, //关闭聚焦层切换的动画显示
            focusAlpha: 0.1, //对不聚焦图层启用透明设置，当focusAlphaMode = true时有效
            viewModeAnimateMode: true, //开启2维，3维切换的动画显示
            compassOffset: [20, 20],
            //指北针大小默认配置
            compassSize: 48,
            isSeparate: true, //分层展示,数据量大的时候
            //defaultThemeName: '2001',
            //defaultBackgroundColor: 0x197ea0,
            // defaultVisibleGroups: 'all',
            // defaultFocusGroup: 1,
            defaultVisibleGroups: [mapCurGroupId || 1],
            defaultFocusGroup: mapCurGroupId || 1,
            defaultMinTiltAngle: 5,
            useStoreApply: true, //使用storeapply
        };

        //创建地图对象
        scope.map = new fengmap.FMMap(config);

        //打开地图数据
        scope.map.preview(mapid, theme); //sceneId

        scope.map.showCompass = true;

        // 点击指南针事件, 使角度归0
        scope.map.on('mapClickCompass', function() {
            scope.map.rotateTo({
                to: 0,
                duration: .3,
            })
        });

        //let allGroupIDs = [];
        //地图加载完成回调
        scope.map.on('loadComplete', function() {
            scope.map.visibleGroupIDs = [mapCurGroupId || 1];
            scope.map.focusGroupID = mapCurGroupId || 1;

            // map.listGroups.forEach(function(item){
            //     allGroupIDs.push(item.gid);
            // });

            let zoomControl = new fengmap.zoomControl(scope.map, zoomCtlOpt);
            var toolControl = new fengmap.toolControl(scope.map, {
                position: fengmap.controlPositon.LEFT_TOP,
                init2D: false,
                groupsButtonNeeded: false,
                imgURL: './images/fm_controls/',
                offset: {
                    x: 10,
                    y: 60
                },
            });
        });

        //每一层的分层数据加载完成后的回调
        scope.map.on('groupLoaded',function(gid){
            //如果没有控件添加控件
            if(!groupControl) {
                groupControl = new fengmap.scrollGroupsControl(scope.map, ctlOpt);

                groupControl.onChange(function(groups, allLayer) {
                    //groups 表示当前要切换的楼层ID数组,
                    //allLayer表示当前楼层是单层状态还是多层状态。
                });
            }

            //切换楼层时先把之前的路线清空
            if(navi) {
                navi.clearAll();
                navi = null;
            }

            //初始化导航对象
            navi = new fengmap.FMNavigation({
                map: scope.map,
                // 设置导航线的样式
                lineStyle: {
                    //设置线为导航线样式
                    lineType: fengmap.FMLineType.FMARROW,
                    lineWidth: 6,
                    //设置线的颜色
                    // godColor: '#FF0000',
                    //设置边线的颜色
                    // godEdgeColor: '#920000',
                }
            });
        });

        // 点击计数
        var clickCount = 0;

        //判断起点是否是同一处坐标
        var lastCoord = null;

        //点击地图事件。开始选点开始后，点击地图一次为起点，第二次点击为终点
        scope.map.on('mapClickNode', function(event) {
            if (event.nodeType == fengmap.FMNodeType.MODEL) {
                var modelLabel = event.label;
                var coord;

                // 如果拾取的模型没有Label对象，则使用模型中心点的坐标
                // 有则使用与模型对应的Label对象的坐标。
                if (!modelLabel) {
                    coord = {
                        x: event.mapCoord.x,
                        y: event.mapCoord.y,
                        groupID: event.groupID
                    }
                } else {
                    coord = {
                        x: modelLabel.mapCoord.x,
                        y: modelLabel.mapCoord.y,
                        groupID: event.groupID
                    };
                }

                //第三次点击清除路径，重现设置起点起点
                if (clickCount == 2) {
                    navi.clearAll();
                    clickCount = 0;
                    lastCoord = null;
                }

                //第一次点击添加起点
                if (clickCount == 0) {
                    lastCoord = coord;
                    navi.setStartPoint({
                        x: coord.x,
                        y: coord.y,
                        groupID: coord.groupID,
                        url: './images/fm_controls/start.png',
                        size: 32,
                        height:poiHeight
                    });
                } else if (clickCount == 1) { //添加终点并画路线
                    //判断起点和终点是否相同
                    if (lastCoord.x == coord.x) {
                        //$('#message').attr("class", "alert alert-warning");
                        return;
                    } else {
                        //$('#message').attr("class", "alert alert-warning hidden");
                    }

                    navi.setEndPoint({
                        x: coord.x,
                        y: coord.y,
                        groupID: coord.groupID,
                        url: './images/fm_controls/end.png',
                        size: 32,
                        height:poiHeight
                    });

                    // 画导航线
                    navi.drawNaviLine();
                }
                clickCount++;
            }
        });
    }

    render() {
        return (
            <Dialog
                title="预览地图"
                modal={false}
                open={this.props.open}
                onRequestClose={this.handleOnCloseDialog}
                contentStyle={styles.customContentStyle}
                autoScrollBodyContent={false}
                titleClassName="dialogTitle"
                actionsContainerClassName="dialogSubmit"
                actionsContainerStyle={styles.dialogSubmit}
                autoDetectWindowHeight={false}
                bodyStyle={{padding:'0',height: (document.body.clientHeight - 32)}}
                style={{padding: 16}}
                >
                <span className="dialogLog">
                    <i className="material-icons dialogLogIcon">palette</i>
                </span>
                <span className="dialogClose" onClick={this.handleOnCloseDialog}>
                    <i className="material-icons dialogLogIcon">close</i>
                </span>
                <div style={{position: 'relative'}} id="customScrollBlue">
                    <FengMapDom themeData={this.props.themeData} fmapId={this.props.fmapID} fmapPath={this.props.fmapPath} createFengMap={this.createFengMap} mapLoading={this.state.mapLoading} poiHeight={this.props.poiHeight} mapCurGroupId={this.props.mapCurGroupId}/>
                    <div style={{position: 'absolute',left: '2%',bottom: '2%',fontSize:'14px'}}>可在地图上顺序选取起终点进行路径规划</div>
                </div>
            </Dialog>
        );
    }
}

class FengMapDom extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let dom = document.getElementById('fengMap');
        this.props.createFengMap(this.props.fmapPath, this.props.fmapId, this.props.themeData, parseInt(this.props.mapCurGroupId),parseFloat(this.props.poiHeight), dom);
    }


    render() {
        return (
            <div id='fengMap' style={{width:'100%',height:  (document.body.clientHeight - 68),fontSize:'12px', fontWeight: 'normal',display: 'block'}}>
            </div>
        )
    }
};