import RelatedEntity from "./RelatedEntity"

export class FacetParent extends RelatedEntity {
    override get $title(): string | undefined {
        return this.parent?.title
    }

    static create(values?: object): FacetParent {
        return Object.assign(new FacetParent(), values || {})
    }
}

export const Entity = FacetParent

export default FacetParent
