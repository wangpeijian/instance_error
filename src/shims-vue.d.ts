import Vue from 'vue';
import VueRouter from 'vue-router';
import {Route} from 'vue-router';
import {Res} from '@/interface';

declare module '*.vue' {
    export default Vue;
}

declare global {
    interface Date {
        Format(...args: any[]): any;
    }

    interface String {
        Format(...args: any[]): any;
    }
}

// 扩充
declare module 'vue/types/vue' {

    interface Vue {
        $router: VueRouter;
        $route: Route;
        $get: (url: string, param?: string) => Promise<Res>;
        $post: (url: string, data?: object) => Promise<Res>;
        $put: (url: string, data?: object) => Promise<Res>;
        $del: (url: string) => Promise<Res>;
    }
}
