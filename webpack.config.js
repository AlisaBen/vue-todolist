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