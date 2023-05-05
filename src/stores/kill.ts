import { defineStore } from 'pinia'
import * as assert from 'assert'
import { Ref, reactive, ref, shallowRef, triggerRef, unref } from 'vue'

export interface Filters {
  server?: string;
  player?: string;
  weapon?: string;
  host?: string;
  map?: string;
  gamemode?: string;
}

function removeNullEntries (a: Filters) {
  return Object.fromEntries(
    Object.entries(a).filter((e) => e[1] !== undefined && e[1] !== null)
  )
}
function objectEqual (a: Filters, b: Filters) {
  try {
    a = removeNullEntries(a)
    b = removeNullEntries(b)
    assert.deepStrictEqual(a, b)
    return true
  } catch {
    return false
  }
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
  data: { [key: string]: Ref<T> };
}

export interface Player extends Kill {
  username: string;
  // eslint-disable-next-line camelcase
  // deaths_while_equipped?: number;
}

export interface Weapon extends Kill {
  // eslint-disable-next-line camelcase
  deaths_while_equipped: number;
}

export interface Server extends Kill {
  host: number;
}

export interface NSServer {
  name:string;
  region:string;
  description:string;
  playerCount:number;
  maxPlayers:number;
  map:string;
  playlist:string;
  hasPassword:boolean;
  modInfo:{Mods:[]}
}
// define your typings for the store state
export interface State {
  servers: Ref<KillData<Server>>[];
  players: Ref<KillData<Player>>[];
  weapons: Ref<KillData<Weapon>>[];
  maps: Ref<KillData<Kill>>[];
  gamemodes: Ref<KillData<Kill>>[];
  hosts: { [key: number]: string };
  nsServers: NSServer[] | undefined
}

export const useKillStore = defineStore('kill', {
  state: (): State => ({
    servers: [],
    players: [],
    weapons: [],
    maps: [],
    gamemodes: [],
    hosts: {},
    nsServers: undefined
  }),
  getters: {
    getPlayerList: (state) => (filters: Filters) => {
      return state.players.find((e) => objectEqual(unref(e).filter, filters))
    },
    getWeaponList: (state) => (filters: Filters) =>
      state.weapons.find((e) => objectEqual(unref(e).filter, filters)),
    getServerList: (state) => (filters: Filters) =>
      state.servers.find((e) => objectEqual(unref(e).filter, filters)),
    getNSServers: (state) => state.nsServers
  },
  actions: {
    fetchPlayers (filter: Filters) {
      filter = removeNullEntries(filter)
      let entry = this.players.find((e) => objectEqual(unref(e).filter, filter))
      if (entry === undefined) {
        entry = shallowRef({ filter, data: {} })
        this.players.push(entry)
      }
      fetch(
        'https://tone.sleepycat.date/v2/client/players?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      ).then(async response => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        unref(entry)!.data = Object.fromEntries(Object.entries(await response.json()).map(e => [e[0], ref(e[1] as Player)]))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        triggerRef(entry!)
      })
      return entry
    },
    fetchWeapons (filter: Filters) {
      filter = removeNullEntries(filter)
      let entry = this.weapons.find((e) => objectEqual(unref(e).filter, filter))
      if (!entry) {
        entry = shallowRef({ filter, data: {} })
        this.weapons.push(entry)
      }

      fetch(
        'https://tone.sleepycat.date/v2/client/weapons?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      ).then(async response => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        unref(entry)!.data = Object.fromEntries(Object.entries(await response.json()).map(e => [e[0], ref(e[1] as Weapon)]))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        triggerRef(entry!)
      })
      return entry
    },
    fetchServers (filter: Filters) {
      filter = removeNullEntries(filter)
      let entry = this.servers.find((e) => objectEqual(unref(e).filter, filter))
      if (!entry) {
        entry = shallowRef({ filter, data: {} })
        this.servers.push(entry)
      }
      fetch(
        'https://tone.sleepycat.date/v2/client/servers?' +
          new URLSearchParams(filter as Record<keyof Filters, string>)
      ).then(async response => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        unref(entry)!.data = Object.fromEntries(Object.entries(await response.json()).map(e => [e[0], ref(e[1] as Server)]))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        triggerRef(entry!)
      })
      return entry
    },
    fetchNSServers () {
      fetch(
        'https://northstar.tf/client/servers').then(async response => {
        this.nsServers = await response.json()
      })
      return this.nsServers || []
    }
  }
})
