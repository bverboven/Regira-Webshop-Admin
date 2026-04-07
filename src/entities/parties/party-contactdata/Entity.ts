import { EntityBase } from "@/regira_modules/vue/entities"

export const ContactDataTypes = {
    Other: "Other",
    Phone: "Phone",
    Email: "Email",
    Website: "Website",
} as const

export type ContactDataTypes = (typeof ContactDataTypes)[keyof typeof ContactDataTypes]

export class PartyContactData extends EntityBase {
    id: number = 0
    title?: string
    value: string = ""
    dataType: ContactDataTypes = ContactDataTypes.Other
    description?: string
    sortOrder: number = 0
    created?: Date
    lastModified?: Date

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title ?? this.value
    }
}

export const Entity = PartyContactData

export default PartyContactData

