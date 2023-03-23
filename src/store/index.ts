// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface Player {
  deaths: number;
  username: string;
  // eslint-disable-next-line camelcase
  max_kill_distance: number;
  // eslint-disable-next-line camelcase
  avg_kill_distance: number;
  kills: number;
}

export interface Weapon {
  // eslint-disable-next-line camelcase
  max_kill_distance: number;
  // eslint-disable-next-line camelcase
  avg_kill_distance: number;
  kills: number;
}

export interface Server{
  name:string;
  id:number;
  description:string
}
// define your typings for the store state
export interface State {
  servers: Server[]
  players: { [key: string]: { [key: string]: Player } };
  weapons: { [key: string]:{ [key: string]: Weapon }};
}

// define injection key
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
  state: {
    servers: [],
    players: {},
    weapons: {}
  },
  getters: {
    getPlayerList: (state) => ({ server, weapon }: { server?: number, weapon?: string }) => {
      return state.players[(server || '') + (weapon || '')]
    },
    getWeaponList: (state) => ({ server, player }: { server?: number, player?: string }) => {
      return state.weapons[(server || '') + (player || '')]
    }
  },
  mutations: {
    setPlayers (state, data: { data: { [key: string]: Player }, filters: { weapon: string, server: number } }) {
      state.players[(data.filters.server || '') + (data.filters.weapon || '')] = data.data
    },
    setWeapons (state, data:{data: {[key:string]:Weapon}, filters:{server:string, player:string}}) {
      state.weapons[(data.filters.server || '') + (data.filters.player || '')] = data.data
    },
    setServers (state, data) {
      state.servers = data
    }
  },
  actions: {
    async fetchPlayers (context, { weapon, server }) {
      const searchParams: Record<string, string> = {}
      if (weapon?.toString()) { searchParams.weapon = weapon }
      if (server?.toString()) { searchParams.server = server }
      const response = await fetch(
        'https://tone.sleepycat.date/v1/client/players?' + new URLSearchParams(searchParams)
      )
      const data = await response.json()
      Object.keys(data).forEach(e => {
        data[e].kills = Number(data[e].kills)
        data[e].deaths = Number(data[e].deaths)
        data[e].max_kill_distance = Number(data[e].max_kill_distance)
        data[e].avg_kill_distance = Number(data[e].avg_kill_distance)
      })
      context.commit('setPlayers', { data, filters: { weapon, server } })
    },
    async fetchWeapons (context, { player, server }) {
      const searchParams: Record<string, string> = {}
      if (player?.toString()) { searchParams.player = player }
      if (server?.toString()) { searchParams.server = server }
      const response = await fetch(
        'https://tone.sleepycat.date/v1/client/weapons?' + new URLSearchParams(searchParams)
      )
      const data = await response.json()
      context.commit('setWeapons', { data, filters: { player, server } })
    },
    async fetchServers (context) {
      const response = await fetch(
        'https://tone.sleepycat.date/v1/client/servers'
      )
      const data = await response.json()
      context.commit('setServers', data)
    }
  },
  modules: {}
})
