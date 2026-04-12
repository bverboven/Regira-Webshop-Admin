import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"

import { plugin as countryPlugin } from "./countries"
import { plugin as unitTypePlugin } from "./unit-types"
import { plugin as partyRelationshipTypePlugin } from "./party-relationship-types"
import { plugin as productPlugin } from "./products"
import { plugin as facetPlugin } from "./facets"
import { plugin as facetGroupPlugin } from "./facet-groups"
import { plugin as partyPlugin } from "./parties"

// order is important -> cf HomeView
export const plugins = [countryPlugin, unitTypePlugin, partyRelationshipTypePlugin, productPlugin, facetPlugin, facetGroupPlugin, partyPlugin]

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        app.config.globalProperties.$configs = {}

        plugins.forEach((plugin) => app.use(plugin as any, { routes }))
    },
}

export { countryPlugin, unitTypePlugin, partyRelationshipTypePlugin, productPlugin, facetPlugin, facetGroupPlugin, partyPlugin }
