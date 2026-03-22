export class WebshopUser {
    id?: string
    email: string
    displayName?: string
    permissions: Array<string> = []
}

export const Entity = WebshopUser

export default WebshopUser
