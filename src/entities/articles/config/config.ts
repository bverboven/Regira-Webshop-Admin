import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/articles"

const config: IConfig = {
    id: Entity.name,
    key: "Article",
    requires: [],
    isComplex: true,

    routePrefix: "articles",
    baseQueryParams: {
        includes: ["Price", "Facets"],
    },
    initialQuery: {},

    overviewTitle: "articles",
    detailsTitle: "article",
    description: "article.description",
    icon: "bi bi-joystick",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    saveUrl: api,
    deleteUrl: api,
}

export default config
