import type Entity from "./Entity"

export function format(item: Entity): string {
    let s = ""
    if (item.street) {
        s += `${item.street || ""} ${item.number || ""}`.trimEnd()
        if (item.box) {
            s += ` box ${item.box}`.trimEnd()
        }
    }
    if (item.postalCode || item.city) {
        if (s) {
            s += ", "
        }
        s += `${item.postalCode} ${item.city}`
    }
    if (item.countryCode) {
        s += ` (${item.countryCode})`
    }
    return s.trim()
}
export function formatCity(item?: Entity, refItem?: Entity): string {
    let s = item?.city || ""
    if (item?.countryCode && refItem?.countryCode != item.countryCode) {
        s = `${s} (${item.countryCode})`
    }
    return s
}
