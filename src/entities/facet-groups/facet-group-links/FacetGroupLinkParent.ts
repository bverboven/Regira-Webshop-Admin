import RelatedEntity from "./RelatedEntity"

export class FacetGroupLinkParent extends RelatedEntity {
    override get $title(): string | undefined {
        return this.parent?.title
    }

    static create(values?: object): FacetGroupLinkParent {
        return Object.assign(new FacetGroupLinkParent(), values || {})
    }
}

export const Entity = FacetGroupLinkParent

export default FacetGroupLinkParent
