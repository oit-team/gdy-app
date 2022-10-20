<template>
  <div class="flex px-4">
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
      <transition-group class="flex gap-x-3 py-2" type="transition" :name="drag ? 'transition-transform' : null">
        <div
          v-for="(item, index) in value"
          :key="item._tempId"
          class="flex flex-col items-center item relative w-12 flex-shrink-0"
          @click="$emit('select', index)"
        >
          <van-icon
            class="!absolute -right-1.5 -top-1.5 !text-xs bg-red-500 w-3 h-3 !leading-3 rounded-1/2 text-white border border-white p-0.5 z-10"
            name="cross"
            @click.stop="$emit('remove', index)"
          />
          <div class="flex flex-col rounded overflow-hidden aspect-9/16 pointer-events-none w-full">
            <van-image
              v-if="item.items[0]"
              :style="{flexBasis: `${item.divider * 100}%`}"
              :src="convertImageSize(fileMap[item.items[0].srcId].resUrl)"
              fit="cover"
            />
            <van-image
              v-if="item.items[1]"
              class="flex-1"
              :src="convertImageSize(fileMap[item.items[1].srcId].resUrl)"
              fit="cover"
            />
          </div>
          <div class="text-xs">{{ index + 1 }}</div>
        </div>
      </transition-group>
    </draggable>
    <span key="add" class="flex flex-col text-sm pl-2 w-12 h-105px">
      <div class="flex-1 flex flex-col justify-center rounded bg-white items-center" @click="$emit('push')">
        <span class="text-3xl">+</span>
      </div>
    </span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { convertImageSize } from '@/utils/helper'

export default {
  components: {
    draggable,
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
