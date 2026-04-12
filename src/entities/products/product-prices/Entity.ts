import { EntityBase } from "@/regira_modules/vue/entities"
import type { Product } from "../data/Entity"

export class ProductPricePeriod extends EntityBase {
    id: number = 0
    objectId: number // productId
    price: number

    startDate: Date

    product?: Product
    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.product?.$title
    }

    static create(values?: object): ProductPricePeriod {
        return Object.assign(new ProductPricePeriod(), values || {})
    }
}

export const Entity = ProductPricePeriod

export default ProductPricePeriod
