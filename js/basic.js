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
            // var head  = ;
            // var link  = document.createElement('link');
            // link.id   = cssId;
            script.rel  = 'stylesheet';
            script.type = 'text/css';
            script.href = url;
            // link.media = 'all';
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
    if (existingScript && callback) callback();
};

window.addEventListener('DOMContentLoaded', () => {
    loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/basic.css", undefined, 'basic-css');
    // loadDynamicScript('link', "basic.css", undefined, 'basic-css');
    loadDynamicScript('script', "https://unpkg.com/vue@next", VueStart, 'vue3load');
});
loadDynamicScript('link', "https://cdn.jsdelivr.net/gh/tempvalut/temppokescript@main/css/basic.css", undefined, 'basic-css');
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
        data() {
            return {
                // mystatus: this.status,
                // id: "switch-toggle_" + Math.floor(Math.random() * Math.round(Math.random() * Date.now().valueOf())),
            }
        },
        methods: {
            changeMy() {
                // this.mystatus = !this.mystatus;
                this.change();
            }
        },
        template: /* html */ `
        <div class="switch-toggle-outer">
            <!--<input type="checkbox" :checked="status" :id="id">:for="id"-->
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
            var that = this;
            function urlCase(url) {
                if (url.indexOf("h5.kxgcw.com/1604021180/assets/otherAssets/music/pvpMusic/pvpBgm") > -1 || 
                    url.indexOf("h5.kxgcw.com/1593740029/assets/ui/PC/pvpDynamicBg1") > -1) {
                    console.warn("检测到您可能点击了PVP，已自动关闭加速(如果不是，请忽略)");
                    that.offmanual();
                }
            }
            var originOpen = XMLHttpRequest.prototype.open;
            var originSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open = function () {
                this.addEventListener('load', function (obj) {
                    var url = obj.target.responseURL; // obj.target -> this
                    urlCase(url);
                });
                originOpen.apply(this, arguments);
            };
            XMLHttpRequest.prototype.send = function () {
                originSend.apply(this, arguments);
            };
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
                        }
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
                        }
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
            <div class="settings-tail">版本号: v2.0.0_beta_2021.12.25</div>
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
            for (let i = 1; i <= 2; i++) {
                this.configs[i].details.change();
            }
        },
    }

    const app = Vue.createApp({
        components: {
            speedup, settings,
        },
        data() {
            return {
                eyeon: false,
                battle: false,
                speedshow: false,
                moreshow: false,
            }
        },
        template: /* html */ `
        <div id="eye_control" @click="changeSpeedShow" ref="myeye">
            <button id="x_eye" :class="eyeon&&battle? 'evoplus evo_eye eye':(eyeon?'evo_eye eye':'eye')">
                <div :class="'jewels eye3' + (battle?' eye_evo':'')">
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                    <span class="jewel"></span>
                </div>
            </button>
        </div>
        <speedup :ifshow="speedshow" :changeshow="changeSpeedShow" :onspeedup="onspeedup" :offspeedup="offspeedup" :displaymore="displaymore"></speedup>
        <settings :ifshow="moreshow" :hideshow="hidemoreshow"></settings>
        `,
        methods: {
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
            }
        },
        mounted() {
            dragTouchELe(this.$refs.myeye);
        },
    }).mount('#'+aID);
}

}());