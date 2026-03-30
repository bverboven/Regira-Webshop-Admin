import { EntityBase } from "@/regira_modules/vue/entities"
import type FacetChild from "../facet-children/Entity"

export class Facet extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string

    created?: Date
    lastModified?: Date

    childEntities?: Array<FacetChild>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Facet

export default Facet
