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
    loadDynamicScript(
      "link",
      "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css",
      undefined,
      "evolved-css"
    );
    // loadDynamicScript("link", "evolved.css", undefined, "evolved-css");
    loadDynamicScript(
      "script",
      "https://unpkg.com/vue@next",
      VueStart,
      "vue3load"
    );
  });
  loadDynamicScript(
    "link",
    "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css",
    undefined,
    "evolved-css"
  );
  loadDynamicScript(
    "script",
    "https://unpkg.com/vue@next",
    VueStart,
    "vue3load"
  );

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

    let inHunting = false,
      huntGlobal = null;
    const huntPro = {
      props: ["hunt_show", "hideHunt"],
      data() {
        return {
          status: 1,
          alerts: [
            "当前捕虫未开放",
            "请先进入捕虫界面，以获取数据！  然后点击下方按钮",
          ],
          score: 0,
          power: 0,
          ball: 0,
          openmap: [],
          bossmap: null,
          mapSe: 1,
          timesExc: 0,
          logshow: false,
          logs: [],
        };
      },
      methods: {
        getAll() {
          try {
            if (com.mvc.models.vos.huntingParty.HuntPartyVO.isOpen) {
              if (
                com.mvc.models.vos.huntingParty.HuntPartyVO.catchCount === 0
              ) {
                this.status = 1;
              } else {
                this.status = 2;
                this.score = com.mvc.models.vos.huntingParty.HuntPartyVO.score;
                this.power =
                  +com.mvc.models.vos.huntingParty.HuntPartyVO.catchCount;
                this.ball =
                  +com.common.util.xmlVOHandler.GetPropFactor.getPropVO2(868)
                    .count;
                this.getMap();
              }
            } else {
              this.status = 0;
            }
          } catch (e) {
            console.error(e);
          }
        },
        getMap() {
          try {
            this.openmap = [];
            let len = com.mvc.models.vos.huntingParty.HuntPartyVO.lastNodeId;
            for (let i = 0; i <= len; i++) {
              let tmp = com.common.util.xmlVOHandler.GetHuntingParty.nodeVec[i];
              if (tmp.type === 0)
                this.openmap.push({ name: tmp.name, id: tmp.id });
              else {
                if (tmp.bossIndex === 5) this.bossmap = null;
                else if (tmp.id === i + 1 && i === len)
                  this.bossmap = { name: tmp.name, id: tmp.id };
                else this.bossmap = null;
              }
            }
          } catch (e) {
            console.error(e);
          }
        },
        showLog() {
          this.logs = [];
          this.logshow = true;
        },
        hideLog() {
          this.getAll();
          if (!inHunting) {
            this.logs = [];
            this.logshow = false;
          }
        },
        refreshPage() {
          window.location.reload();
        },
        execute(id, boss) {
          this.getAll();
          if (this.power <= 0) return;
          if (id !== undefined) {
            let exeTimes = this.timesExc;
            if (boss) {
              exeTimes = 1;
            }
            if (exeTimes <= 0) return;
            if (this.ball < 5 * exeTimes) return;
            this.showLog();
            this.hunt(id, exeTimes, exeTimes);
          }
        },
        stopHunt() {
          inHunting = false;
        },
        scrollToElement() {
          const el = this.$refs.scrollToMe;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        },
        stopHuntNoti() {
          inHunting = false;
          this.getAll();
          this.logs.push("!!!!!!!!!!!!");
          this.logs.push("积分请到排行榜查看(及时更新)");
          this.logs.push("用完后请刷新游戏, 避免奇奇怪怪的bug");
          this.logs.push(
            "该窗口若无法关闭, 点击左边的[停止执行], 再点下[关闭窗口]就能关闭了"
          );
          this.scrollToElement();
        },
        hunt(id, cur, total) {
          if (cur === 0) {
            this.stopHuntNoti();
            return;
          }
          inHunting = true;
          try {
            com.common.net.Client.instance.callObjs.note4102.write4102({
              id: id,
            });
            cur--;
            setTimeout(() => {
              this.logs.push(`==== ${total - cur} of ${total} ====`);
              let meetX =
                com.mvc.models.proxy.huntingParty.HuntingPartyPro.meetObj;
              let [mid, mhp] = [meetX.spId, String(meetX.hp)];
              let mname =
                com.common.util.xmlVOHandler.GetElfFactor.allElfStaticObj[mid]
                  .name;
              this.logs.push(`遇到精灵: ${mid} | ${mname}`);
              this.logs.push("丢球中.");
              this.dropBall(mid, mhp, 1).then(() => {
                if (inHunting) {
                  this.hunt(id, cur, total);
                } else {
                  this.stopHuntNoti();
                  return;
                }
              });
            }, 1001 + Math.round(Math.random() * 100));
          } catch (e) {
            console.error(e);
          }
        },
        async dropBall(id, hp, used) {
          const pr = new Promise((resolve) => {
            try {
              com.common.net.Client.instance.callObjs.note4120.write4120(
                { status: [6], totalHp: hp, currentHp: "1", elfId: id },
                { id: 868 }
              );
              setTimeout(() => {
                if (huntGlobal && huntGlobal !== null) {
                  if (huntGlobal.status === "success") {
                    if (
                      huntGlobal.data.reward &&
                      huntGlobal.data.reward.catchScore
                    ) {
                      this.logs.push(
                        `成功! 获得积分👉${huntGlobal.data.reward.catchScore}👈, 用球${used}个`
                      );
                      this.logs.push("____________________");
                      this.scrollToElement();
                      resolve("ook");
                    } else {
                      used++;
                      this.logs[this.logs.length - 1] =
                        this.logs[this.logs.length - 1] + ".";
                      return this.dropBall(id, hp, used);
                    }
                  } else {
                    this.logs.push("Error: " + huntGlobal.data.msg);
                  }
                }
              }, 501 + Math.round(Math.random() * 100));
            } catch (e) {
              console.error(e);
            }
          });
          return pr;
        },
      },
      template: /* html */ `
    <div class="black-curtain" v-show="hunt_show" @click.self="hideHunt">
    <div class="all-func-outer my-funcs hunt-outer">
    <div class="one-func">
        <div class="func-title">捕虫</div>
        <div v-if="status===0" class="hunt-alert">{{alerts[0]}}</div>
        <div v-else-if="status===1" class="hunt-alert">
          <div>{{alerts[1]}}</div>
          <div class="huntPro-next" @click="getAll">下一步</div>
        </div>
        <template v-else-if="status===2">
        <div class="huntPro-module"><span>积分: {{score}}</span><span>体力: {{power}}</span><span>球: {{ball}}</span>
          <span class="huntPro-next" @click="getAll">刷新🔃</span>
        </div>
        <div class="huntPro-module hunt-module-normal">
        <div class="huntPro-per"><span>选择地图(不含BOSS)</span>
        <select v-model="mapSe"><option v-for="item in openmap" :key="item.id" :value="item.id">{{item.name}}</option></select>
        </div>
        <div class="huntPro-per"><span>欲捕捉次数</span>
          <div class="huntPro-slider"><input type="range" min="0" :max="power" v-model="timesExc">
          <span class="huntPro-slider-txt">{{timesExc}}</span></div>
        </div>
        <div>注: 当公园球数量小于5×执行次数时, 不予执行; 为了愉快玩耍, 请确保包里有1000球以上</div>
        <div class="huntPro-next" @click="execute(mapSe)">执行</div>
        </div>
        <div class="huntPro-module hunt-module-normal" v-if="bossmap !== null">
        <div class="huntPro-per"><span>当前可用BOSS地图</span><div class="huntPro-next" @click="execute(bossmap.id,true)">{{bossmap.name}}</div></div>
        <div class="huntPro-per">注: 点击即可执行, 只捕捉一次; 为了防止Bug, 最后一处BOSS地图不予执行, 请手动捕捉</div>
        </div>
        </template>
    </div>
    </div>
    </div>
    <div class="black-curtain" v-show="logshow">
      <div class="all-func-outer my-funcs hunt-outer-logs">
        <div class="log-area" ref="scrollToMe"><li v-for="(item,idx) in logs" :key="idx">{{item}}</li></div>
        <div class="btn-area">
          <div class="huntPro-next" @click="stopHunt">停止执行</div>
          <div class="huntPro-next" @click="refreshPage">刷新网页</div>
          <div class="huntPro-next" @click="hideLog">关闭窗口</div>
        </div>
      </div>
    </div>
    `,
    };

    const ACTUAL_PVP_NOTE = "note6102: ",
      UPDATE_ABILITY = "buff加成对精灵属性的影响",
      HUNT_PRO_RES = "note4120=",
      BOSS_HP_NOTE = "write33226=",
      BOSS_HP_STOP = "note33227=",
      DATAHANDLER = "更新了状态极巨化首领";

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
      computed: {
        plantdate() {
          return new Date().getTime() <= 1647532569461;
        },
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
                    <div v-if="plantdate" @click="plantCheat" class="speed-up-more">Cheat植树节水滴</div>
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
        plantCheat() {
          try {
            com.common.net.Client.instance.callObjs.note34902.write34901();
            setTimeout(() => {
              let Checkpoints = 4 + Math.round(Math.random() * 3);
              if (Checkpoints % 2 === 1) Checkpoints += 1;
              let maxCount = Checkpoints * 20 + Math.round(Math.random() * 22);
              let bigCount = Checkpoints * 5 + Math.round(Math.random() * 8);
              let middleCount = 3 + Math.round(Math.random() * 7);
              let smallCount = 1 + Math.round(Math.random() * 5);
              let getPoint =
                ((Checkpoints + 1) * Checkpoints) / 2 +
                maxCount +
                bigCount * 2 +
                middleCount * 3 +
                smallCount * 5;
              try {
                com.common.net.Client.instance.callObjs.note34902.write34902({
                  Checkpoints,
                  maxCount,
                  bigCount,
                  middleCount,
                  smallCount,
                  getPoint,
                });
              } catch (e) {
                console.error(e);
              }
            }, 1500);
          } catch (e) {
            console.error(e);
          }
        },
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
        huntPro,
      },
      data() {
        return {
          ctrlani: true,
          pcfull: false,
          gameani: false,
          bossonehp: true,
          hunt_show: false,
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
            {
              tit: "极巨BOSS自动1血",
              type: 1,
              details: {
                default: bool(this.readStorage("bossonehp", true)),
                change: () => {
                  let x = !bool(this.readStorage("bossonehp", true));
                  this.setStorage("bossonehp", x);
                  this.configs[3].details.default = x;
                  this.bossonehp = x;
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
        hideHunt() {
          this.hunt_show = false;
        },
        showHunt() {
          this.hunt_show = true;
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
        bossonehp(val) {
          try {
            window.BOSS1HP = val;
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
            <div>辅助小功能</div>
            <div class="huntPro-next" @click="showHunt">懒人捕虫</div>
            <div class="settings-tail">版本号: v2.1.2_alpha_2022.03.07</div>
            <huntPro :hunt_show="hunt_show" :hideHunt="hideHunt"></huntPro>
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
        this.bossonehp = this.readStorage("bossonehp", true);
      },
      mounted() {
        setTimeout(() => {
          for (let i = 1; i <= 3; i++) {
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
          if (a.indexOf(BOSS_HP_NOTE) >= 0) {
            window.preBOSS1HP = true;
          }
          if (a.indexOf(BOSS_HP_STOP) >= 0) {
            window.preBOSS1HP === false;
          }
          if (
            window.preBOSS1HP === true &&
            a.indexOf(DATAHANDLER) >= 0 &&
            window.BOSS1HP === true
          ) {
            setTimeout(() => {
              for (let i of com.mvc.models.vos.fighting.NPCVO.bagElfVec) {
                i.currentHp = "1";
              }
            }, 400);
          }
          if (inHunting && a.indexOf(HUNT_PRO_RES) >= 0) {
            huntGlobal = JSON.parse(a.split(HUNT_PRO_RES)[1]);
            return 2;
          }
          if (
            com.mvc.models.vos.fighting.FightingConfig.isPVP === true ||
            a.indexOf(ACTUAL_PVP_NOTE) >= 0
          ) {
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
          if (
            !this.currentDeatil ||
            Object.keys(this.currentDeatil).length <= 0
          )
            return [];
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
          if (
            !this.currentDeatil ||
            Object.keys(this.currentDeatil).length <= 0
          )
            return [];
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
