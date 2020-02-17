import ajax from './myaxios'
export const req_Log = date =>ajax.post('/log',{date})