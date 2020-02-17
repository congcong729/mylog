<template>
  <div id="app">
    <div class="header">
      <input type="text" placeholder="输入想要过滤的关键字"> 
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
      
    </div>
    <div class="filter">
      <span :class="{isVerbose:filterLevel ==='VERBOSE'}" @click="logFilter('VERBOSE')">Verbose</span>
      <span :class="{isDebug:filterLevel ==='DEBUG'}" @click="logFilter('DEBUG')">Debug</span>
      <span :class="{isInfo:filterLevel ==='INFO'}" @click="logFilter('INFO')">Info</span>
      <span :class="{isWarn:filterLevel ==='WARN'}" @click="logFilter('WARN')">Warn</span>
      <span :class="{isError:filterLevel ==='ERROR'}" @click="logFilter('ERROR')">Error</span>
    </div>
    <ul class="footer" v-infinite-scroll="load">
      <li class="title">
        <span>TAG</span>
        <span>日志级别</span>
        <span>线程</span>
        <span>文件名称</span>
        <span>日志内容</span>
      </li>
      <li v-for="(log,index) in (filterLogs.length>0 && filterLogs)||logs" :key="index"
         :class="{isVerbose:log.level.toUpperCase() ==='VERBOSE',isDebug:log.level.toUpperCase() ==='DEBUG',
         isInfo:log.level.toUpperCase() ==='INFO',isWarn:log.level.toUpperCase() ==='WARN',isError:log.level.toUpperCase() ==='ERROR'}">
        <span>{{log.tag}}</span>
        <span>{{log.level}}</span>
        <span>{{log.thread}}</span>
        <span>{{log.fileName}}</span>
        <span>{{log.content}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { Message } from 'element-ui';
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
      logs:[],
      filterLogs:[],
      filterLevel:''
    };
  },
  mounted(){
    let date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()+1
    const day = date.getDate()
    if(month<10) month = '0'+month
    date =''+year+month+day
    req_Log(date).then(
      (value)=>{
        this.logs = value.data},
      (error)=>{Message({
          showClose: true,
          message: error.message
        })}
    )
  },
  methods:{
    logFilter(type){
      const result = this.logs.filter((log)=>{
        return log.level.toUpperCase()===type
        
      })
      this.filterLogs = result
      this.filterLevel = type
    },
    load () {
        this.count += 2
    }
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
  margin: 50px auto 30px;
  padding-left: 100px;
}
#app .header>input{
  width: 480px;
  height: 20px;
  padding: 9px 7px;
  margin: 0 20px 0 auto;
  outline: none;
}
#app .header .date{
  margin-left: 20px;
  padding-left: 40px;
}
#app .filter{
  width: 480px;
  height: 30px;
  display: flex;
  margin: 0 auto 30px;
  line-height: 30px;
  text-align: center;
}
#app .filter span{
  width: 20%;
  border: 1px solid #eee;
  border-left: none;
  font-size:14px;
  color: rgb(58, 76, 182);
}
#app .filter span.isVerbose{
  background: #000;
  color: #fff;
}
#app .filter span.isDebug{
  background: rgb(26, 189, 20);
  color: #fff;
}
#app .filter span.isInfo{
  background: #666;
  color: #fff;
}
#app .filter span.isWarn{
  background: yellowgreen;
  color: #fff;
}
#app .filter span.isError{
  background: red;
  color: #fff;
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
  height: 31px;
  line-height: 31px;
  border:1px solid #aaa;
  border-bottom: none;
}
#app .footer li.isVerbose{
  color: #000
}
#app .footer li.isDebug{
  color: rgb(26, 189, 20);
}
#app .footer li.isInfo{
  color: #aaa
}
#app .footer li.isWarn{
  color: yellowgreen
}
#app .footer li.isError{
  color: red
}
#app .footer li:last-child{
  border-bottom:1px solid #aaa;
}
/* #app .footer li.title{
  position: fixed
} */
#app .footer li span{
  padding: 1px 5px;
  font-size: 14px;
  border-right:1px solid #aaa;
  width: 7%;
  align-items: center;
  text-align: center;
}
#app .footer li span:last-child{
  border-right: none;
  text-align: left;
  width: 72%;
}
</style>
