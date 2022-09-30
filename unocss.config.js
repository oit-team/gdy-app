import { defineConfig } from 'unocss'
import presetMini from '@unocss/preset-mini'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetMini(),
    presetRemToPx()
  ],
})
