import { SearchObjectBase, ArchivedFilter } from "regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    code?: string
    name?: string
    partyType?: string

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date

    archived?: ArchivedFilter

    productIdSupplied?: number | Array<number>
    ancestorId?: number | Array<number>
    offspringId?: number | Array<number>
    rootId?: number | Array<number>

    isParent?: boolean
    isChild?: boolean
    isRoot?: boolean
}

export default EntitySearchObject
