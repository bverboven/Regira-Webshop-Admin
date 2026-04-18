<template>
    <FormSection @collapse="$emit('collapse')">
        <template #title>
            <div class="row g-0">
                <div class="col">
                    <h3 class="pt-2 ps-2">Hierarchy</h3>
                </div>
                <div class="col-auto py-1">
                    <div class="form-check my-0 float-end">
                        <IconButton v-if="!areAllExpanded" icon="expand" class="btn-info mx-1" @click="expandAll" />
                        <IconButton v-else icon="collapse" class="btn-info mx-1" @click="collapseAll" />
                    </div>
                </div>
            </div>
        </template>
        <LoadingContainer :is-loading="isLoading">
            <template v-if="tree != null">
                <div v-if="hasNoItems" class="italic-muted my-2">No items</div>
                <template v-else>
                    <div class="float-end">
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" v-model="reverseTree" :true-value="true" class="form-check-input" />
                                {{ $t("tree.invert") }}
                            </label>
                        </div>
                    </div>
                    <div v-if="reverseTree" class="text-muted fst-italic">({{ $t("tree.inverted") }})</div>
                    <TreeView
                        :nodes="tree.roots"
                        :selected="selectedNodes!"
                        @add-child="linkItemAsChild"
                        @move="handleMove"
                        @expand-node="expandNode"
                        @collapse-node="collapseNode"
                        @toggle-node="toggleNode"
                        class="tree"
                    />
                </template>
            </template>
        </LoadingContainer>
    </FormSection>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import { distinctBy } from "@/regira_modules/utilities/array-utility"
import { LoadingContainer } from "@/regira_modules/vue/ui"
import { get } from "@/regira_modules/vue/ioc"
import { TreeList, TreeNode } from "@/regira_modules/treelist"
import { Entity, type EntityService, useEntityStore } from "../../parties"
import { PartyRelationship } from "../party-relations/Entity"
import { toTree } from "./functions"
import { FamilyItem } from "."
import TreeItem, { ChildItem } from "./TreeItem"
import TreeView from "./TreeView.vue"

const props = defineProps<{
    item: Entity
}>()

const isLoading = ref(false)
const hasNoItems = ref<boolean>()
const { service } = useEntityStore()

const reverseTree = ref<boolean>()
const skinnyTree = ref<TreeList<TreeItem>>()
const tree = ref<TreeList<TreeItem>>()
const entityService = get<EntityService>(Entity.name)!
const family = ref<Array<FamilyItem>>()
const selectedNodes = computed(() => tree.value?.filter((n) => n.value?.id == props.item?.id))

const areAllExpanded = computed(() => tree.value?.getOffspring(tree.value.roots).every((n) => n.value.isExpanded))
function expandAll() {
    tree.value?.getOffspring(tree.value.roots).forEach((n) => (n.value.isExpanded = true))
}
function collapseAll() {
    tree.value?.getOffspring(tree.value.roots).forEach((n) => (n.value.isExpanded = false))
}
function expandDefault() {
    tree.value?.forEach(
        (r) =>
            (r.value.isExpanded =
                (!selectedNodes.value!.some((n) => n.value.isExpanded) && selectedNodes.value!.some((n) => n.value?.id == r.value?.id)) ||
                selectedNodes.value!.some((n) => n.getAncestors().some((o) => o.value?.id == r.value?.id)))
    )
}

async function handleMove({ child, parent }: { child: TreeNode<TreeItem>; parent: TreeNode<TreeItem> }) {
    if (child.value?.item && parent.value?.item) {
        isLoading.value = true

        console.debug("handleMove", { child, parent })
        const childValue = child.value as ChildItem
        const details = (await service.details(child.value.id))!

        if (child.parent != null) {
            details.parentRelationships = details.parentRelationships?.filter((x) => x.parentId != child.parent?.value.id)
        }
        if (!details.parentRelationships?.some((p) => p.parentId == parent.value.id)) {
            details.parentRelationships = details.parentRelationships ?? []
            details.parentRelationships.push(
                PartyRelationship.create({
                    parentId: parent.value.id,
                    childId: child.value.id,
                    relationshipTypeId: childValue.relationshipTypeId,
                })
            )
        }
        const { saved } = await service.save(details)

        child.value.item = saved

        tree.value!.move(child, parent)

        isLoading.value = false
    }
    if (parent.value) {
        expandNode(parent)
    }
}

async function linkItemAsChild(child?: Entity, parent?: Entity) {
    if (!child?.id) {
        return
    }
    parent ??= props.item

    isLoading.value = true
    const details = (await service.details(child.id))!
    isLoading.value = false
    if (!details.parentRelationships?.some((p) => p.parentId == parent!.id)) {
        isLoading.value = true
        details.parentRelationships = details.parentRelationships ?? []
        details.parentRelationships.push(PartyRelationship.create({ parentId: parent.id, childId: child.id }))
        await service.save(details)
        isLoading.value = false
    }

    await load()

    if (parent != null) {
        const parentNodes = tree.value?.getNodes().filter((n) => n.value.id == parent.id)
        parentNodes?.forEach((node) => expandNode(node))
    }
}

function expandNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = true
}
function collapseNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = false
}
function toggleNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = !node.value.isExpanded
}

async function load() {
    isLoading.value = true
    const familyItems = await entityService.getFamily([props.item.id])
    family.value = distinctBy(familyItems, (x: FamilyItem) => `${x.childId}_${x.parentId || 0}`)
    isLoading.value = false
}

watchEffect(load)
watchEffect(() => {
    if (family.value) {
        if (reverseTree.value == null) {
            const tempTree = toTree(props.item.id, family.value, false)
            const self = tempTree.getNodes().filter((n) => n.value?.id == props.item.id)
            reverseTree.value = tempTree.getAncestors(self).length > tempTree.getOffspring(self).length
        }

        skinnyTree.value = toTree(props.item.id, family.value, reverseTree.value)
    }
})
watchEffect(async () => {
    if (skinnyTree.value) {
        const partyIds = skinnyTree.value.getValues().map((x) => x.id)

        if (partyIds.length > 0) {
            isLoading.value = true
            const { service: partyService } = useEntityStore()

            const parties = await partyService.list({ ids: partyIds, pageSize: 0 })

            skinnyTree.value.forEach((node) => {
                node.value.item = parties.find((x) => x.id == node.value.id)
            })
            tree.value = skinnyTree.value
            expandDefault()
            isLoading.value = false
        } else {
            hasNoItems.value = true
            tree.value = skinnyTree.value
        }
    }
})
</script>
