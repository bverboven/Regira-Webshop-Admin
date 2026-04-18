<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <PartyInputSelector v-model="newItem.child" v-model:idValue="newItem.childId" :filterDefaults="{ exclude: excludedIds }" />
            </div>
            <div class="col-auto">
                <RelationshipTypeSelector v-model="newItem.relationshipType" v-model:idValue="newItem.relationshipTypeId" />
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" :disabled="!newItem.childId" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <TabContainer :tabs="['all', 'persons', 'units']" :active="orgContacts.length && !personContacts.length ? 'units' : undefined">
            <template #all>
                <List v-if="items?.length" v-model="items" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
            <template #persons>
                <List v-if="personContacts?.length" v-model="personContacts" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
            <template #units>
                <List v-if="orgContacts?.length" v-model="orgContacts" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
        </TabContainer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { TabContainer } from "@/regira_modules/vue/ui"
import useOwnedCollection from "@/regira_modules/vue/entities/form/ownedCollections"
import Entity from "../Entity"
import PartyTypes from "../../data/PartyTypes"
import type Party from "../../data/Entity"
import RelationshipTypeSelector from "@/entities/party-relationship-types/selecting/InputSelector.vue"
import PartyInputSelector from "../../selecting/InputSelector.vue"
import List from "./List.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "sort", args: any): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Array<Entity>
        parent: Party
    }>(),
    {
        modelValue: () => [],
    }
)

const excludedIds = computed(() => [props.parent.id, ...(items.value?.filter((x) => !x._deleted).map((x) => x.childId) ?? [])])

const newItem = ref<Entity>(Entity.create({ parentId: props.parent.id }))
function handleAdd(item: Entity) {
    if (!item.childId) return
    items.value.push(Entity.create({ ...item }))
    newItem.value = Entity.create({ parentId: props.parent.id })
}

const { items, handleSave } = useOwnedCollection({ props, emit })
const personContacts = computed({
    get: () => items.value.filter((x) => x.child?.partyType == PartyTypes.Person),
    set: (value) => emit("update:modelValue", [...value, ...orgContacts.value]),
})
const orgContacts = computed({
    get: () => items.value.filter((x) => x.child?.partyType == PartyTypes.Organization),
    set: (value) => emit("update:modelValue", [...personContacts.value, ...value]),
})
</script>
