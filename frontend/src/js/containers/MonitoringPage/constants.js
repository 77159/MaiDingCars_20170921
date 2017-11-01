/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * CONSTANT的定义请遵循以下格式：
 * export const YOUR_ACTION_CONSTANT = 'YourContainer/YOUR_ACTION_CONSTANT';
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 实时监控 constants
 */
'use strict';
export const CHANGE_USERNAME = 'boilerplate/Home/CHANGE_USERNAME';
