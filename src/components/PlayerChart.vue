<template>
  <div class="playerChart" ref="container">
    <!-- <Scatter :data="chart" :options="chartOptions" /> -->
    <Scatter :data="chart" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CoreChartOptions,
  PluginChartOptions,
  ScaleChartOptions
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import dataLabel from 'chartjs-plugin-datalabels'
import { useKillStore, Player, Filters } from '@/stores/kill'

import { Scatter } from 'vue-chartjs'
import { defineComponent, PropType } from 'vue'
import { ChartEvent } from 'chart.js/dist/core/core.plugins'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin, dataLabel)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    filters: Object as PropType<Filters>,
    playerHighlighted: String
  },
  data: () => {
    return {
      store: useKillStore(),
      refreshColors: 0
    }
  },
  emits: ['highlightPlayer'],
  components: {
    Scatter
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
        colors.currentLine = style.getPropertyValue('--current-line')
      } else {
        colors.fg = '#ffffff'
      }
      return colors
    },
    chart () {
      return {
        datasets: [
          {
            label: 'Players',
            labels: this.playerIdList || [] as string[],
            borderColor: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.index]) ? this.colors.orange : this.colors.cyan,
            backgroundColor: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.index]) ? this.colors.orange : this.colors.cyan,
            pointRadius: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.index]) ? 20 : 1,
            pointStyle: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.index]) ? 'crossRot' : 'circle',
            hoverRadius: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.index]) ? 30 : 4,
            data: this.playerIdList.map((id) => ({ y: this.players[id].kills, x: this.players[id].deaths }))
          }
        ]
      }
    },
    chartOptions (): _DeepPartialObject<CoreChartOptions<'scatter'> & PluginChartOptions<'scatter'> & ScaleChartOptions<'scatter'>> {
      // eslint-disable-next-line no-unused-expressions
      this.$props.playerHighlighted
      let endX = 0
      let endY = 0
      if (this.players) {
        const maxX = Math.max(...Object.values(this.players).map(e => e.deaths))
        const maxY = Math.max(...Object.values(this.players).map(e => e.kills))

        if (maxY > maxX) {
          endX = maxX
          endY = (maxX / maxY) * maxY
        } else {
          endY = maxY
          endX = (maxY / maxX) * maxX
        }
      }
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        layout: { autoPadding: false },
        scales: {
          y: {
            title: {
              text: 'Kills',
              display: true,
              color: this.colors.fg
            },
            ticks: {
              color: this.colors.fg
            }
          },
          x: {
            title: {
              text: 'Deaths',
              display: true,
              color: this.colors.fg
            },
            ticks: {
              color: this.colors.fg
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                let label: string
                if (!this.players) {
                  label = ctx.dataset.labels[ctx.dataIndex]
                } else {
                  label = this.players[ctx.dataset.labels[ctx.dataIndex]].username
                }
                label += ' (' + ctx.parsed.y + ' kills ' + ctx.parsed.x + ' deaths)'
                return label
              }
            }
          },
          annotation: {
            annotations: {
              line: {
                type: 'line',
                yMin: 0,
                xMin: 0,
                yMax: endY,
                xMax: endX,
                borderWidth: 2,
                borderColor: this.colors.orange,
                borderDash: [1, 5]
              }
            }
          },
          legend: { display: false },
          datalabels: {
            formatter: (value: any, context: any) => {
              return this.players[this.playerIdList[context.dataIndex]].username
            },
            backgroundColor: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.dataIndex]) ? this.colors.orange : null,
            borderColor: this.colors.fg,
            borderWidth: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.dataIndex]) ? 1 : 0,
            borderRadius: 5,
            display: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.dataIndex]) ? 'true' : 'auto',
            align: -45,
            anchor: 'end',
            clamp: true,
            color: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerIdList[context.dataIndex]) ? this.colors.bg : this.colors.fg
          }
        },
        onClick: (e: ChartEvent, element: any) => {
          this.$emit('highlightPlayer', element.length > 0 ? this.playerIdList[element[0].index] : undefined)
        },
        onHover: (e: any, element: any) => {
          if (!e.native.target) return
          (e.native.target as HTMLElement).style.cursor = element[0] ? 'pointer' : 'default'
        }
      }
    },
    players (): { [key: string]: Player } {
      const data = this.store.getPlayerList(this.filters || {})?.value.data
      if (!data) return this.store.fetchPlayers(this.filters || {}).value.data
      const cut = Object.entries(data).sort((a, b) => {
        if (a[1].kills < b[1].kills) {
          return 1
        }
        if (a[1].kills > b[1].kills) {
          return -1
        }
        return 0
      }).slice(0, 200)
      return Object.fromEntries(cut)
    },
    playerIdList (): string[] { return Object.keys(this.players) }

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
