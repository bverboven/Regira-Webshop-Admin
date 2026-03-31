<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.facet" />
                    {{ item.facet?.title ?? '' }}
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
import ArticleFacet from "./Entity"
import { type Entity as Facet, InputSelector, FormModalButton } from "@/entities/facets"

const props = defineProps<{
    article: Article
}>()

const items = defineModel<ArticleFacet[]>({ default: () => [] })
const excludeIds = computed(() => items.value.map(i => i.facetId))

function handleRemove(item: ArticleFacet) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Facet) {
    items.value.push(ArticleFacet.create({ articleId: props.article.id, facetId: item?.id, facet: item }))
}
</script>
