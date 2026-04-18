import type Party from "../data/Entity"
import type { PartyRelationshipType } from "../party-relations/Entity"

export class FamilyItem {
    parentId: number
    childId: number
    rootId: number
    relationshipTypeId?: number
    level: number

    parent?: Party
    child?: Party
    root?: Party
    relationshipType?: PartyRelationshipType

    get $id(): string {
        return `${this.parentId}:${this.childId}`
    }
    get $title(): string {
        return `${(this.child as any)?.$title} is child of ${(this.parent as any)?.$title}`
    }

    toString(): string {
        return `${this.level}:${this.parentId || ""}:${this.childId || ""}`
    }
    static create(values: object): FamilyItem {
        return Object.assign(new FamilyItem(), values)
    }
}

export default FamilyItem
