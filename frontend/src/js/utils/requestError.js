/**
 * 请求错误提示枚举类
 * @author chenwenji 2017-04-21
 */
const requestError = {
    /*************************** 设备类型 ***************************/
    QUERY_ALL_DEVICE_ERROR: '加载设备数据列表错误',
    CREATE_DEVICE_ERROR: '添加设备时出现错误',
    CREATE_DEVICE_SUCCESS: '添加设备成功',
    DEVICE_NUM_ERROR: '设备编号或标识重复，请更改设备编号或标识',
    //修改设备
    MODIFY_DEVICE_ERROR: '修改人员时出现错误',
    MODIFY_DEVICE_SUCCESS: '修改成功',
    //删除设备
    DELETE_DEVICE_ERROR: '删除设备失败，请稍后再试',
    DELETE_DEVICE_SUCCESS: '删除设备成功',

    /*************************** 人员类型 ***************************/
    GET_CARCATEGORY_ERROR: '获取人员类型失败',
    GET_CARCATEGORY_SUCCESS: '获取人员类型成功',
    POST_CARCATEGORY_ERROR: '添加人员类型失败',
    POST_CARCATEGORY_SUCCESS: '添加人员类型成功',
    DELETE_CARCATEGORY_ERROR: '删除人员类型失败',
    DELETE_CARCATEGORY_SUCCESS: '删除人员类型成功',
    PUT_CARCATEGORY_ERROR: '修改人员类型失败',
    PUT_CARCATEGORY_SUCCESS: '修改人员类型成功',
    DELETE_SUCCESS: '删除成功',
    //添加人员
    CREATE_CAR_ERROR: '添加人员时出现错误',
    CREATE_CAR_NUM_ERROR: '人员编号重复，请重新输入',
    CREATE_CAR_SUCCESS: '添加人员成功',
    //修改人员
    MODIFY_CAR_ERROR: '修改人员时出现错误',
    MODIFY_CAR_SUCCESS: '修改人员成功',
    //人员退出
    DROP_OUT_ERROR: '退出失败',
    DROP_OUT_SUCCESS: '退出成功',
    //人员登陆
    LOGIN_ERROR: '登陆失败',
    LOGIN_USER_ERROR: '用户名或密码错误',
    LOGIN_SUCCESS: '登陆成功',
    //修改密码
    MODIFY_PASSWORD_ERROR: '密码修改失败',
    MODIFY_PASSWORD_SUCCESS: '密码修改成功',
    MODIFY_USER_PASSWORD_ERROR: '您的原密码错误，请重新输入',

    /*************************** 地图区域 ***************************/
    QUERY_AREALIST_ERROR: '获取地图区域失败',
    DELETE_AREA_BY_ID_ERROR: '删除地图区域失败',
    DELETE_AREA_BY_ID_SUCCESS: '删除地图区域成功',
    CREATE_AREA_ERROR: '创建地图区域失败',
    CREATE_AREA_SUCCESS: '创建地图区域成功',
    QUERY_AREA_BY_ID_ERROR: '查询地图区域失败',
    QUERY_AREA_BY_ID_SUCCES: '查询地图区域成功',
    MODIFY_AREA_ERROR:'更新地图区域失败',
    MODIFY_AREA_SUCCESS:'更新地图区域成功',
    /***************************  ***************************/
    GET_DATA_SUCCESS: '获取数据成功',
    UPDATE_DATA_SUCCESS: '数据已同步至最新版',
    GET_DATA_ERROR: '获取数据失败',
    REQUEST_ERROR: '请求异常',
    GET_THEME_SUCCESS: '获取主题数据成功',
    GET_THEME_ERROR: '获取主题数据失败',
    GET_USERPOI_ERROR: '获取用户图标列表失败',
    GET_DEFAULTPOI_ERROR: '获取默认图标列表失败',
    REMOVE_USERPOI_ERROR: '删除用户图标失败',
    UPDATE_USERPOI_ERROR: '编辑用户图标失败',
    GET_TRAFFIC_ERROR: '获取分组列表失败',
    DEL_TRAFFIC_ERROR: '删除分组失败',
    UPDATE_TRAFFIC_ERROR: '编辑分组失败',
    ADD_TRAFFIC_ERROR: '新增分组失败',
    SEARCH_ERROR: '当前处于路径面板打开状态，请切换至其他面板重新搜索',
    DATATABLE_OPEN_ERROR: '当前处于路径面板打开状态，请切换至其他面板操作数据管理',
    MESSAGE_DEL_WAR: '请选择项进行操作',
    EXPORT_CSV_WAR: '没有可用的数据，无法导出csv文件',
    MERGE_FEATURE_ERROR: '面合并失败，请选择相邻面元素合并',
    NOT_EXIST_PATH_DATA_WARN: '当前地图不存在路径数据',
    LOGOUT_WARN: '退出系统',
};

export default requestError;