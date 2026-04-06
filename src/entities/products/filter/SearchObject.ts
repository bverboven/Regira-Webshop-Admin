import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    title?: string
    unitTypeId?: number

    componentId?: number | Array<number>
    assemblyId?: number | Array<number>
    facetId?: number | Array<number>

    isRoot?: boolean

    isComponent?: boolean
    isAssembly?: boolean

    allowAdditions?: boolean

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date
}

export default EntitySearchObject
