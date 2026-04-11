<template>
  <div class="row">
    <div class="col-lg-6">
      <FormSection>
        <template #title>
          <h3 class="p-2 mb-2"><Icon :name="Party.name" /> {{ $t("party.parentParties") }}</h3>
        </template>
        <OverviewParentParties v-model="item.parentRelationships" :party="item" />
      </FormSection>
    </div>
    <div class="col-lg-6">
      <FormSection>
        <template #title>
          <h3 class="p-2 mb-2"><Icon :name="Party.name" /> {{ $t("party.childParties") }}</h3>
        </template>
        <OverviewChildParties v-model="item.childRelationships" :party="item" />
      </FormSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import Party from "../data/Entity";
import OverviewParentParties from "./OverviewParentParties.vue";
import OverviewChildParties from "./OverviewChildParties.vue";

const item = defineModel<Party>({ required: true });
</script>
