<script setup lang="ts">
import { ref } from "vue";
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities";
import type Party from "../data/Entity";
import PartyTypes from "../data/PartyTypes";
import SearchObject from "./SearchObject";
import InputSelector from "../selecting/InputSelector.vue";

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
  Emits & {
    "update:modelValue": (value: SearchObject) => true;
    filter: (value: SearchObject) => true;
    "toggle-adv": () => void;
    close: () => void;
  }
>();

const props = defineProps<{
  resultCount?: number;
}>();

const searchObject = defineModel<SearchObject>({ required: true });
const ancestor = ref<Party>();
const offspring = ref<Party>();

const { filterIsActive, handleReset } = useFilter({
  searchObject,
  emit,
  Constructor: SearchObject,
});
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
      </div>
    </div>
    <div class="row">
      <!-- name -->
      <div class="col mb-2">
        <div class="input-group">
          <div class="input-group-text">
            <Icon name="title" />
          </div>
          <input v-model.lazy.trim="searchObject.name" class="form-control" :placeholder="$t('name')" />
        </div>
      </div>
      <!-- partyType -->
      <div class="col mb-2">
        <select v-model="searchObject.partyType" class="form-select">
          <option :value="undefined">{{ $t("common.allTypes") }}</option>
          <option :value="PartyTypes.Person">{{ $t("party.person") }}</option>
          <option :value="PartyTypes.Organization">
            {{ $t("party.organization") }}
          </option>
        </select>
      </div>
    </div>
    <div class="row">
      <!-- Ancestor -->
      <div class="col mb-2">
        <InputSelector
          v-model="ancestor"
          v-model:idValue="searchObject.ancestorId as number"
          :filterDefaults="{ isAncestor: true }"
        >
          <template #prepend>
            <div class="input-group-text">
              <NullableCheckBox v-model="searchObject.isParent" id="isAncestor" class="form-check-input" />
            </div>
            <div class="input-group-text">
              <label class="form-check-label" for="isRoot">
                <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                {{ $t("isRoot") }}
              </label>
            </div>
          </template>
        </InputSelector>
        <FormLabel :label="$t('party.parent')" />
      </div>
      <!-- Offspring -->
      <div class="col mb-2">
        <InputSelector
          v-model="offspring"
          v-model:idValue="searchObject.offspringId as number"
          :filterDefaults="{ isOffspring: true }"
        >
          <template #prepend>
            <div class="input-group-text">
              <NullableCheckBox v-model="searchObject.isChild" id="isOffspring" class="form-check-input" />
            </div>
          </template>
        </InputSelector>
        <FormLabel :label="$t('party.child')" />
      </div>
    </div>
  </div>
</template>
