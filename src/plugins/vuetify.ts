import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    background:    '#FFFFFF',
                    'on-background':'#000000',
                    primary:       '#1976D2',
                    secondary:     '#424242',
                },
            },
            dark: {
                dark: true,
                colors: {
                    background:    '#121212',
                    'on-background':'#FFFFFF',
                    primary:       '#90CAF9',
                    secondary:     '#EEEEEE',
                },
            },
        },
    },
})
