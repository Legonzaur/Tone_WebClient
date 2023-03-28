<template>
    <div class="playerChart">
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
  Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import dataLabel from 'chartjs-plugin-datalabels'
import { Store, useStore } from 'vuex'
import { Player, Weapon } from '@/store/index'

import { Scatter } from 'vue-chartjs'
import { defineComponent } from 'vue'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin, dataLabel)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    filters: Object,
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  components: {
    Scatter
  },
  computed: {
    chart () {
      const chartData = {
        datasets: [
          {
            label: 'Players',
            labels: [] as string[],
            borderColor: ['#f87979'],
            backgroundColor: '#f87979',
            pointRadius: [1],
            pointStyle: ['dot'],
            hoverRadius: [4],
            data: [] as {x:number, y:number}[]
          }
        ]
      }
      if (!this.players) {
        return chartData
      }
      chartData.datasets[0].labels = this.playerIdList
      chartData.datasets[0].data = this.playerIdList.map(e => {
        if (!this.players) {
          return { x: 0, y: 0 }
        }
        return { x: this.players[e].deaths, y: this.players[e].kills }
      })
      chartData.datasets[0].pointRadius = Array(chartData.datasets[0].labels.length).fill(1)
      chartData.datasets[0].pointStyle = Array(chartData.datasets[0].labels.length).fill('dot')
      chartData.datasets[0].borderColor = Array(chartData.datasets[0].labels.length).fill('darkblue')
      chartData.datasets[0].hoverRadius = Array(chartData.datasets[0].labels.length).fill(4)
      if (this.$props.playerHighlighted) {
        const index = this.playerIdList.indexOf(this.$props.playerHighlighted)
        chartData.datasets[0].pointRadius[index] = 20
        chartData.datasets[0].pointStyle[index] = 'crossRot'
        chartData.datasets[0].borderColor[index] = 'red'
        chartData.datasets[0].hoverRadius[index] = 30
      }
      return chartData
    },
    chartOptions () {
      const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 500 },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx:any) => {
                let label:string
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
          annotation: {},
          datalabels: {
            formatter: (value:any, context:any) => {
              return this.players[this.playerIdList[context.dataIndex]].username
            },
            backgroundColor: Array(this.playerIdList.length).fill(null),
            borderColor: 'black',
            borderWidth: Array(this.playerIdList.length).fill(0),
            borderRadius: 5,
            display: Array(this.playerIdList.length).fill('auto'),
            align: '-45',
            anchor: 'end',
            clamp: true
          }
        },
        onClick: (e:Event, element:any) => {
          this.$emit('highlightPlayer', element.length > 0 ? this.playerIdList[element[0].index] : undefined)
        },
        onHover: (e:any, element:any) => {
          if (!e.native.target) return
          (e.native.target as HTMLElement).style.cursor = element[0] ? 'pointer' : 'default'
        }
      }
      if (!this.players) {
        return options
      }
      const maxX = Math.max(...Object.values(this.players).map(e => e.deaths))
      const maxY = Math.max(...Object.values(this.players).map(e => e.kills))
      let endX, endY
      if (maxY > maxX) {
        endX = maxX
        endY = (maxX / maxY) * maxY
      } else {
        endY = maxY
        endX = (maxY / maxX) * maxX
      }
      options.plugins.annotation = {
        annotations: {
          line: {
            type: 'line',
            yMin: 0,
            xMin: 0,
            yMax: endY,
            xMax: endX,
            borderWidth: 2,
            borderColor: 'black',
            borderDash: [1, 5]
          }
        }
      }

      if (this.$props.playerHighlighted) {
        const index = this.playerIdList.indexOf(this.$props.playerHighlighted)
        options.plugins.datalabels.display[index] = true
        options.plugins.datalabels.backgroundColor[index] = 'red'
        options.plugins.datalabels.borderWidth[index] = 1
      }
      return options
    },
    players ():{[key:string]:Player} { return this.store.getters.getPlayerList(this.filters) || {} },
    playerIdList ():string[] { return Object.keys(this.players) }

  },
  data () {
    return {
      store: useStore()
    }
  }
})
</script>

<style scoped>
.playerChart {
}
</style>
