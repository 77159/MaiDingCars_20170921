/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计信息对话框（Modal）
 */

'use strict';
import React from 'react';
import {
    Layout,
    Menu,
    Icon,
    Modal,
    Form,
    Spin
} from 'antd';
const {Content} = Layout;
const FormItem = Form.Item;
import styles from './index.less';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {
    deviceEntitySelector,
    modalVisibleSelector,
    operationRunningSelector,
    operationSelector,
    centerAreaEntitySelector,
    isShowSelector
} from './selectors';
import {statisticalFormModalHide} from "./actions";
import echarts from 'echarts';
import _ from 'lodash';

class StatisticalFormModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        let data_ = nextProps.centerAreaEntity;
        if (data_ && data_.legendData) {
            let ChartDom = document.getElementById('main4');
            if (!ChartDom) return;

            let myChart = echarts.init(ChartDom);
            // 绘制图表
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    x2: 'right',
                    top: '30',
                    right: '30',
                    // textStyle: {
                    //     fontSize: 14,
                    //     padding: [3, 4, 5, 6],
                    // },
                    data: data_.legendData
                },
                series: [{
                    name: '区域密度',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data_.data
                }]
            });
            window.onresize = myChart.resize;
        }
    }

    //取消
    onCancel = () => {
        this.props.hideModal();
    };

    render() {
        const {
            modalVisible,
            deviceEntity,
            operationRunning,
            centerAreaEntity,
            isShow
        } = this.props;
        
        return (
            <Modal
                title={<span><i className="iconfont icon-shebeiguanli"/>{deviceEntity} - 集中区域分析</span>}
                visible={modalVisible}
                onCancel={this.onCancel}
                footer={null}
                width={700}
                className={styles.redModal}
                loading={operationRunning}
            >
                <div>
                    <span style={{position: 'relative', left: '50px'}}>工作总时长：{centerAreaEntity.totalTime} h</span>
                    <div id="main4" style={{height: 320}}></div>

                </div>
                <div className={styles.cover} style={{display: `${isShow[0]}`}}>
                    <Spin size="large" className={styles.spin}/>
                </div>

            </Modal>
        );
    }
}

export function actionsDispatchToProps(dispatch) {
    return {
        hideModal: () => dispatch(statisticalFormModalHide()),
    };
}

const selectorStateToProps = createStructuredSelector({
    modalVisible: modalVisibleSelector(),
    operation: operationSelector(),
    operationRunning: operationRunningSelector(),
    deviceEntity: deviceEntitySelector(),
    centerAreaEntity: centerAreaEntitySelector(),
    isShow: isShowSelector()
});

export default connect(selectorStateToProps, actionsDispatchToProps)(Form.create()(StatisticalFormModal));