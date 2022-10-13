import {
  defineConfig,
  presetMini,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetMini(),
    presetRemToPx()
  ],
})
