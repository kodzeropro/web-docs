// Ext
import { onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute, type EnhanceAppContext } from 'vitepress'
import LibShared from 'le2r-lib-kzsharaweb'
import Kodzero from 'kodzero-sdk' // keep
// Int
import './style.css'
import SupportEmail from '../components/SupportEmail.vue'
import IconAlfa from '../components/IconAlfa.vue'
import IconBeta from '../components/IconBeta.vue'
import AuthorQuote from '../components/AuthorQuote.vue'
import CrossLink from '../components/CrossLink.vue'
import WhatAreTokens from '../components/wiki/WhatAreTokens.vue'
import DocsButton from '../components/DocsButton.vue'
import IconGithub from '../components/IconGithub.vue'
import IconNpm from '../components/IconNpm.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: EnhanceAppContext) {
        // Регистрируем глобальный компонент
        app.component('SupportEmail', SupportEmail)
        app.component('IconAlfa', IconAlfa)
        app.component('IconBeta', IconBeta)
        app.component('AuthorQuote', AuthorQuote)
        app.component('CrossLink', CrossLink)
        app.component('WhatAreTokens', WhatAreTokens)
        app.component('DocsButton', DocsButton)
        app.component('IconGithub', IconGithub)
        app.component('IconNpm', IconNpm)
    },
    setup() {
        const route = useRoute()
        onMounted(() => {
            LibShared.analytics.trackPageView()
        }),
        watch(() => route.path, (newPath, oldPath) => {
            LibShared.analytics.trackPageView(newPath)
        })
    }
}
