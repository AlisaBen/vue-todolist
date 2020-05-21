import '../assets/styles/footer.styl'
// 使用jsx的好处就是可以在render内部进行js运算
export default {
  data() {
    return{
      author: 'arya'
    }
  },
  render() {
    return (
      <div id="footer">
        <span>written by {this.author}</span>
      </div>
    )
  }
}