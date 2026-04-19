<template>
    <div>
        <div class="row mb-2" v-if="child != null">
            <div class="col mb-2">
                <div class="form-control fw-bold"><FormModalButton :modelValue="child" class="p-1" /> {{ child.$title }}</div>
                <FormLabel :label="$t('party.child')" />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-md mb-2">
                <RelationshipTypeSelector
                    v-model="item.relationshipType"
                    v-model:idValue="item.relationshipTypeId"
                    :item-defaults="relationshipDefaults"
                    :close-on-save="true"
                />
                <FormLabel :label="$t('partyRelationshipType')" />
            </div>
            <div class="col-md mb-2">
                <PartySelector v-model="item.parent" v-model:idValue="item.parentId" :item-defaults="parentDefaults" :close-on-save="true" />
                <FormLabel :label="$t('party')" />
            </div>
        </div>

        <ContactDataOverview v-model="item.contactData" :party="item.parent" />

        <Debug
            :modelValue="{
                ...item,
                contactData: item.contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                relationshipType: `${item.relationshipType?.title} #${item.relationshipTypeId}`,
                parent: {
                    title: item.parent?.title,
                    contactData: item.parent?.contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                },
                child: `${child?.title} #${item.childId}`,
            }"
        />
    </div>
</template>

<script setup lang="ts">
import { InputSelector as RelationshipTypeSelector } from "@/entities/party-relationship-types"
import type Party from "../../data/Entity"
import FormModalButton from "../../details/FormModalButton.vue"
import PartySelector from "../../selecting/InputSelector.vue"
import { Overview as ContactDataOverview } from "../../party-contact-data"
import Entity from "../Entity"

const props = defineProps<{
    itemDefaults?: Partial<Entity>
    child?: Party
}>()

const item = defineModel<Entity>({ required: true })
const { parent: parentDefaults, relationshipType: relationshipDefaults } = props.itemDefaults || {}
</script>
