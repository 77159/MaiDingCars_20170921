/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/1
 * @describe  Webpack 生产环境-配置文件
 */
'use strict';
const webpack = require("webpack");
const path = require("path");
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, "node_modules");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const CompressionPlugin = require("compression-webpack-plugin");
//const TransferWebpackPlugin = require('transfer-webpack-plugin');
//const CircularDependencyPlugin = require('circular-dependency-plugin');

//antd 自定义样式
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './antd-theme-vars.less'), 'utf8'));

//是否为生产环境
var isProduction = false;
const config = {
    // 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个chunk（编译后的独立文件）。
    entry: [
        path.join(process.cwd(), '/src/js/app.js'),         //设置入口文件的相对路径
    ],
    devtool: "nosources-source-map",     //source map 设置  详细配置：https://doc.webpack-china.org/configuration/devtool/
    // 生成文件，是模块构建的终点，包括输出文件与输出路径。
    output: {
        //数据文件名称
        filename: 'js/[name].js',
        //输出文件的路径
        path: path.resolve(process.cwd(), 'build')
    },
    module: {
        noParse: /fengmap/,                         //排除对FengMapSDK的编译
        rules: [{
            test: /\.(js|jsx)$/,                    //匹配.js||.jsx后缀名的文件
            loader: ['babel-loader'],               //使用babel-loader转换器
            exclude: [nodeModulesPath],             //不解析node_modules目录的es6语法
        }, {
            test: /\.css$/,                         //匹配.css后缀名的文件
            use: isProduction ? ExtractTextPlugin.extract({      //判断是否为生产环境，生产环境时抽取所有.css文件打包，非生产环境使用默认的转换器进行编译。
                fallback: "style-loader",
                use: "css-loader",
            }) : ["style-loader", "css-loader"]     //["style-loader", {loader: 'css-loader', options: {importLoaders: 1}}]
        }, {
            test: /\.less$/,                        //匹配.less后缀名的文件
            include: [nodeModulesPath],             //仅处理 node_modules目录中的less （antd的less文件）
            use: [
                "style-loader",
                "css-loader",
                {
                    loader: "less-loader",
                    options: {
                        sourceMap: true,
                        modifyVars: themeVariables
                    }
                }
            ]
        }, {
            test: /\.less$/,                        //匹配.less后缀名的文件
            exclude: [nodeModulesPath],             //排除 node_modules目录中的less （不处理 antd 的less）
            use: isProduction ? ExtractTextPlugin.extract({      //判断是否为生产环境，生产环境时抽取所有.less文件打包，非生产环境使用默认的转换器进行编译。
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader"},
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: true,
                                modifyVars: themeVariables
                            }
                        }
                    ]
                }) :
                [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: true,
                            modifyVars: themeVariables
                        }
                    }
                ]
        }
        ]
    },
    plugins: [

        //动态生成 index.html 并缩小、优化
        //详细配置：https://github.com/jantimon/html-webpack-plugin#third-party-addons
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),           //模板文件地址
            filename: 'index.html',                                     //生成文件名称
            inject: 'body',                                             //把模板注入到哪个标签后 'body'
        }),
        // 移动一些未通过webpack引用的静态文件
        new CopyWebpackPlugin([
            {from: 'src/img', to: 'img'},
            {from: 'src/assets', to: 'assets'}
        ]),
    ],
    performance: {                                       //关闭包过大提示
        hints: false,
    },
};
module.exports = config;