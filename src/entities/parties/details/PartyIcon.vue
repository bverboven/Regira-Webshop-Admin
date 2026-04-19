<template>
    <Icon :name="iconName" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import config from "../config/config"
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
        return config.key
    }
})
</script>
