import {
  defineConfig,
  presetUno,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno({}),
    presetRemToPx()
  ],
  theme: {
    colors: {
      'primary': '#1989fa',
    },
  }
})
