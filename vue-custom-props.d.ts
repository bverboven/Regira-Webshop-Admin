import type { Router } from "vue-router"

declare module "vue" {
    interface ComponentCustomProperties {
        $isAdmin: boolean
        $router: Router
    }
}

export { }
