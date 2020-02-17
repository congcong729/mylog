const axios = require('axios')
const instance = axios.create({
  baseURL:'/api',
  timeout: 20000
})
instance.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});
export default instance