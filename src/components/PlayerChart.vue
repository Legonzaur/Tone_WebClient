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
import { Store, useStore } from 'vuex'
import { Player, Weapon } from '@/store/index'

import { Scatter } from 'vue-chartjs'
import { defineComponent } from 'vue'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    filters: Object
  },
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
            borderColor: '#f87979',
            backgroundColor: '#f87979',
            pointRadius: [1],
            pointStyle: ['dot'],
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
      chartData.datasets[0].pointRadius = [1].fill(1, 0, chartData.datasets[0].labels.length)
      chartData.datasets[0].pointStyle = ['dot'].fill('dot', 0, chartData.datasets[0].labels.length)
      return chartData
    },
    chartOptions () {
      const options = {
        responsive: true,
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
          annotation: {}
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
      return options
    },
    players ():{[key:string]:Player} { return this.store.getters.getPlayerList(this.filters) },
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
  position:sticky;
  height:fit-content;
  top:0
}
</style>
