# 环境配置与工程搭建
------

## 安装 Node.js

[点击下载Node.js][1]

配置环境变量与NPM

## 安装 Yarn

[点击下载Yarn][2]

## 初始化 package.json

    yarn init
    或
    npm init

## 添加 React

    yarn add react react-dom
    或
    npm install --save react react-dom

## 添加 Andt 框架

    yarn add antd

## 安装 Babel

    # babel cli (command-line interface)
    yarn add babel-cli
        
    # 安装ES6转换器 preset-env 可换为 es-2015 或 es-2016 等
    yarn add babel-preset-es2015 -D
    或
    yarn add babel-preset-env -D
       
    # polyfill用于兼容低版本浏览器
    yarn add babel-polyfill -D
       
    # 用于 webpack
    yarn add babel-loader babel-core -D   
        
    # 用于 react
    yarn add babel-preset-react -D
    
   在项目根目录创建文件名为 **.babelrc** 的Bable配置文件，并在文件中配置转换器：
   
   ```json
    {
      "presets": ["es2015","react"]
    }   
   ```
   presets 数组的配置顺序，在执行时是相反的 先执行 react，然后 es2015
   
   注意：使用npm 2.x运行Babel 6.x项目可能会导致性能问题，因为npm 2.x安装依赖关系。可以通过切换到npm 3.x或使用重复数据删除标志运行npm 2.x来消除此问题。检查你运行的npm版本
   

   ```shell
   npm --version
   ```
   
## 安装 Bable Runtime transform 插件

    yarn add babel-plugin-transform-runtime -D
    yarn add babel-runtime
    
   修改 `.babelrc` 文件，配置如下：
   
   默认配置
   ```json       
    {
      "plugins": ["transform-runtime"]
    }
   ```
   带参数的配置
   ```json
    {
      "plugins": [
        ["transform-runtime", {
          "helpers": false,
          "polyfill": false,
          "regenerator": true,
          "moduleName": "babel-runtime"
        }]
      ]
    }
   ``` 

   关联资料：http://babeljs.io/docs/plugins/transform-runtime/      

## 安装 Webpack
    
    yarn add webpack -D

## 安装 webpack-Dev-Middleware

   webpack中间件 https://github.com/webpack/webpack-dev-middleware
   
    yarn add webpack-dev-middleware -D

## 安装 webpack Dev Server
   
   在开发过程中使用 webpack-dev-server 可以搭建一个开发服务器，当代码修改时，可实现页面实时重新加载。
   此组建基于 webpack-dev-middleware，它提供了对webpack资源的快速内存访问。
   
   Github: https://github.com/webpack/webpack-dev-server
      
     yarn add webpack-dev-server -D

## 配置 Webpack

   在项目根目录创建下面两个文件： 
   
   `webpack.config.js` (用于编译生产环境) 
   
   `webpack-dev.config.js` (用于开发环境)
   
   开发环境配置如下：
   
   ```javascript
    //待补充   
   ```
   
   生产编译环境配置如下：
      
   ```javascript
   //待补充   
   ```
## 安装 circular-dependency-plugin 插件 （Webpack 的循环引用检测插件）

    yarn add circular-dependency-plugin -D 
    
   Github: https://github.com/aackerman/circular-dependency-plugin
    
## 安装 html-webpack-plugin 插件
   
    yarn add html-webpack-plugin -D
    
   Github: https://github.com/ampedandwired/html-webpack-plugin
       
## 配置 antd 按需加载
   
   如果你在开发环境的控制台看到下面的提示，那么你可能使用了 import { Button } from 'antd'; 的写法引入了 antd 下所有的模块，这会影响应用的网络性能。

    You are using a whole package of antd, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
   
   安装 babel-plugin-import 插件来进行按需加载，插件会转换成 antd/lib/xxx 的写法。另外此插件配合 style 属性可以做到模块样式的按需自动加载。
   
   Github: https://github.com/ant-design/babel-plugin-import
   
    yarn add babel-plugin-import -D
    
   修改 `.babelrc` 文件如下：
   
   ```json
   {
     "presets": ["es2015","react"],
     "plugins": [
       "transform-runtime",
       ["import",
         {
           "libraryName": "antd",        // antd 按需加载配置
           "libraryDirectory": "lib",    // default: lib
           "style": true                 // true or 'css'
         }
       ]]
   }
   
   ``` 

## 安装 extract-text-webpack-plugin 插件

   将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

    # 对于 webpack 3
    yarn add extract-text-webpack-plugin -D
    # 对于 webpack 2
    yarn add extract-text-webpack-plugin@2.1.2 -D
    # 对于 webpack 1
    yarn add extract-text-webpack-plugin@1.0.1 -D    
    
   修改 webpack.config.js
   
   ```javascript
   const ExtractTextPlugin = require("extract-text-webpack-plugin");
   
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           use: ExtractTextPlugin.extract({
             fallback: "style-loader",
             use: "css-loader"
           })
         }
       ]
     },
     plugins: [
       new ExtractTextPlugin("styles.css"),
     ]
   }   
   ```

### 安装 webpack style-loader 插件

    yarn add style-loader -D

