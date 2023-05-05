(function(){"use strict";var e={3699:function(e,t,a){var r=a(3862),i=a(4870),s=a(3396);const l=(0,s.uE)('<div class="navbar-logo"><a href="https://github.com/Legonzaur/Tone_WebClient" target="_blank"><img src="/tone_icon.png"></a></div><div class="navbar-element github-link"><a href="https://github.com/Legonzaur/Tone_WebClient" target="_blank">Github</a></div><div class="navbar-element github-link"><a href="https://github.com/Legonzaur/ToneAPI_servermod" target="_blank">Northstar Server Mod</a></div><div class="spacer"></div>',4);function n(e,t,a,r,i,n){const o=(0,s.up)("router-link"),d=(0,s.up)("router-view");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("header",null,[(0,s._)("nav",null,[l,(0,s.Wm)(o,{to:"/",class:"navbar-element"},{default:(0,s.w5)((()=>[(0,s.Uk)("Players")])),_:1})])]),(0,s.Wm)(d)],64)}var o=(0,s.aZ)({}),d=a(89);const h=(0,d.Z)(o,[["render",n]]);var p=h,u=a(2483);const c={id:"filters"},g={class:"multiselect-wrapper"},m=["disabled"],_={class:"multiselect-wrapper"},v=["disabled"],y={class:"multiselect-wrapper"},f=["disabled"],w={id:"playerView"};function b(e,t,a,r,i,l){const n=(0,s.up)("VueMultiselect"),o=(0,s.up)("PlayerList"),d=(0,s.up)("PlayerChart"),h=(0,s.up)("WeaponChart");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("div",c,[(0,s._)("span",g,[(0,s.Wm)(n,{selectLabel:"",deselectLabel:"remove",placeholder:"Select server",modelValue:e.model.server,"onUpdate:modelValue":t[0]||(t[0]=t=>e.model.server=t),options:e.sortedServerList,"allow-empty":!0},null,8,["modelValue","options"]),(0,s._)("button",{onClick:t[1]||(t[1]=t=>e.model.server=void 0),disabled:!e.model.server},"X",8,m)]),(0,s._)("span",_,[(0,s.Wm)(n,{selectLabel:"",deselectLabel:"remove",placeholder:"Select weapon",modelValue:e.model.weapon,"onUpdate:modelValue":t[2]||(t[2]=t=>e.model.weapon=t),"custom-label":t=>e.weaponLocale[t]||t,options:e.sortedWeaponList,"allow-empty":!0},null,8,["modelValue","custom-label","options"]),(0,s._)("button",{onClick:t[3]||(t[3]=t=>e.model.weapon=void 0),disabled:!e.model.weapon},"X",8,v)]),(0,s._)("span",y,[(0,s.Wm)(n,{"options-limit":20,selectLabel:"",deselectLabel:"remove",placeholder:"Search player",modelValue:e.playerHighlighted,"onUpdate:modelValue":t[4]||(t[4]=t=>e.playerHighlighted=t),options:e.sortedPlayerList,"allow-empty":!0,"custom-label":e=>e?.username},null,8,["modelValue","options","custom-label"]),(0,s._)("button",{onClick:t[5]||(t[5]=t=>e.playerHighlighted=void 0),disabled:!e.playerHighlighted},"X",8,f)])]),(0,s._)("div",w,[(0,s.Wm)(o,{filters:e.filters,onHighlightPlayer:e.highlight_player,playerHighlighted:e.playerHighlighted?.id},null,8,["filters","onHighlightPlayer","playerHighlighted"]),(0,s.Wm)(d,{filters:e.filters,onHighlightPlayer:e.highlight_player,playerHighlighted:e.playerHighlighted?.id},null,8,["filters","onHighlightPlayer","playerHighlighted"]),(0,s.Wm)(h,{filters:{player:e.playerHighlighted?.id,...e.filters},playerHighlighted:e.playerHighlighted?.id},null,8,["filters","playerHighlighted"])])],64)}a(7658);var k=a(1020),S=a(5130);function x(e){return Object.fromEntries(Object.entries(e).filter((e=>void 0!==e[1]&&null!==e[1])))}function L(e,t){try{return e=x(e),t=x(t),S.deepStrictEqual(e,t),!0}catch{return!1}}const P=(0,k.Q_)("kill",{state:()=>({servers:[],players:[],weapons:[],maps:[],gamemodes:[],hosts:{}}),getters:{getPlayerList:e=>t=>e.players.find((e=>L((0,i.SU)(e).filter,t))),getWeaponList:e=>t=>e.weapons.find((e=>L((0,i.SU)(e).filter,t))),getServerList:e=>t=>e.servers.find((e=>L((0,i.SU)(e).filter,t)))},actions:{fetchPlayers(e){e=x(e);let t=this.players.find((t=>L((0,i.SU)(t).filter,e)));return void 0===t&&(t=(0,i.XI)({filter:e,data:{}}),this.players.push(t)),fetch("https://tone.sleepycat.date/v2/client/players?"+new URLSearchParams(e)).then((async e=>{(0,i.SU)(t).data=Object.fromEntries(Object.entries(await e.json()).map((e=>[e[0],(0,i.iH)(e[1])]))),(0,i.oR)(t)})),t},fetchWeapons(e){e=x(e);let t=this.weapons.find((t=>L((0,i.SU)(t).filter,e)));return t||(t=(0,i.XI)({filter:e,data:{}}),this.weapons.push(t)),fetch("https://tone.sleepycat.date/v2/client/weapons?"+new URLSearchParams(e)).then((async e=>{(0,i.SU)(t).data=Object.fromEntries(Object.entries(await e.json()).map((e=>[e[0],(0,i.iH)(e[1])]))),(0,i.oR)(t)})),t},fetchServers(e){e=x(e);let t=this.servers.find((t=>L((0,i.SU)(t).filter,e)));return t||(t=(0,i.XI)({filter:e,data:{}}),this.servers.push(t)),fetch("https://tone.sleepycat.date/v2/client/servers?"+new URLSearchParams(e)).then((async e=>{(0,i.SU)(t).data=Object.fromEntries(Object.entries(await e.json()).map((e=>[e[0],(0,i.iH)(e[1])]))),(0,i.oR)(t)})),t}}});var H=a(7139);const C={class:"playerHeaders"},$=(0,s._)("span",null,null,-1);function O(e,t,a,r,i,l){const n=(0,s.up)("VirtualList");return(0,s.wg)(),(0,s.iD)("div",{class:"playerTable",onKeydown:t[7]||(t[7]=(...t)=>e.selectNextPlayer&&e.selectNextPlayer(...t)),tabindex:"0"},[(0,s._)("div",C,[$,(0,s._)("span",{onClick:t[0]||(t[0]=t=>e.updateSort("username")),class:(0,H.C_)("username"==e.sortingData.argument?"selected":"")},"Username",2),(0,s._)("span",{onClick:t[1]||(t[1]=t=>e.updateSort("kills")),class:(0,H.C_)("kills"==e.sortingData.argument?"selected":"")},"K",2),(0,s._)("span",{onClick:t[2]||(t[2]=t=>e.updateSort("deaths")),class:(0,H.C_)("deaths"==e.sortingData.argument?"selected":"")},"D",2),(0,s._)("span",{onClick:t[3]||(t[3]=t=>e.updateSort("k/d")),class:(0,H.C_)("k/d"==e.sortingData.argument?"selected":"")},"K/D",2),(0,s._)("span",{onClick:t[4]||(t[4]=t=>e.updateSort("max_distance")),class:(0,H.C_)("max_distance"==e.sortingData.argument?"selected":"")},"max distance",2),(0,s._)("span",{onClick:t[5]||(t[5]=t=>e.updateSort("avg_distance")),class:(0,H.C_)("avg_distance"==e.sortingData.argument?"selected":"")},"average distance",2)]),(0,s.Wm)(n,{list:e.playerList,"row-height":32,onHighlightPlayer:t[6]||(t[6]=t=>e.$emit("highlightPlayer",t)),highlighted:e.playerHighlighted},null,8,["list","highlighted"])],32)}const V=["onClick"];function W(e,t,a,r,i,l){return(0,s.wg)(),(0,s.iD)("div",{ref:"vlist",class:"vlist",onScroll:t[0]||(t[0]=(...t)=>e.scroll&&e.scroll(...t))},[(0,s._)("div",{ref:"vscroll",class:"vscroll",style:(0,H.j5)(`padding: ${e.vIndex*e.$props.rowHeight}px 0px ${e.list.length*e.$props.rowHeight-e.vIndex*e.$props.rowHeight}px;`)},[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.visibleList,((t,a)=>((0,s.wg)(),(0,s.iD)("div",{class:(0,H.C_)("playerRow "+(t.id===e.$props.highlighted?"selected":"")),key:t.id,onClick:a=>e.$emit("highlightPlayer",t.id),ref_for:!0,ref:"player:"+t.id},[(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(a+1+e.vIndex),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(t.value.username),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(t.value.kills),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(t.value.deaths),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(Math.round(t.value.kills/Math.max(1,t.value.deaths)*100)/100),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(t.value.max_distance),1)]),(0,s._)("div",null,[(0,s._)("span",null,(0,H.zw)(Math.round(100*(t.value.total_distance/t.value.kills||0))/100),1)])],10,V)))),128))],4)],544)}var D=(0,s.aZ)({data(){return{toLoad:10,vlistHeight:0,vIndex:0}},props:{list:{type:Array,default:()=>[]},rowHeight:{type:Number,default:()=>32},highlighted:String},emits:["highlightPlayer"],computed:{visibleList(){return this.list.slice(Math.max(this.vIndex,0),Math.min(this.vIndex+3*this.visibleCount,this.list.length))},visibleCount(){return Math.ceil(this.vlistHeight/this.$props.rowHeight)}},watch:{list(){this.vlistHeight=this.$refs.vlist?.getBoundingClientRect().height||0},highlighted(e){e&&setTimeout((()=>this.$refs.vlist?.scrollBy({top:this.list.findIndex((t=>t.id===e))*this.rowHeight-this.$refs.vlist?.scrollTop-(this.vlistHeight/2-this.$props.rowHeight),behavior:"smooth"})),1)}},methods:{scroll(e){const t=e.target?.scrollTop,a=Math.round(t/this.$props.rowHeight),r=Math.max(0,a-this.visibleCount)<this.vIndex,i=Math.min(this.list.length,a+this.visibleCount)>this.vIndex+2*this.visibleCount;r?this.vIndex=Math.max(0,4*Math.floor((a-this.visibleCount)/4)):i&&(this.vIndex=Math.max(0,4*Math.floor(a/4)))}}});const U=(0,d.Z)(D,[["render",W],["__scopeId","data-v-3b174772"]]);var I=U,M=(0,s.aZ)({components:{VirtualList:I},props:{filters:{type:Object,default:()=>({})},playerHighlighted:String},emits:["highlightPlayer"],data(){return{sortingData:{direction:-1,argument:"kills"},store:P()}},computed:{players(){const{player:e,...t}=this.filters,a=this.store.getPlayerList(t)?.value.data;return a||this.store.fetchPlayers(t).value.data},playerList(){if(!this.players)return[];const e=Object.entries(this.players).map((e=>{const t={},a=new Proxy(e[1],t);return a.id=e[0],a})),t=new Date;if("username"===this.sortingData.argument){const t=new Intl.Collator("en",{numeric:!0,sensitivity:"base"});e.sort(((e,a)=>{const r=e._rawValue,i=a._rawValue;return t.compare(r.username,i.username)}))}else if("k/d"===this.sortingData.argument)e.sort(((e,t)=>{const a=e._rawValue,r=t._rawValue;return a.kills/Math.max(1,a.deaths)-r.kills/Math.max(1,r.deaths)}));else if("avg_distance"===this.sortingData.argument)e.sort(((e,t)=>{const a=e._rawValue,r=t._rawValue;return(a.total_distance/a.kills||0)-(r.total_distance/r.kills||0)}));else{const t=this.sortingData.argument;e.sort(((e,a)=>{const r=e._rawValue,i=a._rawValue;return r[t]-i[t]}))}return console.log("Sorting the player object took + "+((new Date).getTime()-t.getTime())+"ms"),this.sortingData.direction<0&&e.reverse(),e}},watch:{playerHighlighted(e){this.scrollToPlayer(e)},playerList(){this.playerHighlighted&&this.scrollToPlayer(this.playerHighlighted)}},updated(){},methods:{selectNextPlayer(e){const t={Home:-1/0,End:1/0,PageDown:100,PageUp:-100,ArrowUp:-1,ArrowDown:1,ArrowRight:10,ArrowLeft:-10};if(!this.$props.playerHighlighted)return;if(!Object.keys(t).includes(e.key))return;e.preventDefault();const a=this.playerList.findIndex((e=>e.id===this.$props.playerHighlighted));let r=a+t[e.key];r>=this.playerList.length&&(r=this.playerList.length-1),r<0&&(r=0),this.$emit("highlightPlayer",this.playerList[r].id)},updateSort(e){this.sortingData.argument===e?this.sortingData.direction*=-1:this.sortingData.direction=-1,this.sortingData.argument=e},scrollToPlayer(e){const t=this.$refs["player:"+e];setTimeout((function(){t&&t[0]&&t[0].scrollIntoView({behavior:"smooth",block:"center"})}),10)}}});const R=(0,d.Z)(M,[["render",O]]);var j=R;const A={class:"playerChart",ref:"container"};function T(e,t,a,r,i,l){const n=(0,s.up)("Scatter");return(0,s.wg)(),(0,s.iD)("div",A,[(0,s.Wm)(n,{data:e.chart,options:e.chartOptions},null,8,["data","options"])],512)}var E=a(3254),q=a(9152),Z=a(1131),z=a(5866);E.kL.register(E.f$,E.od,E.jn,E.u,E.De,q.Z,Z.Z);var F=(0,s.aZ)({name:"PlayerChart",props:{filters:Object,playerHighlighted:String},data:()=>({store:P(),refreshColors:0,playerData:[]}),emits:["highlightPlayer"],components:{Scatter:z.bp},mounted(){this.refreshColors++},computed:{playerList(){const e=this.store.getPlayerList(this.filters||{})?.value.data;if(!e)return Object.entries(this.store.fetchPlayers(this.filters||{}).value.data).map((e=>({id:e[0],...(0,i.IU)(e[1].value)})));const t=Object.entries(e).map((e=>({id:e[0],...(0,i.IU)(e[1].value)})));return t.sort(((e,t)=>t.kills-e.kills)),t.slice(0,200)},colors(){this.refreshColors;const e={};if(this.$refs.container){const t=getComputedStyle(this.$refs.container);e.fg=t.getPropertyValue("--foreground"),e.bg=t.getPropertyValue("--bg-color"),e.orange=t.getPropertyValue("--orange"),e.cyan=t.getPropertyValue("--cyan"),e.currentLine=t.getPropertyValue("--current-line")}else e.fg="#ffffff";return e},chart(){const e=this.playerList.findIndex((e=>e.id===this.$props.playerHighlighted)),t=this.colors.cyan,a=new Array(this.playerList.length).fill(t);a[e]=this.colors.orange;const r=a,i=new Array(this.playerList.length).fill(1);i[e]=20;const s=new Array(this.playerList.length).fill(4);s[e]=30;const l=new Array(this.playerList.length).fill("circle");return l[e]="crossRot",{datasets:[{label:"Players",labels:this.playerList.map((e=>e.id))||[],borderColor:a,backgroundColor:r,pointRadius:i,pointStyle:l,hoverRadius:s,data:this.playerList.map((e=>({y:e.kills,x:e.deaths})))}]}},chartStaticOptions(){return{responsive:!0,maintainAspectRatio:!1,animation:{duration:500},layout:{autoPadding:!1},scales:{y:{title:{text:"Kills",display:!0,color:this.colors.fg},ticks:{color:this.colors.fg}},x:{title:{text:"Deaths",display:!0,color:this.colors.fg},ticks:{color:this.colors.fg}}},onClick:(e,t)=>{this.$emit("highlightPlayer",t.length>0?this.playerList[t[0].index].id:void 0),void 0!==this.store.getPlayerList(this.filters||{})&&(0,i.oR)(this.store.getPlayerList(this.filters||{}))},onHover:(e,t)=>{e.native.target&&(e.native.target.style.cursor=t[0]?"pointer":"default")}}},chartStaticPlugins(){let e=0,t=0;if(this.playerList){const a=Math.max(...this.playerList.map((e=>e.deaths))),r=Math.max(...this.playerList.map((e=>e.kills)));r>a?(e=a,t=a/r*r):(t=r,e=r/a*a)}return{tooltip:{callbacks:{label:e=>{let t;return t=this.playerList?this.playerList[e.dataIndex].username:e.dataset.labels[e.dataIndex],t+=" ("+e.parsed.y+" kills "+e.parsed.x+" deaths)",t}}},annotation:{annotations:{line:{type:"line",yMin:0,xMin:0,yMax:t,xMax:e,borderWidth:2,borderColor:this.colors.orange,borderDash:[1,5]}}},legend:{display:!1}}},chartOptions(){return this.$props.playerHighlighted,{...this.chartStaticOptions,plugins:{...this.chartStaticPlugins,datalabels:{formatter:(e,t)=>this.playerList[t.dataIndex].username,backgroundColor:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerList[e.dataIndex].id?this.colors.orange:null,borderColor:this.colors.fg,borderWidth:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerList[e.dataIndex].id?1:0,borderRadius:5,display:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerList[e.dataIndex].id?"true":"auto",align:-45,anchor:"end",clamp:!0,color:e=>this.$props.playerHighlighted&&this.$props.playerHighlighted===this.playerList[e.dataIndex].id?this.colors.bg:this.colors.fg}}}}}});const N=(0,d.Z)(F,[["render",T],["__scopeId","data-v-e83d63ce"]]);var B=N;const G={class:"weaponChart",ref:"container"};function K(e,t,a,r,i,l){const n=(0,s.up)("Doughnut");return(0,s.wg)(),(0,s.iD)("div",G,[(0,s.Wm)(n,{data:e.chart,options:e.chartOptions},null,8,["data","options"])],512)}var X=JSON.parse('{"rodeo_battery_removal":"Rodeo Battery Removal","human_execution":"Human Execution","melee_pilot_kunai":"Kunai Melee","execution":"Execution","mp_weapon_car":"CAR","mp_weapon_defender":"Charge Rifle","mp_weapon_doubletake":"Double Take","mp_weapon_epg":"EPG-1","mp_weapon_hemlok_smg":"Volt","mp_weapon_lstar":"L-STAR","mp_weapon_r97":"R-97","mp_weapon_rspn101":"R-201","mp_weapon_smart_pistol":"Smart Pistol","mp_weapon_sniper":"Kraber","mp_weapon_vinson":"Flatline","mp_weapon_autopistol":"RE-45 auto","mp_weapon_alternator_smg":"Alternator","mp_weapon_frag_grenade":"Frag Grenade","mp_weapon_g2":"G2","mp_weapon_lmg":"Spitfire","mp_weapon_smr":"Sidewinder SMR","mp_weapon_softball":"Softball","mp_weapon_thermite_grenade":"Firestar","pilot_emptyhanded":"Melee","mp_weapon_mastiff":"Mastiff","mp_weapon_mgl":"MGL","mp_weapon_rspn101_og":"R-101","mp_weapon_wingman":"Wingman","invalid":"invalid","mp_weapon_arc_launcher":"Thunderbolt","mp_weapon_dmr":"DMR","mp_weapon_grenade_electric_smoke":"Electric Smoke","mp_weapon_pulse_lmg":"Cold War","mp_weapon_satchel":"Satchel","mp_weapon_shotgun":"EVA-8 Auto","mp_weapon_shotgun_pistol":"Mozambique","mp_weapon_wingman_n":"Wingman Elite","mp_weapon_grenade_gravity":"Gravity Star","mp_weapon_grenade_sonar":"Pulse Blade","mp_weapon_rocket_launcher":"Archer","outOfBounds":"OutOfBounds","mind_crime":"Mind Crime","mp_weapon_esaw":"Devotion","fall":"Fall","mp_weapon_semipistol":"P2016","mp_weapon_grenade_emp":"Arc Grenade","mp_weapon_hemlok":"Hemlok","melee_pilot_emptyhanded":"Melee","phase_shift":"Phase Shift","damagedef_suicide":"Suicide","damagedef_titan_hotdrop":"Crushed by Titanfall","mp_titanweapon_arc_cannon":"Arc Cannon","mp_weapon_peacekraber":"Peacekraber","damagedef_crush":"Crushed","mp_titanweapon_brute4_quad_rocket":"Quad Rocket Launcher","mp_weapon_turretplasma":"Antititan Turret","mp_titanweapon_xo16_vanguard":"XO-16","mp_titanweapon_sticky_40mm":"40mm Cannon","mp_titanweapon_predator_cannon":"Predator Cannon","mp_titanweapon_leadwall":"Leadwall","mp_titanweapon_sniper":"Plasma Railgun","titan_execution":"Titan Execution","titan_explosion":"Titan Explosion","auto_titan_melee":"Autotitan Melee","mp_titanweapon_vortex_shield_ion":"Vortex Shield","mp_titanweapon_heat_shield":"Heat shield","bubble_shield":"Bubble Shield","mp_titancore_salvo_core":"Salvo Core","mp_titancore_flame_wave":"Flame Wave","mp_titanweapon_flightcore_rockets":"Flight Core","mp_titancore_laser_cannon":"Laser Cannon","mp_titancore_flame_wave_secondary":"Scorched Earth","mp_titanweapon_flame_wall":"Flame Wall","mp_titanweapon_arc_wave":"Arc Wave"}');E.kL.register(E.qi,E.u,E.De,Z.Z);var Y=(0,s.aZ)({name:"WeaponChart",props:{filters:Object,playerHighlighted:String},emits:["highlightPlayer"],components:{Doughnut:z.$I},mounted(){this.refreshColors++},data:()=>({store:P(),refreshColors:0}),computed:{colors(){this.refreshColors;const e={};if(this.$refs.container){const t=getComputedStyle(this.$refs.container);e.fg=t.getPropertyValue("--foreground"),e.bg=t.getPropertyValue("--bg-color"),e.orange=t.getPropertyValue("--orange"),e.cyan=t.getPropertyValue("--cyan"),e.yellow=t.getPropertyValue("--yellow"),e.green=t.getPropertyValue("--green"),e.purple=t.getPropertyValue("--purple"),e.red=t.getPropertyValue("--red"),e.pink=t.getPropertyValue("--pink"),e.currentLine=t.getPropertyValue("--current-line")}else e.fg="#ffffff";return e},chart(){const e=["cyan","green","orange","pink","purple","red","yellow"],t={datasets:[{label:"Weapons",labels:this.sortedWeaponList||[],borderColor:()=>this.colors.fg,backgroundColor:t=>this.colors[e[3*t.dataIndex%e.length]],data:[]}]};return this.sortedWeaponList?(t.datasets[0].data=this.sortedWeaponList.map((e=>this.weapons?this.weapons[e].value.kills:0)),t):t},chartOptions(){this.$props.playerHighlighted;const e={responsive:!0,maintainAspectRatio:!0,animation:{duration:500},layout:{autoPadding:!1},plugins:{datalabels:{formatter:(e,t)=>{const a=this.sortedWeaponList[t.dataIndex];return X[a]||a},backgroundColor:e=>e.dataset.backgroundColor(e),borderColor:this.colors.fg,borderRadius:25,borderWidth:2,color:this.colors.bg,display:e=>e.dataIndex===e.dataset.labels.length-1||"auto",padding:6},tooltip:{callbacks:{label:e=>{let t;return t=this.sortedWeaponList?this.sortedWeaponList[e.dataIndex]:e.dataset.labels[e.dataIndex],t+=" ("+this.weapons[t].value.kills+" kills)",t}}}}};return e},weapons(){const{weapon:e,...t}=this.filters||{},a=this.store.getWeaponList(t)?.value.data;return a||this.store.fetchWeapons(t).value.data},sortedWeaponList(){if(!this.weapons)return[];const e=Object.keys(this.weapons).filter((e=>this.weapons[e].value.kills>0));return e.sort(((e,t)=>Number(this.weapons[e].value.kills)<Number(this.weapons[t].value.kills)?-1:Number(this.weapons[e].value.kills)>Number(this.weapons[t].value.kills)?1:0)),e}}});const J=(0,d.Z)(Y,[["render",K],["__scopeId","data-v-54a2c8e6"]]);var Q=J,ee=a(6368),te=(0,s.aZ)({name:"PlayerView",components:{VueMultiselect:ee.ZP,PlayerList:j,PlayerChart:B,WeaponChart:Q},data(){return{model:{server:void 0,weapon:void 0},filters:{},store:P(),playerHighlighted:void 0,weaponLocale:X}},created(){let e;this.applyRouteFilters(),this.$route.query.server&&(e=this.$route.query.server?.toString()),this.model={server:e,weapon:this.$route.query.weapon?.toString()}},computed:{servers(){const{server:e,player:t,...a}=this.filters,r=this.store.getServerList(a)?.value.data;return r||(0,i.SU)(this.store.fetchServers(a)).data},groupedServers(){const e=[];return Object.entries(this.servers).forEach((t=>{const a=(0,i.SU)(t[1]);e.find((e=>e.id===a.host))||e.push({id:a.host,servers:[]}),e.find((e=>e.id===a.host))?.servers.push({name:t[0],...a})})),console.log(e),e},weapons(){const{weapon:e,player:t,...a}=this.filters,r=this.store.getWeaponList(a)?.value.data;return r||this.store.fetchWeapons(a).value.data},players(){const{player:e,...t}=this.filters,a=this.store.getPlayerList(t)?.value.data;return a||this.store.fetchPlayers(t).value.data},sortedWeaponList(){if(!this.weapons)return[];const e=Object.keys(this.weapons);return e.sort()},sortedServerList(){if(!this.servers)return[];const e=Object.keys(this.servers);return e.sort()},sortedPlayerList(){if(!this.players)return[];const e=Object.entries(this.players).map((e=>({id:e[0],...e[1]._rawValue})));return e.sort(((e,t)=>e.username<t.username?-1:e.username>t.username?1:0))}},watch:{players(){const e=this.$route.query.player?.toString();e&&this.playerHighlighted?.id!==e&&this.highlight_player(e)},model:{handler(e){this.filters.server=e.server,this.filters.weapon=e.weapon},deep:!0},filters:{handler(e){const{server:t,weapon:a,...r}=this.$route.query;le.push({query:{...e,...r}})},deep:!0},playerHighlighted(e,t){if(e?.id===t?.id)return;const{player:a,...r}=this.$route.query;le.push({query:{player:e?.id,...r}})},$route(){this.applyRouteFilters()}},methods:{highlight_player(e){const t=this.players[e];this.playerHighlighted=t?{id:e,...(0,i.SU)(t)}:void 0},applyRouteFilters(){if(this.playerHighlighted?.id!==this.$route.query.player){const e=this.$route.query.player?.toString();e&&this.highlight_player(e)}this.filters.weapon!==this.$route.query.weapon&&(this.model.weapon=this.$route.query.weapon?.toString()),this.filters.server!==this.$route.query.server&&(this.$route.query.server?this.model.server=this.$route.query.server?.toString():this.model.server=void 0)}}});const ae=(0,d.Z)(te,[["render",b],["__scopeId","data-v-0c8aa721"]]);var re=ae;const ie=[{path:"/",name:"home",component:re}],se=(0,u.p7)({history:(0,u.PO)("/ToneAPI_webclient/"),routes:ie});var le=se;const ne=(0,k.WB)();(0,r.ri)(p).use(ne).use(le).mount("#app");const oe=P(),de=new WebSocket("wss://tone.sleepycat.date/v2/client/websocket");function he(e){oe.$state.players.filter((t=>(!t.value.filter.server||t.value.filter.server===e.servername)&&(!t.value.filter.weapon||t.value.filter.weapon===e.cause_of_death))).forEach((t=>{t.value.data[e.attacker_id]||(t.value.data[e.attacker_id]=(0,i.iH)({deaths:0,kills:500,max_distance:0,total_distance:0,username:e.attacker_name})),t.value.data[e.victim_id]||(t.value.data[e.victim_id]=(0,i.iH)({deaths:0,kills:0,max_distance:0,total_distance:0,username:e.victim_name})),(0,i.SU)(t.value.data[e.victim_id]).deaths++,(0,i.SU)(t.value.data[e.victim_id]).username=e.victim_name,(0,i.SU)(t.value.data[e.attacker_id]).username=e.attacker_name,e.attacker_id!==e.victim_id&&((0,i.SU)(t.value.data[e.attacker_id]).kills++,(0,i.SU)(t.value.data[e.attacker_id]).total_distance+=e.distance,(0,i.SU)(t.value.data[e.attacker_id]).max_distance=Math.max(e.distance,(0,i.SU)(t.value.data[e.attacker_id]).max_distance))})),oe.$state.weapons.filter((t=>!t.value.filter.player||t.value.filter.player===e.attacker_id)).forEach((t=>{t.value.data[e.cause_of_death]||(t.value.data[e.cause_of_death]=(0,i.iH)({deaths:0,kills:500,max_distance:0,total_distance:0,deaths_while_equipped:0})),e.attacker_id!==e.victim_id&&((0,i.SU)(t.value.data[e.cause_of_death]).kills++,(0,i.SU)(t.value.data[e.cause_of_death]).total_distance+=e.distance,(0,i.SU)(t.value.data[e.cause_of_death]).max_distance=Math.max(e.distance,(0,i.SU)(t.value.data[e.cause_of_death]).max_distance)),(0,i.SU)(t.value.data[e.cause_of_death]).deaths++})),oe.$state.servers.filter((t=>!t.value.filter.server||t.value.filter.server===e.servername)).forEach((t=>{t.value.data[e.servername]||(t.value.data[e.servername]=(0,i.iH)({deaths:0,kills:500,max_distance:0,total_distance:0,deaths_while_equipped:0,host:e.host})),e.attacker_id!==e.victim_id&&((0,i.SU)(t.value.data[e.servername]).kills++,(0,i.SU)(t.value.data[e.servername]).total_distance+=e.distance,(0,i.SU)(t.value.data[e.servername]).max_distance=Math.max(e.distance,(0,i.SU)(t.value.data[e.servername]).max_distance)),(0,i.SU)(t.value.data[e.servername]).deaths++}))}de.onmessage=function(e){if("ping"===e.data)return de.send("pong");const t=JSON.parse(e.data);he(t)}}},t={};function a(r){var i=t[r];if(void 0!==i)return i.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,a),s.exports}a.m=e,function(){var e=[];a.O=function(t,r,i,s){if(!r){var l=1/0;for(h=0;h<e.length;h++){r=e[h][0],i=e[h][1],s=e[h][2];for(var n=!0,o=0;o<r.length;o++)(!1&s||l>=s)&&Object.keys(a.O).every((function(e){return a.O[e](r[o])}))?r.splice(o--,1):(n=!1,s<l&&(l=s));if(n){e.splice(h--,1);var d=i();void 0!==d&&(t=d)}}return t}s=s||0;for(var h=e.length;h>0&&e[h-1][2]>s;h--)e[h]=e[h-1];e[h]=[r,i,s]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={143:0};a.O.j=function(t){return 0===e[t]};var t=function(t,r){var i,s,l=r[0],n=r[1],o=r[2],d=0;if(l.some((function(t){return 0!==e[t]}))){for(i in n)a.o(n,i)&&(a.m[i]=n[i]);if(o)var h=o(a)}for(t&&t(r);d<l.length;d++)s=l[d],a.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return a.O(h)},r=self["webpackChunktoneapi_webclient"]=self["webpackChunktoneapi_webclient"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=a.O(void 0,[998],(function(){return a(3699)}));r=a.O(r)})();
//# sourceMappingURL=app.04e88cb3.js.map