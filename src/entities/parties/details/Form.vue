<template>
    <form @submit.prevent="handleSubmit" :modelValue="item">
        <div class="row form-buttons">
            <div class="col col-md-auto order-1">
                <FormButtonsRow :item="item" :readonly="readonly" :feedback="feedback" :show-delete="item?.id > 0"
                    @cancel="handleCancel" @remove="handleRemove" @restore="handleRestore" />
            </div>
            <div class="col-auto order-2 order-md-3">
                <RouterLink v-if="isPopup" :to="{ name: `${Entity.name}Details`, params: { id: item.$id } }"
                    class="btn btn-default py-1" target="_blank" :title="$t('popOut')">
                    <Icon name="popOut" />
                </RouterLink>
                <RouterLink v-else-if="overviewUrl" :to="overviewUrl" class="btn btn-info py-1">
                    <Icon name="list" /> <span class="d-none d-md-inline ms-1">{{ $t("overview") }}</span>
                </RouterLink>
            </div>
            <div class="col-md order-3 order-md-2">
                <Feedback :feedback="feedback" />
            </div>
        </div>

        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
            <div class="row">
                <!-- partyType -->
                <div class="col-sm-auto mb-2">
                    <select v-model="item.partyType" class="form-select">
                        <option :value="PartyTypes.Person">{{ $t("party.person") }}</option>
                        <option :value="PartyTypes.Organization">{{ $t("party.organization") }}</option>
                    </select>
                    <FormLabel :label="$t('party.partyType')" />
                </div>
            </div>

            <!-- Person fields -->
            <template v-if="item.partyType === PartyTypes.Person">
                <div class="row">
                    <div class="col-sm-auto mb-2">
                        <input v-model="(item as Person).salutation" maxlength="16" :readonly="readonly"
                            class="form-control" />
                        <FormLabel :label="$t('party.salutation')" />
                    </div>
                    <div class="col-sm mb-2">
                        <input v-model="(item as Person).givenName" maxlength="64" :readonly="readonly"
                            class="form-control" />
                        <FormLabel :label="$t('party.givenName')" />
                    </div>
                    <div class="col-sm mb-2">
                        <input v-model="(item as Person).middleName" maxlength="64" :readonly="readonly"
                            class="form-control" />
                        <FormLabel :label="$t('party.middleName')" />
                    </div>
                    <div class="col-sm mb-2">
                        <input v-model="(item as Person).familyName" maxlength="64" :readonly="readonly"
                            class="form-control" />
                        <FormLabel :label="$t('party.familyName')" />
                    </div>
                </div>
            </template>

            <!-- Organization fields -->
            <template v-if="item.partyType === PartyTypes.Organization">
                <div class="row">
                    <!-- name -->
                    <div class="col mb-2">
                        <div class="input-group">
                            <div class="input-group-text">
                                <Icon name="title" />
                            </div>
                            <input v-model="(item as Organization).name" maxlength="128" :readonly="readonly"
                                class="form-control" />
                        </div>
                        <FormLabel :label="$t('party.name')" />
                    </div>
                    <!-- code -->
                    <div class="col-sm col-md-2 mb-2">
                        <div class="input-group">
                            <div class="input-group-text">
                                <Icon name="code" />
                            </div>
                            <input v-model="item.code" maxlength="32" :readonly="readonly" class="form-control" />
                        </div>
                        <FormLabel :label="$t('code')" />
                    </div>
                    <!-- legalEntity -->
                    <div class="col-sm col-md-2 mb-2">
                        <input v-model="(item as Organization).legalEntity" maxlength="64" :readonly="readonly"
                            class="form-control" />
                        <FormLabel :label="$t('party.legalEntity')" />
                    </div>
                </div>
            </template>

            <div class="row">
                <div class="col mb-2">
                    <DescriptionInput v-model="item.description" :label="$t('description')" :readonly="readonly" />
                </div>
            </div>
        </FormSection>

        <Debug :modelValue="{
            item,
        }" />
    </form>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"
import { Feedback } from "@/regira_modules/vue/ui"
import { FormButtonsRow } from "@/components/input"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity, { Person, Organization, PartyTypes } from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> { }
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        modelValue: Entity
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
        initialTab?: string
    }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })
</script>
