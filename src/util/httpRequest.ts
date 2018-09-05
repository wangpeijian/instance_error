/**
 * get请求将参数对象拼接到url
 * @param api
 * @param param
 * @returns {*}
 */
import {Vue} from 'vue/types/vue';

function adjustParam(api: string, param = '') {
    if (param.constructor === String) {
        return `${api}${param}`;
    } else if (param.constructor === Object) {
        const query = [];
        // @ts-ignore
        for (const key in param) {
            query.push(`${key}=${param[key]}`);
        }
        const querySign = api.includes('?') ? '&' : '?';
        return `${api}${querySign}${query.join('&')}`;
    } else {
        return api;
    }
}

const BASE = function (type: string, api: string, data: object) {
    const config = {
        headers: {'Content-Type': 'application/json', 'citic-token': sessionStorage.getItem('citic-token')},
        method: type,
        body: {},
    };

    if (['post', 'put'].includes(type)) {
        config.body = JSON.stringify(data);
    }

    // @ts-ignore
    return fetch(api, config).then((response: any) => {
        return response.json();
    }).then((res: any) => {
        if (res.code === '200') {

        } else if (res.code === '6005') {
            // @ts-ignore
            this.$router.push('/login');
        }

        console.group(`${type}接口： ${api}`);
        console.log('响应结果：', JSON.parse(JSON.stringify(res)));
        console.groupEnd();
        return res;
    }).catch((e: any) => {
        console.error('接口异常：', e);
    });
};

const get = function (this: Vue, api: string, params: string) {
    return BASE.call(this, 'get', adjustParam(api, params));
};

const post = function (this: Vue, api: string, data = {}) {
    return BASE.call(this, 'post', api, data);
};

const put = function (this: Vue, api: string, data = {}) {
    return BASE.call(this, 'put', api, data);
};

const del = function (this: Vue, api: string) {
    return BASE.call(this, 'delete', api);
};


export default {
    get,
    post,
    put,
    del,
};
