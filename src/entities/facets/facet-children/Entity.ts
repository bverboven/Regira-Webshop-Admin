import { EntityBase } from "@/regira_modules/vue/entities"
import type Facet from "../data/Entity"

export class FacetChild extends EntityBase {
    id: number = 0
    childId: number
    parentId: number

    child?: Facet
    parent?: Facet

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.child?.title
    }

    static create(values?: object): FacetChild {
        return Object.assign(new FacetChild(), values || {})
    }
}

export const Entity = FacetChild

export default FacetChild