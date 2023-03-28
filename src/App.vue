<template>
  <header>
    <nav>
      <!-- <div class="navbar-element">hamburger</div> -->
      <div class="navbar-element"><span>logo&nbsp;</span>TONE&nbsp;API</div>
      <div class="spacer"></div>
      <router-link to="/" class="navbar-element">Home</router-link>
      <router-link to="/about" class="navbar-element">About</router-link>
      <router-link to="/players" class="navbar-element">Players</router-link>
    </nav>
  </header>
  <router-view />
</template>

<style>
:root {
  --bg-color: #282a36;
  --accent: #353744;
  --current-line: #44475a;
  --comment: #6272a4;
  --foreground: #f8f8f2;
  --orange: #ffb86c;
  --cyan: #8be9fd;
}

body {
  background: var(--bg-color);
  margin: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
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

.spacer {
  width: 100%;
}
</style>
