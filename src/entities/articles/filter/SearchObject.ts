import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    title?: string
    unitTypeId?: number

    allowAdditions?: boolean

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date
}

export default EntitySearchObject
