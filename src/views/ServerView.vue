<template>
    <div id="filters">

    </div>

    <VirtualList :list="serverList" :row-height="100" v-slot="slotProps">
        <div
            :class="'serverRow ' + (!nsServersByName[slotProps.data.name] ? 'offline ' : ' ') + (!nsServersByName[slotProps.data.name]?.playerCount ? 'inactive' : '')">
            <div><span>{{ slotProps.index + 1 }}</span></div>
            <div><span>{{ slotProps.data.name }}</span></div>
            <div><span>{{ slotProps.data._value.kills }}</span></div>
            <div><span>{{ slotProps.data._value.max_distance }}</span></div>
            <div><span>{{ Math.round(((slotProps.data._value.total_distance / slotProps.data._value.kills) || 0) * 100) /
                100 }}</span></div>
            <img v-if="nsServersByName[slotProps.data.name]"
                :src="`${publicPath}maps/${nsServersByName[slotProps.data.name].map}_lobby.png`" />
        </div>
        <!-- <div :class="(!nsServersByName[slotProps.data.servername] ? 'offline ' : ' ') + (!nsServersByName[slotProps.data.servername]?.playerCount ? 'inactive' : '')">
            {{ slotProps.data.servername }} {{ slotProps.data.value.kills }} {{ nsServersByName[slotProps.data.servername] ? nsServersByName[slotProps.data.servername]?.playerCount +'/'+nsServersByName[slotProps.data.servername]?.maxPlayers : ''}}
            <img v-if="nsServersByName[slotProps.data.servername]" :src="`${publicPath}maps/${nsServersByName[slotProps.data.servername].map}_lobby.png`"/>
        </div> -->
    </VirtualList>
    <div>

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
      return Object.entries(this.servers).map(e => ({ ...e[1], name: e[0] }))
    },
    nsServers (): NSServer[] {
      const data = this.store.getNSServers
      if (!data) {
        return this.store.fetchNSServers()
      }
      console.log(data)
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
    color: var(--current-line);
}

.serverRow,
.serverHeaders {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 5ch 20ch 6ch 6ch 6ch 10ch 1fr;
    background: var(--bg-color);
    text-align: left;
    cursor: pointer;
    margin: 0;
    /* border: 2px solid transparent; */
    transition: border .25s;
    height: 100px;
}

.serverRow:nth-child(2n+1) {
    background: var(--accent);
}

.serverRow:nth-child(2n) {
    background: var(--bg-color);
}

.serverRow:hover {
    background: var(--current-line);
}

img {
    object-fit: contain;
    height:100%
}</style>
