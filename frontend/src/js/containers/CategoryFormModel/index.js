/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/8/6
 * @describe 车辆管理页面。路径为'/Car'
 */
'use strict';
import React from 'react';

//antd UI
import {Layout, Icon, Button} from 'antd';
import {Row, Col} from 'antd';
import {Modal} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Select} from 'antd';
const Option = Select.Option;
import {Menu} from 'antd';
const SubMenu = Menu.SubMenu;

//css
import styles from './index.less';

//redux
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

//actions
import {
    getCarCategory,
    getCarCategoryById,
    emptyCarCategoryId,
    updateCarCategoryName,
    putCarCategory,
    postCarCategory,
    deleteCarCategory,
    getImgUrlComponent,
    getImgUrl,
    queryArea,
    updateArea
} from './actions';

//store
import {
    carCategorySourceSelector,
    operationRunningSelector,
    typeNameSelector,
    idSelector,
    areaSelector,
    imgUrlSelector,
    imgUrlComponentSelector,
    areaNameSourceSelector
} from './selectors';

//自定义组件
import {CategorySubMenu} from '../../components/CategorySubMenu'
import {PeopleAvatar} from '../../components/PeopleAvatar'

//正则验证
import {appRegExp} from "../../utils/validation";


const {Content} = Layout;
const FormItem = Form.Item;

import {AppConfig} from '../../core/appConfig';
const serviceUrl = AppConfig.serviceUrl;

const formItemLayout = {
    labelCol: {span: 17, offset: 3},
    wrapperCol: {span: 17, offset: 3},
};

const formItemLayout2 = {
    labelCol: {span: 0},
    wrapperCol: {span: 24},
};
const formItemLayout3 = {
    labelCol: {span: 0},
    wrapperCol: {span: 12, offset: 5},
};

class CategoryFormModel extends React.Component {
    constructor(props) {
        super(props);
    };

    /**
     * 加载所有车辆类型
     */
    componentDidMount() {
        this.props.getCarCategory();
        this.props.queryArea();
    };

    //创建添加类别
    createCarCategory = () => {
        this.props.emptyCarCategoryId();     //清空输入框的值
        this.props.changePostFormType('category');
        //this.props.updateCarLevelName('');

    };

    //修改
    modifyCarCategory = (id, type) => {
        const form = this.props.form;
        form.resetFields();
        if (id) {
            this.props.changePostFormType(type);
            this.props.getCarCategoryById(id);
        }
    };


    //删除
    deleteCarCategory = (id, type) => {
        if (id) {
            // if (type === 'category') {
            //     this.props.changePostFormType('category');
            // }
            this.props.emptyCarCategoryId();
            this.props.deleteCarCategory(id);
        }
    };


    /**
     * 创建车辆类型
     * @param carCategory 车辆类型实体
     */
    handlePostCarCategory = (carCategory) => {
        if (carCategory) {
            const id = this.props.id;
            if (id) {
                carCategory['id'] = id;
                this.props.updateCarCategoryName(carCategory.typeName);
                this.props.updateArea(carCategory.area);
                this.props.putCarCategory(carCategory);
            } else {
                this.props.postCarCategory(carCategory);
                this.props.getImgUrl('');
            }
        }
    };


