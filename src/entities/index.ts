import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"

import { plugin as countryPlugin } from "./countries"
import { plugin as unitTypePlugin } from "./unit-types"
import { plugin as articlePlugin } from "./articles"
import { plugin as facetPlugin } from "./facets"
import { plugin as facetGroupPlugin } from "./facet-groups"

// order is important -> cf HomeView
export const plugins = [countryPlugin, unitTypePlugin, articlePlugin, facetPlugin, facetGroupPlugin]

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        app.config.globalProperties.$configs = {}

        plugins.forEach((plugin) => app.use(plugin as any, { routes }))
    },
}

export { countryPlugin, unitTypePlugin, articlePlugin, facetPlugin, facetGroupPlugin }
