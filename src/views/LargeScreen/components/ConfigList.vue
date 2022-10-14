<template>
  <div class="flex px-4">
    <draggable
      :value="value"
      class="flex-1 overflow-auto"
      :animation="200"
      group="description"
      ghostClass="ghost"
      :options="{delay: 200}"
      draggable=".item"
      @input="$emit('input', $event)"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group class="flex gap-x-3 py-2" type="transition" :name="drag ? 'transition-transform' : null">
        <div
          v-for="(image, index) in value"
          :key="image"
          class="flex flex-col items-center item relative w-12 flex-shrink-0"
          @click="$emit('select', index)"
        >
          <van-icon
            class="!absolute -right-1.5 -top-1.5 !text-xs bg-red-500 w-3 h-3 !leading-3 rounded-1/2 text-white border border-white p-0.5"
            name="cross"
            @click.stop="$emit('remove', index)"
          />
          <div class="flex flex-col">
            <img :src="image" class="w-full flex-1 rounded overflow-hidden aspect pointer-events-none" />
          </div>
          <div class="text-xs">{{ index + 1 }}</div>
        </div>
      </transition-group>
    </draggable>
    <span key="add" class="flex flex-col text-sm pl-2 w-12">
      <div class="flex-1 flex flex-col justify-center rounded bg-white items-center mb-2" @click="$emit('push')">
        <span>+</span>
        <span>添加</span>
      </div>
    </span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    drag: false,
  }),
}
</script>

<style scoped="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.aspect {
  aspect-ratio: 9 / 16;
}
</style>
