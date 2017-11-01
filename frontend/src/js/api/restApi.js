/**
 * Copyright 2014-2016, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2016/11/27
 * @describe API接口封装类(封装通用的请求方法)
 */
import 'isomorphic-fetch';

/**
 * 发送网络请求
 * @param url 请求地址(URL)
 * @param method 请求方法,'GET','POST','DELETE','PUT'
 * @param options 请求参数 默认为空{}
 * @returns {Promise.<TResult>|*}
 */
export function makeRequest(url, method, options = null) {

    let fetchOptions = {
        method: method || 'GET',
        catch: 'default',
        credentials: 'include',
        mode: 'cors', //允许跨域
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    if (options) {
        fetchOptions.body = JSON.stringify(options);
    }
    return fetch(url, fetchOptions)
        .then(response => {
            console.log('Received response: ' + url);
            //console.log('Received response: ' + JSON.stringify(response, null, 4));
            console.log('Received response: ' + response.status);
            console.log('Received response: ' + response.statusText);
            console.log(response.headers.get('Content-Type'));

            if (response.status >= 200 && response.status < 300) {

                return response.text()
                    .then(responseText => {
                        //console.log('Server response: ' + responseText);
                        let jsonData = undefined;
                        try {
                            jsonData = JSON.parse(responseText);
                        } catch (e) {
                        }
                        if (jsonData.error === true) {
                            let errorText = '';
                            if (jsonData.errors) {
                                jsonData.errors.forEach(errText => {
                                    errorText += '\n' + errText;
                                });
                            } else {
                                errorText = JSON.stringify(jsonData.errors);
                            }
                            throw Error(errorText);
                        } else if (jsonData.data !== undefined) {
                            jsonData = jsonData;
                        }
                        return jsonData;
                    });
            } else {
                throw Error(response.statusText);
            }
        });
}

/**
 * 发送针对于编辑器服务接口的请求
 * @param url 接口地址（不含协议，域名，端口）
 * @param method 请求方法 GET|POST|PUT|DELETE
 * @param options 请求参数 body
 * @returns {Promise.<TResult>|*}
 */
export function invokeServerAPI(url, method, options) {
    return makeRequest(window.serviceUrl + url, method, options);
}