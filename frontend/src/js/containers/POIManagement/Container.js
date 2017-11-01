/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  lixia (lixia@fengmap.com)
 * @date     2017/2/13
 * @describe 图标管理（Dialog），可以通过Esc关闭，或点击遮罩区域。
 */
import React from 'react';
import {
    connect
} from 'react-redux';
import {
    containerActions
} from './actions.js';
import {
    modelSelector
} from './selectors.js';

import _ from 'lodash';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {
    GridList,
    GridTile
} from 'material-ui/GridList';
import {
    red600
} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import DropzoneUpload from '../../components/DropzoneUpload';
import InlineConfirmButton from "react-inline-confirm";
import Snackbar from 'material-ui/Snackbar';

const styles = {
    custom_content: {
        width: '760px',
        maxWidth: 'none',
        height: '600px',
        minHeight: '600px',
        overflowX: 'hidden'
    },
    recently_poi: {
        width: '450px',
        height: 'auto',
        margin: '6px 0px',
        float: 'left'
    },
    recently_poi_title: {
        height: '36px',
        lineHeight: '36px',
        color: '#333',
        display: 'inline-block'
    },
    grid_list: {
        padding: '0px',
        marginTop: '2px'
    },
    preview_poi_icon_div: {
        width: '86px',
        height: '86px',
        border: '1px solid #ccc',
        float: 'right',
        marginTop: '10px',
        overflow: 'hidden'
    },
    preview_poi_icon_img: {
        width: "60px",
        height: "60px",
        margin: '2px 13px 0 13px',
        border: 'none'
    },
    preview_poi_icon_title: {
        width: '74px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: '14px',
        padding: '0 5px',
        display: 'block',
        cursor: 'default',
        color: '#666'
    },
    floating_label_style: {
        bottom: '8px',
        color: 'rgba(0, 0, 0, 0.298039)'
    },
    item_div: {
        float: 'left',
        color: '#333'
    },
    item_title: {
        width: '80px',
        display: 'inline-block',
        lineHeight: '50px',
        paddingLeft: '10px',
        fontSize: '14px'
    },
    item_input: {
        width: '170px',
        fontSize: '14px',
        height: '40px',
        color: 'rgba(0, 0, 0, 0.298039)'
    },
    item_input_false: {
        color: 'rgba(0, 0, 0, 0.298039)'
    },
    item_input_text: {
        color: '#4495ef'
    },
    editor_poi: {
        border: '1px solid #ccc',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        backgroundColor: '#f7f6fc',
        float: 'left'
    },
    del_user_poi: {
        float: 'left',
        width: '32px',
        minWidth: '32px',
        color: '#fff',
        backgroundColor: red600,
        color: '#fff',
        textAlign: 'center',
        borderRadius: '0px',
        height: '32px',
        lineHeight: '32px'

    },
    del_user_poi_btn: {
        minWidth: '30px',
        float: 'right',
        marginTop: '8px',
        overflow: 'hidden',
        boxShadow: 'none',
        borderRadius: '0px'
    },
    tabs_list: {
        // width: '700px',
        height: '200px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        padding: '10px',
        display: 'none',
        maxHeight: '200px',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    tabs_list_active: {
        // width: '700px',
        height: '200px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        padding: '4px 10px 12px',
        display: 'block',
        maxHeight: '200px',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    upload_div: {
        width: '100%',
        height: '218px',
        backgroundColor: 'rgba(250,250,250,0.9)',
        display: 'none',
        maxHeight: '218px',
        overflow: 'hidden',
        top: '38px',
        left: '0px',
        position: 'absolute',
        zIndex: '10'
    },
    poi_icon_tooltip: {
        top: '2px'
    },
    dialog_container: {
        width: '240px'
    },
    upload_use_tip: {
        fontSize: '12px',
        color: '#999',
        lineHeight: '32px',
        padding: '0px 12px'
    }
};

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewPOIIcon: null, //当前预览的POI对象
            //编辑状态开关
            editorStatus: false,
            //编辑的初始数据
            editorData: null,
            //保存图标修改的信息
            editorArr: [],
            //提示条显示状态
            snackbar_open: false,
            //snackbar信息提示
            messageInfo: '',
            //是否删除用户图标提示框显示&隐藏 【True】显示 【False】隐藏
            removeUserPoiDialog: false
        };
    }

    //状态更新后的变化
    componentWillReceiveProps(nextProps) {
        //在第一次请求用户图标完成时，如果最近图标内有用户图标，判断是否为当前用户的图标，否则从最近使用图标中删除原有图标
        if (this.props.componentModel.getUserPoiIconDone == false && nextProps.componentModel.getUserPoiIconDone == true) {
            for (let i = 0, ilen = this.props.drawPOICardModel.recentPOIIcons.length; i < ilen; i++) {
                let item = this.props.drawPOICardModel.recentPOIIcons[i];
                if (item.typeName == '用户图标') {
                    let index = _.findIndex(nextProps.componentModel.userPoiIcon, (icon) => (icon.typeCode == item.typeCode));
                    //如果不存在，则移除最近使用图标
                    if (index < 0) {
                        if (nextProps.componentModel.defaultPoiIcon.length > 0) {
                            //console.log('poipoipoipoi', item);
                            nextProps.refreshRecentPOIIcons(item, nextProps.componentModel.defaultPoiIcon[0].icons);
                        }
                    }
                }
            }
        }
    }


    componentDidMount() {

        //获取系统默认图标
        this.props.getDefaultPoiIcon();

        //获取用户图标
        this.props.getUserPoiIcon();
    }

    /**
     * 默认图标点击事件
     * @param  [defaultPoi]显示默认图标
     */
    handledefaultPoi = () => {
        this.props.showPOItype('defaultPoi');
        this.setState({
            editorStatus: false,
        });
    }

    /**
     * 用户图标点击事件
     * @param  [uesrPoi] 显示用户图标
     */
    handleUesrPoi = () => {
        this.props.showPOItype('uesrPoi');
    }

    /**
     * 图标上传成功函数
     * 把上传成功的数据插入到用户图标的数据中
     * @param  {[type]} data [上传图标成功后返回data]
     */
    uploadCallback = (data) => {
        //更新userPoiIcon 数据
        this.props.getUserPoiIcon();

        //新增主题样式，并更新地图
        this.props.operateThemeLists(this.props.getUpdatePoiData('add', data));
        this.props.updateTheme();
    }

    /**
     * 点击编辑图标事件
     * @return [true]用户可编辑“ 用户图标 ”状态,[false]用户不可编辑“ 用户图标 ”状态
     */
    updateUserPoiIcon = () => {
        let this_ = this;
        /*点击编辑图标时，如果是true,则提交修改的图标名称至后台*/
        if (this.state.editorStatus && this.state.editorArr.length > 0) {
            this.props.updateUserPoiIcon(JSON.stringify(this.state.editorArr), function(resulte) {
                if (resulte) {
                    this_.setState({
                        messageInfo: '编辑图标保存成功',
                        snackbar_open: true
                    })
                }
            });

            //编辑主题样式，并更新地图，（不需要，编辑名称无需更新至主题文件中）
            // this.state.editorArr.foreach((item) => (this.props.operateThemeLists(this.getUpdatePoiData('update', item))));
            // this.props.updateTheme();
        } else {
            /*false则清空保存修改图标的数据，开启编辑模式*/
            this.setState({
                editorArr: []
            })
        }
        this.setState({
            editorStatus: !this.state.editorStatus
        });
    }

    /**
     * 关闭Snackbar信息提示框
     */
    handleSnackbarRequestClose = () => {
        this.setState({
            messageInfo: '',
            snackbar_open: !this.state.snackbar_open
        });
    }

    /**
     * 图标预览事件
     * @param {Object} poiIcon POI图标对象
     * @param {Object} event 触发事件的DOM对象
     */
    handlePoiIconPreview = (poiIcon, event) => {
        /*设置预览图标*/
        this.setState({
            previewPOIIcon: poiIcon
        });
    }

    /**
     * 添加最近使用图标并开启绘制状态
     * @param  {[type]} poiIcon [poiIcon POI图标对象]
     * @param  {[type]} event   [event 被点击的DOM对象]
     */
    handleDrawPOITouchTap = (poiIcon, event) => {
        //判断图片是否丢失
        if (poiIcon.disabled) {
            this.setState({
                editorData: null,
                messageInfo: '图标资源已丢失',
                snackbar_open: true
            })
            return;
        }

        //判断是否开启编辑状态
        let editorStatus_ = this.state.editorStatus;

        if (!editorStatus_) {
            this.props.handleAddRecentPOIIcon(poiIcon);
            this.props.handleDrawPOITouchTap(poiIcon, event);
            this.props.showPOIManagementDialog(false);
        } else {
            this.setState({
                editorData: poiIcon,
            });
        }
    }

    /**
     * 图标加载失败事件
     * @param  {[type]} poiIcon [poiIcon POI图标对象]
     * @param  {[type]} event   [event 被点击的DOM对象]
     */
    handleImageOnError = (poiIcon, event) => {
        poiIcon.poiIconPath = './images/drop_img.png';
        poiIcon.poiName = '图标已丢失';
        poiIcon.disabled = true;
    }

    /**
     * 过滤掉默认图标typeCode=0的数据
     * @param  {[type]} element [数据源]
     */
    isBigEnough = (element, index, array) => {
        return (parseInt(element.typeCode) > 0);
    }

    /**
     * 显示默认图标集合Grid
     * @param  {[object]} systemDefaultPoi  [默认图标数据]
     */
    renderSystemPOIGridLists(systemDefaultPoi) {
        if (!systemDefaultPoi || systemDefaultPoi.length <= 0 || systemDefaultPoi[0].icons.length <= 0) return;

        var filtered = systemDefaultPoi[0].icons.filter(this.isBigEnough);
        return filtered.map((poiIcon, i) => {
            return (

                <GridTile key={i} style={{overflow: 'visible', margin: '2px'}}>
                    <img className="poi_icon_img"
                         title={poiIcon.poiName}
                         onError={this.handleImageOnError.bind(null, poiIcon)}
                         onMouseOver={this.handlePoiIconPreview.bind(null, poiIcon)}
                         onClick={this.handleDrawPOITouchTap.bind(null, poiIcon)} src={poiIcon.poiIconPath}/>
                </GridTile>
            )
        });
    }

    /**
     * 显示用户图标集合Grid
     * @param  {[object]} userPoiData  [用户图标数据]
     */
    renderUserPOIGridLists = (userPoiData) => {

        //TODO 此处将上传图标与用户自定义图标放到一起返回了，不利于扩展维护，后续重构时需要拆分此函数
        //上传图标
        let upload = (
            <GridTile key="gt_upload" style={{overflow: 'visible', margin: '2px'}}>
                <DropzoneUpload uploadCallback={this.uploadCallback} dragTooltipSelector="#upload_div"/>
            </GridTile>
        );
        //如果用户图标为空，则只返回上传图标按钮
        if (!userPoiData || userPoiData.length <= 0) return upload;
        //遍历用户自定义图标
        let userPoiDataArray = userPoiData.map((poiIcon, i) => {
            return (
                <GridTile key={i} style={{overflow: 'visible', margin: '2px'}}>
                    <img className={this.state.editorData&&this.state.editorData.id==poiIcon.id?'poi_icon_img_on':'poi_icon_img'}
                         title={poiIcon.poiName}
                         onError={this.handleImageOnError.bind(null, poiIcon)}
                         onMouseOver={this.handlePoiIconPreview.bind(null, poiIcon)}
                         onClick={this.handleDrawPOITouchTap.bind(null, poiIcon)} src={poiIcon.poiIconPath}/>
                </GridTile>
            );
        });
        //将上传图标插入到首位
        userPoiDataArray.unshift(upload);
        return userPoiDataArray;
    }

    /**
     * 显示最近使用的图标列表
     * @param {Array} recentPOIIcons 最近使用的图标集合
     */
    renderRecentPOIIcon = (recentPOIIcons) => {
        if (!recentPOIIcons || recentPOIIcons.length <= 0) return;
        return recentPOIIcons.map((poiIcon, idx) => {
            return (
                <GridTile key={idx} style={{overflow: 'visible', margin: '2px'}}>
                    <img className="poi_icon_img" src={poiIcon.poiIconPath}
                         title={poiIcon.poiName}
                         onError={this.handleImageOnError.bind(null, poiIcon)}
                         onClick={this.handleDrawPOITouchTap.bind(null, poiIcon)}
                         onMouseOver={this.handlePoiIconPreview.bind(null, poiIcon)}/>
                </GridTile>
            );
        });
    }

    /**
     * 监听修改用户图标名称修改事件
     * @param  {[type]} event     [input输入框]
     * @param  {[type]} newString [description]
     */
    handleChangePoiIcon = (event, newString) => {
        let editorData_ = this.state.editorData;
        editorData_.poiName = newString;

        //修改后的图标信息
        this.setState({
            editorData: editorData_
        });
    }

    /**
     * 修改图标名称input失去焦点事件
     * 判断图标名称是否修改
     * this.state.editorData.id当前图标的id,根据id去修改用户图标数据
     */
    handleEditorBlur = (event) => {
        let editorData_ = this.state.editorData;
        let userPoiIconDatas_ = this.props.componentModel.userPoiIcon;
        let editorArr_ = this.state.editorArr;

        //查找当前编辑数据的下标
        let findIndex = _.findIndex(userPoiIconDatas_, {
            'id': editorData_.id
        });

        //当前编辑数据和已经编辑的数据去重
        if (editorArr_.length > 0) {
            for (var i = 0; i < editorArr_.length; i++) {
                if (editorData_.id === editorArr_[i].id) {
                    editorArr_.splice(i, 1);
                }
            }
        }

        if (findIndex < 0) return;
        let findUserPoipoiName = userPoiIconDatas_[findIndex].poiName;
        //通过POI name判断数据是否修改
        if (findUserPoipoiName && findUserPoipoiName !== editorData_.findUserPoipoiName) {
            editorArr_.push(editorData_);
            this.setState({
                editorArr: editorArr_
            });
        }
    }

    /**
     * 用户删除图标
     * @param  根据id删除图标
     */
    handleDeletePOIClick = () => {
        if (!this.state.editorData) return; //未选中任何元素
        this.setState({
            removeUserPoiDialog: true
        })
    }

    /**
     * 关闭弹窗事件，清空编辑信息
     */
    hidePOIManagementDialog = () => {
        this.props.getUserPoiIcon();
        this.props.showPOIManagementDialog(false);
        this.props.showPOItype('defaultPoi');
        this.setState({
            editorStatus: false,
            editorData: null,
            editorArr: []
        })
    }

    //更新最近使用图标和地图中使用的poi
    updateRecentIconsAndMapPoi(editorData) {
        if (!editorData) return;

        if (this.props.componentModel.defaultPoiIcon.length > 0)
            this.props.refreshRecentPOIIcons(editorData, this.props.componentModel.defaultPoiIcon[0].icons);

        //删除主题样式，并更新地图        
        this.props.operateThemeLists(this.props.getUpdatePoiData('del', editorData));
        this.props.updateTheme();
    }

    /**
     * 确认删除用户图标提示框
     */
    handleisRemoveUserPoiDialog = () => {
        let this_ = this;
        let editorData_ = this.state.editorData;
        this.props.removeUserPoiIcon(editorData_.id, function(resulte) {
            if (resulte) {
                this_.setState({
                    removeUserPoiDialog: false,
                    editorData: null,
                    messageInfo: '删除成功',
                    snackbar_open: true
                });
            }
        });

        //更新最近使用图标和地图中使用的poi
        this_.updateRecentIconsAndMapPoi(editorData_);
    }

    /**
     * 取消删除用户图标提示框
     */
    handleremoveUserPoiDialog = () => {
        this.setState({
            removeUserPoiDialog: false
        });
    }

    /**
     * 关闭dialog 清空未保存的数据
     */
    hidePOIManagementDialog = () => {
        this.props.getUserPoiIcon();
        this.props.showPOIManagementDialog(false);
        this.props.showPOItype('defaultPoi');
        this.setState({
            editorStatus: false,
            editorData: null,
            editorArr: []
        })
    }

    render() {
        const {
            componentModel,
            showPOIManagementDialog,
            drawPOICardModel
        } = this.props;

        const actions = [
            <FlatButton
            label="取消"
            primary={true}
            onTouchTap={this.handleremoveUserPoiDialog}
            />,
            <FlatButton
            label="确定"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleisRemoveUserPoiDialog}
            />,
        ];
        return (
            <Dialog
                title="图标管理"
                modal={false}
                open={this.props.componentModel.showPOIMgmtDialog}
                onRequestClose={this.hidePOIManagementDialog}
                contentStyle={styles.custom_content}
                titleClassName="dialogTitle"
                actionsContainerClassName="dialogContainer"
                actionsContainerStyle={styles.dialog_container}
                autoDetectWindowHeight={false}
            >
                {/*左上角窗口图标*/}
                <span className="dialogLog">
                    <i className="material-icons dialogLogIcon">location_on</i>
                </span>
                {/*右上角关闭按钮*/}
                <span className="dialogClose" onClick={() => {
                    this.props.showPOIManagementDialog(false)
                }}>
                    <i className="material-icons dialogLogIcon">close</i>
                </span>
                <div style={{width: '100%', height: '108px', float: 'left'}}>
                    {/*最近使用的图标*/}
                    <div style={styles.recently_poi}>
                        <span style={styles.recently_poi_title}>最近使用</span>
                        <GridList style={styles.grid_list} cellHeight={50} cols={8} rows={1}>
                            {this.renderRecentPOIIcon(this.props.drawPOICardModel.recentPOIIcons)}
                        </GridList>
                    </div>
                    {/*图标预览区域*/}
                    <div className="hint--bottom"
                         aria-label={this.state.previewPOIIcon && this.state.previewPOIIcon.poiName}
                         style={styles.preview_poi_icon_div}>
                        <img style={styles.preview_poi_icon_img}
                             src={this.state.previewPOIIcon ? this.state.previewPOIIcon.poiIconPath : ""}/>
                        <span
                            style={styles.preview_poi_icon_title}>{this.state.previewPOIIcon && this.state.previewPOIIcon.poiName}</span>
                    </div>
                </div>
                {/*TAB区域*/}
                <div className="dialogTabs">
                    <div className="dialogTabsMenu">
                        <div onClick={this.handledefaultPoi}
                             className={componentModel.poiIconValue == "defaultPoi" ? 'tabsToggleActive' : 'tabsToggle'}>
                            默认图标
                        </div>
                        <div onClick={this.handleUesrPoi}
                             className={componentModel.poiIconValue === "defaultPoi" ? 'tabsToggle' : 'tabsToggleActive'}>
                            我的图标
                        </div>
                        {/*编辑图标按钮*/}
                        <div style={{
                            display: componentModel.poiIconValue === "defaultPoi" ? 'none' : 'block',
                            float: 'right'
                        }}>
                            <span style={styles.upload_use_tip}>提示：点击按钮可上传图标</span>
                            <RaisedButton
                            backgroundColor={this.state.editorStatus ? "#ff4081" : "#4495ef"}
                            label={this.state.editorStatus ? '完成' : '编辑'}
                            labelStyle={{padding: '0 12px 0 6px'}}
                            labelColor="#fff"
                            onTouchTap={this.updateUserPoiIcon}
                            buttonStyle={{borderRadius: '0px', height: '32px', lineHeight: '32px'}}
                            style={{
                                boxShadow: 'none',
                                color: this.state.editorStatus ? '#4495ef' : '#fff',
                                float: 'right'
                            }}
                            icon={this.state.editorStatus ?<i className="iconfont icon-font-white icon-font-size15 icon-wancheng"></i>:<i className="iconfont icon-font-white icon-font-size15 icon-bianji"></i>}/>
                        </div>
                    </div>
                    <div style={{clear: 'both'}}></div>
                    {/*系统默认图标列表*/}
                    <div style={componentModel.poiIconValue == "defaultPoi" ? styles.tabs_list_active : styles.tabs_list}
                         className="customScrollBlue">
                        <GridList
                            cellHeight={52}
                            style={styles.grid_list}
                            cols={12}
                        >
                            {this.renderSystemPOIGridLists(componentModel.defaultPoiIcon)}
                        </GridList>
                    </div>
                    {/*用户图标列表*/}
                    <div id="userPoiIcon_div" style={componentModel.poiIconValue == "defaultPoi" ? styles.tabs_list : styles.tabs_list_active} className="customScrollBlue">
                        <GridList
                            cellHeight={52}
                            style={styles.grid_list}
                            cols={12}
                        >
                            {this.renderUserPOIGridLists(componentModel.userPoiIcon)}
                        </GridList>
                    </div>
                    {/*拖拽上传面板*/}
                    {/*<div id="upload_div" className="customScrollBlue"*/}
                         {/*style={styles.upload_div}>*/}
                        {/*<span className="upload_tooltip_span">放开鼠标完成上传 :-)</span>*/}
                    {/*</div>*/}
                </div>
                {/*图标编辑区*/}
                <div style={{clear: 'both'}}></div>
                <div style={{
                    width: '100%',
                    marginTop: '15px',
                    float: 'left',
                    display: this.state.editorStatus ? 'block' : 'none'
                }}>
                    <IconButton
                        style={styles.editor_poi}
                        tooltipPosition="top-center"
                    >
                        <img className={this.state.editorStatus ? 'dialogPoi' : 'dialogEditorPoi'}
                            src={this.state.editorData ? this.state.editorData.poiIconPath : ''}
                            title={this.state.editorData ? this.state.editorData.poiName : ''}
                             />
                    </IconButton>
                    <div style={styles.item_div}>
                        <div style={styles.item_title}>图标名称：</div>
                        <TextField
                            id="editorPoiName"
                            hintStyle={styles.floating_label_style}
                            hintText="请输入图标名称"
                            maxLength='20'
                            style={styles.item_input}
                            inputStyle={styles.item_input_text}
                            value={this.state.editorData ? this.state.editorData.poiName : ''}
                            onChange={this.handleChangePoiIcon}
                            onBlur={this.handleEditorBlur}
                        />
                    </div>
                    {/* <InlineConfirmButton className="btn btn-default" textValues={["删除","确认删除？","删除中..."]} showTimer onClick={this.handleDeletePOIClick}>
                     <i className="fa fa-trash"></i>
                     </InlineConfirmButton>*/}
                    <RaisedButton
                        label=""
                        buttonStyle={styles.del_user_poi}
                        style={styles.del_user_poi_btn}
                        icon={<i className="iconfont icon-shanchu dialogDeleteIcon"></i>}
                        onTouchTap={this.handleDeletePOIClick}
                    />
                </div>

                 <Snackbar
                 open={this.state.snackbar_open}
                 message={this.state.messageInfo}
                 autoHideDuration={4000}
                 onRequestClose={this.handleSnackbarRequestClose}
                 style={{textAlign:'center',top: '10px',transform: (this.state.snackbar_open ? 'translate(-50%, 0)' : 'translate(-50%, -58px)')}}
                 />

                <Dialog
                    actions={actions}
                    contentStyle={{width:'250px',color:'#666'}}
                    bodyStyle={{color:'#666',paddingBottom:'12px'}}
                    modal={false}
                    open={this.state.removeUserPoiDialog}
                    onRequestClose={this.handleremoveUserPoiDialog}
                >
                    您确认删除此图标?
                </Dialog>
            </Dialog>
        );
    }
}
export default connect(modelSelector, containerActions)(Container);