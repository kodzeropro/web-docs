<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    to?: string
    target?: '_blank' | 'self' | 'parent' | 'top'
    leadingIcon?: 'github' | 'npm'
}>()

const hasLeadingIcon = computed(() => !!props.leadingIcon)
const leadingIconComponent = computed(() => {
    switch (props.leadingIcon) {
        case 'github':
            return 'IconGithub'
        case 'npm':
            return 'IconNpm'
        default:
            return null
    }
})
</script>

<template>
    <a :href="to" class="docs-button" :target="target">
        <div v-if="hasLeadingIcon" class="leading-icon-wr">
            <component :is="leadingIconComponent" class=""></component>
        </div>
        <slot></slot>
    </a>
</template>

<style scoped>


.docs-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    padding: 0.375rem 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--vp-c-border);
    text-decoration: none;
    user-select: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.docs-button:hover {
    opacity: 1 !important;
    color: var(--vp-c-brand) !important;
    border-color: var(--vp-c-brand);
}

.leading-icon-wr {
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.leading-icon-wr svg {
    height: 20px;
    width: 20px;
}
</style>