<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot>
            <Icon :name="Entity.name" />
        </slot>
        <Teleport to="#modals">
            <MyModal :is-visible="isOpen" :title="modalTitle || $tm(config.detailsTitle || '')" :showFooter="false"
                :full-width="false" @close="close" @cancel="handleCancel" @submit="handleSave">
                <Form v-model="item" :initial-tab="initialTab" :readonly="readonly" :is-popup="true"
                    @cancel="handleCancel" @save="handleSave" @remove="handleRemove" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue"
import { FormStates, useModal, type SaveResult } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import Form from "./Form.vue"

interface Emits {
    (e: "update:modelValue", item?: Entity): void;
    (e: "save", result: SaveResult<Entity>): void;
    (e: "remove", item: Entity): void;
    (e: "restore", item: Entity): void;
    (e: "cancel", arg: { canceled: Entity; original?: Entity; }): void;
    (e: "changeState", state: FormStates): void;
    (e: "open", item: Entity, update: (newItem: Entity) => void): void;
    (e: "close", item?: Entity): void;
}

const emit = defineEmits<Emits>()
const props = defineProps<{
    readonly?: boolean
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
    initialTab?: string
    label?: string
    closeOnSave?: boolean
}>()

const modelRef = defineModel<Entity>()
const { service: entityService } = useEntityStore()

const modalTitle = computed(() => props.label || (modelRef.value != null && entityService.toEntity(modelRef.value).$title))
const {
    item, isOpen,
    close, open,
    handleSave, handleRemove, handleCancel,
} = useModal<Entity>({ entityService, model: modelRef, itemDefaults: props.itemDefaults, closeOnSave: props.closeOnSave, closeOnCancel: false, closeOnDelete: true, emit })
</script>
