import { EntityBase } from "@/regira_modules/vue/entities"
import { type Entity as UnitType } from "@/entities/unit-types"

export class Article extends EntityBase {
    id: number = 0
    title: string
    description?: string

    allowAdditions: boolean = true
    unitTypeId?: number
    price?: number

    created?: Date
    lastModified?: Date

    unitType?: UnitType

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Article

export default Article
