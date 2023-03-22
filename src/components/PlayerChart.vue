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

import { Scatter } from 'vue-chartjs'
import { defineComponent } from 'vue'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin)

export default defineComponent({
  name: 'PlayerChart',
  props: {
    players: Object
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
            data: [] as {x:number, y:number}[]
          }
        ]
      }
      if (!this.$props.players) {
        return chartData
      }
      chartData.datasets[0].labels = Object.keys(this.$props.players)
      chartData.datasets[0].data = Object.values(this.$props.players).map((e:any) => ({ x: e.deaths, y: e.kills }))
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
                if (!this.$props.players) {
                  label = ctx.dataset.labels[ctx.dataIndex]
                } else {
                  label = this.$props.players[ctx.dataset.labels[ctx.dataIndex]].username
                }
                label += ' (' + ctx.parsed.y + ' kills ' + ctx.parsed.x + ' deaths)'
                return label
              }
            }
          },
          annotation: {}
        }
      }
      if (!this.$props.players) {
        return options
      }
      const maxX = Math.max(...Object.values(this.$props.players).map(e => e.deaths))
      const maxY = Math.max(...Object.values(this.$props.players).map(e => e.kills))
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
    }
  },
  /* watch: {
    players: function (newval: any, oldval: any): void {

    }
  }, */
  data () {
    return {

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
