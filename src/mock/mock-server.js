import Mock from 'mockjs'
import data from './data.json'

Mock.mock('/api/log','post', (config)=>{
  console.log(config);
  return data;
})