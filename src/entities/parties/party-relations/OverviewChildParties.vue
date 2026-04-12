<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <PartyInputSelector v-model="newItem.child" v-model:idValue="newItem.childId" :filterDefaults="{ exclude: excludedIds }" />
            </div>
            <div class="col-auto">
                <RelationshipTypeDropDown v-model="newItem.relationshipType" v-model:idValue="newItem.relationshipTypeId" />
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" :disabled="!newItem.childId" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <!-- <template v-for="(item, i) in items" :key="item.$id"> -->
        <Draggable v-model="items" item-key="id" handle=".drag-handle" ghost-class="ghost">
            <template #item="{ element: item, index: i }">
                <div :class="{ 'bg-light': !item._deleted && i % 2 == 0, 'is-deleted': item._deleted }">
                    <div class="row align-items-start">
                        <div class="col-auto pe-0">
                            <span class="btn drag-handle cursor move">
                                <Icon name="move" />
                            </span>
                        </div>
                        <div class="col mb-2">
                            <PartyFormModalButton :modelValue="item.child"><PartyIcon :item="item.child!" /></PartyFormModalButton>
                            {{ getParty(item.child)?.title ?? "" }}
                            <small class="d-md-none text-muted">({{ getRelationshipType(item.relationshipType)?.title }})</small>

                            <div v-show="getParty(item.child)?.$phone || getParty(item.child)?.$email">
                                <small v-if="getParty(item.child)?.$phone" class="d-block text-muted">
                                    <a :href="`tel:${getParty(item.child)?.$phone}`" class="btn btn-link">
                                        <Icon name="phone" />
                                    </a>
                                    {{ getParty(item.child)?.$phone }}
                                </small>
                                <small v-if="getParty(item.child)?.$email" class="d-block text-muted">
                                    <a :href="`mailto:${getParty(item.child)?.$email}`" class="btn btn-link">
                                        <Icon name="email" />
                                    </a>
                                    {{ getParty(item.child)?.$email }}
                                </small>
                            </div>
                        </div>
                        <div class="d-none d-sm-block col-auto">
                            <small class="text-muted">{{ getRelationshipType(item.relationshipType)?.title }}</small>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-outline-danger btn-sm" @click="handleRemove(item)">
                                <Icon name="delete" />
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </Draggable>

        <Debug
            :modelValue="{
                items: items.map(({ id, child, relationshipType }) => `#${id} ${child?.title} (${relationshipType?.title})`),
            }"
        />
    </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable"
import { ref, computed } from "vue"
import { useEntityStore as useRelationshipTypeStore } from "@/entities/party-relationship-types"
import type Party from "../data/Entity"
import usePartyStore from "../data/store"
import { PartyRelationship } from "../data/PartyRelationship"
import PartyInputSelector from "../selecting/InputSelector.vue"
import PartyFormModalButton from "../details/FormModalButton.vue"
import PartyIcon from "../details/PartyIcon.vue"
import RelationshipTypeDropDown from "@/entities/party-relationship-types/selecting/SelectorDropdown.vue"

const props = defineProps<{
    party: Party
}>()

const items = defineModel<PartyRelationship[]>({ default: () => [] })
const excludedIds = computed(() => [props.party.id, ...(items.value?.filter((x) => !x._deleted).map((x) => x.childId) ?? [])])

function handleRemove(item: PartyRelationship) {
    item._deleted = !item._deleted
}

const newItem = ref<PartyRelationship>(PartyRelationship.create({ parentId: props.party.id }))
function handleAdd(item: PartyRelationship) {
    if (!item.childId) return
    items.value.push(PartyRelationship.create({ ...item }))
    newItem.value = PartyRelationship.create({ parentId: props.party.id })
}

const { fromPool: getParty } = usePartyStore()
const { fromPool: getRelationshipType } = useRelationshipTypeStore()
</script>
