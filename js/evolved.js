(function () {
  "use strict";
  const bool = (a) => {
    if (a === true || a === "true" || a === 1) return true;
    else if (a === false || a === "false" || a === 0) return false;
    return false;
  };

  const loadDynamicScript = (type, url, callback, scriptID) => {
    const existingScript = document.getElementById(scriptID);
    if (!existingScript) {
      const script = document.createElement(type);
      script.id = scriptID;
      if (type === "script") {
        script.src = url;
        document.body.appendChild(script);
        script.onload = () => {
          if (callback) callback();
        };
      } else if (type === "link") {
        script.rel = "stylesheet";
        script.type = "text/css";
        script.href = url;
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    }
    if (existingScript && callback) callback();
  };

  window.addEventListener("DOMContentLoaded", () => {
    loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css", undefined, 'evolved-css');
    // loadDynamicScript("link", "evolved.css", undefined, "evolved-css");
    loadDynamicScript(
      "script",
      "https://unpkg.com/vue@next",
      VueStart,
      "vue3load"
    );
  });
  loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css", undefined, 'evolved-css');
  loadDynamicScript('script', "https://unpkg.com/vue@next", VueStart, 'vue3load');

  function dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.addEventListener("mousedown", function (e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = function () {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = function (e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      };
    });
  }
  function touchElementMove(elmnt) {
    var startX = 0,
      startY = 0,
      x = 0,
      y = 0;
    elmnt.addEventListener("touchstart", function (e) {
      startX = e.targetTouches[0].pageX;
      startY = e.targetTouches[0].pageY;
      x = this.offsetLeft;
      y = this.offsetTop;
    });
    elmnt.addEventListener("touchmove", function (e) {
      var moveX = e.targetTouches[0].pageX - startX;
      var moveY = e.targetTouches[0].pageY - startY;
      this.style.left = x + moveX + "px";
      this.style.top = y + moveY + "px";
      e.preventDefault();
    });
  }
  function dragTouchELe(ele) {
    dragElement(ele);
    touchElementMove(ele);
  }

  function VueStart() {
    const aID = "vue_" + new Date().getTime().toString();
    const a = document.createElement("div");
    a.id = aID;
    a.setAttribute("class", "root-of-all");
    document.body.appendChild(a);

    const switch_toggle = {
      name: "SwitchToggle",
      props: ["status", "change", "small"],
      methods: {
        changeMy() {
          this.change();
        },
      },
      template: /* html */ `
        <div class="switch-toggle-outer">
            <label :class="small?'smaller':'normal'" :name="status?'checked':'unchecked'" @click="changeMy"></label>
        </div>
        `,
    };

    const controller = {
      name: "controller",
      props: ["current", "Fdown", "Fup"],
      methods: {
        up() {
          this.Fup();
        },
        down() {
          this.Fdown();
        },
      },
      template: /* html */ `
        <div class="controller-outer">
            <div @click="down" class="ctrl-btn">-</div>
            <div class="ctrl-num">{{current}}</div>
            <div @click="up" class="ctrl-btn">+</div>
        </div>
        `,
    };

    const ACTUAL_PVP_NOTE = "note6102: ",
      UPDATE_ABILITY = "buff加成对精灵属性的影响";

    const speedup = {
      components: {
        controller,
        switch_toggle,
      },
      name: "speedup",
      props: ["ifshow", "changeshow", "onspeedup", "offspeedup", "displaymore"],
      data() {
        return {
          config: {
            max: 25,
            min: 0.1,
            default: 10,
            choice: [0.5, 1, 5, 10, 18, 25],
          },
          current: 10,
          title: "变速",
          status: false,
        };
      },
      template: /* html */ `
        <div class="black-curtain" v-show="ifshow" @click.self="changeshow">
            <div class="all-func-outer">
                <div class="my-funcs">
                    <div class="func-speedup one-func">
                        <div class="func-title">{{title}}</div>
                        <div class="func-quick">
                            <li v-for="item in config.choice" :key="item" @click="changespeed(item)">{{item}}</li>
                        </div>
                        <div class="func-other">
                            <controller :current="current" :Fdown="passdown" :Fup="passup"></controller>
                            <switch_toggle :status="status" :change="changeStatus"></switch_toggle>
                        </div>
                    </div>
                    <div @click="displaymore" class="speed-up-more">更多功能</div>
                </div>
            </div>
        </div>
        `,
      watch: {
        current() {
          if (this.status === true) {
            this.applySpeed();
          }
        },
        status() {
          this.applySpeed();
        },
      },
      methods: {
        offmanual() {
          this.status = false;
        },
        changespeed(e) {
          if (e < this.config.min) e = this.config.min;
          if (e > this.config.max) e = this.config.max;
          this.current = e;
        },
        applySpeed() {
          if (this.status === true) {
            try {
              this.onspeedup();
              if (window.Laya && window.Laya.timer && window.Laya.timer.scale) {
                window.Laya.timer.scale = this.current;
              }
            } catch (e) {
              window.console.warn(e);
            }
          } else {
            try {
              this.offspeedup();
              if (window.Laya && window.Laya.timer && window.Laya.timer.scale) {
                window.Laya.timer.scale = 1;
              }
            } catch (e) {
              window.console.warn(e);
            }
          }
        },
        changeStatus() {
          this.status = !this.status;
        },
        passdown() {
          if (this.current > 1) this.current -= 1;
          else if (this.current > 0 && this.current <= 1) {
            this.current = (this.current * 10 - 1) / 10;
            if (this.current === 0) {
              this.current = this.config.min;
            }
          } else {
            this.current = this.config.min;
          }
        },
        passup() {
          if (this.current >= 1 && this.current < this.config.max) {
            this.current += 1;
          } else if (this.current >= this.config.max) {
            return;
          } else {
            this.current = (this.current * 10 + 1) / 10;
            if (this.current < this.config.min) this.current = this.config.min;
          }
        },
      },
      mounted() {
        this.$emit("nospeed", this.offmanual);
      },
    };

    const settings = {
      name: "settings",
      props: ["ifshow", "hideshow"],
      components: {
        controller,
        switch_toggle,
      },
      data() {
        return {
          ctrlani: true,
          pcfull: false,
          gameani: false,
          configs: [
            {
              tit: "界面字号设置",
              type: 2,
              details: {
                default: this.readStorage("basicsize", 16),
                down: () => {
                  let x = this.readStorage("basicsize", 16);
                  x--;
                  if (x <= 10) x = 10;
                  this.configs[0].details.default = x;
                  this.setStorage("basicsize", x);
                  this.setFontAll(x);
                },
                up: () => {
                  let x = this.readStorage("basicsize", 16);
                  x++;
                  if (x >= 30) x = 30;
                  this.configs[0].details.default = x;
                  this.setStorage("basicsize", x);
                  this.setFontAll(x);
                },
              },
            },
            {
              tit: "电脑端窗口大小默认铺满",
              type: 1,
              details: {
                default: bool(this.readStorage("pcfullscreen", true)),
                change: () => {
                  let x = !bool(this.readStorage("pcfullscreen", true));
                  this.setStorage("pcfullscreen", x);
                  this.configs[1].details.default = x;
                  this.pcfull = x;
                },
              },
            },
            {
              tit: "游戏内弹窗动画和战斗动画",
              type: 1,
              details: {
                default: bool(this.readStorage("gameani", false)),
                change: () => {
                  let x = !bool(this.readStorage("gameani", false));
                  this.setStorage("gameani", x);
                  this.configs[2].details.default = x;
                  this.gameani = x;
                },
              },
            },
          ],
        };
      },
      methods: {
        readStorage(x, y) {
          if (
            localStorage.getItem("myvuesettings-" + x) === undefined ||
            localStorage.getItem("myvuesettings-" + x) === null
          ) {
            localStorage.setItem("myvuesettings-" + x, y);
            return y;
          } else {
            return localStorage.getItem("myvuesettings-" + x);
          }
        },
        setStorage(x, y) {
          // console.log('set', x, y);
          localStorage.setItem("myvuesettings-" + x, y);
        },
        setFontAll(x) {
          a.style.setProperty("--bsc", x + "px");
        },
        delayHideShow() {
          this.ctrlani = false;
          this.hideshow();
          setTimeout(() => (this.ctrlani = true), 350);
        },
      },
      watch: {
        pcfull(val) {
          try {
            if (val === true) {
              Laya.Config.isFullScreen = true;
              Laya.stage.scaleMode = "showall";
            } else {
              Laya.Config.isFullScreen = false;
              Laya.stage.scaleMode = "noscale";
            }
          } catch (e) {
            console.warn(e);
          }
        },
        gameani(val) {
          try {
            Laya.Config.isOpenAni = val;
            Laya.Config.isOpenFightingAni = val;
          } catch (e) {
            console.warn(e);
          }
        },
      },
      template: /* html */ `
        <div v-show="ifshow"><div class="settings-background" @click.self="delayHideShow"></div>
        <div :class="'settings-outer '+(ctrlani?'active':'deactive')" ref='showouter'>
            <div class="settings-title">设置</div>
            <ul class="settings-body">
                <li v-for="(item, idx) in configs" :key="'settings-'+idx">
                    <span>{{item.tit}}</span>
                    <template v-if="item.type===2">
                        <controller :current="item.details.default" :Fdown="item.details.down" :Fup="item.details.up"></controller>
                    </template>
                    <template v-else-if="item.type===1">
                        <switch_toggle :small="true" :status="item.details.default" :change="item.details.change"></switch_toggle>
                    </template>
                </li>
            </ul>
            <div class="settings-tail">版本号: v2.1.0_alpha_2022.02.14</div>
        </div>
        </div>
        `,
      created() {
        let x = this.readStorage("basicsize", 16);
        this.setFontAll(x);
        let y = this.readStorage("pcfullscreen", true);
        this.pcfull = y;
        let z = this.readStorage("gameani", true);
        this.gameani = z;
      },
      mounted() {
        setTimeout(() => {
          for (let i = 1; i <= 2; i++) {
            this.configs[i].details.change();
            this.configs[i].details.change();
          }
        }, 2000);
      },
    };

    function checkLog() {
      try {
        if (!Laya.Config.isShowLog) Laya.Config.isShowLog = true;
      } catch (e) {
        console.error(e);
      }
    }

    const pvp2 = {
      name: "pvp",
      props: ["onbattle", "offbattle", "closepvpshow"],
      data() {
        return {
          player0: null,
          player1: null,
          isFighting: null,
          clickCamp: -1,
          clickElf: -1,
          name6: ["血", "物", "防", "特", "抗", "速"],
          colorSet: [
            "#D37C84",
            "#DAB28F",
            "#ECF1D5",
            "#9CA7DE",
            "#A9E2B9",
            "#9884D6",
          ],
        };
      },
      methods: {
        spSkill(a) {
          if (a.id === "594") return a.nature + "-" + "手里";
          else if (a.id === "546") return a.nature + "-" + "破坏";
          else if (a.id === "449") return a.nature + "-" + "制裁";
          else if (a.id === "40054") return a.nature + "-" + "审判";
          return a.name;
        },
        showINFO(a, b) {
          this.clickCamp = +a;
          this.clickElf = +b;
        },
        handleMSG(a) {
          if (com.mvc.models.vos.fighting.FightingConfig.isPVP === true || a.indexOf(ACTUAL_PVP_NOTE) >= 0) {
            this.player0 = com.mvc.models.vos.login.PlayerVO.bagElfVec;
            this.player1 = com.mvc.models.vos.fighting.NPCVO.bagElfVec;
            return 1;
          } else if (a.indexOf(UPDATE_ABILITY) >= 0) {
            this.player0 = com.mvc.models.vos.login.PlayerVO.bagElfVec;
            this.player1 = com.mvc.models.vos.fighting.NPCVO.bagElfVec;
          }
          return 2;
        },
      },
      computed: {
        PLAYER0() {
          return this.player0 === null
            ? []
            : this.player0.filter((i) => i !== null);
        },
        PLAYER1() {
          return this.player1 === null
            ? []
            : this.player1.filter((i) => i !== null);
        },
        currentDeatil() {
          if (this.clickCamp === -1) return {};
          if (this.clickCamp === 0)
            return this.PLAYER0[Math.min(this.clickElf, this.PLAYER0.length)];
          else
            return this.PLAYER1[Math.min(this.clickElf, this.PLAYER1.length)];
        },
        curAbi() {
          if (!this.currentDeatil || Object.keys(this.currentDeatil).length <= 0) return [];
          const ns = [
            "currentHp",
            "attack",
            "defense",
            "super_attack",
            "super_defense",
            "speed",
          ];
          let b = [];
          for (let i of ns) b.push(+this.currentDeatil[i]);
          let tmax = Math.max(...b);
          let c = [];
          for (let i of b) c.push(Math.floor((i / tmax) * 1000) / 10 + "%");
          let d = [];
          for (let i in b) {
            d.push({
              num: b[i],
              per: c[i],
            });
          }
          return d;
        },
        curSkill() {
          if (!this.currentDeatil || Object.keys(this.currentDeatil).length <= 0) return [];
          if (
            this.currentDeatil.featureVO &&
            this.currentDeatil.featureVO.id === "10284"
          ) {
            if (
              this.currentDeatil.nowSingleSkillVec1 &&
              this.currentDeatil.nowSingleSkillVec2
            ) {
              return this.currentDeatil.nowSingleSkillVec1
                .slice(1)
                .concat(this.currentDeatil.nowSingleSkillVec2.slice(1));
            } else {
              return this.currentDeatil.nowSkillVec1
                .slice(1)
                .concat(this.currentDeatil.nowSkillVec1.slice(1));
            }
          }
          if (this.currentDeatil.nowSingleSkillVec1)
            return this.currentDeatil.nowSingleSkillVec1;
          else return this.currentDeatil.nowSkillVec1;
        },
        dynamax() {
          if (this.currentDeatil.superBigVec) {
            if (this.currentDeatil.superBigVec[0].isEquip) return true;
          }
          return false;
        },
      },
      template: /* html */ `
        <div class="pvp-all-info" ref="mypvpboard">
          <div class="close-pvp-info" @click="closepvpshow()">×</div>
          <div class="pvp-choose-player">
            <div class="pvp-player player1">
                <span class="pvp-player-camp">敌</span>
                <ul class="pvp-elves-btn">
                    <li v-for="(item,idx) in PLAYER1" :key="'player1_'+idx" @click="showINFO(1, idx)">{{item.name}}</li>
                </ul>
            </div>
            <div class="pvp-player player0">
                <span class="pvp-player-camp">我</span>
                <ul class="pvp-elves-btn">
                    <li v-for="(item,idx) in PLAYER0" :key="'player0_'+idx" @click="showINFO(0, idx)">{{item.name}}</li>
                </ul>
            </div>
          </div>
          <div class="pvp-show-detail" v-if="currentDeatil && Object.keys(currentDeatil).length > 0">
            <div class="pvp-all-detail pvp-all-detail-items">
              <span v-if="currentDeatil.nature">{{currentDeatil.nature.join(',')}} || <span v-if="currentDeatil.character">{{currentDeatil.character}}</span></span>
              <div v-if="currentDeatil.carryProp">{{currentDeatil.carryProp.name}}</div>
              <div v-if="currentDeatil.hagberryProp">{{currentDeatil.hagberryProp.name}}</div>
              <div v-if="currentDeatil.featureVO">🍭{{currentDeatil.featureVO.name}}</div>
              <div v-if="currentDeatil.currentZSkill" class="Zskill-con">{{currentDeatil.currentZSkill.name}}{{currentDeatil.currentZSkill.zSkillLv}}</div>
            </div>
            <div class="pvp-all-detail pvp-all-detail-panel">
              <li v-for="(item,idx) in curAbi" :key="'abi_'+idx">
                {{name6[idx]}}<span><span :style="{width: item.per, backgroundColor: colorSet[idx]}">{{item.num}}</span></span>
              </li>
            </div>
            <div class="pvp-all-detail pvp-all-detail-skills">
              <li v-for="(item,idx) in curSkill" :key="'ski_'+idx">
                  {{spSkill(item)}}<span>{{item.currentPP}}</span>
              </li>
            </div>
            <div class="info-dy" v-if="dynamax === true">极巨化</div>
          </div>
        </div>
      `,
      created() {
        setTimeout(() => {
          checkLog();
          window.console.nativeLog = window.console.log;
          var that = this;
          window.console.log = function (a) {
            try {
              let xr = that.handleMSG(a.toString());
              if (xr === 1) {
                that.onbattle();
              }
            } catch (e) {
              console.warn(e);
            }
          };
          // pvp: com.mvc.models.vos.fighting.FightingConfig.isPVP,
          // fight: com.mvc.models.vos.fighting.FightingConfig.isPlayBack,
        }, 10000);
      },
      mounted() {
        dragTouchELe(this.$refs.mypvpboard);
      },
    };

    const app = Vue.createApp({
      components: {
        speedup,
        settings,
        pvp2,
      },
      data() {
        return {
          eyeon: false,
          battle: false,
          speedshow: false,
          moreshow: false,
          pvpshowb: false,
          xe: "",
        };
      },
      template: /* html */ `
        <div id="eye_control">
            <button id="x_eye" :class="eyeon?'evo_eye eye':'eye'" @click="changeSpeedShow" ref="myeye">
                <div class="jewels eye3">
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                </div>
            </button>
            <button id="x_eye2" class="evoplus evo_eye eye" ref="myeye2" @click="openpvpshow_">
                <div class="jewels eye3 eye_evo">
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                </div>
            </button>
        </div>
        <speedup v-on:nospeed="rec" :ifshow="speedshow" :changeshow="changeSpeedShow" :onspeedup="onspeedup" :offspeedup="offspeedup" :displaymore="displaymore"></speedup>
        <settings :ifshow="moreshow" :hideshow="hidemoreshow"></settings>
        <pvp2 :closepvpshow="closepvpshow_" v-show="pvpshowb" :onbattle="onbattle_" :offbattle="offbattle_"></pvp2>
        `,
      methods: {
        rec(e) {
          this.xe = e;
        },
        showsp() {
          this.speedshow = true;
        },
        openpvpshow_() {
          this.pvpshowb = true;
        },
        closepvpshow_() {
          this.pvpshowb = false;
        },
        displaymore() {
          this.speedshow = false;
          this.moreshow = true;
        },
        changeSpeedShow() {
          this.speedshow = !this.speedshow;
        },
        changeon() {
          this.eyeon = !this.eyeon;
        },
        changebattle() {
          this.battle = !this.battle;
        },
        onspeedup() {
          this.eyeon = true;
        },
        offspeedup() {
          this.eyeon = false;
        },
        hidemoreshow() {
          setTimeout(() => (this.moreshow = false), 300);
        },
        onbattle_() {
          this.xe();
          this.eyeon = false;
        },
        offbattle_() {
          this.eyeon = false;
          this.battle = false;
        },
      },
      mounted() {
        dragTouchELe(this.$refs.myeye);
        dragTouchELe(this.$refs.myeye2);
      },
    });
    app.mount("#" + aID);
  }
})();
