import type Party from "../data/Entity"
import type { PartyRelationshipType } from "../party-relations/Entity"

export class TreeItem {
    id: number
    item?: Party
    children: Array<ChildItem> = []

    isExpanded: boolean = false

    static create(values: object): TreeItem {
        return Object.assign(new TreeItem(), values)
    }
}
export class ChildItem extends TreeItem {
    relationshipTypeId?: number
    relationshipType?: PartyRelationshipType

    static create(values: object): ChildItem {
        return Object.assign(new ChildItem(), values)
    }
}

export default TreeItem
