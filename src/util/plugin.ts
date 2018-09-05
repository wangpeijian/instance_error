import httpRequest from './httpRequest';
import {Vue} from 'vue/types/vue';

class plugin {

    constructor() {

    }

    public install(Vue: Vue, options: any) {
        this.installExtendsFunction();

        this.installComponent(Vue);

        this.installPrototype(Vue);

        this.installFilter(Vue);

        this.installDirective(Vue);

        this.installMixin(Vue);
    }

    /*------------------安装扩展方法------------------*/
    public installExtendsFunction() {
        /**
         * 扩展时间对象，增加Format方法
         */
        {
            /*对Date的扩展，将 Date 转化为指定格式的String
             月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
             年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
             例子：
             (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
             (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
             支持时间格式化*/

            Date.prototype.Format = function (fmt: string) { // author: meizz
                const o = {
                    'M+': this.getMonth() + 1, // 月份
                    'd+': this.getDate(), // 日
                    'h+': this.getHours(), // 小时
                    'm+': this.getMinutes(), // 分
                    's+': this.getSeconds(), // 秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                    'S': this.getMilliseconds(), // 毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (const k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        // @ts-ignore
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            };
        }

        /**
         * 字符串增加format方法，替换字符串中的#{\d}元素，从0开始
         */
        {
            /**
             * @return {string}
             */
            String.prototype.Format = function (...arr: any[]) {
                let value = this.toString();
                arr.forEach((item, index) => {
                    value = value.replace(`#{${index}}`, item);
                });
                return value;
            };
        }
    }

    /*------------------添加vue组件------------------*/
    public installComponent(Vue: Vue) {

    }

    /*------------------添加vue过滤器------------------*/
    public installFilter(Vue: Vue) {

    }

    /*------------------添加vue实例方法------------------*/
    public installPrototype(Vue: Vue) {

        (Vue as any).prototype.$get = httpRequest.get;
        (Vue as any).prototype.$post = httpRequest.post;
        (Vue as any).prototype.$put = httpRequest.put;
        (Vue as any).prototype.$del = httpRequest.del;
    }

    /*------------------安装指令方法------------------*/
    public installDirective(Vue: Vue) {

    }

    /*------------------安装mixin方法------------------*/
    public installMixin(Vue: Vue) {

    }
}

export default new plugin();
