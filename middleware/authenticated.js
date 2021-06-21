// import axios from "@/plugins/axios"

export default ({ store, redirect, route }) => {
    if (store.getters['auth/isLoggedIn'] && (route.path === "/auth/login" || route.path === "/auth/signup")) {
        // ログインしている場合
        redirect('/home')

    } else if (localStorage.getItem('uid')) {
        // TODO: userを取得し、storeに保持するロジックを追記

        // ローカルストレージにuidが存在しているが、storeに保持されていない場合
        // const self = this;
        // const user = axios.get(`/api/v1/users/id`, { params: { uid: localStorage.getItem('uid') } }).then((res) => {
        //     store.dispatch("auth/gotUser", { id: res.data.id, uid: res.data.uid, name: res.data.name, email: res.data.email });
        // });
        // if (route.path === "/auth/login" || route.path === "/auth/signup") redirect('/home');

    } else if (!store.getters['auth/isLoggedIn'] && route.path !== '/auth/login' && route.path !== "/auth/signup" && route.path !== "/") {
        // ログインしていない場合
        redirect('/auth/login')
    }
}