### 安装 webpack css-loader 插件

    yarn add css-loader -D
    
### 安装 webpack less-loader 插件

    yarn add less-loader less -D


## 调整开发IDE

   使用自动编译代码时，可能会在保存文件时遇到一些问题。某些编辑器具有“安全写入”功能，可能会影响重新编译。
   要在一些常见的编辑器中禁用此功能，请查看以下列表：
          
   * **Sublime Text 3** - 在用户首选项(user preferences)中添加 atomic_save: "false"。
   * **IntelliJ** - 在首选项(preferences)中使用搜索，查找到 "safe write" 并且禁用它。
   * **Vim** - 在设置(settings)中增加 :set backupcopy=yes。
   * **WebStorm** - 在 Preferences > Appearance & Behavior > System Settings 中取消选中 Use "safe write"。

## 配置模块热替换(Hot Module Replacement 或 HMR)
    
   模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。
   HMR 不适用于生产环境，这意味着它应当只在开发环境使用。
   
   ```javascript
    const path = require('path');
    const webpack = require('webpack');
    
    module.exports = {
      entry: './index.js',
    
      plugins: [
        new webpack.HotModuleReplacementPlugin()    // 启用 HMR
      ],
    
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
      },
    
      devServer: {
        hot: true,                                  // 告诉 dev-server 我们在使用 HMR
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/'
      }
    };
   ``` 
   
## 添加 react-hot-loader  ！！未验证！！

    yarn add react-hot-loader -D   
   
   在`webpack.config.js`中需要添加dev服务器和热重载服务器到entry部分。将它们放在entry数组中，并确保在主入口文件之前：
   
   ```javascript
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './scripts/index' // Your appʼs entry point
    ]
   ```
   在plugins配置的部分中。添加插件。
   ```javascript
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
   ```
    
   注意：如果您使用Webpack Dev Server命令行界面而不是其Node API，则不要将此插件添加到您的配置，如果您使用该--hot标志。与--hot选项相互排斥。
   
   如果使用服务器端渲染，则上述WebpackDevServer是不够的。相反，我们必须使用Express服务器webpack-dev-middleware。

## antd 样式覆盖

   * 默认样式 https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
   
   使用 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式来覆盖变量。 在具体工程实践中，有 package.theme 和 less 两种方案，选择一种即可。
   
   1) 通过 theme 属性来自定义样式
   
   配置在 package.json 或 .roadhogrc 下的 theme 字段。theme 可以为配置为一个对象或文件路径。
   
   ```
    "theme": {
      "primary-color": "#1DA57A",
    },
   ```
   或者 [一个 js 文件](https://github.com/ant-design/antd-init/blob/master/examples/customize-antd-theme/theme.js)：
   
   ```
    "theme":"./theme.js",
   ```
   定义 theme 属性时，需要配合使用（antd-init 或 dva-cli。如果你使用的是其他脚手架，可以参考 atool-build 中 less-loader 的 webpack 相关配置 ，利用 less-loader 的 modifyVars 配置来覆盖原来的样式变量。
   
   
   ```
     {
       test: '/\.module\.less$/',
       loader: ExtractTextPlugin.extract(
         'css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' +
         'postcss!' +
         `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
       )
     }
   ```
   
   注意：
   - 样式必须加载 less 格式。
   - 如果你在使用 babel-plugin-import 的 style 配置来引入样式，需要将配置值从 'css' 改为 true，这样会引入 less 文件。
   - 如果你是通过 'antd/dist/antd.css' 引入样式的，改为 antd/dist/antd.less。
   - dva-cli@0.7.0+ 的 theme 属性需要写在 .roadhogrc 文件里。
   - 如果要覆盖 @icon-url 变量，内容需要包括引号 "@icon-url": "'your-icon-font-path'"（修正示例）。
  
## 安装 Redux 栈
    
    yarn add redux
    yarn add react-redux    
    yarn add redux-devtools -D
    //react-router-redux 仅支持 react-router 2.x or 3.x
    yarn add react-router-redux
    //安装3.0版本的最新版    
    yarn add react-router@3.0 -T
    yarn add redux-saga
    yarn add babel-polyfill
    yarn add redux-immutable

## 配置PostCSS
    
  https://github.com/postcss/postcss-loader

  webpack+ES6+less开发环境搭建（附带视频教程） 
  
  http://blog.csdn.net/sinat_17775997/article/details/52434604
  
  css-modules https://github.com/css-modules/css-modules   
    
## 开启 Css modules

  https://doc.webpack-china.org/loaders/css-loader/
  https://medium.com/@pioul/modular-css-with-react-61638ae9ea3e
  https://github.com/camsong/blog/issues/5
  http://www.ruanyifeng.com/blog/2016/06/css_modules.html
  http://www.jianshu.com/p/8f49aaa6169e
  https://jasonformat.com/how-css-modules-work-today/
  https://github.com/camsong/blog/issues/5

## antd less 处理问题

   https://github.com/ant-design/ant-design/issues/3442
   https://github.com/ant-design/ant-design/issues/2758 
    
  [1]: https://nodejs.org/zh-cn/
  
  [2]: https://yarnpkg.com/en/