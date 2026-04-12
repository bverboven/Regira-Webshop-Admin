<template>
    <div class="row">
        <div class="col-md mb-2">
            <div class="input-group">
                <span class="input-group-text drag-handle cursor move">
                    <Icon name="move" />
                </span>
                <AddressButton class="btn btn-outline-info" :modelValue="address" />
                <div class="form-control">
                    {{ format(address) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type Address from "./Entity"
import { format } from "./formatter"
import AddressButton from "./AddressButton.vue"

defineProps<{
    address: Address
}>()
</script>
