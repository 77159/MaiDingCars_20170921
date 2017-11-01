/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/22
 * @describe 人员详细信息卡片
 */
'use strict';

import React from 'react';

//antd ui
import {Card, Icon, Avatar} from 'antd';

import styles from './index.less';


export default class PeopleCard extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * 关闭右下角详细信息框
     */
    onClosePeopleInfoWindow = () => {
        this.props.onClosePeopleInfoWindow();
    };

    /**
     * 获取人员头像地址 如果没有上传图像，则判断性别设置默认头像地址
     * @param imgUrl 人员头像地址
     * @param sex 人员性别 [0,男][1,女]
     */
    getImageUrl = (imgUrl, sex) => {
        const service = window.serviceUrl;
        if (imgUrl) {
            return service + imgUrl;
        } else {
            if (sex === 0) {
                return '../../img/avatar/man.png';
            } else {
                return '../../img/avatar/woman.png';
            }
        }
    };

    render() {
        const {people} = this.props;

        return (
            <Card noHovering={true} bordered={false} className={this.props.peopleInfoWinClassName} title={
                <span><Icon type="solution"/>人员编号： {people ? people.personCode : ''}</span>
            }
                  extra={<span className={styles.peopleClose} title="关闭"
                               onClick={this.onClosePeopleInfoWindow}>
                      <Icon type="close"/></span>}
            >
                <div className={styles.leftPeopleContent}>
                    <Avatar className={styles.peopleAvatar}
                            src={this.getImageUrl(people ? people.avatarImgPath : '', people ? people.sex : 1)}/>
                    <span className={styles.nameTag}>{people ? people.personName : ''}</span>
                </div>
                <div className={styles.rightPeopleContent}>
                    <span>职别：{this.props.getPostTypeName(people ? people.postType : '')}-{this.props.getPostTypeName(people ? people.postLevel : '')}</span>
                    <span>年龄：{people ? people.age : ''}</span>
                    <span>电量：xxx</span>
                    <span>设备编号：{people ? people.deviceCode : ''}</span>
                    <span className={styles.location} title="位置：一层西南口大会议室附近">位置：一层西南口大会议室附近</span>
                </div>
            </Card>
        )
    }
}