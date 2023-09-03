import { defineStore } from 'pinia'
import { Ref, ref, shallowRef, triggerRef, unref } from 'vue'

export class Filter {
  constructor (filt?:{server?:string[], player?: string, weapon?: string[], host?: string[], map?: string[], gamemode?: string[]}) {
    if (filt?.server) this.server = filt.server
    if (filt?.player) this.player = filt.player
    if (filt?.weapon) this.weapon = filt.weapon
    if (filt?.host) this.host = filt.host
    if (filt?.map) this.map = filt.map
    if (filt?.gamemode) this.gamemode = filt.gamemode
  }

  server?: string[];
  player?: string;
  weapon?: string[];
  host?: string[];
  map?: string[];
  gamemode?: string[];
  toURLSearchParams (): URLSearchParams {
    return new URLSearchParams(
      Object.entries(this).filter(e => e[1] !== undefined)
        .map<string[][]>((e) => [e[1]].flat().map((v) => [e[0], v]))
        .flat(1)
    )
  }
}

function fetchWithLoading (url: string, progress: (percentage: number) => void) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText)
      }

      if (!response.body) {
        throw Error('ReadableStream not yet supported in this browser.')
      }

      // to access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
      // server must send custom x-file-size header if gzip or other content-encoding is used
      const contentEncoding = response.headers.get('Content-Encoding')
      const contentLength = response.headers.get(
        contentEncoding ? 'X-File-Size' : 'content-length'
      )
      if (contentLength === null) {
        throw Error('Response size header unavailable')
      }

      const total = parseInt(contentLength, 10)
      let loaded = 0

      return new Response(
        new ReadableStream({
          start (controller) {
            if (response.body === null) {
              throw new Error('response.body is null')
            }
            const reader = response.body.getReader()

            read()
            function read () {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    controller.close()
                    progress(1)
                    return
                  }
                  if (value) {
                    loaded += value.byteLength
                    progress(loaded / total)
                    controller.enqueue(value)
                  }
                  read()
                })
                .catch((error) => {
                  console.error(error)
                  controller.error(error)
                })
            }
          }
        })
      )
    })
    .catch((error) => {
      console.error(error)
    })
}

export interface Kill {
  deaths: number;
  deaths_while_equipped: number;
  kills: number;
  max_distance: number;
  total_distance: number;
}

export interface Player extends Kill {
  username: string;
  // deaths_while_equipped?: number;
}

export interface Weapon extends Kill {
  deaths_while_equipped: number;
}

export interface Server extends Kill {
  host: number;
}

export interface KillData<T extends Kill> {
  data: { [key: string]: Ref<T> };
  progress: Ref<number>;
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
  modInfo: { Mods: [] };
}

// define your typings for the store state
export interface State {
  killData:{
    servers: Ref<Map<string, Ref<KillData<Server>>>>;
    players: Ref<Map<string, Ref<KillData<Player>>>>;
    weapons: Ref<Map<string, Ref<KillData<Weapon>>>>;
    maps: Ref<Map<string, Ref<KillData<Kill>>>>;
    gamemodes: Ref<Map<string, Ref<KillData<Kill>>>>;
  },

  hosts: { [key: number]: string };
  nsServers: NSServer[] | undefined;
  currentFilter: Filter;
}

type StateProperty = keyof State['killData']
type StateType<T extends StateProperty> =
  T extends 'servers' ? Server :
    T extends 'players' ? Player :
      T extends 'weapons' ? Weapon :
        Kill

let serverInterval: number
export const useKillStore = defineStore('kill', {
  state: (): State => ({
    killData: {
      servers: shallowRef(new Map()),
      players: shallowRef(new Map()),
      weapons: shallowRef(new Map()),
      maps: shallowRef(new Map()),
      gamemodes: shallowRef(new Map())
    },

    hosts: {},
    nsServers: undefined,
    currentFilter: new Filter()
  }),
  getters: {
    getList:
      (state) =>
        <T extends StateProperty>(type: T, filters?: Filter): Ref<KillData<StateType<T>>> | undefined => {
          return unref(state.killData[type as keyof typeof state.killData]).get(filters?.toURLSearchParams().toString() ?? '') as Ref<KillData<StateType<T>>>
        },
    getNSServers: (state) => state.nsServers
  },
  actions: {
    fetch <T extends StateProperty> (type:T, filter?:Filter): Ref<KillData<StateType<T>>> {
      let entry = this.getList(type, filter)
      if (entry === undefined) {
        entry = shallowRef<KillData<StateType<T>>>({ data: {}, progress: ref(0) })
        unref(this.$state.killData[type as keyof typeof this.$state.killData] as Map<string, Ref<KillData<StateType<T>>>>).set(filter?.toURLSearchParams().toString() ?? '', entry)
        // console.log(isRef(entry), this.$state.killData)
      }
      fetchWithLoading(
        `https://toneapi.ovh/v2/client/${type}?` +
            filter?.toURLSearchParams() ?? '',
        (progress) => {
          if (entry && progress !== 1 && unref(entry).progress.value !== 1) {
            unref(entry).progress.value = progress
            triggerRef(unref(entry).progress)
          }
        }
      ).then(async (response) => {
        if (entry) {
          entry.value.data = Object.fromEntries(
            Object.entries(await response?.json()).map<[string, Ref<StateType<T>>]>((e) => [
              e[0],
              ref(e[1]) as Ref<StateType<T>>
            ])
          )
          unref(entry).progress.value = 1

          triggerRef(entry)
        }
      })
      return entry
    },
    fetchNSServers () {
      fetch('https://northstar.tf/client/servers').then(async (response) => {
        this.nsServers = await response.json()
      })
      clearInterval(serverInterval)
      serverInterval = setInterval(() => this.fetchNSServers(), 60000)
      return this.nsServers || []
    },
    setFilter (filter: Filter) {
      if (this.currentFilter.player === filter.player) {
        const newfilter = new Filter(filter)
        delete newfilter.player
        this.fetch('players', newfilter)
      }

      if (this.currentFilter.weapon === filter.weapon) {
        const newfilter = new Filter(filter)
        delete newfilter.weapon
        this.fetch('weapons', newfilter)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const { server: _server, ...withoutServer } = filter
      // if (this.currentFilter.server === _server) { this.fetchServers(withoutServer) }
      this.currentFilter = filter
    }
  }
})
