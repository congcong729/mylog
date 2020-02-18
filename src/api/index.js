import ajax from './myaxios'
export const req_Log = date =>ajax.get('/demo/list',{date})