import { EntityBase } from "@/regira_modules/vue/entities"
import type FacetGroupLinkChild from "../facet-group-links/FacetGroupLinkChild"
import type FacetGroupLinkParent from "../facet-group-links/FacetGroupLinkParent"

export class FacetGroup extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string

    created?: Date
    lastModified?: Date

    childEntities?: Array<FacetGroupLinkChild>
    parentEntities?: Array<FacetGroupLinkParent>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = FacetGroup

export default FacetGroup
