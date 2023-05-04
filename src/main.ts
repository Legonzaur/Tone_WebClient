import { createApp, ref, unref } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useKillStore } from './stores/kill'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

const websocketData = {
  attacker_id: '1010035351172',
  attacker_name: 'Iverral',
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

const store = useKillStore()
setInterval(() => {
  const allPlayerArrays = store.$state.players.filter((e) => {
    return (
      (!e.value.filter.server ||
                e.value.filter.server === websocketData.servername) &&
              (!e.value.filter.weapon ||
                e.value.filter.weapon === websocketData.cause_of_death)
    // Handle other types of filters once those are implemented
    )
  })
  allPlayerArrays.forEach(e => {
    if (!e.value.data[websocketData.attacker_id]) {
      e.value.data[websocketData.attacker_id] = ref({
        deaths: 0,
        kills: 500,
        max_distance: 0,
        total_distance: 0,
        username: websocketData.attacker_name
      })
    }
    if (!e.value.data[websocketData.victim_id]) {
      e.value.data[websocketData.victim_id] = ref({
        deaths: 0,
        kills: 0,
        max_distance: 0,
        total_distance: 0,
        username: websocketData.victim_name
      })
    }
    // handle deaths with equipped, eventually
    /*
    if(e.value.filter.weapon){
        !e.value.data[websocketData.victim_id] = e.value.data[websocketData.victim_id] = {
            deaths: 0,
            kills: 0,
            max_distance: 0,
            total_distance: 0,
            username: websocketData.victim_name,
          }
    } */

    unref(e.value.data[websocketData.victim_id]).deaths++
    unref(e.value.data[websocketData.victim_id]).username = websocketData.victim_name
    unref(e.value.data[websocketData.attacker_id]).username = websocketData.attacker_name
    unref(e.value.data[websocketData.attacker_id]).kills++
    unref(e.value.data[websocketData.attacker_id]).total_distance += websocketData.distance
    unref(e.value.data[websocketData.attacker_id]).max_distance = Math.max(websocketData.distance, unref(e.value.data[websocketData.attacker_id]).max_distance)
  })
  const allWeaponsArrays = store.$state.weapons.filter((e) => {
    return (
      (!e.value.filter.player || e.value.filter.player === websocketData.attacker_id)
    // Handle other types of filters once those are implemented
    )
  })

  allWeaponsArrays.forEach(e => {
    if (!e.value.data[websocketData.cause_of_death]) {
      e.value.data[websocketData.cause_of_death] = ref({
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
        !e.value.data[websocketData.victim_id] = e.value.data[websocketData.victim_id] = {
            deaths: 0,
            kills: 0,
            max_distance: 0,
            total_distance: 0,
            username: websocketData.victim_name,
          }
    } */

    // unref(e.value.data[websocketData.cause_of_death]).deaths++
    unref(e.value.data[websocketData.cause_of_death]).total_distance += websocketData.distance
    unref(e.value.data[websocketData.cause_of_death]).kills++
    unref(e.value.data[websocketData.cause_of_death]).max_distance = Math.max(websocketData.distance, unref(e.value.data[websocketData.cause_of_death]).max_distance)
  })
}, 100)
