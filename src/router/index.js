import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers, otherRouter } from './router';
import store from '../store';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

//必须要通过 Vue.use() 明确地安装路由功能：
Vue.use(VueRouter);
Vue.use(mavonEditor)

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

// 创建 router 实例，然后传 `RouterConfig` 配置
export const router = new VueRouter(RouterConfig);

/**
 * 使用 router.beforeEach 注册一个全局前置路由守卫：
 *
 * to: Route: 即将要进入的目标 路由对象
 *
 * from: Route: 当前导航正要离开的路由
 *
 * next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
 * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
 * next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
 * next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。
 * next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
 确保要调用 next 方法，否则钩子就不会被 resolved
 */
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    //修改当前页面的title
    Util.title(to.meta.title);
    if (Cookies.get('locking') === '1' && to.name !== 'locking') {
        // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('userInfo') && to.name !== 'login' && to.name !== 'regist' && to.name !== 'regist-result') {
          // 判断是否已经登录且前往的页面不是登录页,没注册，没登陆跳转到登陆页面
            next({
                name: 'login'
            });
        } else if (Cookies.get('userInfo') && to.name === 'login') {
            // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            Util.toDefaultPage([...routers], to.name, router, next);
        }
    }
});

//也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
