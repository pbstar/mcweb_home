<template>
  <div class="fbody">
    <div :class="screenType + 'Box'">
      <main id="main">
        <div class="page">
          <div class="page1Box">
            <div class="boxleft">
              <div class="blTop">
                <div class="cards headpicBox" @click="toMusic">
                  <img
                    :class="isMusic ? 'headpic musicIng' : 'headpic'"
                    src="@/assets/imgs/headpic.jpg"
                    alt=""
                  />
                  <div class="mask"></div>
                  <i class="el-icon-video-play" v-if="!isMusic" />
                  <i class="el-icon-video-pause" v-else />
                </div>
                <span>{{ $config.nameCn }}</span>
              </div>
              <div class="blMid1 cards">
                <Typed
                  :typedList="typedList"
                  overflow="scroll"
                  :scrollLength="screenType == 'small' ? 17 : 31"
                />
              </div>
              <div class="blMid2 cards">hh</div>
              <div class="blBot">
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  v-for="(item, index) in contatctList"
                  :key="index"
                  placement="bottom"
                >
                  <img
                    :src="item.icon"
                    :alt="item.name"
                    :style="
                      'width:' + item.width + ';height:' + item.height + ';'
                    "
                    @click="toContatct(item)"
                  />
                </el-tooltip>
              </div>
            </div>
            <div class="boxRight">
              <div class="brTop">
                <div class="brTLeft cards" @click="getHitokoto()">
                  <p class="overflowDot3">{{ hitokoto }}</p>
                  <p class="overflowDot1">
                    -「&nbsp;{{ hitokotoFrom }}&nbsp;」
                  </p>
                </div>
                <div class="brTRight cards">
                  <p>
                    {{ time.year }}年{{ time.month }}月{{ time.day }}日&nbsp;{{
                      time.weekday
                    }}
                  </p>
                  <p>{{ time.hour }}:{{ time.minute }}:{{ time.second }}</p>
                  <p class="overflowDot1">
                    {{ cityName }}&nbsp;{{ weather }}&nbsp;{{
                      temperature
                    }}°C&nbsp;{{ winddirection }}风&nbsp;{{ windpower }}级
                  </p>
                </div>
              </div>
              <div class="brBot">
                <div
                  class="brBotBox cards"
                  v-for="(item, index) in websiteList"
                  :key="index"
                  :style="index % 3 == 0 ? 'margin-left:0;' : ''"
                  @click="toWebBox(item)"
                >
                  <div class="imgbox">
                    <img
                      :src="item.icon"
                      :alt="item.name"
                      :style="
                        'width:' + item.width + ';height:' + item.height + ';'
                      "
                    />
                  </div>

                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="page">第二页</div>
        <div class="page">最后一页</div> -->
      </main>
    </div>
    <webFooter :screenType="screenType" />
    <audio
      ref="alertAudioEl"
      style="display: none"
      src="http://m801.music.126.net/20230517181229/2984002ed49d9fd9d90de5b46be07cc5/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096513422/df95/bfad/2e9e/cf623d6ebd32f754e24a4017caa261db.mp3"
    />
  </div>
