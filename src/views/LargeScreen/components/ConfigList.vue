<template>
  <div class="flex px-4 w-full box-border relative">
    <draggable
      :value="value"
      class="flex-1 overflow-auto"
      :animation="200"
      ghostClass="ghost"
      :options="{delay: 200}"
      draggable=".item"
      @input="$emit('input', $event)"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group v-if="value.length" class="flex gap-x-3 py-2" type="transition" :name="drag ? 'transition-transform' : null">
        <div
          v-for="(item, index) in value"
          :key="item._tempId"
          class="flex flex-col items-center item relative w-12 flex-shrink-0"
          @click="$emit('select', index)"
          v-actions:clickSelectedImg.click
        >
          <van-icon
            class="!absolute -right-1.5 -top-1.5 !text-xs bg-red-500 w-3 h-3 !leading-3 rounded-1/2 text-white border border-white p-0.5 z-10"
            name="cross"
            @click.stop="$emit('remove', index)"
            v-actions:removeSelectedImg.click
          />
          <div class="flex flex-col rounded overflow-hidden pointer-events-none w-full" :class="supportsAspectRatio ? 'aspect-9/16' : 'w-48px h-85px'">
            <ConfigItem
              v-if="item.items[0]"
              :item="item.items[0]"
              :file-map="fileMap"
              :style="{flexBasis: `${item.divider * 100}%`}"
              placeholder
            ></ConfigItem>
            <ConfigItem
              v-if="item.items[1]"
              :item="item.items[1]"
              :file-map="fileMap"
              placeholder
              class="flex-1"
            ></ConfigItem>
          </div>
          <div class="text-xs">{{ index + 1 }}</div>
        </div>
      </transition-group>
      <div v-else class="h-full grid place-content-center text-gray-500">
        暂无内容
      </div>
    </draggable>
    <span key="add" class="flex flex-col text-sm pl-2 w-12 h-105px">
      <div class="flex-1 flex flex-col justify-center rounded bg-white items-center" @click="$emit('push')" v-actions:addMatch.click>
        <span class="text-3xl">+</span>
      </div>
    </span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { convertImageSize, supportsAspectRatio } from '@/utils/helper'
import ConfigItem from './ConfigItem.vue'

export default {
  components: {
    draggable,
    ConfigItem,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    fileMap: {
      type: Object,
      default: () => ({}),
    }
  },

  data: () => ({
    drag: false,
    supportsAspectRatio,
  }),

  methods: {
    convertImageSize,
  },
}
</script>

<style scoped="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
