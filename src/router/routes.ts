import type { RouteRecordRaw } from "vue-router"
import HomeView from "@/views/HomeView.vue"

import Login from "@/views/Login.vue"
import AccountView from "@/views/AccountView.vue"
import AccountHome from "@/components/users/Home.vue"
import ConfirmEmail from "@/components/users/ConfirmEmail.vue"
import ForgotPassword from "@/views/ForgotPassword.vue"
import ResetPassword from "@/views/ResetPassword.vue"
import Unauthorized from "@/views/Unauthorized.vue"
import Forbidden from "@/views/Forbidden.vue"

import NotFound from "@/views/NotFound.vue"

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/AboutView.vue"),
    },
    {
        path: "/icons",
        name: "icons",
        component: () => import("../views/Icons.vue"),
    },
    // account
    {
        name: "account",
        path: "/account",
        component: AccountView,
        redirect: { name: "accountHome" },
        children: [
            {
                name: "accountHome",
                path: "",
                component: AccountHome,
            },
            {
                name: "login",
                path: "login",
                component: Login,
                props: (to) => ({
                    username: to.query?.username,
                }),
                meta: {
                    allowAnonymous: true,
                },
            },
            {
                path: "confirm-email",
                name: "confirmEmail",
                component: ConfirmEmail,
                meta: {
                    allowAnonymous: true,
                },
            },
            {
                name: "forgotPassword",
                path: "forgot-password",
                component: ForgotPassword,
                props: (to) => ({
                    username: to.query?.username,
                }),
                meta: {
                    allowAnonymous: true,
                },
            },
            {
                name: "resetPassword",
                path: "reset-password",
                component: ResetPassword,
                meta: {
                    allowAnonymous: true,
                },
            },
        ],
    },
    {
        name: "unauthorized",
        path: "/401",
        component: Unauthorized,
        props: (to) => ({ url: to.query.url }),
        meta: {
            allowAnonymous: true,
        },
    },
    {
        name: "forbidden",
        path: "/403",
        component: Forbidden,
        props: (to) => ({ url: to.query.url }),
    },
    // default routes
    {
        path: "/404",
        name: "notFound",
        component: NotFound,
        props: (to) => ({ url: to.query.url }),
        meta: {
            allowAnonymous: true,
        },
    },
    {
        name: "catchAll",
        path: "/:pathMatch(.*)*",
        redirect: (from) => ({ name: "notFound", query: { url: from.fullPath } }),
        meta: {
            allowAnonymous: true,
        },
    },
]

export default routes
