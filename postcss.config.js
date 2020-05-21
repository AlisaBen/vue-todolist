const autoprefixer = require('autoprefixer')

// 后处理css，在css-loader处理完css文件之后通过postcss进行优化
module.exports = {
  plugins: [
    autoprefixer(),  // 需要加浏览器前缀的css属性webkit...
    

  ]
}