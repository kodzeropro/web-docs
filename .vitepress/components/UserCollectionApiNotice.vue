<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

type NoticeMethod = 'Create' | 'Delete' | 'Distinct' | 'Update'

const props = defineProps<{
    method?: NoticeMethod
}>()

const registrationUrl = withBase('/auth/strategies#регистрация-register')
const methodLabel = computed(() => props.method ? `Метод ${props.method}` : 'Ограничения REST API')
</script>

<template>
    <aside class="user-collection-notice" role="note">
        <p v-if="method && method !== 'Update'">
            API-метод <b>{{ method }}</b> недоступен для коллекций типа <b>Пользователи</b>.
            <template v-if="method === 'Create'">
            Создание пользователей осуществляется через специальный метод авторизации — <a :href="registrationUrl">Регистрация</a>.
            </template>
        </p>

        <p v-else-if="method === 'Update'">
            В коллекциях типа <b>Пользователи</b> невозможно по API изменять технические поля, начинающиеся с символа «_». Например, поле <code>_password</code>.
        </p>

        <template v-else>
            <p>
                Методы <code>Create</code>, <code>Delete</code> и <code>Distinct</code> недоступны в коллекциях типа <b>Пользователи</b>.
            </p>
        </template>
    </aside>
</template>

<style scoped>
.user-collection-notice {
    margin: 24px 0;
    padding: 16px 20px;
    border-radius: 8px;
    font-size: 15px;
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-brand-2);
}

.user-collection-notice p {
    margin: 8px 0;
}
</style>