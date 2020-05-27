# todolist项目

通过利用vue实现todolist项目，对webpack组合vue文件实现简单组件

学习资源：https://www.imooc.com/learn/935

通过该项目了解入门级别的前端项目，和视频中的不同是原视频比较老，该工程使用webpack4的配置，因此一些webpack的配置方法和原视频中不同

在原来的开发中，前端依赖后端工程的运行而运行，需要后端将html文件组织起来，并且前端的html\js\css等文件不利于团队合作

vue/react的实现，让前端的工程师们开发有更多的灵活度，但是vue和react的文件格式并不是普通的html或者js文件，而是vue或者jsx文件，浏览器无法处理这种文件，所以通过webpack将所有非html/js/css的文件转换成响应的文件，而在vue文件中的代码则会被拆分



## 开始项目

> 需要提前配置node环境

将项目克隆到本地
`git clone https://github.com/AlisaBen/vue-todolist.git`
进入工程目录：`cd vue-todolist`
安装工程需要的插件`npm i`

运行工程：`npm run dev`

生成生产环境文件：`npm run build`


## 文件结构

```
vue todo project
│   README.md
│   package.json  插件的配置文件
|   package-lock.json   这个是自动生成的不用管
|   webpack.config.json  webpack的配置文件，程序运行在浏览器主要是靠它
|   .babelrc  babel的配置文件，转换es6代码
|   .gitignore  git提交的配置文件
│
└───dist  npm run build自动生成的文件夹和文件
│     bundle.js
│   
└───node_modules  npm i安装的插件的目录
|     
|
└───src
    |   app.vue   入口组件，整个页面的组织结构
    │   index.js   入口文件
    |
    └───assests   静态文件，图片和css文件
    |   │   
    |   └───images
    |   │       a.jpg
    |   │       b.jpg
    |   └───styles
    |   |       a.css
    |   |       style.styl
    └────todo
            footer.jsx  页脚
            header.vue  页眉
            item.vue  每个todo item组件
            tabs.vue  下面的一些筛选功能栏
            todo.vue  整个todolist组件
```


## 组件结构

每个vue的文件都由`template`标签、`script`标签和`style`标签组成

`template`标签下就像是普通的html结构，运行工程会将`template`下的标签加载到根节点标签，因此`template`下的标签只能有一个外层节点

`script`标签中写主要的组件逻辑，数据和生命周期的维护

`style`标签中写当前组件的标签的样式，当然可以通过import的当时引入样式文件

```javascript
<template>
  <div >
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    }
  },
  methods: {
    deleteTodo(){
      // 调用父组件的删除操作，传递当前的todo的id属性
      // 父组件会监听子组件里面，所有触发删除事件
      this.$emit('del', this.todo.id)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
```

## 文件配置

`package.json`文件中的依赖说明

|插件|作用|
|---|---:|
|@babel/core|
|babel-helper-vue-jsx-merge-props|
|babel-loader|
|babel-plugin-syntax-jsx|
|babel-plugin-transform-vue-jsx|
|babel-preset-env|
|autoprefixer|自动修复语法规范|
|cross-env|支持不同的操作系统window和max对配置项的适配|
|css-loader|样式loader|
|style-loader||
|stylus|css的一种文件格式|
|stylus-loader|样式loader|
|extract-text-webpack-plugin|抽离css为单独的css文件|
|file-loader|加载文件loader，比如加载图片|
|html-webpack-plugin|自动生成html模板文件|
|url-loader|
|vue|
|vue-loader|
|vue-template-compiler|
|webpack|
|webpack-dev-server|开发环境运行server

webpack配置

作用

- 提取代码,并把文件引入写入到html文件中


```javascript
{
  test: /\.vue$/,
  loader: 'vue-loader' // vue-loader将vue文件处理成js文件
},
{
  test: /\.jsx$/,
  loader: 'babel-loader', // 需要配合babel-plugin-syntax-jsx插件
},
{
  test: /\.(css|scss)$/, // 希望把css文件整理出来，作为style文件引入
  use: [
    'style-loader', // 把style文件写入到html文件中
    'css-loader', // 从vue文件中读出来
  ]
},
```

- 通过url加载图片等文件

设置options等字段，loader可以将图片转换成base64代码放到html中，而不用http请求

生成的图片名字经过了hash处理

```javascript
{
  test: /\.(gif|jpg|jpeg|png|svg)$/,
  use: [
    {
      loader: 'url-loader', // 处理图片的loader,依赖file-loader
      options: {
        limit: 1024, //loader可以将图片转换成base64代码，而不用生成图片，可以减少http请求
        name: '[name]-[hash:8].[ext]', // 输出的文件名字
      }
    }
  ]
}
```

