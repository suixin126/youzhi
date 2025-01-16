import http from '../http/http.js'

export const login = (url,params,headers)=>{
    return http.post(url,params,headers)
}