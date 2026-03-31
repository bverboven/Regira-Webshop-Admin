import RelatedEntity from "./RelatedEntity"

export class FacetGroupLinkChild extends RelatedEntity {
    override get $title(): string | undefined {
        return this.child?.title
    }

    static create(values?: object): FacetGroupLinkChild {
        return Object.assign(new FacetGroupLinkChild(), values || {})
    }
}

export const Entity = FacetGroupLinkChild

export default FacetGroupLinkChild
