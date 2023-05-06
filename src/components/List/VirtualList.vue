<template>
  <div ref="vlist" class="vlist" @scroll="scroll">
    <div ref="vscroll" class="vscroll">
      <div :style="`padding: ${(interval[0]*$props.rowHeight!)}px 0px ${Math.max(0,(((list.length)*$props.rowHeight!)-(interval[1])*$props.rowHeight!))}px;`">
        <slot v-for="(data, index) in visibleList" :data="data" :index="index+interval[0]"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  data () {
    return {
      toLoad: 10,
      vlistHeight: 10,
      vIndex: 0
    }
  },
  props: {
    list: { type: Array as PropType<any[]>, default: () => [] },
    rowHeight: { type: Number, default: () => 32 },
    highlighted: String
  },
  mounted () {
    if (this.$props.list) {
      this.vlistHeight = (this.$refs.vlist as HTMLElement)?.getBoundingClientRect().height || 0
      this.toLoad = this.visibleCount * 3
      if (this.$props.highlighted) {
        setTimeout(() => (this.$refs.vlist as HTMLElement)?.scrollBy({ top: ((this.list.findIndex(e => e.id === this.$props.highlighted)) * this.rowHeight) - ((this.$refs.vlist as HTMLElement))?.scrollTop - (this.vlistHeight / 2 - this.$props.rowHeight), behavior: 'smooth' }), 1)
      }
    }
  },
  computed: {
    interval () {
      // console.log(this.list.length, this.vIndex + this.toLoad)
      return [Math.min(this.list.length - this.toLoad, this.vIndex), Math.min(this.vIndex + this.toLoad, this.list.length)]
    },
    visibleList () {
      return this.list.slice(this.interval[0], this.interval[1])
    },
    visibleCount () {
      return Math.ceil(this.vlistHeight / this.$props.rowHeight)
    }
  },
  watch: {
    list () {
      this.vlistHeight = (this.$refs.vlist as HTMLElement)?.getBoundingClientRect().height || 0
    },
    highlighted (newVal) {
      if (newVal) setTimeout(() => (this.$refs.vlist as HTMLElement)?.scrollBy({ top: ((this.list.findIndex(e => e.id === newVal)) * this.rowHeight) - ((this.$refs.vlist as HTMLElement))?.scrollTop - (this.vlistHeight / 2 - this.$props.rowHeight), behavior: 'smooth' }), 1)
    }
  },
  methods: {
    scroll (e:Event) {
      const scrollTop = (e.target as HTMLElement)?.scrollTop
      const scrollIndex = Math.floor(scrollTop / this.$props.rowHeight)

      const mustScrollUp = scrollIndex < this.vIndex
      const mustScrollDown = scrollIndex > this.vIndex + this.visibleCount
      // console.log(this.vIndex + this.visibleCount, scrollIndex + this.visibleCount)
      if (mustScrollUp) {
        this.vIndex = Math.max(scrollIndex - this.visibleCount, 0)
      } else if (mustScrollDown) {
        this.vIndex = Math.min(scrollIndex, this.list.length - this.toLoad)
      }
      if (mustScrollDown || mustScrollUp) {
        const msg = (mustScrollDown ? 'down ' : '') + (mustScrollUp ? 'up ' : '')
        // console.log(this.toLoad)
        // console.log((this.list.length * this.$props.rowHeight) - (this.vIndex * this.$props.rowHeight) - (this.visibleCount * this.$props.rowHeight))
      }
    }
  }

})
</script>

<style scoped>
.vlist{
  overflow-y:auto;
}
.vlist, .vscroll {
  height: calc(100% - 3em);
}

</style>
