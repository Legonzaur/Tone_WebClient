<template>
    <div id="filters">
    </div>
    <div>
        <div v-for="(server, servername) in servers" v-bind:key="servername" :class="(!nsServersByName[servername] ? 'offline ' : ' ') + (!nsServersByName[servername]?.playerCount ? 'inactive' : '')">
            {{ servername }} {{ server.value.kills }} {{ nsServersByName[servername] ? nsServersByName[servername]?.playerCount +'/'+nsServersByName[servername]?.maxPlayers : ''}}
            <img v-if="nsServersByName[servername]" :src="`/maps/${nsServersByName[servername].map}_lobby.png`"/>
        </div>
    </div>
</template>

<script lang="ts">
import { NSServer, Server, useKillStore } from '@/stores/kill'

import { Ref, defineComponent, unref } from 'vue'

export default defineComponent({
  name: 'ServerView',
  components: {

  },
  data () {
    return {
      store: useKillStore()
    }
  },
  computed: {
    servers (): { [key: string]: Ref<Server> } {
      const data = this.store.getServerList({})?.value.data
      if (!data) return unref(this.store.fetchServers({})).data
      return data
    },
    serverList ():(Ref<Server> & {name:string})[] {
      return Object.entries(this.servers).map(e => ({ ...e[1], name: e[0] }))
    },
    nsServers ():NSServer[] {
      const data = this.store.getNSServers
      if (!data) {
        return this.store.fetchNSServers()
      }
      console.log(data)
      return data
    },
    nsServersByName ():{[key:string]:NSServer} {
      return Object.fromEntries(this.nsServers.map(e => [e.name, e]))
    }
  }

})
</script>

<style scoped>
.inactive{
    color:var(--comment);
}
.offline{
    color: var(--current-line);
}

</style>
