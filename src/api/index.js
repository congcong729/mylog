import ajax from './myaxios'
export const req_Log = date =>ajax.get('/log/list',{params:{date}})