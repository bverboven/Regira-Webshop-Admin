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
            <!-- UnitType -->
            <div class="col mb-2">
                <UnitTypeInputSelector v-model="unitType" v-model:id-value="searchObject.unitTypeId" />
                <FormLabel :label="$t('unitType')" />
            </div>
        </div>
        <div class="row">
            <!-- Component -->
            <div class="col mb-2">
                <InputSelector v-model="component" v-model:idValue="searchObject.componentId as number"
                    :filterDefaults="{ isComponent: true }">
                    <template #prepend>
                        <div class="input-group-text">
                            <NullableCheckBox v-model="searchObject.isComponent" id="isComponent"
                                class="form-check-input" />
                        </div>
                        <div class="input-group-text">
                            <label class="form-check-label" for="isRoot">
                                <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                                {{ $t('isRoot') }}
                            </label>
                        </div>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('product.component')" />
            </div>
            <!-- Assembly -->
            <div class="col mb-2">
                <InputSelector v-model="assembly" v-model:idValue="searchObject.assemblyId as number"
                    :filterDefaults="{ isAssembly: true }">
                    <template #prepend>
                        <div class="input-group-text">
                            <NullableCheckBox v-model="searchObject.isAssembly" id="isAssembly"
                                class="form-check-input" />
                        </div>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('assembly')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import { type Entity as UnitType, InputSelector as UnitTypeInputSelector } from "@/entities/unit-types"
import SearchObject from "./SearchObject"
import InputSelector from "../selecting/InputSelector.vue";
import Product from "../data/Entity";
import { NullableCheckBox } from "@/regira_modules/vue/ui";

interface Emits extends /* @vue-ignore */ FilterEmits { }
const emit = defineEmits<Emits & {
    "update:modelValue": (value: SearchObject) => true,
    "filter": (value: SearchObject) => true,
}>()

const props = defineProps<{
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const unitType = ref<UnitType>()
const component = ref<Product>()
const assembly = ref<Product>()

const { filterIsActive, handleReset } = useFilter({ searchObject, emit, Constructor: SearchObject })
</script>
