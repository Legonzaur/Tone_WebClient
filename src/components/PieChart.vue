<template>
  <div class="chart" ref="container">
    <LoadingBar v-if="progress !== 1" :value="progress"></LoadingBar>
    <Doughnut :data="chart" :options="chartOptions" v-if="progress === 1" />
  </div>
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import dataLabel from 'chartjs-plugin-datalabels'
import { Weapon, Filter, useKillStore } from '@/stores/kill'
import { Doughnut } from 'vue-chartjs'
import { defineComponent, PropType, Ref, triggerRef, unref } from 'vue'

import LoadingBar from './LoadingBar.vue'

ChartJS.register(ArcElement, Tooltip, Legend, dataLabel)

export default defineComponent({
  name: 'PieChart',
  props: {
    filters: Object as PropType<Filter>,
    playerHighlighted: String,
    type: Object as PropType<'server' | 'player' | 'weapon' | 'map' | 'gamemode'>
  },
  emits: ['highlightPlayer'],
  components: {
    Doughnut, LoadingBar
  },
  created () {
    // eslint-disable-next-line no-extra-bind
    import(`../stores/${this.type}s.json`).then((e => { this.locale = e }).bind(this))
  },
  mounted () {
    this.refreshColors++
  },
  data: () => {
    return {
      store: useKillStore(),
      refreshColors: 0,
      locale: {} as {[key:string]:string}
    }
  },
  computed: {
    progress () {
      const filter = new Filter(this.filters)
      if (this.type === undefined) return 0
      if (!(['server', 'player', 'weapon', 'map', 'gamemode'].includes(this.type))) return 0
      if (Object.keys(this.locale).length === 0) return 0
      const type = this.type as 'server' | 'player' | 'weapon' | 'map' | 'gamemode'

      if (this.type !== undefined) delete filter[type]
      const data = this.store.getList(`${type}s`, filter)?.value
      if (!data) return this.store.fetch(`${type}s`, filter).value.progress.value
      return data.progress.value
    },
    colors () {
      // eslint-disable-next-line no-unused-expressions
      this.refreshColors
      const colors = {} as { [key: string]: string }
      if (this.$refs.container) {
        const style = getComputedStyle(this.$refs.container as Element)
        colors.fg = style.getPropertyValue('--foreground')
        colors.bg = style.getPropertyValue('--bg-color')
        colors.orange = style.getPropertyValue('--orange')
        colors.cyan = style.getPropertyValue('--cyan')
        colors.yellow = style.getPropertyValue('--yellow')
        colors.green = style.getPropertyValue('--green')
        colors.purple = style.getPropertyValue('--purple')
        colors.red = style.getPropertyValue('--red')
        colors.pink = style.getPropertyValue('--pink')
        colors.currentLine = style.getPropertyValue('--current-line')
      } else {
        colors.fg = '#ffffff'
      }
      return colors
    },
    chart (): ChartData<'doughnut', number[]> {
      const colors = [
        'cyan',
        'green',
        'orange',
        'pink',
        'purple',
        'red',
        'yellow'
      ]
      const chartData: ChartData<'doughnut', number[]> = {
        datasets: [
          {
            label: 'Weapons',
            borderColor: () => this.colors.fg,
            backgroundColor: (context) => {
              return this.colors[
                colors[(context.dataIndex * 3) % colors.length]
              ]
            },
            data: [] as number[]
          }
        ]
      }
      if (!this.sortedList) {
        return chartData
      }
      chartData.datasets[0].data = this.sortedList.map((e) => {
        if (!this.values) {
          return 0
        }
        return this.values[e].value.kills
      })
      return chartData
    },
    chartOptions (): ChartOptions<'doughnut'> {
      // eslint-disable-next-line no-unused-expressions
      this.$props.playerHighlighted
      const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 500 },
        layout: { autoPadding: false },
        plugins: {
          datalabels: {
            formatter: (value, context) => {
              const weaponId = this.sortedList[context.dataIndex]
              return this.locale[weaponId] || weaponId
            },
            backgroundColor: (context) => {
              return context.dataset.backgroundColor(context, options)
            },
            borderColor: this.colors.fg,
            borderRadius: 25,
            borderWidth: 2,
            color: this.colors.bg,
            display: (context) => {
              return context.dataIndex === context.dataset.data.length - 1
                ? true
                : 'auto'
            },
            padding: 6
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                let label: string
                if (!this.sortedList) {
                  label = ctx.dataset.labels[ctx.dataIndex]
                } else {
                  label = this.sortedList[ctx.dataIndex]
                }
                label += ' (' + this.values[label].value.kills + ' kills)'
                return label
              }
            }
          }
        }
      }
      return options
    },
    values (): { [key: string]: Ref<Weapon> } {
      const filter = new Filter({ ...this.filters, player: this.playerHighlighted })
      if (this.type === undefined) return {}
      if (!(['server', 'player', 'weapon', 'map', 'gamemode'].includes(this.type))) return {}
      const type = this.type as 'server' | 'player' | 'weapon' | 'map' | 'gamemode'
      const data = this.store.getList(`${type}s`, filter)?.value.data
      if (!data) return this.store.fetch(`${type}s`, filter).value.data
      return data
    },
    sortedList (): string[] {
      if (!this.values) return []
      const weapons = Object.keys(this.values).filter(e => unref(this.values[e]).kills > 0)
      weapons.sort((a, b) => {
        if (Number(this.values[a].value.kills) < Number(unref(this.values[b]).kills)) {
          return -1
        }
        if (Number(this.values[a].value.kills) > Number(unref(this.values[b]).kills)) {
          return 1
        }
        return 0
      })
      return weapons
    }
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
}

@media only screen and (max-width: 922px) {
  canvas {
    display: none !important;
  }
}
</style>
