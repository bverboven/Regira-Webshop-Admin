import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/facet-groups"

const config: IConfig = {
    id: Entity.name,
    key: "FacetGroup",
    requires: [],
    isComplex: false,

    routePrefix: "facet-groups",
    baseQueryParams: {
        includes: [],
    },
    initialQuery: {},

    overviewTitle: "facetGroups",
    detailsTitle: "facetGroup",
    description: "facetGroup.description",
    icon: "bi bi-tags",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    get searchUrl() { return this.isComplex ? api + "/search" : api },
    saveUrl: api,
    deleteUrl: api,
}

export default config
