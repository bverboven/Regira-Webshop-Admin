export class PimUser {
    id?: string
    email: string
    displayName?: string
    permissions: Array<string> = []
}

export const Entity = PimUser

export default PimUser
