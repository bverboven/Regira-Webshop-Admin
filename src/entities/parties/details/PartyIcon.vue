<template>
    <Icon :name="iconName" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import Party from "../data/Entity"
import PartyTypes from "../data/PartyTypes"

const props = defineProps<{
    item: Party
}>()

const iconName = computed(() => {
    if (props.item.partyType === PartyTypes.Organization) {
        return "organization"
    } else if (props.item.partyType === PartyTypes.Person) {
        return "person"
    } else {
        return Party.name
    }
})
</script>
