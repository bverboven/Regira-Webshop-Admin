<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.component" v-model:idValue="newItem.componentId"
                    :filterDefaults="{ isComponent: true }" />
            </div>
            <div class="col-4">
                <div class="input-group">
                    <input type="number" v-model="newItem.quantity" class="form-control" />
                    <div class="input-group-text">
                        <span class="text-muted">{{ getUnitType(newItem.component?.unitType)?.code }}</span>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <template v-for="item in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <InputSelector v-model="item.component" v-model:idValue="item.componentId" />
                </div>
                <div class="col-4">
                    <div class="input-group">
                        <input type="number" v-model="item.quantity" class="form-control" />
                        <div class="input-group-text">
                            <span class="text-muted">{{ getUnitType(item.component?.unitType)?.code }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-danger" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEntityStore as useUnitTypeStore } from '@/entities/unit-types';
import Product from '../data/Entity';
import InputSelector from '../selecting/InputSelector.vue';
import ProductComponent from './Entity';

const model = defineModel<Product>({ required: true });
const items = computed(() => model.value.components ?? []);

function handleRemove(item: ProductComponent) {
    item._deleted = !item._deleted;
}

const newItem = ref<ProductComponent>(ProductComponent.create({ assemblyId: model.value.id }));
function handleAdd(item: ProductComponent) {
    if (!model.value.components) model.value.components = [];
    model.value.components.push(ProductComponent.create({ ...item }));
    newItem.value = ProductComponent.create({ assemblyId: model.value.id });
}

const { fromPool: getUnitType } = useUnitTypeStore()
</script>