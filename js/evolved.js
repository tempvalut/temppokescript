(function(){
'use strict';
const bool = a => {
    if (a === true || a === 'true' || a === 1) return true;
    else if (a === false || a === 'false' || a === 0) return false;
    return false;
}

const loadDynamicScript = (type, url, callback, scriptID) => {
    const existingScript = document.getElementById(scriptID);
    if (!existingScript) {
        const script = document.createElement(type);
        script.id = scriptID;
        if (type === 'script') {
            script.src = url;
            document.body.appendChild(script);
            script.onload = () => {
                if (callback) callback();
            };
        } else if (type === 'link') {
            script.rel  = 'stylesheet';
            script.type = 'text/css';
            script.href = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
    if (existingScript && callback) callback();
};

window.addEventListener('DOMContentLoaded', () => {
    loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css", undefined, 'evolved-css');
    // loadDynamicScript('link', "evolved.css", undefined, 'evolved-css');
    loadDynamicScript('script', "https://unpkg.com/vue@next", VueStart, 'vue3load');
});
loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/evolved.css", undefined, 'evolved-css');
loadDynamicScript('script', "https://unpkg.com/vue@next", VueStart, 'vue3load');

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.addEventListener('mousedown', function(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        document.onmousemove = function(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    });
}
function touchElementMove(elmnt) {
    var startX = 0, startY = 0, x = 0, y = 0;
    elmnt.addEventListener('touchstart', function (e) {
        startX = e.targetTouches[0].pageX;
        startY = e.targetTouches[0].pageY;
        x = this.offsetLeft;
        y = this.offsetTop;
    });
    elmnt.addEventListener('touchmove', function (e) {
        var moveX = e.targetTouches[0].pageX - startX;
        var moveY = e.targetTouches[0].pageY - startY;
        this.style.left = x + moveX + 'px';
        this.style.top = y + moveY + 'px';
        e.preventDefault();
    })
}
function dragTouchELe(ele) {
    dragElement(ele);
    touchElementMove(ele);
}


function VueStart() {
    const aID = 'vue_'+new Date().getTime().toString();
    const a = document.createElement('div');
    a.id = aID;
    a.setAttribute('class', 'root-of-all');
    document.body.appendChild(a);

    const switch_toggle = {
        name: 'SwitchToggle',
        props: ['status', 'change', 'small'],
        methods: {
            changeMy() {
                this.change();
            }
        },
        template: /* html */ `
        <div class="switch-toggle-outer">
            <label :class="small?'smaller':'normal'" :name="status?'checked':'unchecked'" @click="changeMy"></label>
        </div>
        `,
    }

    const controller = {
        name: 'controller',
        props: ['current', 'Fdown', 'Fup'],
        methods: {
            up() {
                this.Fup();
            },
            down() {
                this.Fdown();
            }
        },
        template: /* html */ `
        <div class="controller-outer">
            <div @click="down" class="ctrl-btn">-</div>
            <div class="ctrl-num">{{current}}</div>
            <div @click="up" class="ctrl-btn">+</div>
        </div>
        `,
    }

    const speedup = {
        components: {
            controller, switch_toggle
        },
        name: 'speedup',
        props: ['ifshow', 'changeshow', 'onspeedup', 'offspeedup', 'displaymore'],
        data() {
            return {
                config: {
                    max: 25, min: 0.1, default: 10,
                    choice: [0.5, 1, 5, 10, 18, 25]
                },
                current: 10,
                title: '变速',
                status: false,
            }
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
            }
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
                    } catch(e) { window.console.warn(e); }
                } else {
                    try {
                        this.offspeedup();
                        if (window.Laya && window.Laya.timer && window.Laya.timer.scale) {
                            window.Laya.timer.scale = 1;
                        }
                    } catch(e) { window.console.warn(e); }
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
    }

    const settings = {
        name: 'settings',
        props: ['ifshow', 'hideshow'],
        components: {
            controller, switch_toggle
        },
        data() {
            return {
                ctrlani: true,
                pcfull: false,
                gameani: false,
                configs: [{
                    tit: '界面字号设置',
                    type: 2,
                    details: {
                        default: this.readStorage('basicsize', 16),
                        down: () => {
                            let x = this.readStorage('basicsize', 16);
                            x--;
                            if (x <= 10) x = 10;
                            this.configs[0].details.default = x;
                            this.setStorage('basicsize', x);
                            this.setFontAll(x);
                        },
                        up: () => {
                            let x = this.readStorage('basicsize', 16);
                            x++;
                            if (x >= 30) x = 30;
                            this.configs[0].details.default = x;
                            this.setStorage('basicsize', x);
                            this.setFontAll(x);
                        },
                    }
                }, {
                    tit: '电脑端窗口大小默认铺满',
                    type: 1,
                    details: {
                        default: bool(this.readStorage('pcfullscreen', true)),
                        change: () => {
                            let x = !bool(this.readStorage('pcfullscreen', true));
                            this.setStorage('pcfullscreen', x);
                            this.configs[1].details.default = x;
                            this.pcfull = x;
                        },
                    }
                },  {
                    tit: '游戏内弹窗动画和战斗动画',
                    type: 1,
                    details: {
                        default: bool(this.readStorage('gameani', false)),
                        change: () => {
                            let x = !bool(this.readStorage('gameani', false));
                            this.setStorage('gameani', x);
                            this.configs[2].details.default = x;
                            this.gameani = x;
                        },
                    }
                }],
            }
        },
        methods: {
            readStorage(x, y) {
                if (localStorage.getItem('myvuesettings-'+x) === undefined || localStorage.getItem('myvuesettings-'+x) === null) {
                    localStorage.setItem('myvuesettings-'+x, y);
                    return y;
                } else {
                    return localStorage.getItem('myvuesettings-'+x);
                }
            },
            setStorage(x, y) {
                // console.log('set', x, y);
                localStorage.setItem('myvuesettings-'+x, y);
            },
            setFontAll(x) {
                a.style.setProperty('--bsc', x + "px");
            },
            delayHideShow() {
                this.ctrlani = false;
                this.hideshow();
                setTimeout(()=>this.ctrlani = true, 350);
            }
        },
        watch: {
            pcfull(val) {
                try {
                    if (val === true) {
                        Laya.Config.isFullScreen = true;
                        Laya.stage.scaleMode='showall';
                    } else {
                        Laya.Config.isFullScreen = false;
                        Laya.stage.scaleMode='noscale';
                    }
                } catch(e) {
                    console.warn(e);
                }
            },
            gameani(val) {
                try {
                    Laya.Config.isOpenAni = val;
                    Laya.Config.isOpenFightingAni = val;
                } catch(e) {
                    console.warn(e);
                }
            }
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
            <div class="settings-tail">版本号: v2.0.1_alpha_2022.01.10</div>
        </div>
        </div>
        `,
        created() {
            let x = this.readStorage('basicsize', 16);
            this.setFontAll(x);
            let y = this.readStorage('pcfullscreen', true);
            this.pcfull = y;
            let z = this.readStorage('gameani', true);
            this.gameani = z;
        },
        mounted() {
            setTimeout(()=>{
                for (let i = 1; i <= 2; i++) {
                    this.configs[i].details.change();
                    this.configs[i].details.change();
                }
            }, 2000)
        },
    }

    function checkLog() {
        try {
            if (!Laya.Config.isShowLog) Laya.Config.isShowLog = true;
        } catch(e) {
            console.error(e);
        }
    }

    class elf {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.skills = [];
            this.ability = [];
            this.sex = "?";
            this.skillcur = 0;
            this.dynamax = false;
        }
        get ID() {return this.id;}
        get NAME() {return this.name;}
        get SKILL() {return this.skills;}
        get ABI() {return this.ability;}
        setName(n) {
            this.name = n;
        }
        setSex(s) {
            this.sex = s;
        }
        setSkillName(n) {
            if (this.skillcur < this.skills.length) {
                this.skills[this.skillcur].name = n;
                this.skillcur++;
            }
        }
        addSkill(s) {
            this.skills.push(s);
        }
        setAbility(s) {
            this.ability = s;
        }
        getAll() {
            return { id: this.id, name: this.name, skills: this.skills, ability: this.ability };
        }
        setByID(id, name, dy) {
            if (this.id === id) {
                this.name = name;
                this.dynamax = dy;
                return true;
            }
            return false;
        }
    }

    class player {
        constructor(side, guild, guildspe) {
            this.side = side;
            this.guild = guild;
            this.guildspe = guildspe;
            this.elves = [];
        }
        get ELVES() { return this.elves; }
        addElf(e) {
            let el = new elf(e.id, ""); /////////////
            // let el = new elf(e.id, e.name);
            el.setSex(e.sex);
            for (let i of e.skLst) {
                el.addSkill(new Object({
                    id: i.id,
                    pp: i.totalPP,
                    name: "" //////////
                    // name: i.name
                }))
            }
            // const tmp = [];
            // for (let i = 0; i < 6; i++) {
            //     tmp.push(Math.round(Math.random()*13423+Math.random()*122+Math.random()*7863+Math.random()*14511));
            // }
            // el.setAbility(tmp);////////////
            // el.dynamax = true;
            this.elves.push(el);
        }
        setNameById(id, n, dynamax) {
            for (let i of this.elves) {
                if (i.setByID(+id, n, dynamax) === true) {
                    return i;
                }
            }
            return null;
        }
        searchById(id) {
            for (let i of this.elves) {
                if (i.ID === id) return i;
            }
            return null;
        }
    }

    function processSpecial(s) {
        let a = new Object({
            attack: [], defend: []
        });
        if (s.attackWorkAttr) {
            a.attack.push({
                type: s.attackWorkAttr, value: s.attackRise
            })
        }
        if (s.defendWorkAttr) {
            a.defend.push({
                type: s.defendWorkAttr, value: s.defendRise
            })
        }
        if (s.attackWorkAttr_1) {
            a.attack.push({
                type: s.attackWorkAttr_1, value: s.attackRise_1
            })
        }
        if (s.defendWorkAttr_1) {
            a.defend.push({
                type: s.defendWorkAttr_1, value: s.defendRise_1
            })
        }
        return a;
    }
    function processSpecial2(s) {
        let a = new Object({
            attack: [], defend: []
        });
        if (s.guardAttackInfo) {
            a.attack.push({
                type: s.guardAttackInfo.attr, value: s.guardAttackInfo.rise
            })
        }
        if (s.guardDefenseInfo) {
            a.defend.push({
                type: s.guardDefenseInfo.attr, value: s.guardDefenseInfo.rise
            })
        }
        if (s.guardAttackInfo_1) {
            a.attack.push({
                type: s.guardAttackInfo_1.attr, value: s.guardAttackInfo_1.rise
            })
        }
        if (s.guardDefenseInfo_1) {
            a.defend.push({
                type: s.guardDefenseInfo_1.attr, value: s.guardDefenseInfo_1.rise
            })
        }
        return a;
    }


    const ACTUAL_PVP_NOTE = "note6102: ",
          ROOM_PVP_NOTE = "note6214: ",
          WATCH_PVP_NOTE = "note6230=", 
          DYNAMAX_INFO = "极巨化data= ", 
          BEGIN_ELF_INFO = "赋值超级招式elfvo", 
          BEGIN_ELF_ABILITY = "buff加成对精灵属性的影响 ",
          BEGIN_ELF_SKILL = "HarmSimulatorData.getInstance().isReady:",
          BEGIN_FIGHT = "==加载战斗界面==",
          END_FIGHT = "保存pvp战斗记录",
          END_FIGHT2 = "战斗文本信息:战斗结束";

    const pvp = {
        name: 'pvp',
        props: ['onbattle', 'offbattle', 'closepvpshow', 'openspeed'],
        data() {
            return {
                pvpMode: 0,
                player0: new player(0, [1.0, 1.0], {attack:[{type:'',value:0},{type:'',value:0}],defend:[{type:'',value:0},{type:'',value:0}]}),
                player1: new player(1, [1.0, 1.0], {attack:[{type:'',value:0},{type:'',value:0}],defend:[{type:'',value:0},{type:'',value:0}]}),
                cur0: new elf(-100, ""),
                cur1: new elf(-200, ""),
                cur: 0,
                lastBigger: false,
                showwhich: 0,
                guildcur: {guild: [], guildspe: []},
                curShow: new elf(-300, ""),
                name6: ['血量', '物攻', '物防', '特攻', '特防', '速度'],
                colorSet: ['#D37C84', '#DAB28F', '#ECF1D5', '#9CA7DE', '#A9E2B9', '#9884D6'],
                lastPVPMODE: undefined,
            }
        },
        template: /* html */ `
        <div class="pvp-all-info" ref="mypvpboard">
            <div class="close-pvp-info" @click="closepvpshow()">×</div>
            <div class="sp-pvp-speed" @click="openspeed()">速</div>
            <div class="pvp-choose-player">
            <div class="pvp-player player1">
                <span class="pvp-player-camp" @click="showopp">敌</span>
                <ul class="pvp-elves-btn">
                    <li v-for="(item,idx) in player1.ELVES" :key="'player1_'+idx" @click="showINFO(1, item.ID)">{{item.NAME}}</li>
                </ul>
            </div>
            <div class="pvp-player player0">
                <span class="pvp-player-camp" @click="showown">我</span>
                <ul class="pvp-elves-btn">
                    <li v-for="(item,idx) in player0.ELVES" :key="'player0_'+idx" @click="showINFO(0, item.ID)">{{item.NAME}}</li>
                </ul>
            </div>
            </div>
            <div class="pvp-show-detail">
            <template v-if="showwhich === 0">
                <div class="pvp-special pvp-special-left">
                    <div class="sp-title">公会科技</div>
                    <div>攻: {{guildcur.guild[0]}}</div>
                    <div>防: {{guildcur.guild[1]}}</div>
                </div>
                <div class="pvp-special pvp-special-right">
                    <div class="sp-title">公会神兽</div>
                    <div class="sp-more">攻: <li v-for="(item,idx) in guildcur.guildspe.attack" :key="'gu0_'+idx">{{item.type}}_{{item.value}}</li></div>
                    <div class="sp-more">防: <li v-for="(item,idx) in guildcur.guildspe.defend" :key="'gu1_'+idx">{{item.type}}_{{item.value}}</li></div>
                </div>
            </template>
            <template v-else>
                <div class="pvp-all-detail pvp-all-detail-panel">
                    <li v-for="(item,idx) in curShow.ABI" :key="'abi_'+idx">
                        {{name6[idx]}}<span><span :style="{width: getWidth(idx), backgroundColor: colorSet[idx]}">{{item}}</span></span>
                    </li>
                    <span style="color: #fd5772;">注: 以上数值不计入契约努力等固定值<br>且不随着战斗实时更新</span>
                </div>
                <div class="pvp-all-detail pvp-all-detail-skills">
                    <li v-for="(item,idx) in curShow.SKILL" :key="'ski_'+idx">
                        {{item.name}}<span>{{item.pp}}</span>
                    </li>
                </div>
                <div class="info-dy" v-if="curShow.dynamax === true">极巨化</div>
            </template>
            </div>
        </div>
        `,
        methods: {
            showopp() {
                this.showwhich = 0;
                this.guildcur = { guild: this.player1.guild, guildspe: this.player1.guildspe};
            },
            showown() {
                this.showwhich = 0;
                this.guildcur = { guild: this.player0.guild, guildspe: this.player0.guildspe};
            },
            showINFO(wh, id) {
                if (wh === 0) {
                    this.curShow = this.player0.searchById(id);
                } else if (wh === 1) {
                    this.curShow = this.player1.searchById(id);
                }
                if (this.curShow !== null) {
                    this.showwhich = 1;
                }
            },
            handleMSG(a) {
                if (this.pvpMode !== this.lastPVPMODE) {
                    this.lastPVPMODE = this.pvpMode;
                }
                
                if (a.indexOf(END_FIGHT) >= 0 || a.indexOf(END_FIGHT2) >= 0) {
                    this.pvpMode = 0;
                    return -1;
                }
                if (this.pvpMode >= 1 && this.pvpMode <= 5 && a.indexOf(BEGIN_FIGHT) >= 0) {
                    this.pvpMode = 10;
                }
                if (this.pvpMode === 0 && (a.indexOf(WATCH_PVP_NOTE) >= 0 || a.indexOf(ROOM_PVP_NOTE) >= 0 || a.indexOf(ACTUAL_PVP_NOTE) >= 0)) {
                    let pm0, pm1;
                    if (a.indexOf(WATCH_PVP_NOTE) >= 0) {
                        let info_json = JSON.parse(a.substring(WATCH_PVP_NOTE.length));
                        let info0 = info_json.userInfo.selfInfo;
                        let info1 = info_json.userInfo.oppInfo;
                        this.player0 = new player(0, [info0.guildAttachAdd, info0.guildDefenseAdd], processSpecial(info0.dogzSeriesVO));
                        this.player1 = new player(1, [info1.guildAttachAdd, info1.guildDefenseAdd], processSpecial(info1.dogzSeriesVO));
                        pm0 = info0.spirits;
                        pm1 = info1.spirits;
                    } else if (a.indexOf(ROOM_PVP_NOTE) >= 0) {
                        let info_json = JSON.parse(a.substring(ROOM_PVP_NOTE.length));
                        let info0 = info_json.ownGuild;
                        let info1 = info_json.oppGuild;
                        pm0 = info_json.roomMaster.poke;
                        pm1 = info_json.roomGuest.poke;
                        this.player0 = new player(0, [info0.guildAttackAddition, info0.guildDefenseAddition], processSpecial2(info0));
                        this.player1 = new player(1, [info1.guildAttackAddition, info1.guildDefenseAddition], processSpecial2(info1));
                    } else if (a.indexOf(ACTUAL_PVP_NOTE) >= 0) {
                        let info_json = JSON.parse(a.substring(ACTUAL_PVP_NOTE.length));
                        let info0 = {
                            guildAttackAddition: 0,
                            guildDefenseAddition: 0,
                        }
                        if (info_json.data.ownGuild) {
                            info0 = info_json.data.ownGuild;
                        }
                        let info1 = {
                            guildAttackAddition: 0,
                            guildDefenseAddition: 0,
                        }
                        if (info_json.data.oppGuild) {
                            info1 = info_json.data.oppGuild;
                        }
                        pm0 = info_json.data.myPoke;
                        pm1 = info_json.data.oppUserBasic.poke;
                        this.player0 = new player(0, [info0.guildAttackAddition, info0.guildDefenseAddition], processSpecial2(info0));
                        this.player1 = new player(1, [info1.guildAttackAddition, info1.guildDefenseAddition], processSpecial2(info1));
                    }
                    for (let i of pm0) {
                        this.player0.addElf(i);
                    }
                    for (let i of pm1) {
                        this.player1.addElf(i);
                    }
                    this.pvpMode = 1;
                    this.guildcur = { guild: this.player0.guild, guildspe: this.player0.guildspe};
                    return 1;
                } else if ((this.pvpMode === 1 || this.pvpMode === 5) && a.indexOf(DYNAMAX_INFO) >= 0) {
                    let isDy = a.substring(DYNAMAX_INFO.length);
                    if (isDy === undefined || isDy === "undefined") {
                        this.lastBigger = false;
                    } else {
                        let dydata = JSON.parse(isDy);
                        if (dydata.curUsedId !== undefined && dydata.curUsedId !== null) {
                            if (dydata.allActive[dydata.curUsedId] !== undefined) {
                                this.lastBigger = true;
                            } else {
                                this.lastBigger = false;
                            }
                        } else {
                            this.lastBigger = false;
                        }
                    }
                } else if ((this.pvpMode === 1 || this.pvpMode === 5) && a.indexOf(BEGIN_ELF_INFO) >= 0) {
                    let aa = a.split(' ');
                    let aid = aa[aa.indexOf('name:')+1];
                    let aname = aa[aa.indexOf('name:')+2];
                    let res0 = this.player0.setNameById(+aid, aname, this.lastBigger);
                    if (res0 !== null) {
                        this.cur0 = res0;
                        this.cur = 0;
                        this.lastBigger = false;
                    } else {
                        let res1 = this.player1.setNameById(+aid, aname, this.lastBigger);
                        if (res1 !== null) {
                            this.cur1 = res1;
                            this.cur = 1;
                            this.lastBigger = false;
                        }
                    }
                    this.pvpMode = 3;
                } else if (this.pvpMode === 3 && a.indexOf(BEGIN_ELF_ABILITY) >= 0) {
                    let aa = a.split(' '); aa.shift();
                    let b = aa.map(e=>+e);
                    if (b.length === 7) b.pop();
                    if (this.cur === 0) {
                        this.cur0.setAbility(b);
                    } else {
                        this.cur1.setAbility(b);
                    }
                    this.pvpMode = 4;
                } else if ((this.pvpMode === 4 || this.pvpMode === 5) && a.indexOf(BEGIN_ELF_SKILL) >= 0) {
                    let aa = a.split(' ');
                    let skillname = aa[aa.indexOf(BEGIN_ELF_SKILL) + 2];
                    if (this.cur === 0) {
                        this.cur0.setSkillName(skillname);
                    } else {
                        this.cur1.setSkillName(skillname);
                    }
                    this.pvpMode = 5;
                } else if (this.pvpMode === 5 && a.indexOf("界面=") >= 0) {
                    this.pvpMode = 1;
                }
                return 100;
            },
            getWidth(idx) {
                let mmax = Math.ceil(Math.max(...this.curShow.ABI)/300)*300;
                return Math.round((this.curShow.ABI[idx]/mmax)*10000)/100+'%';
            },
            clearAll() {
                this.player0 = new player(0, [1.0, 1.0], {attack:[{type:'',value:0},{type:'',value:0}],defend:[{type:'',value:0},{type:'',value:0}]}),
                this.player1 = new player(1, [1.0, 1.0], {attack:[{type:'',value:0},{type:'',value:0}],defend:[{type:'',value:0},{type:'',value:0}]}),
                this.cur0 = new elf(-100, ""),
                this.cur1 = new elf(-200, ""),
                this.guildcur = {guild: [], guildspe: []},
                this.curShow = new elf(-300, "");
                this.showwhich = 0;
            }
        },
        mounted() {
            dragTouchELe(this.$refs.mypvpboard);
        },
        created() {
            setTimeout(()=>{
                checkLog();
                window.console.nativeLog = window.console.log;
                var that = this;
                window.console.log = function(a) {
                    try {
                        let xr = that.handleMSG(a.toString());
                        if (xr === 1) {
                            that.onbattle();
                        } else if (xr === -1) {
                            that.offbattle();
                            that.closepvpshow();
                            that.clearAll();
                        }
                    } catch(e) {
                        console.warn(e);
                    }
                }
            }, 10000);
        },
    }

    const app = Vue.createApp({
        components: {
            speedup, settings, pvp
        },
        data() {
            return {
                eyeon: false,
                battle: false,
                speedshow: false,
                moreshow: false,
                pvpshowb: false,
                xe: "",
            }
        },
        template: /* html */ `
        <div id="eye_control" @click="morectrl" ref="myeye">
            <button id="x_eye" :class="eyeon&&battle? 'evoplus evo_eye eye':(eyeon?'evo_eye eye':'eye')">
                <div :class="'jewels eye3' + (battle?' eye_evo':'')">
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                </div>
            </button>
        </div>
        <speedup v-on:nospeed="rec" :ifshow="speedshow" :changeshow="changeSpeedShow" :onspeedup="onspeedup" :offspeedup="offspeedup" :displaymore="displaymore"></speedup>
        <settings :ifshow="moreshow" :hideshow="hidemoreshow"></settings>
        <pvp :openspeed="showsp" :closepvpshow="closepvpshow_" v-show="pvpshowb" :onbattle="onbattle_" :offbattle="offbattle_"></pvp>
        `,
        methods: {
            rec(e) {
                this.xe = e;
            },
            morectrl() {
                if (this.eyeon === true && this.battle === true) {
                    this.pvpshowb = true;
                } else {
                    this.changeSpeedShow();
                }
            },
            showsp() {
                this.speedshow = true;
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
                setTimeout(()=>this.moreshow = false, 300);
            },
            onbattle_() {
                this.xe();
                this.eyeon = true;
                this.battle = true;
            }, 
            offbattle_() {
                this.eyeon = false;
                this.battle = false;
            }
        },
        mounted() {
            dragTouchELe(this.$refs.myeye);
        },
    });
    app.mount('#'+aID);
}
    
}());