```javascript
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // 提取css文件

const isDev = process.env.NODE_ENV === 'development'
// 如何单独打包类库文件，也就是vue框架，这个代码的稳定性高，而业务代码需要不断的迭代
// 希望浏览器尽可能使用长的时间来使用静态文件，如果打包到一起，js需要根据业务代码去更新，类库代码不能在浏览器中进行缓存
// 希望借助浏览器的缓存减少流量并且用户的加载速度更快，所以把vue类库的代码和业务的代码拆分出来进行打包，vendor

const config = {
  // entry: path.join(__dirname, 'src/index.js'),
  entry: {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue'] // vue-router, vuex单独进行打包📦
  },
  output: {
    filename: 'bundle.js', // 或者是叫bundle.[hash:8].js，但是正式的生产环境中要使用chunkhash
    // 但是开发环境中不能使用chunkhash，因为webpack-dev-server会报错
    path: path.join(__dirname, 'dist')
  },
  module: {
    // target: "web",
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader' // vue-loader将vue文件处理成js文件
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader', // 需要配合babel-plugin-syntax-jsx插件
      },
      {
        test: /\.(css|scss)$/, // 希望把css文件整理出来，作为style文件引入
        use: [
          'style-loader', // 把style文件写入到html文件中
          'css-loader', // 从vue文件中读出来
        ]
      },
      // 这部分的配置升级到区分生产环境和测试环境
      // {
      //   test: /.styl(us)?$/, // 匹配styl或者stylus
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true // postcss可以自动生成sourcemap，但是前面有stylus，使用前面的sourcemap就好了，节省时间
      //       }
      //     },
      //     'stylus-loader' // 可以自动生成sourcemap
      //   ]
      // },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', // 处理图片的loader,依赖file-loader
            options: {
              limit: 1024, //loader可以将图片转换成base64代码，而不用生成图片，可以减少http请求
              name: '[name]-[hash:8].[ext]', // 输出的文件名字
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }), // 可以根据生产环境或者开发环境，打包vue不同的源代码
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
  ],
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         name: 'vendor',
  //         chunks: 'initial',
  //         minChunks: 2
  //       }
  //     }
  //   }
  // }
  optimization: {
    // splitChunks: {
    //   chunks (chunk) {
    //     // exclude `my-excluded-chunk`
    //     return chunk.name !== 'my-excluded-chunk';
    //   }
    // }
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
          default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
          },
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          }
      }
    }
    
  }

}

// 区分生产环境和开发环境
if (isDev) {
  config.module.rules.push({
    test: /.styl(us)?$/, // 匹配styl或者stylus
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true // postcss可以自动生成sourcemap，但是前面有stylus，使用前面的sourcemap就好了，节省时间
        }
      },
      'stylus-loader' // 可以自动生成sourcemap
    ]
  })
  config.devtool = '#cheap-module-eval-source-map' // 将es6的代码映射成js代码，方便查改
  config.devServer = {
    port: 8080,
    host: '0.0.0.0', // 可以通过内网访问
    overlay: {
      errors: true, // 可以把错误显示在网页上
    },
    hot: true,
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),  // 热加载,内容修改后不用更新整个页面
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  // 生产环境，把css代码写入html里面去，以style标签的形式引入
  config.output.filename = 'bundle.[chunkhash:8].js' // 在这里使用chunkhash和hash是不同的，
  // 如果是hash的话，是整个应用的，一次build都是相同的，而chunkhash是针对不同的节点来说的
  // 不然的话，每次打包跟随业务代码都是不同的哈希，我们根据不同节点进行缓存就没有意义了
  // config.entry = {
  //   app: path.join(__dirname, 'src/index.js'),
  //   vendor: ['vue'] // vue-router, vuex单独进行打包📦
  // }
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: ExtractPlugin.extract({
      fallback: 'style-loader', // 将css-loader处理之后的css文件在外面包了一层js代码
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true // postcss可以自动生成sourcemap，但是前面有stylus，使用前面的sourcemap就好了，节省时间
          }
        },
        'stylus-loader' // 可以自动生成sourcemap
      ]
    })
  })
  // 命名生成的css文件名，根据css文件的内容，生成一个8位的哈希值
  config.plugins.push(
    new ExtractPlugin('styles.[md5:contenthash:hex:8].css'),
    // new webpack.optimize.CommonChunksPlugin('vendor')
  ) // webpack4.3包含了contentHash关键字，所以不能直接使用
}

module.exports = config
```




