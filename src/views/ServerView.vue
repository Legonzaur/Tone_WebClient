<template>
  <div id="filters">

  </div>
  <div class="serverView">
    <div class="serverList">
      <div class="serverHeaders">
        <span></span>
        <span>Map</span>
        <span>Server name</span>
        <span>Players</span>
        <span>Kills</span>
        <span>Max distance</span>
        <span>Average distance</span>
      </div>
      <VirtualList :list="serverList" :row-height="100" v-slot="slotProps">
        <div
          :class="'serverRow ' + (!nsServersByName[slotProps.data.name] ? 'offline ' : '') + (!nsServersByName[slotProps.data.name]?.playerCount ? 'inactive ' : '') + ((slotProps.index + 1) % 2 ? 'odd ' : 'uneven ')">
          <div><span>{{ slotProps.index + 1 }}</span></div>
          <img v-if="nsServersByName[slotProps.data.name]"
            :src="`${publicPath}maps/${nsServersByName[slotProps.data.name].map}_lobby.png`" />
            <div v-if="!nsServersByName[slotProps.data.name]"></div>
          <div><span>{{ slotProps.data.name + (!nsServersByName[slotProps.data.name] ? ' (offline)' : '') }}</span></div>
          <div><span>{{ nsServersByName[slotProps.data.name] ? nsServersByName[slotProps.data.name]?.playerCount
            + '/' + nsServersByName[slotProps.data.name]?.maxPlayers : '' }}</span></div>
          <div><span>{{ slotProps.data._value.deaths }}</span></div>
          <div><span>{{ slotProps.data._value.max_distance }}</span></div>
          <div><span>{{ Math.round(((slotProps.data._value.total_distance / slotProps.data._value.kills) || 0) * 100) /
            100 }}</span></div>

        </div>
      </VirtualList>
    </div>
  </div>
</template>

<script lang="ts">
import { NSServer, Server, useKillStore } from '@/stores/kill'
import VirtualList from '@/components/List/VirtualList.vue'
import { Ref, defineComponent, unref } from 'vue'

export default defineComponent({
  name: 'ServerView',
  components: {
    VirtualList
  },
  data () {
    return {
      store: useKillStore(),
      publicPath: process.env.BASE_URL
    }
  },
  computed: {
    servers (): { [key: string]: Ref<Server> } {
      const data = this.store.getServerList({})?.value.data
      if (!data) return unref(this.store.fetchServers({})).data
      return data
    },
    serverList (): (Ref<Server> & { name: string })[] {
      const data = Object.entries(this.servers).map(e => ({ ...e[1], name: e[0] }))
      data.sort((server1, server2) => {
        const a = !this.nsServersByName[server1.name] ? -1 : this.nsServersByName[server1.name].playerCount ? 1 : 0
        const b = !this.nsServersByName[server2.name] ? -1 : this.nsServersByName[server2.name].playerCount ? 1 : 0
        return b - a
      })
      return data
    },
    nsServers (): NSServer[] {
      const data = this.store.getNSServers
      if (!data) {
        return this.store.fetchNSServers()
      }
      return data
    },
    nsServersByName (): { [key: string]: NSServer } {
      return Object.fromEntries(this.nsServers.map(e => [e.name, e]))
    }
  }

})
</script>

<style scoped>
.inactive {
  color: var(--comment);
}

.offline {
  color: var(--comment);
}
.serverView{
  margin: 0 1rem 1rem 1rem;
  overflow:auto;
}
.serverList {
  overflow-y: auto;
  height: 100%;
}

.serverRow,
.serverHeaders {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 4ch 178px 20ch 8ch 8ch 8ch 1fr;
  background: var(--bg-color);
  text-align: left;
  cursor: pointer;
  margin: 0;
  /* border: 2px solid transparent; */
  transition: border .25s;
  height: 100px;
}

.serverHeaders {
  height: 3em;
  background: var(--current-line);
}
.serverHeaders > span {
  padding: .5em .8em 0 .25em;
}

.serverRow.odd {
  background: var(--accent);
}

.serverRow.uneven {
  background: var(--bg-color);
}

.serverRow:hover {
  background: var(--current-line);
}

.serverRow>div{
  padding: .5em .8em 0 .25em;
}
.serverRow>div:not(:last-child){
  border-right: solid var(--bg-color) 2px;
}

img {
  object-fit: contain;
  height: 100%;
}</style>
