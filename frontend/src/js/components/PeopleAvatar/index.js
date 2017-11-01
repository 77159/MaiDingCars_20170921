/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/23
 * @describe 头像上传组件
 */
'use strict';

import React from 'react';
import {Upload, Icon, message} from 'antd';
import styles from './index.less';

import {AppConfig} from '../../core/appConfig';
const serviceUrl = AppConfig.serviceUrl;

export class PeopleAvatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: props.imgUrl || ''
        };
    }

    componentWillReceiveProps(nextprops) {
        this.setState({
            imageUrl: nextprops.imgUrl
        });
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('只能上传JPEG格式的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传的图片大小不能超过2M');
        }
        return isJPG && isLt2M;
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}));
            this.props.getImgUrl(info.file.response.imgUrl);
        }
    };

    render() {
        const imageUrl = this.state.imageUrl;
        return (
            <Upload
                className={styles.avatarUploader}
                name="avatar"
                showUploadList={false}
                action={`${serviceUrl}/cars/upload`}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {
                    imageUrl ?
                        <img src={imageUrl} alt="" className={styles.avatar}/> :
                        <span style={this.props.modifyImg2} className={styles.avatarUploaderTrigger}>点击或拖拽上传照片</span>
                }
            </Upload>
        );
    }
}