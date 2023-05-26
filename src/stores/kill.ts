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

function fetchWithLoading (url: string, progress: (percentage: number) => void) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw Error(response.status + ' ' + response.statusText)
    }

    if (!response.body) {
      throw Error('ReadableStream not yet supported in this browser.')
    }

    // to access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
    // server must send custom x-file-size header if gzip or other content-encoding is used
    const contentEncoding = response.headers.get('Content-Encoding')
    const contentLength = response.headers.get(contentEncoding ? 'X-File-Size' : 'content-length')
    if (contentLength === null) {
      throw Error('Response size header unavailable')
    }

    const total = parseInt(contentLength, 10)
    let loaded = 0

    return new Response(
      new ReadableStream({
        start (controller) {
          const reader = response.body!.getReader()

          read()
          function read () {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              if (value) {
                loaded += value.byteLength
                progress(loaded / total)
                controller.enqueue(value)
              }
              read()
            }).catch(error => {
              console.error(error)
              controller.error(error)
            })
          }
        }
      })
    )
  })
    .catch(error => {
      console.error(error)
    })
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
  progress?: number;
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
  name: string;
  region: string;
  description: string;
  playerCount: number;
  maxPlayers: number;
  map: string;
  playlist: string;
  hasPassword: boolean;
  modInfo: { Mods: [] }
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

let serverInterval: number
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
      fetchWithLoading(
        'https://tone.sleepycat.date/v2/client/players?' +
        new URLSearchParams(filter as Record<keyof Filters, string>),
        (progress) => {
          if (entry) {
            unref(entry).progress = progress
            if (progress !== 1) triggerRef(entry)
          }
        }
      ).then(async response => {
        if (entry) {
          unref(entry).data = Object.fromEntries(Object.entries(await response?.json()).map(e => [e[0], ref(e[1] as Player)]))
          triggerRef(entry)
        }
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

      fetchWithLoading(
        'https://tone.sleepycat.date/v2/client/weapons?' +
        new URLSearchParams(filter as Record<keyof Filters, string>),
        (progress) => {
          if (entry) {
            unref(entry).progress = progress
            if (progress !== 1) triggerRef(entry)
          }
        }
      ).then(async response => {
        if (entry) {
          unref(entry).data = Object.fromEntries(Object.entries(await response?.json()).map(e => [e[0], ref(e[1] as Weapon)]))
          triggerRef(entry)
        }
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
      fetchWithLoading(
        'https://tone.sleepycat.date/v2/client/servers?' +
        new URLSearchParams(filter as Record<keyof Filters, string>),
        (progress) => {
          if (entry) {
            unref(entry).progress = progress
            if (progress !== 1) triggerRef(entry)
          }
        }
      ).then(async response => {
        if (entry) {
          unref(entry).data = Object.fromEntries(Object.entries(await response?.json()).map(e => [e[0], ref(e[1] as Server)]))
          triggerRef(entry)
        }
      })
      return entry
    },
    fetchNSServers () {
      fetch(
        'https://northstar.tf/client/servers').then(async response => {
        this.nsServers = await response.json()
      })
      clearInterval(serverInterval)
      serverInterval = setInterval(() => this.fetchNSServers(), 60000)
      return this.nsServers || []
    }
  }
})
