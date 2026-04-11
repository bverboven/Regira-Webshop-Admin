<template>
  <div>
    <template v-if="party.id > 0">
      <div class="row mb-2">
        <div class="col">
          <PartyInputSelector
            v-model="newItem.parent"
            v-model:idValue="newItem.parentId"
            :filterDefaults="{ exclude: excludedIds }"
          />
        </div>
        <div class="col-auto">
          <RelationshipTypeDropDown v-model="newItem.relationshipType" v-model:idValue="newItem.relationshipTypeId" />
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-success" :disabled="!newItem.parentId" @click="handleAdd(newItem)">
            <Icon name="new" />
          </button>
        </div>
      </div>

      <template v-for="item in items" :key="item.$id">
        <div class="row mb-2 align-items-center" :class="{ 'is-deleted': item._deleted }">
          <div class="col-auto">
            <PartyFormModalButton :modelValue="item.parent" />
          </div>
          <div class="col">
            {{ item.parent?.$title ?? "" }}
            <small v-if="item.parent?.$phone" class="d-block text-muted">
              <Icon name="phone" />
              {{ item.parent?.$phone }}
            </small>
            <small v-if="item.parent?.$email" class="d-block text-muted">
              <Icon name="email" />
              {{ item.parent?.$email }}
            </small>
          </div>
          <div class="col-auto">
            <small class="text-muted">{{ item.relationshipType?.title }}</small>
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="handleRemove(item)">
              <Icon name="delete" />
            </button>
          </div>
        </div>
      </template>
    </template>
    <p v-else class="italic-muted">{{ $t("saveFirst") }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type Party from "../data/Entity";
import { PartyRelationship } from "../data/PartyRelationship";
import PartyInputSelector from "../selecting/InputSelector.vue";
import PartyFormModalButton from "../details/FormModalButton.vue";
import RelationshipTypeDropDown from "@/entities/party-relationship-types/selecting/SelectorDropDown.vue";

const props = defineProps<{
  party: Party;
}>();

const items = defineModel<PartyRelationship[]>({ default: () => [] });
const excludedIds = computed(() => [
  props.party.id,
  ...(items.value?.filter((x) => !x._deleted).map((x) => x.parentId) ?? []),
]);

function handleRemove(item: PartyRelationship) {
  item._deleted = !item._deleted;
}

const newItem = ref<PartyRelationship>(PartyRelationship.create({ childId: props.party.id }));
function handleAdd(item: PartyRelationship) {
  if (!item.parentId) return;
  items.value.push(PartyRelationship.create({ ...item }));
  newItem.value = PartyRelationship.create({ childId: props.party.id });
}
</script>
