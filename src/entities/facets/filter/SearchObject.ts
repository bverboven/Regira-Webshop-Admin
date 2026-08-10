import { SearchObjectBase, ArchivedFilter } from "regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    code?: string
    title?: string

    isParent?: boolean
    isChild?: boolean
    isRoot?: boolean

    parentFacetId?: number
    childFacetId?: number
    parentGroupId?: number
    childGroupId?: number

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date

    archived?: ArchivedFilter
}

export default EntitySearchObject
