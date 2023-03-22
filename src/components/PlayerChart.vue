<template>
    <div class="playerChart">
        <Scatter :data="chart" :options="options" />
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

import { Scatter } from 'vue-chartjs'
import { defineComponent } from 'vue'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

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
    }
  },
  /* watch: {
    players: function (newval: any, oldval: any): void {

    }
  }, */
  data () {
    return {
      options: {
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
          }
        }
      }
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
