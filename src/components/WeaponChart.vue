<template>
  <div class="weaponChart" ref="container">
    <Doughnut :data="chart" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import dataLabel from 'chartjs-plugin-datalabels'
import { Store, useStore } from 'vuex'
import { Player, Weapon } from '@/store/index'
import { Doughnut } from 'vue-chartjs'
import { defineComponent } from 'vue'
import { functionExpression } from '@babel/types'

ChartJS.register(ArcElement, Tooltip, Legend, dataLabel)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    filters: Object,
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  components: {
    Doughnut
  },
  mounted () {
    this.refreshColors++
  },
  computed: {
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
    chart () {
      const colors = ['cyan', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']
      const chartData = {
        datasets: [
          {
            label: 'Weapons',
            labels: this.sortedWeaponList || [] as string[],
            borderColor: (context: any) => this.colors.fg,
            backgroundColor: (context: any) => { return this.colors[colors[(context.dataIndex * 3) % colors.length]] },
            data: [] as number[]
          }
        ]
      }
      if (!this.sortedWeaponList) {
        return chartData
      }
      chartData.datasets[0].data = this.sortedWeaponList.map(e => {
        if (!this.weapons) {
          return 0
        }
        return this.weapons[e].kills
      })
      return chartData
    },
    chartOptions () {
      // eslint-disable-next-line no-unused-expressions
      this.$props.playerHighlighted
      const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 500 },
        layout: { autoPadding: false },
        plugins: {
          datalabels: {
            formatter: (value:any, context:any) => {
              return this.sortedWeaponList[context.dataIndex]
            },
            backgroundColor: (context:any) => {
              return context.dataset.backgroundColor(context)
            },
            borderColor: this.colors.fg,
            borderRadius: 25,
            borderWidth: 2,
            color: this.colors.bg,
            display: (context:any) => {
              return context.dataIndex === context.dataset.labels.length - 1 ? true : 'auto'
            },
            font: {
              weight: 'bold'
            },
            padding: 6
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                let label: string
                if (!this.sortedWeaponList) {
                  label = ctx.dataset.labels[ctx.dataIndex]
                } else {
                  console.log(this.sortedWeaponList)
                  label = this.sortedWeaponList[ctx.dataIndex]
                }
                label += ' (' + this.weapons[label].kills + ' kills)'
                return label
              }
            }
          }

        }
      }
      return options
    },
    weapons (): { [key: string]: Weapon } {
      return this.store.getters.getWeaponList(this.filters)
    },
    sortedWeaponList (): string[] {
      if (!this.weapons) return []
      const weapons = Object.keys(this.weapons)
      weapons.sort((a, b) => {
        if (Number(this.weapons[a].kills) < Number(this.weapons[b].kills)) {
          return -1
        }
        if (Number(this.weapons[a].kills) > Number(this.weapons[b].kills)) {
          return 1
        }
        return 0
      })
      return weapons
    }

  },
  data () {
    return {
      store: useStore(),
      refreshColors: 0
    }
  }
})
</script>

<style scoped>
canvas {
  background: var(--accent);
}

@media only screen and (max-width: 922px) {
  canvas {
    display: none !important
  }
}
</style>
