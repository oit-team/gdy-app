import { Image } from 'vant'
import { Lazyload as LazyLoad } from 'vant'

const cache = []

export default {
  name: 'VcImg',

  inheritAttrs: false,

  props: {
    raw: Boolean,
  },

  data: () => ({
    innerSrc: '',
  }),

  methods: {
    loadOrigin() {
      this.innerSrc = this.innerSrc.replace(/_x/, '')
      if (!cache.includes(this.innerSrc)) cache.push(this.innerSrc)
    },
  },

  directives: {
    LazyLoad,
  },

  render(h) {
    let { src } = this.$attrs

    if (this.raw && !cache.includes(src) && /^((?!_x).)*\.[A-z]+$/.test(src)) {
      src = src.replace(/(.*)(\.[A-z]+)$/, '$1_x$2')
    }
    this.innerSrc = src

    return h(Image, {
      props: {
        ...this.$attrs,
        src: this.innerSrc,
      },
      on: this.$listeners,
      directives: [
        {
          name: 'lazy-load',
        },
      ],
    })
  },
}
