<template>
    <div>
        <div class="row mb-2" v-if="parent != null">
            <div class="col mb-2">
                <div class="form-control fw-bold"><FormModalButton :modelValue="parent" class="p-1" /> {{ parent.$title }}</div>
                <FormLabel :label="$t('party.parent')" />
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
                <PartySelector v-model="item.child" v-model:idValue="item.childId" :item-defaults="childDefaults" :close-on-save="true" />
                <FormLabel :label="$t('party')" />
            </div>
        </div>

        <ContactDataOverview v-model="item.contactData" :party="item.child" />

        <Debug
            :modelValue="{
                ...item,
                contactData: item.contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                relationshipType: `${item.relationshipType?.title} #${item.relationshipTypeId}`,
                child: {
                    title: item.child?.title,
                    contactData: item.child?.contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                },
                parent: `${parent?.title} #${item.parentId}`,
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
    parent?: Party
}>()

const item = defineModel<Entity>({ required: true })
const { child: childDefaults, relationshipType: relationshipDefaults } = props.itemDefaults || {}
</script>
