(function(){"use strict";var e={2579:function(e,t,r){var s=r(9242),a=r(3396);const i=(0,a.uE)('<div class="navbar-element">TONE API</div><div class="navbar-element github-link"><a href="https://github.com/Legonzaur/Tone_WebClient">Github</a></div><div class="navbar-element github-link"><a href="https://github.com/Legonzaur/ToneAPI_servermod">Northstar Server Mod</a></div><div class="spacer"></div>',4);function l(e,t){const r=(0,a.up)("router-link"),s=(0,a.up)("router-view");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("header",null,[(0,a._)("nav",null,[i,(0,a.Wm)(r,{to:"/",class:"navbar-element"},{default:(0,a.w5)((()=>[(0,a.Uk)("Players")])),_:1})])]),(0,a.Wm)(s)],64)}var o=r(89);const n={},p=(0,o.Z)(n,[["render",l]]);var h=p,d=r(2483);const c={id:"filters"},g={id:"playerView"};function u(e,t,r,s,i,l){const o=(0,a.up)("VueMultiselect"),n=(0,a.up)("PlayerList"),p=(0,a.up)("PlayerChart"),h=(0,a.up)("WeaponChart");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("div",c,[(0,a.Wm)(o,{selectLabel:"",deselectLabel:"remove",placeholder:"Select server",modelValue:e.models.server,"onUpdate:modelValue":t[0]||(t[0]=t=>e.models.server=t),options:e.servers,"allow-empty":!0,"custom-label":e=>e.name,onSelect:t[1]||(t[1]=t=>e.changeFilter({server:t.id})),onRemove:t[2]||(t[2]=t=>e.changeFilter({server:""}))},null,8,["modelValue","options","custom-label"]),(0,a.Wm)(o,{selectLabel:"",deselectLabel:"remove",placeholder:"Select weapon",modelValue:e.models.weapon,"onUpdate:modelValue":t[3]||(t[3]=t=>e.models.weapon=t),options:e.sortedWeaponList,"allow-empty":!0,onSelect:t[4]||(t[4]=t=>e.changeFilter({weapon:t})),onRemove:t[5]||(t[5]=t=>e.changeFilter({weapon:""}))},null,8,["modelValue","options"]),(0,a.Wm)(o,{selectLabel:"",deselectLabel:"remove",placeholder:"Search player",modelValue:e.playerHighlighted,"onUpdate:modelValue":t[6]||(t[6]=t=>e.playerHighlighted=t),options:e.sortedPlayerList,"allow-empty":!0,"custom-label":t=>e.players[t]?.username},null,8,["modelValue","options","custom-label"])]),(0,a._)("div",g,[(0,a.Wm)(n,{filters:e.filters,onHighlightPlayer:t[7]||(t[7]=t=>e.playerHighlighted=t),playerHighlighted:e.playerHighlighted},null,8,["filters","playerHighlighted"]),(0,a.Wm)(p,{filters:e.filters,onHighlightPlayer:t[8]||(t[8]=t=>e.playerHighlighted=t),playerHighlighted:e.playerHighlighted},null,8,["filters","playerHighlighted"]),(0,a.Wm)(h,{filters:{player:e.playerHighlighted,...e.filters},playerHighlighted:e.playerHighlighted},null,8,["filters","playerHighlighted"])])],64)}r(7658);var y=r(65),f=r(7139);const m=e=>((0,a.dD)("data-v-24acbb0c"),e=e(),(0,a.Cn)(),e),v={class:"playerHeaders"},b=m((()=>(0,a._)("span",null,null,-1))),w=["onClick"];function k(e,t,r,s,i,l){return(0,a.wg)(),(0,a.iD)("div",{class:"playerTable",onKeydown:t[6]||(t[6]=(...t)=>e.selectNextPlayer&&e.selectNextPlayer(...t)),tabindex:"0"},[(0,a._)("div",v,[b,(0,a._)("span",{onClick:t[0]||(t[0]=t=>e.sortPlayerList("username")),class:(0,f.C_)("username"==e.sortingData.argument?"selected":"")},"Username",2),(0,a._)("span",{onClick:t[1]||(t[1]=t=>e.sortPlayerList("kills")),class:(0,f.C_)("kills"==e.sortingData.argument?"selected":"")},"K",2),(0,a._)("span",{onClick:t[2]||(t[2]=t=>e.sortPlayerList("deaths")),class:(0,f.C_)("deaths"==e.sortingData.argument?"selected":"")},"D",2),(0,a._)("span",{onClick:t[3]||(t[3]=t=>e.sortPlayerList("k/d")),class:(0,f.C_)("k/d"==e.sortingData.argument?"selected":"")},"K/D",2),(0,a._)("span",{onClick:t[4]||(t[4]=t=>e.sortPlayerList("max_kill_distance")),class:(0,f.C_)("max_kill_distance"==e.sortingData.argument?"selected":"")},"max distance",2),(0,a._)("span",{onClick:t[5]||(t[5]=t=>e.sortPlayerList("avg_kill_distance")),class:(0,f.C_)("avg_kill_distance"==e.sortingData.argument?"selected":"")},"average distance",2)]),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.playerIdList,((t,r)=>((0,a.wg)(),(0,a.iD)("div",{class:(0,f.C_)("playerRow "+(t===e.$props.playerHighlighted?"selected":"")),key:t,onClick:r=>e.$emit("highlightPlayer",t),ref_for:!0,ref:"player:"+t},[(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(r),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(e.players[t].username),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(e.players[t].kills),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(e.players[t].deaths),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(Math.round(e.players[t].kills/e.players[t].deaths*100)/100),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(e.players[t].max_kill_distance),1)]),(0,a._)("div",null,[(0,a._)("span",null,(0,f.zw)(Math.round(100*e.players[t].avg_kill_distance)/100),1)])],10,w)))),128))],32)}var P=(0,a.aZ)({props:{filters:Object,playerHighlighted:String},emits:["highlightPlayer"],data(){return{sortingData:{direction:-1,argument:"kills"},playerIdList:[],store:(0,y.oR)()}},computed:{players(){return this.store.getters.getPlayerList(this.filters)}},watch:{players:{handler(e){e&&(this.playerIdList=[],this.sortingData.direction*=-1,this.playerIdList=Object.keys(e),this.sortPlayerList(this.sortingData.argument))},immediate:!0},playerHighlighted(e){const t=this.$refs["player:"+e];t[0].scrollIntoView({behavior:"smooth",block:"center"})}},updated(){const e=this.$refs["player:"+this.$props.playerHighlighted];e&&e[0]&&e[0].scrollIntoView({behavior:"smooth",block:"center"})},methods:{sortPlayerList(e){e===this.sortingData.argument?this.sortingData.direction*=-1:"username"===e&&(this.sortingData.direction=1),this.sortingData.argument=e,this.playerIdList.sort(((t,r)=>{if(!this.players)return 0;let s,a;return"k/d"===e?(s=this.players[t].kills/this.players[t].deaths,a=this.players[r].kills/this.players[r].deaths):(s=this.players[t][e],a=this.players[r][e]),s<a?-1*this.sortingData.direction:s>a?1*this.sortingData.direction:0}))},selectNextPlayer(e){const t={Home:-1/0,End:1/0,PageDown:100,PageUp:-100,ArrowUp:-1,ArrowDown:1,ArrowRight:10,ArrowLeft:-10};if(!this.$props.playerHighlighted)return;if(!Object.keys(t).includes(e.key))return;e.preventDefault();const r=this.playerIdList.indexOf(this.$props.playerHighlighted);let s=r+t[e.key];s>=this.playerIdList.length&&(s=this.playerIdList.length-1),s<0&&(s=0),this.$emit("highlightPlayer",this.playerIdList[s])}}});const _=(0,o.Z)(P,[["render",k],["__scopeId","data-v-24acbb0c"]]);var L=_;const H={class:"playerChart",ref:"container"};function C(e,t,r,s,i,l){const o=(0,a.up)("Scatter");return(0,a.wg)(),(0,a.iD)("div",H,[(0,a.Wm)(o,{data:e.chart,options:e.chartOptions},null,8,["data","options"])],512)}var x=r(3254),I=r(9152),D=r(3013),W=r(5866);x.kL.register(x.f$,x.od,x.jn,x.u,x.De,I.Z,D.Z);var O=(0,a.aZ)({name:"PlayerChart",props:{filters:Object,playerHighlighted:String},emits:["highlightPlayer"],components:{Scatter:W.bp},mounted(){this.refreshColors++},computed:{colors(){this.refreshColors;const e={};if(this.$refs.container){const t=getComputedStyle(this.$refs.container);e.fg=t.getPropertyValue("--foreground"),e.bg=t.getPropertyValue("--bg-color"),e.orange=t.getPropertyValue("--orange"),e.cyan=t.getPropertyValue("--cyan"),e.currentLine=t.getPropertyValue("--current-line")}else e.fg="#ffffff";return e},chart(){const e={datasets:[{label:"Players",labels:this.playerIdList||[],borderColor:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.index]?this.colors.orange:this.colors.cyan,backgroundColor:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.index]?this.colors.orange:this.colors.cyan,pointRadius:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.index]?20:1,pointStyle:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.index]?"crossRot":"dot",hoverRadius:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.index]?30:4,data:[]}]};return this.players?(e.datasets[0].data=this.playerIdList.map((e=>this.players?{x:this.players[e].deaths,y:this.players[e].kills}:{x:0,y:0})),e):e},chartOptions(){this.$props.playerHighlighted;const e={responsive:!0,maintainAspectRatio:!0,animation:{duration:500},layout:{autoPadding:!1},scales:{y:{title:{text:"Kills",display:!0,color:this.colors.fg},ticks:{color:this.colors.fg}},x:{title:{text:"Deaths",display:!0,color:this.colors.fg},ticks:{color:this.colors.fg}}},plugins:{tooltip:{callbacks:{label:e=>{let t;return t=this.players?this.players[e.dataset.labels[e.dataIndex]].username:e.dataset.labels[e.dataIndex],t+=" ("+e.parsed.y+" kills "+e.parsed.x+" deaths)",t}}},annotation:{},legend:{display:!1},datalabels:{formatter:(e,t)=>this.players[this.playerIdList[t.dataIndex]].username,backgroundColor:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.dataIndex]?this.colors.orange:null,borderColor:this.colors.fg,borderWidth:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.dataIndex]?1:0,borderRadius:5,display:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.dataIndex]?"true":"auto",align:"-45",anchor:"end",clamp:!0,color:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerIdList[e.dataIndex]?this.colors.bg:this.colors.fg}},onClick:(e,t)=>{this.$emit("highlightPlayer",t.length>0?this.playerIdList[t[0].index]:void 0)},onHover:(e,t)=>{e.native.target&&(e.native.target.style.cursor=t[0]?"pointer":"default")}};if(!this.players)return e;const t=Math.max(...Object.values(this.players).map((e=>e.deaths))),r=Math.max(...Object.values(this.players).map((e=>e.kills)));let s,a;return r>t?(s=t,a=t/r*r):(a=r,s=r/t*t),e.plugins.annotation={annotations:{line:{type:"line",yMin:0,xMin:0,yMax:a,xMax:s,borderWidth:2,borderColor:this.colors.orange,borderDash:[1,5]}}},e},players(){return this.store.getters.getPlayerList(this.filters)||{}},playerIdList(){return Object.keys(this.players)}},data(){return{store:(0,y.oR)(),refreshColors:0}}});const $=(0,o.Z)(O,[["render",C],["__scopeId","data-v-4e740fcc"]]);var V=$;const S={class:"weaponChart",ref:"container"};function j(e,t,r,s,i,l){const o=(0,a.up)("Doughnut");return(0,a.wg)(),(0,a.iD)("div",S,[(0,a.Wm)(o,{data:e.chart,options:e.chartOptions},null,8,["data","options"])],512)}x.kL.register(x.qi,x.u,x.De,D.Z);var R=(0,a.aZ)({name:"PlayerChart",props:{filters:Object,playerHighlighted:String},emits:["highlightPlayer"],components:{Doughnut:W.$I},mounted(){this.refreshColors++},computed:{colors(){this.refreshColors;const e={};if(this.$refs.container){const t=getComputedStyle(this.$refs.container);e.fg=t.getPropertyValue("--foreground"),e.bg=t.getPropertyValue("--bg-color"),e.orange=t.getPropertyValue("--orange"),e.cyan=t.getPropertyValue("--cyan"),e.yellow=t.getPropertyValue("--yellow"),e.green=t.getPropertyValue("--green"),e.purple=t.getPropertyValue("--purple"),e.red=t.getPropertyValue("--red"),e.pink=t.getPropertyValue("--pink"),e.currentLine=t.getPropertyValue("--current-line")}else e.fg="#ffffff";return e},chart(){const e=["cyan","green","orange","pink","purple","red","yellow"],t={datasets:[{label:"Weapons",labels:this.sortedWeaponList||[],borderColor:e=>this.colors.fg,backgroundColor:t=>this.colors[e[3*t.dataIndex%e.length]],data:[]}]};return this.sortedWeaponList?(t.datasets[0].data=this.sortedWeaponList.map((e=>this.weapons?this.weapons[e].kills:0)),t):t},chartOptions(){this.$props.playerHighlighted;const e={responsive:!0,maintainAspectRatio:!0,animation:{duration:500},layout:{autoPadding:!1},plugins:{datalabels:{formatter:(e,t)=>this.sortedWeaponList[t.dataIndex],backgroundColor:e=>e.dataset.backgroundColor(e),borderColor:this.colors.fg,borderRadius:25,borderWidth:2,color:this.colors.bg,display:e=>e.dataIndex===e.dataset.labels.length-1||"auto",font:{weight:"bold"},padding:6},tooltip:{callbacks:{label:e=>{let t;return t=this.sortedWeaponList?this.sortedWeaponList[e.dataIndex]:e.dataset.labels[e.dataIndex],t+=" ("+this.weapons[t].kills+" kills)",t}}}}};return e},weapons(){return this.store.getters.getWeaponList(this.filters)},sortedWeaponList(){if(!this.weapons)return[];const e=Object.keys(this.weapons);return e.sort(((e,t)=>Number(this.weapons[e].kills)<Number(this.weapons[t].kills)?-1:Number(this.weapons[e].kills)>Number(this.weapons[t].kills)?1:0)),e}},data(){return{store:(0,y.oR)(),refreshColors:0}}});const N=(0,o.Z)(R,[["render",j],["__scopeId","data-v-7081590e"]]);var M=N,Z=r(6368),z=(0,a.aZ)({name:"PlayerView",components:{PlayerList:L,PlayerChart:V,VueMultiselect:Z.ZP,WeaponChart:M},data(){return{models:{},filters:{minKills:100,minDeaths:100},store:(0,y.oR)(),playerHighlighted:void 0}},computed:{servers(){return this.store.state.servers},weapons(){return this.store.getters.getWeaponList(this.filters)},sortedWeaponList(){if(!this.weapons)return[];const e=Object.keys(this.weapons);return e.sort()},players(){return this.store.getters.getPlayerList(this.filters)},sortedPlayerList(){if(!this.players)return[];const e=Object.keys(this.players);return e.sort(((e,t)=>this.players?this.players[e].username<this.players[t].username?-1:this.players[e].username>this.players[t].username?1:0:0))}},watch:{playerHighlighted:function(e){this.fetchPlayerData({player:e,...this.filters})}},methods:{async fetchPlayerData({player:e,server:t}){if(!this.store.getters.getWeaponList({player:e,server:t}))return await this.store.dispatch("fetchWeapons",{player:e,server:t})},async changeFilter({weapon:e,server:t}){const r=JSON.parse(JSON.stringify(this.filters));void 0!==e&&(r.weapon=e),void 0!==t&&(r.server=t),""===e&&delete r.weapon,""===t&&delete r.server;const s=[];this.store.getters.getPlayerList(r)||s.push(this.store.dispatch("fetchPlayers",r)),this.store.getters.getWeaponList(r)||s.push(this.store.dispatch("fetchWeapons",r)),s.push(this.fetchPlayerData({player:this.playerHighlighted,...r})),await Promise.all(s),this.filters=r}}});const U=(0,o.Z)(z,[["render",u],["__scopeId","data-v-ac04060e"]]);var A=U;const T=[{path:"/",name:"home",component:A}],K=(0,d.p7)({history:(0,d.PO)("/Tone_WebClient/"),routes:T});var E=K;Symbol();var F=(0,y.MT)({state:{servers:[],players:{},weapons:{}},getters:{getPlayerList:e=>({server:t,weapon:r,minKills:s,minDeaths:a})=>{let i=[];return e.players[""]&&(i=Object.entries(e.players[""]).filter((([,e])=>e.kills>=s||e.deaths>=a)).map((e=>e[0]))),i.length>0&&e.players[(t||"")+(r||"")]?Object.fromEntries(Object.entries(e.players[(t||"")+(r||"")]).filter((([e])=>i.includes(e)))):e.players[(t||"")+(r||"")]},getWeaponList:e=>({server:t,player:r})=>e.weapons[(t||"")+(r||"")]},mutations:{setPlayers(e,t){e.players[(t.filters.server||"")+(t.filters.weapon||"")]=t.data},setWeapons(e,t){e.weapons[(t.filters.server||"")+(t.filters.player||"")]=t.data},setServers(e,t){e.servers=t}},actions:{async fetchPlayers(e,{weapon:t,server:r}){const s={};t?.toString()&&(s.weapon=t),r?.toString()&&(s.server=r);const a=await fetch("https://tone.sleepycat.date/v1/client/players?"+new URLSearchParams(s)),i=await a.json();Object.keys(i).forEach((e=>{i[e].kills=Number(i[e].kills),i[e].deaths=Number(i[e].deaths),i[e].max_kill_distance=Number(i[e].max_kill_distance),i[e].avg_kill_distance=Number(i[e].avg_kill_distance)})),e.commit("setPlayers",{data:i,filters:{weapon:t,server:r}})},async fetchWeapons(e,{player:t,server:r}){const s={};t?.toString()&&(s.player=t),r?.toString()&&(s.server=r);const a=await fetch("https://tone.sleepycat.date/v1/client/weapons?"+new URLSearchParams(s)),i=await a.json();e.commit("setWeapons",{data:i,filters:{player:t,server:r}})},async fetchServers(e){const t=await fetch("https://tone.sleepycat.date/v1/client/servers"),r=await t.json();e.commit("setServers",r)}},modules:{}});(0,s.ri)(h).use(F).use(E).mount("#app"),F.dispatch("fetchServers",{}),F.dispatch("fetchPlayers",{}),F.dispatch("fetchWeapons",{})}},t={};function r(s){var a=t[s];if(void 0!==a)return a.exports;var i=t[s]={exports:{}};return e[s](i,i.exports,r),i.exports}r.m=e,function(){var e=[];r.O=function(t,s,a,i){if(!s){var l=1/0;for(h=0;h<e.length;h++){s=e[h][0],a=e[h][1],i=e[h][2];for(var o=!0,n=0;n<s.length;n++)(!1&i||l>=i)&&Object.keys(r.O).every((function(e){return r.O[e](s[n])}))?s.splice(n--,1):(o=!1,i<l&&(l=i));if(o){e.splice(h--,1);var p=a();void 0!==p&&(t=p)}}return t}i=i||0;for(var h=e.length;h>0&&e[h-1][2]>i;h--)e[h]=e[h-1];e[h]=[s,a,i]}}(),function(){r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,{a:t}),t}}(),function(){r.d=function(e,t){for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={143:0};r.O.j=function(t){return 0===e[t]};var t=function(t,s){var a,i,l=s[0],o=s[1],n=s[2],p=0;if(l.some((function(t){return 0!==e[t]}))){for(a in o)r.o(o,a)&&(r.m[a]=o[a]);if(n)var h=n(r)}for(t&&t(s);p<l.length;p++)i=l[p],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(h)},s=self["webpackChunktoneapi_webclient"]=self["webpackChunktoneapi_webclient"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=r.O(void 0,[998],(function(){return r(2579)}));s=r.O(s)})();
//# sourceMappingURL=app.29dc9867.js.map