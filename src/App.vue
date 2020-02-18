<template>
  <div id="app">
    <div class="header">
      <input type="text" placeholder="输入想要过滤的关键字" @input="inputHandle" v-model="filterKey"> 
      <el-date-picker
        size="small"
        class="date"
        v-model="value1"
        align="right"
        type="date"
        @change="dateFilter"
        placeholder="选择日期"
        value-format="yyyyMMdd"
        :picker-options="pickerOptions">
      </el-date-picker>
      
    </div>
    <div class="filter">
      <span :class="{isAll:filterLevel ==='ALL'}" @click="logFilter('ALL')">All</span>
      <span :class="{isVerbose:filterLevel ==='VERBOSE'}" @click="logFilter('VERBOSE')">Verbose</span>
      <span :class="{isDebug:filterLevel ==='DEBUG'}" @click="logFilter('DEBUG')">Debug</span>
      <span :class="{isInfo:filterLevel ==='INFO'}" @click="logFilter('INFO')">Info</span>
      <span :class="{isWarn:filterLevel ==='WARN'}" @click="logFilter('WARN')">Warn</span>
      <span :class="{isError:filterLevel ==='ERROR'}" @click="logFilter('ERROR')">Error</span>
    </div>
    <div  class="footer" v-infinite-scroll="()=>{}">
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th>时间</th> 
            <th>TAG</th>
            <th>日志级别</th>
            <th>线程</th>
            <th>文件名称</th>
            <th>日志内容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log,index) in filterLogs" :key="index"
          :class="{isVerbose:log.level_string.toUpperCase() ==='VERBOSE',isDebug:log.level_string.toUpperCase() ==='DEBUG',
          isInfo:log.level_string.toUpperCase() ==='INFO',isWarn:log.level_string.toUpperCase() ==='WARN',isError:log.level_string.toUpperCase() ==='ERROR'}">
          <td>{{log.timestmp}}</td>
          <td>{{log.logger_name}}</td>
          <td>{{log.level_string}}</td>
          <td>{{log.thread_name}}</td>
          <td>{{log.caller_filename}}</td>
          <td>{{log.formatted_message}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Message,InfiniteScroll } from 'element-ui';
import {req_Log} from './api/index.js'


export default {
  directives: { InfiniteScroll },
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
      filterLevel:'',
      filterKey:''
    };
  },
  mounted(){
    //日期选择器默认显示
    this.getdatatime()
    //获取数据
    this.filterLevel ='ALL'
    let date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()+1
    const day = date.getDate()
    if(month<10) month = '0'+month
    date =''+year+month+day
    this.dateFilter(date)
  },
  methods:{
    getdatatime(){//默认显示今天
      this.value1= new Date();
    },
    //选定日期后发请求
    dateFilter(date){
      req_Log(date||this.value1).then(
      (value)=>{
        this.logs = value.data
        this.filterLogs = this.logs
        },
      (error)=>{Message({
          showClose: true,
          message: error.message
        })}
    )
    },
    //过滤数据
    logFilter(filtertype){
        if(this.filterLevel === filtertype) return
        this.filterLevel = filtertype
        this.filterHandle()
    },
    inputHandle(){
      //设防抖函数
      this.filterHandle()
    },
    filterHandle(){
      const filterKey = this.filterKey
      const filtertype = this.filterLevel
      if(this.filterLevel === 'ALL'){
        this.filterLogs = this.logs.filter((log)=>{
          return log.timestmp.indexOf(filterKey)!==-1 || log.logger_name.indexOf(filterKey)!==-1 || log.level_string.indexOf(filterKey)!==-1 || log.thread_name.indexOf(filterKey)!==-1 ||
          log.caller_filename.indexOf(filterKey)!==-1 || log.formatted_message.indexOf(filterKey)!==-1
        })
      }else{
        this.filterLogs = this.logs.filter((log)=>{
          return log.level_string.toUpperCase() === filtertype
        }).filter((item)=>{
           return item.timestmp.indexOf(filterKey)!==-1 || item.logger_name.indexOf(filterKey)!==-1 || item.level_string.indexOf(filterKey)!==-1 || item.thread_name.indexOf(filterKey)!==-1 ||
          item.caller_filename.indexOf(filterKey)!==-1 || item.formatted_message.indexOf(filterKey)!==-1
        })
      }
    }
  }
}
</script>

<style>
/* html,body {
  width: 100%;
  height: 100%;
  overflow: hidden;
} */
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
#app .filter span.isAll{
  background: rgb(58, 76, 182);;
  color: #fff;
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
  max-height: 704px;
  overflow-y: auto;
  margin: 0 auto;
  padding: 0;
}
#app .footer table{
  border:1px solid #eee;
  table-layout:fixed;
  width: 1200px;
  padding: 0;
  margin: 0;
  font-size: 13px;
  text-align: center;
}
#app .footer table tr{
  height: 31px;
}
#app .footer table tr th,#app .footer table tr td{
  overflow: hidden;
  word-break:keep-all;
  white-space:nowrap;
  text-overflow:ellipsis;
}
#app .footer table tr th:first-child,#app .footer table tr td:first-child{
  width: 110px;
}
#app .footer table tr th:nth-child(2),#app .footer table tr td:nth-child(2){
  width: 130px;
  padding: 0 5px;
}
#app .footer table tr th:nth-child(3),#app .footer table tr td:nth-child(3){
  width: 60px;
  padding: 0 5px;
}
#app .footer table tr th:nth-child(4),#app .footer table tr td:nth-child(4){
  width: 60px;
  padding: 0 5px;
}
#app .footer table tr th:nth-child(5),#app .footer table tr td:nth-child(5){
  width: 130px;
  padding: 0 5px;
}
#app .footer table tr td:nth-child(5){
  text-align: left;
}
#app .footer table tr th:nth-child(6){
  text-align: center;
}
#app .footer table tr td:nth-child(6){
  text-align: left;
}
#app .footer tr.isVerbose{
  color: #000
}
#app .footer tr.isDebug{
  color: rgb(26, 189, 20);
}
#app .footer tr.isInfo{
  color: #aaa
}
#app .footer tr.isWarn{
  color: yellowgreen
}
#app .footer tr.isError{
  color: red
}
#app .footer tr:last-child{
  border-bottom:1px solid #aaa;
}
#app .footer tr span:first-child{
  width: 13%;
}
#app .footer tr span{
  padding: 1px 5px;
  font-size: 14px;
  border-right:1px solid #aaa;
  width: 7%;
  align-items: center;
  text-align: center;
}
#app .footer tr span:last-child{
  border-right: none;
  text-align: left;
  width: 60%;
}
</style>
