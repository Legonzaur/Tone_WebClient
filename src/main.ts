/* eslint-disable camelcase */
import { createApp, ref, unref } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useKillStore } from './stores/kill'

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

// setInterval(() => registerWebSocketKill(dummyData), 100)

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
  const allPlayerArrays = store.$state.players.filter((e) => {
    return (
      (!e.value.filter.server ||
                e.value.filter.server === data.servername) &&
              (!e.value.filter.weapon ||
                e.value.filter.weapon === data.cause_of_death)
    // Handle other types of filters once those are implemented
    )
  })
  allPlayerArrays.forEach(e => {
    if (!e.value.data[data.attacker_id]) {
      e.value.data[data.attacker_id] = ref({
        deaths: 0,
        kills: 500,
        max_distance: 0,
        total_distance: 0,
        username: data.attacker_name
      })
    }
    if (!e.value.data[data.victim_id]) {
      e.value.data[data.victim_id] = ref({
        deaths: 0,
        kills: 0,
        max_distance: 0,
        total_distance: 0,
        username: data.victim_name
      })
    }
    // handle deaths with equipped, eventually
    /*
    if(e.value.filter.weapon){
        !e.value.data[data.victim_id] = e.value.data[data.victim_id] = {
            deaths: 0,
            kills: 0,
            max_distance: 0,
            total_distance: 0,
            username: data.victim_name,
          }
    } */

    unref(e.value.data[data.victim_id]).deaths++
    unref(e.value.data[data.victim_id]).username = data.victim_name
    unref(e.value.data[data.attacker_id]).username = data.attacker_name
    unref(e.value.data[data.attacker_id]).kills++
    unref(e.value.data[data.attacker_id]).total_distance += data.distance
    unref(e.value.data[data.attacker_id]).max_distance = Math.max(data.distance, unref(e.value.data[data.attacker_id]).max_distance)
  })
  const allWeaponsArrays = store.$state.weapons.filter((e) => {
    return (
      (!e.value.filter.player || e.value.filter.player === data.attacker_id)
    // Handle other types of filters once those are implemented
    )
  })

  allWeaponsArrays.forEach(e => {
    if (!e.value.data[data.cause_of_death]) {
      e.value.data[data.cause_of_death] = ref({
        deaths: 0,
        kills: 500,
        max_distance: 0,
        total_distance: 0,
        deaths_while_equipped: 0
      })
    }
    // handle deaths with equipped, eventually
    /*
    if(e.value.filter.weapon){
        !e.value.data[data.victim_id] = e.value.data[data.victim_id] = {
            deaths: 0,
            kills: 0,
            max_distance: 0,
            total_distance: 0,
            username: data.victim_name,
          }
    } */

    // unref(e.value.data[data.cause_of_death]).deaths++
    unref(e.value.data[data.cause_of_death]).total_distance += data.distance
    unref(e.value.data[data.cause_of_death]).kills++
    unref(e.value.data[data.cause_of_death]).max_distance = Math.max(data.distance, unref(e.value.data[data.cause_of_death]).max_distance)
  })
}
