import { describe, it, expect } from "vitest"

import { mount } from "@vue/test-utils"
import { createPinia } from "pinia"
import { createMemoryHistory, createRouter } from "vue-router"
import App from "../App.vue"

// Smoke test: the app shell (header / main / footer) mounts with the plugin
// globals mocked and all child components stubbed out.
describe("App", () => {
    it("mounts the app shell", () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: "/", component: { template: "<div />" } }],
        })
        const wrapper = mount(App, {
            global: {
                plugins: [createPinia(), router],
                mocks: {
                    $t: (key: string) => key,
                    $feedback: {},
                    $appStatus: undefined,
                    $auth: { enabled: false, isAuthenticated: false },
                },
                stubs: {
                    Offline: true,
                    Header: true,
                    Feedback: true,
                    AppDebug: true,
                    LoadingContainer: true,
                    Main: true,
                    Footer: true,
                    LoginModal: true,
                    ForgotPasswordModal: true,
                    Teleport: true,
                },
            },
        })
        expect(wrapper.find("header").exists()).toBe(true)
        expect(wrapper.find("main").exists()).toBe(true)
        expect(wrapper.find("footer").exists()).toBe(true)
    })
})