</template>
<script>
import cursorInit from "@/assets/js/cursor.js";
import time from "@/assets/units/time.js";
import Api from "@/server/api.js";
import contatct from "@/assets/jsons/contact.json";
import website from "@/assets/jsons/website.json";
import Typed from "@/components/typed";
import webFooter from "@/components/footer";
export default {
  name: "App",
  components: {
    Typed,
    webFooter,
  },
  data() {
    return {
      screenType: "none",
      provinceName: "北京市",
      cityName: "北京市",
      adcode: "110000",
      weather: "",
      temperature: "",
      winddirection: "",
      windpower: "",
      hitokoto: "",
      hitokotoFrom: "",
      time: "",
      timeInterval: "",
      contatctList: [],
      websiteList: [],
      typedList: ["hello", "欢迎光临我的主页"],
      isMusic: false,
    };
  },
  created() {
    cursorInit(); //初始化鼠标
    this.contatctList = contatct;
    this.websiteList = website;
    this.getConfig();
    this.getTime();
    window.addEventListener("resize", this.onResize());
  },
  mounted() {
    this.getHitokoto();
    this.getArea();
    this.getWeather();
    let loading = document.getElementById("p_app_loading_mask");
    loading.style.display = "none";
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize());
    clearInterval(this.timeInterval);
  },
  methods: {
    onResize() {
      if (window.innerWidth > 1300) {
        this.screenType = "big";
      } else if (window.innerWidth <= 1300 && window.innerWidth > 500) {
        this.screenType = "medium";
      } else if (window.innerWidth <= 500) {
        this.screenType = "small";
      } else {
        this.$notify({
          title: "提示",
          message: "获取设备可视宽度失败！",
          duration: 0,
          type: "warning",
          position: "bottom-right",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    getConfig() {
      Api.getConfig().then((res) => {
        if (res.code == 200) {
          if (this.$config.version != res.data.version) {
            this.$notify({
              title: "提示",
              message: "网页内容已更新，请刷新浏览器或清除浏览器缓存！",
              duration: 0,
              type: "warning",
              position: "bottom-right",
              dangerouslyUseHTMLString: true,
            });
          }
        }
      });
    },
    getArea() {
      Api.getAdcode().then((e) => {
        if (e.code == 200) {
          this.provinceName = e.data.province;
          this.cityName = e.data.city;
          this.adcode = e.data.adcode;
        }
      });
    },
    getWeather() {
      Api.getWeather(this.adcode).then((e) => {
        if (e.code == 200) {
          if (e.data.lives && e.data.lives.length > 0) {
            let data = e.data.lives[0];
            this.weather = data.weather;
            this.temperature = data.temperature;
            this.winddirection = data.winddirection;
            this.windpower = data.windpower;
          }
        }
      });
    },
    getHitokoto() {
      Api.getHitokoto().then((e) => {
        if (e.code == 200) {
          this.hitokoto = e.data.hitokoto;
          this.hitokotoFrom = e.data.from;
        }
      });
    },
    getTime() {
      this.time = time.getCurrentTime();
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      this.timeInterval = setInterval(() => {
        if (this.time.second < 59) {
          this.time.second++;
          if (this.time.second < 10) this.time.second = "0" + this.time.second;
        } else {
          this.getTime();
        }
      }, 1000);
    },
    toContatct(e) {
      if (e.type == 1) {
        window.open(e.url);
      } else if (e.type == 2) {
        this.$notify({
          title: e.name,
          message: e.text,
          duration: 0,
          position: "bottom-right",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    toWebBox(e) {
      if (e.type == 1) {
        window.open(e.url);
      } else if (e.type == 2) {
        this.$notify({
          title: e.name,
          message: e.text,
          duration: 0,
          position: "bottom-right",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    toMusic() {
      this.isMusic = !this.isMusic;
      if (this.isMusic) {
        this.$refs.alertAudioEl.play();
      } else {
        this.$refs.alertAudioEl.pause();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.fbody {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/imgs/background.webp");
  background-size: cover;
  .bigBox,
  .mediumBox,
  .smallBox {
    #main {
      width: 100vw;
      height: 100vh;
      scroll-snap-type: y mandatory;
      overflow-y: scroll;
      overflow-x: hidden;
      background-color: #00000020;
      .page {
        width: 100vw;
        height: 100vh;
        scroll-snap-align: start;
        overflow: hidden;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .bigBox {
    .page1Box {
      width: 1200px;
      height: 560px;
      display: flex;
      justify-content: space-between;
      .boxleft {
        width: 560px;
        .blTop {
          width: 100%;
          height: 155px;
          margin-bottom: 30px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          span {
            margin-left: 20px;
            font-size: 50px;
            text-shadow: -1px 0 3px #eeeeee;
            font-family: KaiTi;
          }
          .headpicBox {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            position: relative;
            .mask {
              position: absolute;
              display: none;
              border-radius: 50%;
              left: 0;
              top: 0;
              width: 120px;
              height: 120px;
              background-color: rgba(0, 0, 0, 0.4);
            }

            i {
              display: none;
              position: absolute;
              top: 50%;
              left: 50%;
              width: 30px;
              height: 30px;
              font-size: 30px;
              margin-left: -15px;
              margin-top: -15px;
            }
          }
          .headpicBox:hover {
            i {
              display: block;
            }
            .mask {
              display: block;
            }
          }
          .headpic {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            animation: rotation 15s linear infinite;
            animation-play-state: paused;
          }
          .musicIng {
            animation-play-state: running;
          }
          @keyframes rotation {
            0% {
              -webkit-transform: rotate(0deg);
            }

            100% {
              -webkit-transform: rotate(360deg);
            }
          }
        }
        .blMid1 {
          height: 55px;
          padding: 18px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          overflow-x: auto;
        }
        .blMid2 {
          height: 180px;
          padding: 18px 20px;
        }
        .blBot {
          display: flex;
          align-items: center;
          height: 60px;
          margin-top: 10px;
          img {
            margin-right: 10px;
          }
        }
      }
      .boxRight {
        width: 560px;
        .brTop {
          width: 100%;
          height: 160px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          .brTLeft,
          .brTRight {
            height: 100%;
            p {
              width: 100%;
              text-align: center;
            }
          }
          .brTLeft {
            padding: 18px 20px;
            width: 260px;
            display: flex;
            flex-direction: column;
            line-height: 30px;
            p:nth-child(1) {
              text-align: left;
              height: 90px;
            }
            p:nth-child(2) {
              height: 30px;
              margin-top: 4px;
              text-align: right;
              font-weight: bold;
            }
          }
          .brTRight {
            padding: 18px 20px;
            width: 280px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            line-height: 30px;
            p:nth-child(2) {
              font-family: "UnidreamLED";
              letter-spacing: 2px;
              font-size: 45px;
            }
          }
        }
        .brBot {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          flex-grow: 3;
          justify-content: space-between;
          .brBotBox {
            width: 175px;
            height: 55px;
            line-height: 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            .imgbox {
              width: 60px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img {
              margin-left: 6px;
            }
          }
        }
      }
    }
  }
  .smallBox {
    .page1Box {
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      .boxleft {
        width: 90vw;
        .blTop {
          width: 100%;
          height: 80px;
          margin-bottom: 30px;
          padding-top: 20px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }
          span {
            margin-left: 20px;
            font-size: 40px;
            text-shadow: -1px 0 3px #eeeeee;
            font-family: KaiTi;
          }
        }
        .blMid1 {
          height: 50px;
          padding: 10px 20px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          overflow-x: auto;
        }
        .blMid2 {
          height: 180px;
          padding: 10px 20px;
        }
        .blBot {
          display: flex;
          align-items: center;
          height: 60px;
          // margin-top: 10px;
          img {
            margin-right: 10px;
          }
        }
      }
      .boxRight {
        display: none;
      }
    }
  }
  .noneBox {
    display: none;
  }
}
</style>