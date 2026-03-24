<template>
    <div class="row border-bottom border-bottom-1 py-2">
        <div class="col-auto">
            <router-link :to="{ name: Entity.name + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                <Icon :name="Entity.name" />
            </router-link>
        </div>
        <div class="col text-truncate">
            {{ item.$title }}
        </div>
        <div class="col text-truncate">
            {{ formatNumber(item.price) }}
        </div>
        <div class="col-3 d-none d-md-block text-truncate">
            <UnitTypeButton :model-value="item.unitType" />{{ getUnitType(item.unitType)?.$title }}
        </div>
        <div v-if="!readonly" class="col-auto d-none d-md-block">
            <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger"
                @confirm="$emit('request-remove', item)">{{ $t("deleteItem", { title: item?.$title }) }}</ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "@/regira_modules/vue/ui"
import { formatNumber } from "@/regira_modules/vue/formatters";
import { type SaveResult } from "@/regira_modules/vue/entities"
import { useEntityStore as useUnitTypeStore, FormModalButton as UnitTypeButton } from "@/entities/unit-types";
import Entity from "../data/Entity"

const emit = defineEmits<{
    (e: "update:modelValue", args: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", args: Entity): void
    (e: "request-save", args: Entity): void
    (e: "request-remove", args: Entity): void
}>()
const props = defineProps<{
    readonly?: boolean
}>()

const item = defineModel<Entity>({ required: true })

const { fromPool: getUnitType } = useUnitTypeStore()
</script>
