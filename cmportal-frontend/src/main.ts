import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Quasar, Loading,AppFullscreen, Notify, Dialog } from 'quasar'
import './styles/quasar.scss'
import { getQuasarLang } from './modules/quasarLang'
import interceptors from './modules/interceptors';
import { umLabel } from './modules/umLabel';
import '@quasar/extras/material-icons/material-icons.css'
import './assets/site.scss';
import dotenv from 'dotenv';
import { createI18n } from 'vue-i18n';
import { defaultLocale} from './language';
import en from './language/en.json';
import ro from './language/ro.json';
import hu from './language/hu.json';
import bg from './language/bg.json';

const messages = {
    en: {
      message: en
    },
    ro: {
      message:
        ro
    },
    hu: {
      message:
        hu
    },
    bg: {
      message:
        bg
    }
  }
  
  // 2. Create i18n instance with options
  const savedLocale = localStorage.getItem('lang') || defaultLocale;
  const i18n = createI18n({
    locale: savedLocale, // set locale
    fallbackLocale: 'bg', // set fallback locale
    globalInjection: true,
    messages, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
  })
  

dotenv.config();

interceptors((key: string) => i18n.global.t(key) as string);
const quasarUserOptions={
    config: {},
    plugins: {
        Loading,AppFullscreen, Notify, Dialog
    },
    lang: getQuasarLang(savedLocale)

}

const app = createApp(App).use(Quasar, quasarUserOptions).use(i18n).use(store).use(router);
app.config.globalProperties.$umLabel = (raw: unknown): string =>
    umLabel(raw, (key: string) => i18n.global.t(key) as string);
app.mount('#app');
