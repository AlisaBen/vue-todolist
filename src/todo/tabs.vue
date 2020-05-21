<template>
  <div class="helper">
    <span class="left">{{unFinishTodosLength}} item left</span>
    <span class="tabs">
      <span
        v-for="state in states"
        :key="state"
        :class="[state, filter === state ? 'actived' : '']"
        @click="toggleFilter(state)"
      >
        {{state}}
      </span>
    </span>
    <span class="clear" @click="clearAllCompleted">
      clear all completed
    </span>
  </div>
</template>


<script>
export default {
  props: {
    filter: {
      type: String,
      required: true
    },
    todos: {
      type: Array,
      required: true
    }
  },
  computed: {
    unFinishTodosLength() {
      return this.todos.filter(todo => !todo.completed).length
    }

  },
  methods: {
    clearAllCompleted(){},
    toggleFilter(state){
      // [all,active,completed]
      this.$emit('toggle', state) //触发切换tab事件，传递state状态
    },
    clearAllCompleted() {
      this.$emit('clearAllCompleted') // 删除所有的完成事件
    }
  },
  data() {
    return {
      states: ['all', 'active', 'completed']
    }
  }
}
</script>

<style lang="stylus" scoped>
.helper
    font-weight 100
    display flex
    justify-content space-between
    padding 5px 0
    line-height 30px
    background-color #ffffff
    font-size 14px
    font-smoothing antialiased
.left, .clear, .tabs
    padding 0 10px
.left .clear
    width 150px
.left
    text-align center
.clear
    text-align right
    cursor pointer
.tabs
    width 200px
    display flex
    justify-content space-between
    *
        display inline-block
        padding 0 10px
        cursor pointer
        border 1px solid rgba(175,47,47,0)
        &.actived
            border-color rgba(175,47,47,0.4)
            border-radius 5px
</style>