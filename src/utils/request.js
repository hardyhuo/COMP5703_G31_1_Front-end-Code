import axios from 'axios'


const request = axios.create({
    baseURL: 'http://localhost:8091',
    timeout: 50000
})


request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // config.headers['token'] = user.token;
    return config
}, error => {
    return Promise.reject(error)
});


request.interceptors.response.use(
    response => {

        let res = response.data;

        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request
