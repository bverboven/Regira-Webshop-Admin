<template>
    <FormSection :title="$t('components')">
        <template v-for="item in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <InputSelector v-model="item.component" v-model:idValue="item.componentId" />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-text">
                            <span class="text-muted">{{ item.component?.unitType?.code }}</span>
                        </div>
                        <input type="number" v-model="item.quantity" class="form-control" />
                    </div>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-danger" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>

        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.component" v-model:idValue="newItem.componentId"
                    :filterDefaults="{ isComponent: true }" />
            </div>
            <div class="col">
                <div class="input-group">
                    <div class="input-group-text">
                        <span class="text-muted">{{ newItem.component?.unitType?.code }}</span>
                    </div>
                    <input type="number" v-model="newItem.quantity" class="form-control" />
                </div>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-outline-success" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>
    </FormSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputSelector from '../selecting/InputSelector.vue';
import ArticleComponent from './Entity';

const items = defineModel<Array<ArticleComponent>>({ default: () => [] });
const newItem = ref<ArticleComponent>(new ArticleComponent())

function handleRemove(item: ArticleComponent) {
    item._deleted = !item._deleted;
}

function handleAdd(item: ArticleComponent) {
    items.value.push({ ...item });
    newItem.value = new ArticleComponent();
}
</script>