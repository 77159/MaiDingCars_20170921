/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  dl (duanliang@fengmap.com)
 * @date     2017/9/12
 * @describe 人员类型二级树菜单
 */
'use strict';

import React from 'react';

//antd-ui
import {Button, Icon} from 'antd';
import {Menu} from 'antd';

//css
import styles from './index.less';

const SubMenu = Menu.SubMenu;
import {Popconfirm} from 'antd';

export class CategorySubMenu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {carCategory} = this.props;    //数据源
        // console.log(carCategory);
        return (
            <Menu
                mode="inline"
                className={styles.menu}
                //openKeys={[]}
            >
                {
                    carCategory.map((item, index) => {
                        let id = item.id;
                        return (
                            <SubMenu key={index} title={
                                <section>
                                    <span className={styles.floorName}>{item.typeName}</span>
                                    <Button shape="circle" ghost className={styles.areaEditBtn}
                                            title="编辑" onClick={(e) => {
                                        e.stopPropagation();
                                        this.props.modifyCarCategory(id, 'category');
                                    }}>
                                        <Icon type="edit"/>
                                    </Button>

                                    <Popconfirm title="确认要删除此类别吗？"
                                                onConfirm={() => this.props.deleteCarCategory(id, 'category')}>
                                        <Button shape="circle" ghost className={styles.areaEditBtn}
                                                title="删除" onClick={(e) => {
                                            e.stopPropagation();
                                        }}>
                                            <Icon type="close"/>
                                        </Button>
                                    </Popconfirm>
                                </section>
                            }>
                            </SubMenu>
                        )
                    })
                }
            </Menu>
        )
    }
}