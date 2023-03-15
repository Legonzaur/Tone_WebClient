// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

interface Player {
  deaths: number;
  username: string;
  maxKillDistance: number;
  avgKillDistance: number;
  kills: number;
}
// define your typings for the store state
export interface State {
  players: Player[];
}

// define injection key
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol()

export default createStore({
  state: {
    servers: [],
    players: {},
    weapons: {}
  },
  getters: {
    getPlayerList (weapon, server) {
      console.log('e')
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
