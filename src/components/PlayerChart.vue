<template>
  <div class="playerChart" ref="container">
    <LoadingBar v-if="progress!==1" :value="progress"></LoadingBar>
    <Scatter :data="chart" :options="chartOptions" v-if="progress===1" />
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
import annotationPlugin, { AnnotationPluginOptions } from 'chartjs-plugin-annotation'
import dataLabel from 'chartjs-plugin-datalabels'
import { useKillStore, Player, Filter } from '@/stores/kill'

import { Scatter } from 'vue-chartjs'
import { defineComponent, PropType, toRaw, unref } from 'vue'
import { ChartEvent } from 'chart.js/dist/core/core.plugins'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'

import LoadingBar from './LoadingBar.vue'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin, dataLabel)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    filters: Object as PropType<Filter>,
    playerHighlighted: String
  },
  data: () => {
    return {
      store: useKillStore(),
      refreshColors: 0,
      playerData: []
    }
  },
  emits: ['highlightPlayer'],
  components: {
    Scatter, LoadingBar
  },
  mounted () {
    this.refreshColors++
  },
  computed: {
    progress () {
      if (this.filters) {
        const filter = new Filter(this.filters)
        delete filter.player
        return this.store.getList('players', filter)?.value.progress.value
      }
      return 0
    },
    playerList (): (Player & {id:string})[] {
      const filter = new Filter(this.filters)
      delete filter.player
      const data = unref(this.store.getList('players', filter))?.data
      if (!data) return Object.entries(this.store.fetch('players', filter).value.data).map(e => ({ id: e[0], ...toRaw(e[1].value) }))
      const cut = Object.entries(data).map(e => ({ id: e[0], ...toRaw(e[1].value) }))
      cut.sort((a, b) => {
        return b.kills - a.kills
      })
      return cut.slice(0, 200)
    },
    colors () {
      // eslint-disable-next-line no-unused-expressions
      this.refreshColors
      const colors = {} as { [key: string]: string }
      if (this.$refs?.container) {
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
      const playerIndex = this.playerList.findIndex(e => e.id === this.$props.playerHighlighted)
      const defaultColor = this.colors.cyan
      const borderColor = new Array(this.playerList.length).fill(defaultColor)
      borderColor[playerIndex] = this.colors.orange
      const backgroundColor = borderColor
      const pointRadius = new Array(this.playerList.length).fill(1)
      pointRadius[playerIndex] = 20
      const hoverRadius = new Array(this.playerList.length).fill(4)
      hoverRadius[playerIndex] = 30
      const pointStyle = new Array(this.playerList.length).fill('circle')
      pointStyle[playerIndex] = 'crossRot'
      return {
        datasets: [
          {
            label: 'Players',
            labels: this.playerList.map(e => e.id) || [] as string[],
            borderColor,
            backgroundColor,
            pointRadius,
            pointStyle,
            hoverRadius,
            data: this.playerList.map((player) => ({ y: player.kills, x: player.deaths }))
          }
        ]
      }
    },
    chartStaticOptions () {
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
        onClick: (e: ChartEvent, element: any) => {
          this.$emit('highlightPlayer', element.length > 0 ? this.playerList[element[0].index].id : undefined)
        },
        onHover: (e: any, element: any) => {
          if (!e.native.target) return
          (e.native.target as HTMLElement).style.cursor = element[0] ? 'pointer' : 'default'
        }
      }
    },
    chartStaticPlugins () {
      let endX = 0
      let endY = 0
      if (this.playerList) {
        const maxX = Math.max(...this.playerList.map(e => e.deaths))
        const maxY = Math.max(...this.playerList.map(e => e.kills))
        if (maxY > maxX) {
          endX = maxX
          endY = (maxX / maxY) * maxY
        } else {
          endY = maxY
          endX = (maxY / maxX) * maxX
        }
      }
      return {
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              let label: string
              if (!this.playerList) {
                label = ctx.dataset.labels[ctx.dataIndex]
              } else {
                label = this.playerList[ctx.dataIndex].username
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
        } as _DeepPartialObject<AnnotationPluginOptions>,
        legend: { display: false }
      }
    },
    chartOptions (): _DeepPartialObject<CoreChartOptions<'scatter'> & PluginChartOptions<'scatter'> & ScaleChartOptions<'scatter'>> {
      // eslint-disable-next-line no-unused-expressions
      this.$props.playerHighlighted
      return {
        ...this.chartStaticOptions,
        plugins: {
          ...this.chartStaticPlugins,
          datalabels: {
            formatter: (value: any, context: any) => {
              return this.playerList[context.dataIndex].username
            },
            backgroundColor: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerList[context.dataIndex].id) ? this.colors.orange : null,
            borderColor: this.colors.fg,
            borderWidth: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerList[context.dataIndex].id) ? 1 : 0,
            borderRadius: 5,
            display: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerList[context.dataIndex].id) ? 'true' : 'auto',
            align: -45,
            anchor: 'end',
            clamp: true,
            color: (context: any) => (this.$props.playerHighlighted && this.$props.playerHighlighted === this.playerList[context.dataIndex].id) ? this.colors.bg : this.colors.fg
          }
        }
      }
    }
  }
  /* methods: {
    refreshChart () {
      if (this.store.getPlayerList(this.filters || {}) !== undefined) triggerRef(this.store.getPlayerList(this.filters || {}) as unknown as Ref)
    }
  } */
})
</script>

<style scoped>
canvas {
  background: var(--accent);
}
.playerChart{
  position:relative;
}
#refreshChart{
  position:absolute;
  top: 0;
  left:0;
}
@media only screen and (max-width: 922px) {
  canvas {
    display: none !important
  }
}
</style>
