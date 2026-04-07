import { EntityBase } from "@/regira_modules/vue/entities"
import type PartyAddress from "../party-addresses/Entity"
import type PartyContactData from "../party-contactdata/Entity"

export const PartyTypes = {
    Person: "PERSON",
    Organization: "ORGANIZATION",
} as const

export type PartyTypes = (typeof PartyTypes)[keyof typeof PartyTypes]

export abstract class Party extends EntityBase {
    id: number = 0
    partyType: string = ""
    code?: string

    abstract get $title(): string | undefined

    description?: string

    startDate?: Date
    endDate?: Date

    created?: Date
    lastModified?: Date
    isArchived: boolean = false

    contactData?: PartyContactData[]
    addresses?: PartyAddress[]

    override get $id(): string | number {
        return this.id || "new"
    }
}

export class Person extends Party {
    partyType: string = PartyTypes.Person

    salutation?: string
    givenName?: string
    middleName?: string
    familyName?: string

    override get $title(): string | undefined {
        return `${this.givenName ?? ""} ${this.familyName ?? ""}`.trim() || undefined
    }
}

export class Organization extends Party {
    partyType: string = PartyTypes.Organization

    name: string = ""
    legalEntity?: string

    override get $title(): string | undefined {
        return this.name
    }
}

export const Entity = Party

export default Party
