<template>
  <div>
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

    <template v-for="(item, i) in items" :key="item.$id">
      <div :class="{ 'bg-light': !item._deleted && i % 2 == 0, 'is-deleted': item._deleted }">
        <div class="row align-items-center">
          <div class="col-auto">
            <PartyFormModalButton :modelValue="item.parent" />
          </div>
          <div class="col">
            {{ getParty(item.parent)?.title ?? "" }}
            <small class="d-md-none text-muted">({{ getRelationshipType(item.relationshipType)?.title }})</small>
          </div>
          <div class="d-none d-sm-block col-auto">
            <small class="text-muted">{{ getRelationshipType(item.relationshipType)?.title }}</small>
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="handleRemove(item)">
              <Icon name="delete" />
            </button>
          </div>
        </div>
        <div v-show="getParty(item.parent)?.$phone || getParty(item.parent)?.$email" class="row mb-2">
          <div class="col offset-1">
            <small v-if="getParty(item.parent)?.$phone" class="d-block text-muted">
              <a :href="`tel:${getParty(item.parent)?.$phone}`" class="btn btn-link">
                <Icon name="phone" />
              </a>
              {{ getParty(item.parent)?.$phone }}
            </small>
            <small v-if="getParty(item.parent)?.$email" class="d-block text-muted">
              <a :href="`mailto:${getParty(item.parent)?.$email}`" class="btn btn-link">
                <Icon name="email" />
              </a>
              {{ getParty(item.parent)?.$email }}
            </small>
          </div>
        </div>
      </div>
    </template>

    <Debug
      :modelValue="{
        items: items.map(({ id, parent, relationshipType }) => `#${id} ${parent.title} (${relationshipType?.title})`),
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEntityStore as useRelationshipTypeStore } from "@/entities/party-relationship-types";
import type Party from "../data/Entity";
import usePartyStore from "../data/store";
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

const { fromPool: getParty } = usePartyStore();
const { fromPool: getRelationshipType } = useRelationshipTypeStore();
</script>
