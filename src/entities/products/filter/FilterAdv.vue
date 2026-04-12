<script setup lang="ts">
import { ref, watch, watchEffect } from "vue"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import { type Entity as UnitType, InputSelector as UnitTypeInputSelector } from "@/entities/unit-types"
import SearchObject from "./SearchObject"
import InputSelector from "../selecting/InputSelector.vue"
import Product from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FilterEmits {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
    }
>()

const props = defineProps<{
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const unitType = ref<UnitType>()
const component = ref<Product>()
const assembly = ref<Product>()
const allComponents = ref<Array<Product>>()

const { filterIsActive, handleReset } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})
watch(allComponents, () => {
    searchObject.value = {
        ...searchObject.value,
        allComponentId: allComponents.value?.map((c) => c.id),
    }
    emit("filter", searchObject.value)
})

function handleAddComponent(product?: Product) {
    if (product && !allComponents.value?.some((c) => c.id === product.id)) {
        allComponents.value = [...(allComponents.value ?? []), product]
    }
}
function handleRemoveComponent(product: Product) {
    allComponents.value = allComponents.value?.filter((c) => c.id !== product.id)
}

const { service } = useEntityStore()
watchEffect(async () => {
    if (searchObject.value.allComponentId != null && allComponents.value == null) {
        allComponents.value = await service.list({ ids: searchObject.value.allComponentId as number[] })
    }
})
</script>

<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>
        <div class="row">
            <!-- keywords -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
                <FormLabel :label="$t('keywords')" />
            </div>
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" :placeholder="$t('name')" />
                </div>
                <FormLabel :label="$t('name')" />
            </div>
        </div>
        <div class="row">
            <div class="col mb-2">
                <div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                        <label class="form-check-label" for="isRoot">{{ $t("isRoot") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isAssembly" id="isAssembly" class="form-check-input" />
                        <label class="form-check-label" for="isAssembly">{{ $t("product.isAssembly") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isComponent" id="isComponent" class="form-check-input" />
                        <label class="form-check-label" for="isComponent">{{ $t("product.isComponent") }}</label>
                    </div>
                </div>
                <FormLabel :label="$t('assembly')" />
            </div>
            <!-- UnitType -->
            <div class="col mb-2">
                <UnitTypeInputSelector v-model="unitType" v-model:id-value="searchObject.unitTypeId" />
                <FormLabel :label="$t('unitType')" />
            </div>
        </div>
        <div class="row">
            <!-- Component -->
            <div class="col mb-2">
                <InputSelector
                    v-model="component"
                    v-model:idValue="searchObject.componentId as number"
                    :canEdit="false"
                    :filterDefaults="{ isComponent: true }"
                    :placeholder="$t('product.component')"
                />
                <FormLabel :label="$t('product.component')" />
            </div>
            <!-- Assembly -->
            <div class="col mb-2">
                <InputSelector
                    v-model="assembly"
                    v-model:idValue="searchObject.assemblyId as number"
                    :canEdit="false"
                    :filterDefaults="{ isAssembly: true }"
                    :placeholder="$t('product.assembly')"
                />
                <FormLabel :label="$t('product.assembly')" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col-auto" v-for="c in allComponents" :key="c.id">
                        <div class="input-group mt-1">
                            <div class="form-control">{{ c.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveComponent(c)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <InputSelector
                            @select="handleAddComponent"
                            :canEdit="false"
                            :filter-defaults="{ isComponent: true }"
                            :placeholder="$t('product.addComponent')"
                        />
                    </div>
                </div>
                <FormLabel :label="$t('product.allComponents')" />
            </div>
        </div>
    </div>
</template>
