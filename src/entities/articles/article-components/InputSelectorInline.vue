<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.component" />
                    {{ item.component?.title ?? '' }}
                    <button type="button" class="btn btn-outline-danger border-0" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
        <div class="col-auto mb-2">
            <InputSelector @select="handleAdd" :filterDefaults="{ exclude: excludeIds }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type Article from "../data/Entity"
import ArticleComponent from './Entity';
import InputSelector from '../selecting/InputSelector.vue';
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    article: Article
}>()

const items = defineModel<ArticleComponent[]>({ default: () => [] })
const excludeIds = computed(() => items.value.map(i => i.componentId))

function handleRemove(item: ArticleComponent) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Article) {
    items.value.push(ArticleComponent.create({ assemblyId: props.article.id, componentId: item?.id, component: item }))
}
</script>
