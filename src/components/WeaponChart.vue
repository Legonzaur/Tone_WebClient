<template>
  <div class="weaponChart" ref="container">
    <LoadingBar v-if="progress !== 1" :value="progress"></LoadingBar>
    <Doughnut :data="chart" :options="chartOptions" v-if="progress === 1"/>
  </div>
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import dataLabel from 'chartjs-plugin-datalabels'
import { Weapon, Filters, useKillStore } from '@/stores/kill'
import { Doughnut } from 'vue-chartjs'
import { defineComponent, PropType, Ref } from 'vue'
import weapons from '../stores/weapons.json'

import LoadingBar from './LoadingBar.vue'

ChartJS.register(ArcElement, Tooltip, Legend, dataLabel)

export default defineComponent({
  name: 'WeaponChart',
  props: {
    filters: Object as PropType<Filters>,
    playerHighlighted: String
  },
  emits: ['highlightPlayer'],
  components: {
    Doughnut, LoadingBar
  },
  mounted () {
    this.refreshColors++
  },
  data: () => {
    return {
      store: useKillStore(),
      refreshColors: 0
    }
  },
  computed: {
    progress () {
      const { weapon: _, ...withoutWeapon } = this.filters || {}
      const data = this.store.getWeaponList(withoutWeapon)?.value
      if (!data) return this.store.fetchWeapons(withoutWeapon).value.progress
      return data.progress
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
    chart () {
      const colors = [
        'cyan',
        'green',
        'orange',
        'pink',
        'purple',
        'red',
        'yellow'
      ]
      const chartData = {
        datasets: [
          {
            label: 'Weapons',
            labels: this.sortedWeaponList || ([] as string[]),
            borderColor: () => this.colors.fg,
            backgroundColor: (context: any) => {
              return this.colors[
                colors[(context.dataIndex * 3) % colors.length]
              ]
            },
            data: [] as number[]
          }
        ]
      }
      if (!this.sortedWeaponList) {
        return chartData
      }
      chartData.datasets[0].data = this.sortedWeaponList.map((e) => {
        if (!this.weapons) {
          return 0
        }
        return this.weapons[e].value.kills
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
            formatter: (value: any, context: any) => {
              const weaponId = this.sortedWeaponList[context.dataIndex]
              // if (!(weapons as {[key:string]:string})[weaponId]) console.log(weaponId)
              return (weapons as {[key:string]:string})[weaponId] || weaponId
            },
            backgroundColor: (context: any) => {
              return context.dataset.backgroundColor(context)
            },
            borderColor: this.colors.fg,
            borderRadius: 25,
            borderWidth: 2,
            color: this.colors.bg,
            display: (context: any) => {
              return context.dataIndex === context.dataset.labels.length - 1
                ? true
                : 'auto'
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
                  label = this.sortedWeaponList[ctx.dataIndex]
                }
                label += ' (' + this.weapons[label].value.kills + ' kills)'
                return label
              }
            }
          }
        }
      }
      return options
    },
    weapons (): { [key: string]: Ref<Weapon> } {
      const { weapon: _, ...withoutWeapon } = this.filters || {}
      const data = this.store.getWeaponList(withoutWeapon)?.value.data
      if (!data) return this.store.fetchWeapons(withoutWeapon).value.data
      return data
    },
    sortedWeaponList (): string[] {
      if (!this.weapons) return []
      const weapons = Object.keys(this.weapons).filter(e => this.weapons[e].value.kills > 0)
      weapons.sort((a, b) => {
        if (Number(this.weapons[a].value.kills) < Number(this.weapons[b].value.kills)) {
          return -1
        }
        if (Number(this.weapons[a].value.kills) > Number(this.weapons[b].value.kills)) {
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
.weaponChart {
  width: calc(min(50vw, 50vh) - 3em);
  height: calc(min(50vw, 50vh) - 3em);
}

@media only screen and (max-width: 922px) {
  canvas {
    display: none !important;
  }
}
</style>
