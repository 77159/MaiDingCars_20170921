/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 修改密码 Actions
 */
'use strict';
import {
    MODIFY_PASSWORD,
    MODIFY_BEGIN,
    MODIFY_FINISH,
    MODIFY_FORM_MODAL_HIDE,
    MODIFY_FORM_MODAL_SHOW
} from './constants';


/**
 * 修改密码-开始
 */
export const modifyFormModalOpBegin = () => ({
    type: MODIFY_BEGIN
});

/**
 * 修改密码-结束
 */
export const modifyFormModalOpFinish = () => ({
    type: MODIFY_FINISH
});

/**
 * 显示修改密码信息框
 * @param operation 操作状态
 */
export const modifyFormModalShow = (operation) => ({
    type: MODIFY_FORM_MODAL_SHOW,
    payload:{operation}
});

/**
 * 隐藏修改密码信息框
 */
export const modifyFormModalHide = () => ({
    type: MODIFY_FORM_MODAL_HIDE
});


/**
 * 修改密码
 * @param passwordMsg 修改密码信息集合
 */
export function modifyPassword(passwordMsg) {
    return {
        type: MODIFY_PASSWORD,
        payload: passwordMsg
    };
}
