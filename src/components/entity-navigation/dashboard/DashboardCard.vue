<template>
    <div class="text-center">
        <router-link :to="{ name: node.value.routeName, query: node.value.initialQuery || {} }"
            class="btn btn-link pt-0 mt-0">
            <Icon :name="node.value.icon" size="xl" />
        </router-link>
        <div>
            {{ node.value.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { TreeNode } from "@/regira_modules/treelist"
import type { INavItem } from "@/regira_modules/vue/entities"
defineProps<{
    node: TreeNode<INavItem>
}>()
</script>
