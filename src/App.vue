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
    <el-table
      :row-class-name="tableRowClassName"
      :data="filterLogs"
      height=700
      border
      style="width: 1200">
      <el-table-column
        prop="timestmp"
        label="时间"
        width="110">
      </el-table-column>
      <el-table-column
        prop="logger_name"
        label="TAG"
        width="130">
      </el-table-column>
      <el-table-column
        prop="level_string"
        label="日志级别"
        width="85">
      </el-table-column>
      <el-table-column
        prop="thread_name"
        label="线程"
        width="60">
      </el-table-column>
      <el-table-column
        prop="caller_filename"
        label="文件名称"
        width="130">
      </el-table-column>
      <el-table-column
        prop="formatted_message"
        label="日志内容">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message,InfiniteScroll,Table,TableColumn } from 'element-ui';
import {req_Log} from './api/index.js'

export default {
  directives: { InfiniteScroll },
  components:{
    'el-table':Table,
    'el-table-column':TableColumn
  },
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
    getDate(time){
      let date = new Date(time)
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    },
    tableRowClassName({row}) {
      if (row.level_string.toUpperCase() ==='VERBOSE') {
        return 'verbose-row';
      } else if (row.level_string.toUpperCase() ==='DEBUG') {
        return 'debug-row';
      }else if (row.level_string.toUpperCase() ==='INFO') {
        return 'info-row';
      }else if (row.level_string.toUpperCase() ==='WARN') {
        return 'warn-row';
      }else if (row.level_string.toUpperCase() ==='ERROR') {
        return 'error-row';
      }
    },
    //选定日期后发请求
    dateFilter(date){
        console.log(date)
      req_Log(date||this.value1).then(
      (value)=>{
        this.logs = value.data
        this.logs.map((log)=>{
          return log.timestmp=this.getDate(log.timestmp)
        })
        this.filterLogs = this.logs
        },
      (error)=>{Message({
        showClose: true,
        message: error.message
        })
      })
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
  background: rgb(155, 180, 212);
  color: #fff;
}
#app .filter span.isDebug{
  background:  rgba(0, 255, 0,0.5);
  color: #fff;
}
#app .filter span.isInfo{
  background: #666;
  color: #fff;
}
#app .filter span.isWarn{
  background: rgba(230, 230, 5, 0.5);
  color: #fff;
}
#app .filter span.isError{
  background:rgba(255, 0, 0, 0.5);
  color: #fff;
}
#app .filter span:first-child{
  border-left: 1px solid #eee
}
#app .el-table tr,#app .el-table td,#app .el-table td div{
  height: 30px ;
  line-height: 30px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  padding: 0 ;
}
#app .el-table .verbose-row {
  background: rgb(155, 180, 212);
}
#app .el-table .debug-row {
  background: rgba(0, 255, 0,0.5);
}
#app .el-table .info-row {
  background: #fff;
}
#app .el-table .warn-row {
  background: rgba(255, 255, 0, 0.5);
}
#app .el-table .error-row {
  background: rgba(255, 0, 0, 0.5);
}
</style>
