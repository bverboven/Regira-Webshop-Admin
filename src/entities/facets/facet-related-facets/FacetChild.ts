import RelatedEntity from "./RelatedEntity"

export class FacetChild extends RelatedEntity {
    override get $title(): string | undefined {
        return this.child?.title
    }

    static create(values?: object): FacetChild {
        return Object.assign(new FacetChild(), values || {})
    }
}

export const Entity = FacetChild

export default FacetChild
