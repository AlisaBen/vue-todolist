<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <Todo></Todo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'
// 数据绑定，直观方便
  export default {
    components: {
      Header,
      Footer,
      Todo,
    },
    data(){
      return {
        text: 'abdcd'
      }
    },
    // render() {
    //   createElement() // 可以遍历template节点下面的节点，创建一个html元素，渲染到根节点
    // }
  }


</script>

<style lang="stylus" scoped>
  #app{
    position absolute
    left 0
    right 0
    top 0
    bottom 0
  }
  #cover{
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color #999
    opacity .9
    z-index -1
  }
</style>