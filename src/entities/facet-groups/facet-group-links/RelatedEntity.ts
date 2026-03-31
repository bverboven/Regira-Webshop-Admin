import { EntityBase } from "@/regira_modules/vue/entities"
import type FacetGroup from "../data/Entity"

export abstract class RelatedEntity extends EntityBase {
    id: number = 0
    childId: number
    parentId: number

    child?: FacetGroup
    parent?: FacetGroup

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
}

export const Entity = RelatedEntity

export default RelatedEntity
