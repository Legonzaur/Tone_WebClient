/* eslint-disable camelcase */
import { createApp, ref, unref } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { objectEqual, useKillStore } from './stores/kill'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

const dummyData = {
  attacker_id: '1008704914497',
  attacker_name: 'DarkwinV1',
  cause_of_death: 'mp_weapon_car',
  victim_id: '1008553404453',
  victim_name: 'GURENTITANIUM',
  attacker_current_weapon: 'mp_weapon_car',
  victim_current_weapon: 'mp_weapon_sniper',
  distance: 300,
  game_mode: 'ps',
  servername: "fvnkhead's 3v3",
  map: 'lf_meadow',
  host: 1
}

setInterval(() => registerWebSocketKill(dummyData), 100)

type websocketData = {
  attacker_id: string,
  attacker_name: string,
  cause_of_death: string,
  victim_id: string,
  victim_name: string,
  attacker_current_weapon: string,
  victim_current_weapon: string,
  distance: number,
  game_mode: string,
  servername: string,
  map: string,
  host: number
}

// dev stuff

const store = useKillStore()
const socket = new WebSocket('wss://tone.sleepycat.date/v2/client/websocket')
socket.onmessage = function (e) {
  if (e.data === 'ping') return socket.send('pong')
  const data = JSON.parse(e.data)
  registerWebSocketKill(data)
}

function registerWebSocketKill (data : websocketData) {
  const { player: _, ...filterWithoutPlayer } = store.$state.currentFilter
  const list = unref(store.$state.players.find((e) => {
    return objectEqual(filterWithoutPlayer, e.value.filter)
  }))
  if (!list) return
  if (!(!list.filter.server || list.filter.server === data.servername)) return

  const WeaponFilter = (!list.filter.weapon || list.filter.weapon === data.cause_of_death)
  const CurrentWeaponFilter = list.filter.weapon === data.attacker_current_weapon
  if (!(WeaponFilter || CurrentWeaponFilter)) return

  if (!list.data[data.victim_id]) {
    list.data[data.victim_id] = ref({
      deaths: 0,
      deaths_while_equipped: 0,
      kills: 0,
      max_distance: 0,
      total_distance: 0,
      username: data.victim_name
    })
  }
  if (WeaponFilter) {
    unref(list.data[data.victim_id]).deaths++
  } else if (CurrentWeaponFilter) {
    unref(list.data[data.victim_id]).deaths_while_equipped++
  }

  if (!list.data[data.attacker_id]) {
    list.data[data.attacker_id] = ref({
      deaths: 0,
      deaths_while_equipped: 0,
      kills: 0,
      max_distance: 0,
      total_distance: 0,
      username: data.attacker_name
    })
  }
  if (data.attacker_id !== data.victim_id) {
    unref(list.data[data.attacker_id]).kills++
    unref(list.data[data.attacker_id]).total_distance += data.distance
    unref(list.data[data.attacker_id]).max_distance = Math.max(data.distance, unref(list.data[data.attacker_id]).max_distance)
  }

  unref(list.data[data.victim_id]).username = data.victim_name
  unref(list.data[data.attacker_id]).username = data.attacker_name
}
