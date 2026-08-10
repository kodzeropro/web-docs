import { defineConfig } from 'vitepress'
import LibShared from 'le2r-lib-kzsharaweb'

// Расширяем тип темы для кастомных свойств
declare module 'vitepress' {
    interface ThemeConfig {
        supportEmail?: string
    }
}

const seoContent = {
    title: 'Документация',
    description: 'Платформа для создания бэкенда за минуты. Визуальный конструктор, готовый REST API и админ-панель. Просто подключите фронтенд!',
    url: 'https://kodzero.pro/docs/',
    image: 'https://kodzero.pro/og-kodzero.png'
}

export default defineConfig({
    lang: 'ru-RU',
    title: seoContent.title,
    titleTemplate: ':title - Kodzero Docs',
    description: seoContent.description,
    lastUpdated: true,
    cleanUrls: true,
    base: '/docs/',
    head: [
        ['meta', { property: 'og:title', content: seoContent.title }],
        ['meta', { property: 'og:description', content: seoContent.description }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:url', content: seoContent.url }],
        ['meta', { property: 'og:image', content: seoContent.image }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: seoContent.title }],
        ['meta', { name: 'twitter:description', content: seoContent.description }],
        ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
        [   
            'script',
            {},
            LibShared.analytics.counterCode
        ]
    ],
    // Глобальные переменные для markdown
    markdown: {
        config: (md) => {
            // Можно добавить плагины
        }
    },
    themeConfig: {
        logo: {
            light: '/kodzero-docs-bl.png',
            dark: '/kodzero-docs-wh.png'
        },
        siteTitle: false,
        footer: {
            message: '<a href="mailto:team@kodzero.pro">team@kodzero.pro</a>'
        },
        notFound: {
            title: 'Страница не найдена',
            quote: 'Похоже, вы перешли по неверной ссылке или страница была удалена.',
            linkLabel: 'Перейти на главную',
            linkText: 'На главную'
        },
        outline: {
            level: [2, 3],
            label: 'На этой странице'
        },
        docFooter: {
            prev: 'Предыдущая страница',
            next: 'Следующая страница'
        },
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Оформление',
        lightModeSwitchTitle: 'Светлая тема',
        darkModeSwitchTitle: 'Тёмная тема',
        returnToTopLabel: 'Наверх',
        lastUpdated: {
            text: 'Обновлено'
        },
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: 'Поиск',
                        buttonAriaLabel: 'Поиск'
                    },
                    modal: {
                        displayDetails: 'Показать подробности',
                        resetButtonTitle: 'Сбросить',
                        backButtonTitle: 'Закрыть',
                        noResultsText: 'Ничего не найдено',
                        footer: {
                            selectText: 'выбрать',
                            selectKeyAriaLabel: 'enter',
                            navigateText: 'навигация',
                            navigateUpKeyAriaLabel: 'стрелка вверх',
                            navigateDownKeyAriaLabel: 'стрелка вниз',
                            closeText: 'закрыть',
                            closeKeyAriaLabel: 'escape'
                        }
                    }
                }
            }
        },
        nav: [
            { 
                text: 'Разделы',
                items: [
                    { text: 'Быстрый старт', link: '/quickstart' },
                    { text: 'Коллекции', link: '/collections' },
                    { text: 'API', link: '/api' },
                    { text: 'Авторизация', link: '/auth' },
                    { text: 'Серверная интеграция', link: '/server-integration' },
                    { text: 'SDK', link: '/sdk' },
                    { text: 'Логи', link: '/logs' }
                ]
            },
            
            { text: 'kodzero.pro', link: 'https://kodzero.pro/', target: '_blank', rel: 'noopener' },
            { text: 'team@kodzero.pro', link: 'mailto:team@kodzero.pro/' },
        ],
        sidebar: [
        {
            text: 'Быстрый старт',
            items: [
                    { text: 'О Kodzero', link: '/quickstart/' },
                    { text: 'Первый проект', link: '/quickstart/first-project' },
                    { text: 'Обзор API', link: '/quickstart/api' }
                ]
        },
        {
            text: 'Коллекции',
            items: [
                    { text: 'Обзор', link: '/collections/' },
                    { text: 'Данные', link: '/collections/data' },
                    { text: 'Схема данных', link: '/collections/schema' },
                    { text: 'Настройки API', link: '/collections/api-settings' }
                ]
        },
        {
            text: 'REST API',
            items: [
                    { text: 'Введение', link: '/api/' },
                    { text: 'View All', link: '/api/view-all' },
                    { text: 'View', link: '/api/view' },
                    { text: 'Create', link: '/api/create' },
                    { text: 'Update', link: '/api/update' },
                    { text: 'Delete', link: '/api/delete' },
                    { text: 'Distinct', link: '/api/distinct' },
                    { text: 'Ошибки', link: '/api/errors' }
                ]
        },
        {
            text: 'Авторизация',
            items: [
                { text: 'Введение', link: '/auth/' },
                { text: 'Стратегии', link: '/auth/strategies' },
                { text: 'Уровни доступа', link: '/auth/scopes' },
            ]
        },
        {
            text: 'Серверная интеграция',
            items: [
                { text: 'Введение', link: '/server-integration/' },
                { text: 'Когда использовать', link: '/server-integration/when-to-use' },
                { text: 'Admin API-ключ', link: '/server-integration/admin-api-key' },
                { text: 'Аутентификация пользователей', link: '/server-integration/user-auth' },
                { text: 'Выполнение запросов', link: '/server-integration/requests' },
                { text: 'Права доступа', link: '/server-integration/permissions' },
                { text: 'Безопасность', link: '/server-integration/security' },
                { text: 'Возможные ошибки', link: '/server-integration/errors' }
            ]
        },
        {
            text: 'Kodzero SDK',
            items: [
                    { text: 'Обзор', link: '/sdk/' },
                    { text: 'Начало работы', link: '/sdk/start' },
                    { text: 'Для ИИ', link: '/sdk/ai' },
                    { text: 'Модель данных', link: '/sdk/model' },
                    { text: 'Кастомные методы', link: '/sdk/custom' },
                    { text: 'Пагинация', link: '/sdk/pagination' },
                    { text: 'Валидация', link: '/sdk/validation' },
                    { text: 'Авторизация', link: '/sdk/auth' },
                    { text: 'Обработка ошибок', link: '/sdk/errors' }
                ]
        },
        {
            text: 'Логи',
            items: [
                    { text: 'Логи запросов', link: '/logs/' }
                ]
        }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/kodzeropro/docs' },
            { icon: 'telegram', link: 'https://t.me/kodzeropro' },
        ],
        
        // @ts-ignore
        supportEmail: 'team@kodzero.pro'
    },
    sitemap: {
        hostname: 'https://kodzero.pro/docs/'
    }
})
