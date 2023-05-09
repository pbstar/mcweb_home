<template>
  <div class="fbody">
    <div :class="screenType + 'Box'">
      <main id="main">
        <div class="page">
          <div class="page1Box">
            <div class="boxleft">
              <div class="blTop">
                <img class="cards" src="@/assets/imgs/headpic.jpg" alt="" />
                <span>11</span>
              </div>
              <div class="blMid cards">资料</div>
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
              <div class="brBot"></div>
            </div>
          </div>
        </div>
        <div class="page">第二页</div>
        <div class="page">最后一页</div>
      </main>
    </div>
    <div class="footer">
      <span
        >Copyright&nbsp;&copy;&nbsp;2023
        <a :href="$config.webUrl">{{ $config.nameCn }}</a>
      </span>
      <span class="hidden"
        >&nbsp;&amp;&nbsp;Made&nbsp;by&nbsp;<a
          :href="$config.githubUrl"
          target="_blank"
        >
          {{ $config.nameEn }}
        </a></span
      >&nbsp;&amp;&nbsp;
      <a href="https://beian.miit.gov.cn" target="_blank">{{
        $config.beianCode
      }}</a>
    </div>
  </div>
</template>
<script>
import cursorInit from "@/assets/js/cursor.js";
import time from "@/assets/units/time.js";
import Api from "@/server/api.js";
export default {
  name: "App",
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
    };
  },
  created() {
    //初始化鼠标
    cursorInit();
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
      width: 1100px;
      height: 500px;
      display: flex;
      justify-content: space-between;
      .boxleft {
        width: 500px;
        .blTop {
          width: 100%;
          height: 160px;
          margin-bottom: 30px;
          img {
            width: 160px;
            height: 160px;
            border-radius: 50%;
          }
        }
        .blMid {
          height: 300px;
        }
      }
      .boxRight {
        width: 520px;
        .brTop {
          width: 100%;
          height: 160px;
          margin-bottom: 30px;
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
            width: 230px;
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
            width: 270px;
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
      }
    }
  }
  .noneBox {
    display: none;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00000040;
    color: #fefefe;
    font-size: 13px;
    a {
      color: #fefefe;
    }
  }
}
</style>