'use strict';
/**
 * 提供正则判断及错误提示的类
 */
export const appRegExp = {
    modelName: /^[\u4E00-\u9FA5a-zA-Z0-9\-\_\(\)\'\.\·\s]{1,50}$/, //任意字符最多50个字符
    name: /^[\u4E00-\u9FA5a-zA-Z0-9\-\_\(\)\'\.\·\s]{1,10}$/, //任意字符最多10个字符
    groupName: /^[\u4E00-\u9FA5a-zA-Z0-9\-\_\(\)\'\.\·\s]{1,20}$/, //任意字符最多20个字符
    searchText: /^[\u4E00-\u9FA5a-zA-Z0-9\-\_\(\)\'\.\·\s]*$/, //不包含特殊符号
    floatNumber: /^-?\d+\.?\d{0,2}$/, //小数后2位
    intNumber: /^[1-9]\d*$/, //正整数
    ///////////////////////////////////////////////////
    /**********地磁设备**********/
    DEVICECODE: /^[a-zA-Z0-9]{3,15}$/,                               //设备编号
    DEVICECODE_ERROR_MSG: '设备编号规则为3~15位英文字母、数字',
    DEVICENAME: /^[a-zA-Z0-9-\u4e00-\u9fa5]{0,20}$/,                 //设备名称
    DEVICENAME_ERROR_MSG: '设备名称规则为0~20位中文、英文、数字、短横线',
    DEVICESTATUS: /^[01]$/,											//设备状态
    DEVICESTATUS_ERROR_MSG: '设备状态规则为数字0或者1',
    DEVICETYPE: /^[\w]{3,15}$/,										//设备类型
    DEVICETYPE_ERROR_MSG: '设备类型规则为3~15位数字、字母、下划线',
    DEVICEREMARK: /^[\w\u4E00-\u9FA5\:\;\,\-\(\)\u3014-\u3015\uFF08-\uFF09][a-zA-Z0-9\u4E00-\u9FA5_:;,\(\)\s\-\u3014-\u3015\uFF08-\uFF09\：\；\，\.\。]{0,50}$/,	//设备备注
    DEVICEREMARK_ERROR_MSG: '设备备注规则为0~50位字母、数字、下划线、中划线、汉字、分号、逗号、小括号、空格等字符',
    DEVICEINFO: /^[0-9,，]{3,50}$/,                              //设备标识
    DEVICEINFO_ERROR_MSG: '设备标识规则为设备编号+27位标识，由3-28位数字、逗号组成',

    /**********车辆**********/
    CARCODE: /^[a-zA-Z0-9]{3,15}$/,								//车辆编号
    CARCODE_ERROR_MSG: '车辆编号规则为3~15英文字母、数字',
    PERSONNAME: /^[a-zA-Z\u4e00-\u9fa5]{2,4}$/,						//人员姓名
    PERSONNAME_ERROR_MSG: '人员姓名规则为2~4位中文或英文字母',
    PERSONSEX: /^[01]$/,												//人员性别
    PERSONSEX_ERROR_MSG: '人员性别规则为数字0或者1',
    PERSONAGE: /^[0-9]{0,3}$/,										//人员年龄
    PERSONAGE_ERROR_MSG: '人员年龄规则为0~3位数字',
    PERSONCONTACT: /^[0-9a-zA-Z\u4e00-\u9fa5_@.]{0,15}$/,			//联系方式
    PERSONCONTACT_ERROR_MSG: '人员联系方式规则为0~15位中文、数字、英文字母、或者下划线、@符号、英文.',
    CARREMARK: /^[\w\u4E00-\u9FA5\:\;\,\-\(\)\u3014-\u3015\uFF08-\uFF09][a-zA-Z0-9\u4E00-\u9FA5_:;,\(\)\s\-\u3014-\u3015\uFF08-\uFF09\：\；\，\.\。]{0,100}$/,	//车辆备注
    CARREMARK_ERROR_MSG: '车辆备注规则为0~100位字母、数字、下划线、中划线、汉字、分号、逗号、小括号、空格等字符',
    PERSONTYPE: /^[0-9a-zA-Z\u4e00-\u9fa5]{3,10}$/,					//职位类别
    PERSONTYPE_ERROR_MSG: '职位类别规则为3~10位中文、数字、字母',
    PERSONLEVEL: /^[0-9a-zA-Z\u4e00-\u9fa5]{3,10}$/,					//职位级别
    PERSONLEVEL_ERROR_MSG: '职位级别规则为3~10位中文、数字、字母',
    PERSON_DEVICECODE: /^[a-zA-Z0-9]{3,15}$/,						//关联设备编号
    PERSON_DEVICECODE_ERROR_MSG: '关联设备编号规则为3~15位英文字母、数字',
    PERSONAREA: /^[01]$/,											//是否可进入重点区域
    PERSONAREA_ERROR_MSG: '是否可进入重点区域规则为数字0或者1',

    /**********人员类型设置**********/
    CAR_CATEAGORY_NAME: /^[\u4E00-\u9FA5a-zA-Z0-9\-\_\(\)\'\.\·\s]{1,20}$/,
    CAR_CATEAGORY_NAME_ERROR_MSG: '车辆类别规则为0~10位中文、英文、数字、短横线',

    /**********区域设置**********/
    AREAID: /^[\w]{3,15}$/,											//楼层ID
    AREAID_ERROR_MSG: '楼层ID规则为3~15位数字、字母、下划线',
    AREANAME: /^[a-zA-Z0-9-\u4e00-\u9fa5]{3,20}$/,					//区域名称
    AREANAME_ERROR_MSG: '区域名称规则为3~20位中文、英文、数字、短横线',
    AREATYPE: /^[01]$/,												//区域类型
    AREATYPE_ERROR_MSG: '区域类型规则为数字0或者1',
    AREAREMARK: /^[\w\u4E00-\u9FA5\:\;\,\-\(\)\u3014-\u3015\uFF08-\uFF09][a-zA-Z0-9\u4E00-\u9FA5_:;,\(\)\s\-\u3014-\u3015\uFF08-\uFF09\：\；\，\.\。]{0,50}$/,	//区域备注
    AREAREMARK_ERROR_MSG: '区域备注规则为0~50位字母、数字、下划线、中划线、汉字、分号、逗号、小括号、空格等字符',
    MAXCARNUM: /^[0-9]{1,3}$/,                                      //车辆限制  areaMaxSpeed
    MAXCARNUM_ERROR_MSG: '车辆数量限制规则为1~3位数字',
    MAXSPEED: /^([0-9]|1[0-5])(\.[0-9])?$/,                                      //车辆速度限制
    MAXSPEED_ERROR_MSG: '车辆速度规则为1~2位数字，小数点后保留1位数字',


    /**********系统用户**********/
    USERNAME: /^[0-9a-zA-Z\u4e00-\u9fa5_@.]{3,15}$/,					//用户名
    USERNAME_ERROR_MSG: '用户名规则为3~15位中文、数字、英文字母、或者下划线、@符号、英文.',
    PASSWORD: /^[\w]{6,16}$/,										//密码
    PASSWORD_ERROR_MSG: '密码规则为6~16位数字、字母、下划线',

    /**********人员职位**********/
    POSTNAME: /^[0-9a-zA-Z\u4e00-\u9fa5_@.]{0,15}$/,					//职位名称
    POSTNAME_ERROR_MSG: '职位名称规则为0~15位中文、数字、英文字母、或者下划线、@符号、英文.',


    /**********车辆相关**********/
    SAFETYSPEED: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,                              //安全速度
    SAFETYSPEED_ERROR_MSG: '安全速度规则为1-6位数字、小数点后保留2位数字',



};


export const FMEditorValidation = {
    //错误提示
    modelNameError: '不含特殊符号，最大50个字符',
    nameError: '不含特殊符号，最大10个字符',
    groupNameError: '不含特殊符号，最大20个字符',
    searchTextError: '不包含特殊符号',
    floatNumberError: '取值范围0.01~99.99',
    emptyError: '请输入不为空的值',
    floatWidthError: '取值范围0.1~10.0',
    adsorptionError: '取值范围1~50',
    fontSizeError: '取值范围1~150',
    pathWidthError: '取值范围1~30',
    alphaError: '取值范围0.0~1.0',

    //验证modelname的正则
    checkModelNameReg: (value) => {
        return !appRegExp.modelName.exec(value);
    },

    //验证多数名称的正则
    checkNameReg: (value) => {
        return !appRegExp.name.exec(value);
    },

    //验证groupName的正则
    checkGroupNameReg: (value) => {
        return appRegExp.groupName.test(value);
    },

    //验证SearchText的正则
    checkSearchTextReg: (value) => {
        return !appRegExp.searchText.exec(value);
    },

    //验证浮点型的正则 元素高度和标注高度
    checkFloatNumberReg: (value) => {
        var num = parseFloat(value);
        return (num < 0.01 || num > 99.99 || !appRegExp.floatNumber.exec(value));
    },

    //验证浮点型的正则 (边线宽度)
    checkFloatWidthReg: (value) => {
        var num = parseFloat(value);
        return (num < 0.1 || num > 10 || !appRegExp.floatNumber.exec(value));
    },

    //验证正整数（吸附半径）
    checkAdsorptionReg: (value) => {
        var num = parseInt(value);
        return (!appRegExp.intNumber.test(value) || num < 1 || num > 50);
    },

    //验证字体大小
    checkFontSizeReg: (value) => {
        var num = parseInt(value);
        return (!appRegExp.intNumber.test(value) || num < 1 || num > 150);
    },

    //验证路径宽度
    checkPathWidthReg: (value) => {
        var num = parseInt(value);
        return (!appRegExp.intNumber.test(value) || num < 1 || num > 30);
    },

    //验证透明度
    checkAlphaReg: (value) => {
        var num = parseFloat(value);
        return (num < 0.0 || num > 1.0 || !appRegExp.floatNumber.exec(value));
    },
};