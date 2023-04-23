<template>
  <header>
    <nav>
      <!-- <div class="navbar-element">hamburger</div> -->
      <div class="navbar-element"><!--<span>logo&nbsp;</span>--->TONE&nbsp;API</div>
      <div class="navbar-element github-link"><a href="https://github.com/Legonzaur/Tone_WebClient">Github</a></div>
      <div class="navbar-element github-link"><a
          href="https://github.com/Legonzaur/ToneAPI_servermod">Northstar&nbsp;Server&nbsp;Mod</a></div>
      <div class="spacer"></div>
      <!-- <router-link to="/" class="navbar-element">Home</router-link>
      <router-link to="/about" class="navbar-element">About</router-link> -->
      <router-link to="/" class="navbar-element">Players</router-link>
    </nav>
  </header>
  <router-view />
</template>

<script lang="ts">
import { Player, Weapon, Server, useKillStore } from '@/stores/kill'
import { defineComponent } from 'vue'

export default defineComponent({
  setup (props, ctx) {
    const store = useKillStore()
    store.fetchPlayers({})
    store.fetchServers({})
    store.fetchWeapons({})
  }
})
</script>

<style>
:root {
  --bg-color: #282a36;
  --accent: #353744;
  --current-line: #44475a;
  --comment: #6272a4;
  --foreground: #f8f8f2;
  --orange: #ffb86c;
  --cyan: #8be9fd;
  --green: #50fa7b;
  --pink: #ff79c6;
  --purple: #bd93f9;
  --red: #ff5555;
  --yellow: #f1fa8c;
}

body {
  background: var(--bg-color);
  margin: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  font-family: 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--foreground);
  display: grid;
  grid-template-areas:
    'header  header'
    'filters body '
    'stats   body '
    'footer  body ';
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto 1fr auto auto;
}

@media only screen and (max-width: 922px) {
  #app {
    grid-template-areas:
      'header  header'
      'filters filters'
      'body body ';
    grid-template-rows: auto auto 1fr;
  }
}

@media only screen and (max-width: 600px) {
  .github-link{
    display:none;
  }
}

header {
  grid-area: header;
  height: 64px;
  background: var(--bg-color);
  color: var(--foreground);
}

nav {
  display: flex;
  flex-direction: row;
  text-align: center;
  vertical-align: middle;
}

nav a {
  font-weight: bold;
  color: var(--foreground);
}

nav a.router-link-exact-active {
  color: var(--orange);
}

.navbar-element {
  text-align: center;
  line-height: 16px;
  padding: 24px 32px;
}

.navbar-element:hover {
  background: var(--current-line)
}

.spacer {
  width: 100%;
}
</style>
