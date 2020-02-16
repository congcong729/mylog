<template>
  <div id="app">
    <div class="header">
      <el-date-picker
        size="small"
        class="date"
        v-model="value1"
        align="right"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
      </el-date-picker>
      <input type="text" placeholder="输入想要过滤的关键字">
    </div>
    <div class="filter">
      <span>Verbose</span>
      <span>Debug</span>
      <span>Info</span>
      <span>Warn</span>
      <span>Error</span>
    </div>
    <ul class="footer">
      <li>
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容</span>
      </li>
      <li>
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容</span>
      </li>
      <li>
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容</span>
      </li>
      <li>
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容</span>
      </li>
      <li>
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容日志内容</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {req_Log} from './api/index.js'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
    };
  },
  mounted(){
    req_Log()
  }
    
}
</script>

<style>
#app{
  width: 1150px;
  margin: 0 auto;
}
#app .header{
  display: flex;
  width: 1000px;
  margin: 50px auto;
}
#app .header>input{
  width: 480px;
  height: 20px;
  padding: 9px 7px;
  margin: 0 auto;
  outline: none;
}
#app .header .date{
  padding:0 40px;
}
#app .filter{
  width: 480px;
  height: 30px;
  display: flex;
  margin: 30px auto;
  line-height: 30px;
  text-align: center;
}
#app .filter span{
  width: 20%;
  border: 1px solid #eee;
  border-left: none;
  font-size:14px;
  color: blue;
}
#app .filter span:first-child{
  border-left: 1px solid #eee
}
#app .footer{
  width: 1000px;
  margin: 0 auto;
  padding: 0;
}
#app .footer li{
  display: flex;
  align-items:none;
  border:1px solid #666;
  border-bottom: none;
}
#app .footer li:last-child{
  border-bottom:1px solid #666;
}
#app .footer li span{
  padding: 1px 5px;
  font-size: 14px;
  border-right:1px solid #666;
}
#app .footer li span:last-child{
  border-right: none;
}
</style>
