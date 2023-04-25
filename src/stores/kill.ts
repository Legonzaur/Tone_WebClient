import { defineStore } from 'pinia'
import * as assert from 'assert'

function removeNullEntries (a:any) {
  return Object.fromEntries(Object.entries(a).filter(e => e[1] !== undefined && e[1] !== null))
}
function objectEqual (a:any, b:any) {
  try {
    a = removeNullEntries(a)
    b = removeNullEntries(b)
    assert.deepStrictEqual(a, b)
    return true
  } catch {
    return false
  }
}
export interface Filters {
  server?: string;
  player?: string;
  weapon?: string;
  host?: string;
  map?: string;
  gamemode?: string;
}

export interface Kill {
  deaths: number;
  kills: number;
  // eslint-disable-next-line camelcase
  max_distance: number;
  // eslint-disable-next-line camelcase
  total_distance: number;
}
export interface KillData<T extends Kill> {
  filter: Filters;
  data: { [key: string]: T };
}

export interface Player extends Kill {
  username: string;
  // eslint-disable-next-line camelcase
  deaths_while_equipped?: number;
}

export interface Weapon extends Kill {
  // eslint-disable-next-line camelcase
  deaths_while_equipped: number;
}

export interface Server extends Kill {
  host: number;
}

// define your typings for the store state
export interface State {
  servers: KillData<Server>[];
  players: KillData<Player>[];
  weapons: KillData<Weapon>[];
  maps: KillData<Kill>[];
  gamemodes: KillData<Kill>[];
  hosts: { [key: number]: string };
}

export const useKillStore = defineStore('kill', {
  state: (): State => ({
    servers: [],
    players: [],
    weapons: [],
    maps: [],
    gamemodes: [],
    hosts: {}
  }),
  getters: {
    getPlayerList: (state) => (filters: Filters) => state.players.find((e) => objectEqual(e.filter, filters)),
    getWeaponList: (state) => (filters: Filters) => state.weapons.find((e) => objectEqual(e.filter, filters)),
    getServerList: (state) => (filters: Filters) => state.servers.find((e) => objectEqual(e.filter, filters))
  },
  actions: {
    async fetchPlayers (filter: Filters) {
      filter = removeNullEntries(filter)
      const response = await fetch(
        'https://tone.sleepycat.date/v2/client/players?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      )
      const data = await response.json()
      const entry = this.players.find((e) => objectEqual(e.filter, filter))
      if (!entry) return this.players.push({ filter, data })
      entry.data = data
    },
    async fetchWeapons (filter: Filters) {
      filter = removeNullEntries(filter)
      const response = await fetch(
        'https://tone.sleepycat.date/v2/client/weapons?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      )
      const data = await response.json()
      const entry = this.weapons.find((e) => objectEqual(e.filter, filter))
      if (!entry) return this.weapons.push({ filter, data })
      entry.data = data
    },
    async fetchServers (filter: Filters) {
      filter = removeNullEntries(filter)
      const response = await fetch(
        'https://tone.sleepycat.date/v2/client/servers?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      )
      const data = await response.json()
      const entry = this.servers.find((e) => objectEqual(e.filter, filter))
      if (!entry) return this.servers.push({ filter, data })
      entry.data = data
    }
  }
})
