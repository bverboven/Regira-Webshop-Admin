<template>
  <select v-model="selectedId" class="form-select">
    <option value=""></option>
    <option v-for="item in items" :value="item.id" :key="item.id">
      {{ item.title }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed, onMounted, type Ref } from "vue";
import type Entity from "../data/Entity";
import useEntityStore from "../data/store";

const emit = defineEmits<{
  (e: "update:modelValue", args?: Entity): void;
  (e: "update:idValue", args?: number): void;
}>();
const props = defineProps<{
  modelValue?: Entity;
  idValue?: number;
}>();

const { fromCache } = useEntityStore();
const items = computed(() => (fromCache() as Array<Ref<Entity>>)!.map((x) => x.value));

const selectedId = computed({
  get() {
    return props.modelValue?.id ?? props.idValue;
  },
  set(id) {
    const entity = id ? items.value.find((x) => x.id == id) : undefined;
    emit("update:idValue", entity?.id);
    emit("update:modelValue", entity);
  },
});
</script>
