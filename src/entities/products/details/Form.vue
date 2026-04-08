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

        <TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
            <template #form>

                <div class="row">
                    <div class="col-lg mb-2">
                        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
                            <div class="row">
                                <div class="col-lg mb-2">
                                    <div class="input-group">
                                        <div class="input-group-text">
                                            <Icon name="title" />
                                        </div>
                                        <input v-model="item.title" maxlength="128" :readonly="readonly"
                                            class="form-control" />
                                    </div>
                                    <FormLabel :label="$t('name')" />
                                </div>
                                <div class="col-lg mb-2">
                                    <UnitTypeInputSelector v-model="item.unitType" v-model:id-value="item.unitTypeId"
                                        :readonly="readonly" />
                                    <FormLabel :label="$t('unitType')" />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection :title="$t('product.facets')">
                            <InputSelectorInline v-model="item" />
                        </FormSection>

                        <FormSection :title="$t('product.prices')">
                            <PricesOverview v-model="item" />
                        </FormSection>

                        <FormSection :title="$t('description')">
                            <div class="row">
                                <div class="col mb-2">
                                    <DescriptionInput v-model="item.description" :label="$t('description')"
                                        :readonly="readonly" />
                                </div>
                            </div>
                        </FormSection>

                    </div>
                    <div v-show="screen.isLarge" class="col mb-2">

                        <FormSection :title="$t('product.components')">
                            <ComponentOverview v-model="item" />
                        </FormSection>

                    </div>
                </div>
            </template>

            <template #components>
                <FormSection :title="$t('product.components')">
                    <ComponentOverview v-model="item" />
                </FormSection>
            </template>

            <template #assemblies>
                <AssemblyOverview :product="item" />
            </template>

            <template #suppliers>
                <FormSection :title="$t('product.suppliers')">
                    <SupplierInputSelectorOverview v-model="item" />
                </FormSection>
            </template>

        </TabContainer>

        <Debug :modelValue="{
            item,
        }" />
    </form>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { useLang } from "@/regira_modules/vue/lang"
import { Feedback, TabContainer, Tab, useScreen } from "@/regira_modules/vue/ui"
import { FormButtonsRow } from "@/components/input"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import { InputSelector as UnitTypeInputSelector } from "@/entities/unit-types"
import AssemblyOverview from "@/entities/products/product-assemblies/Overview.vue"
import ComponentOverview from "@/entities/products/product-components/Overview.vue"
import { InputSelectorInline } from "@/entities/products/product-facets/"
import { InputSelectorInline as SupplierInputSelectorInline, InputSelectorOverview as SupplierInputSelectorOverview } from "@/entities/products/product-suppliers/"
import PricesOverview from "@/entities/products/product-prices/Overview.vue"
import config from "../config/config"
import Entity from "../data/Entity"
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

const { screen } = useScreen()

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })

// Tabs
const { translate } = useLang()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        !screen.isLarge ? Tab.create("product.components", { icon: "component", title: translate("product.components") }) : null,
        Tab.create("assemblies", { icon: "assembly", title: translate("assemblies") }),
        Tab.create("suppliers", { icon: "supplier", title: translate("product.suppliers") }),
    ].filter(tab => tab)
)
</script>