    render() {
        const {form} = this.props;
        const {carCategory, operationRunning, areaName} = this.props;
        const {postVisible, postFormType} = this.props;
        const {typeName, area, imgUrl} = this.props;

        return (
            <Modal
                title={<span><Icon type="user-add"/>类别设置</span>}
                visible={postVisible}
                onCancel={this.props.closePostSettingModal}
                footer={null}
                width={640}
                className={styles.redModal}>
                <Row type="flex">
                    <Col span={8} className={styles.leftCol}>
                        <Layout>
                            <div className={styles.headTitle}>
                                <label>车辆类别</label>
                                <Button size="small" title="添加类别" onClick={this.createCarCategory}>添加类别</Button>
                            </div>
                            <Content>
                                {/*树形菜单*/}
                                <CategorySubMenu
                                    carCategory={carCategory}                     //数据源
                                    modifyCarCategory={this.modifyCarCategory}    //修改
                                    deleteCarCategory={this.deleteCarCategory}    //删除
                                />
                            </Content>
                        </Layout>
                    </Col>
                    <Col span={16} className={styles.rightCol}>
                        <CategoryForm
                            form={form}
                            postFormType={postFormType}
                            closePostSettingModal={this.props.closePostSettingModal}
                            handlePostCarCategory={this.handlePostCarCategory}
                            getImgUrl={this.props.getImgUrl}
                            typeName={typeName}
                            operationRunning={operationRunning}
                            area={area}
                            imgUrl={imgUrl}
                            areaName={areaName}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

//车辆二级类型表单
class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
    }

    //保存车辆类型
    saveCarCategory = () => {
        const form = this.props.form;
        const imgUrl = this.props.imgUrl;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values['imgUrl'] = imgUrl;
            this.props.handlePostCarCategory(values);
            form.resetFields();
            //this.props.getImgUrl('');
            console.log('收集到的信息', values);
        });
    };


    /**
     * 获取表单面板
     * @param postFormType
     * @returns {Array}
     */
    getFormPanel = (postFormType) => {
        const {getFieldDecorator} = this.props.form;
        let formPanel = [];
        let areaList;
        let isShowImg, tempImgSrc = this.props.imgUrl === '' ? '' : `${serviceUrl}${this.props.imgUrl}`;
        isShowImg = <PeopleAvatar getImgUrl={this.props.getImgUrl} imgUrl={tempImgSrc}/>;
        let allAreaList = this.props.areaName;

        if(allAreaList) {
            areaList = allAreaList.map((item, index) => {
                return (
                    <Option key={index} value={item.areaName}>{item.areaName}</Option>
                )
            })
        }

        if (postFormType !== 'none') {

            //类别图片显示
            formPanel.push(
                <div key={'imgUrl'} className={styles.imgStyle}>
                   {isShowImg}
                </div>
            )

            formPanel.push(<FormItem key={'typeName'} {...formItemLayout} label="类别名称" hasFeedback={true}>
                {getFieldDecorator('typeName', {
                    rules: [{
                        required: true,
                        regexp: 'regexp',
                        pattern: appRegExp.CAR_CATEAGORY_NAME,
                        message: appRegExp.CAR_CATEAGORY_NAME_ERROR_MSG,
                        min: 1,
                        max: 20,
                    }],
                    initialValue: this.props.typeName

                })(
                    <Input maxLength="10" disabled={this.props.typeName ? true : false}/>
                )}
            </FormItem>)

            //关联区域
            formPanel.push(<FormItem key={'area'} {...formItemLayout} label="关联区域">
                {getFieldDecorator('area', {
                    initialValue: this.props.area
                })(
                    <Select>
                        {areaList}
                    </Select>
                )}
            </FormItem>)
        }
        return formPanel;
    };

    /**
     * 获取按钮面板
     * @param postFormType
     * @returns {*}
     */
    getButtonPanel = (postFormType) => {

        let buttonPanel = null;

        if (postFormType !== 'none') {
            buttonPanel = <FormItem {...formItemLayout2} style={{textAlign: 'center'}}>
                <Button key="submit" type="primary" loading={this.props.operationRunning} size="large"
                        onClick={this.saveCarCategory}
                        style={{
                            margin: '0px 15px 0px 0px',
                            width: '110px'
                        }}>保存</Button>
                <Button key="back" size="large"
                        onClick={this.props.closePostSettingModal}
                        style={{margin: '0px 15px 0px 0px', width: '110px'}}>
                    取消
                </Button>
            </FormItem>
        }

        return buttonPanel;

    };


    render() {
        const {postFormType} = this.props;
        const FormPanel = this.getFormPanel(postFormType);
        const buttonPanel = this.getButtonPanel(postFormType);

        return (
            <Form layout="vertical">
                <FormItem {...formItemLayout}>
                </FormItem>
                <FormItem {...formItemLayout}>
                </FormItem>
                {FormPanel}
                <FormItem {...formItemLayout}>
                </FormItem>
                {buttonPanel}
                <FormItem {...formItemLayout}>
                </FormItem>
                <FormItem {...formItemLayout}>
                </FormItem>
            </Form>
        )
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        getCarCategory: () => dispatch(getCarCategory()),
        getCarCategoryById: (id) => dispatch(getCarCategoryById(id)),
        emptyCarCategoryId: () => dispatch(emptyCarCategoryId()),
        updateCarCategoryName: (typeName) => dispatch(updateCarCategoryName(typeName)),
        updateArea: (area) => dispatch(updateArea(area)),
        putCarCategory: (model) => dispatch(putCarCategory(model)),
        postCarCategory: (model) => dispatch(postCarCategory(model)),
        deleteCarCategory: (id) => dispatch(deleteCarCategory(id)),
        getImgUrlComponent: (imgUrlComponent) => dispatch(getImgUrlComponent(imgUrlComponent)),
        getImgUrl: (imgUrl) => dispatch(getImgUrl(imgUrl)),
        queryArea: () => dispatch(queryArea())
    }
}

const selectorStateToProps = createStructuredSelector({
    carCategory: carCategorySourceSelector(),
    typeName: typeNameSelector(),
    id: idSelector(),
    area: areaSelector(),
    imgUrl: imgUrlComponentSelector(),
    // imgUrlComponent: imgUrlComponentSelector()
    areaName: areaNameSourceSelector(),
});

export default connect(selectorStateToProps, actionsDispatchToProps)(Form.create()(CategoryFormModel));