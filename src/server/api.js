import http from "@/assets/js/http";
let amap_key = "21cafd233b6716a57334301c03e81d63"

function getConfig() {
  return new Promise((resolve, reject) => {
    http.defaultGet("./config.json").then((e) => {
      resolve({
        code: 200,
        msg: '请求成功',
        data: e
      })
    }).catch(err => {
      resolve({
        code: 100,
        msg: '获取失败',
        data: err
      });
    })
  })
}
function getHitokoto() {
  return new Promise((resolve, reject) => {
    http.defaultGet("https://v1.hitokoto.cn").then(e => {
      resolve({
        code: 200,
        msg: '请求成功',
        data: e
      })
    }).catch(err => {
      resolve({
        code: 100,
        msg: '获取失败',
        data: err
      });
    })
  })
}
function getAdcode() {
  return new Promise((resolve, reject) => {
    http.defaultGet("https://restapi.amap.com/v3/ip?key=" + amap_key).then(e => {
      resolve({
        code: 200,
        msg: '请求成功',
        data: e
      })
    }).catch(err => {
      resolve({
        code: 100,
        msg: '获取失败',
        data: err
      });
    })
  })
}
function getWeather(city) {
  return new Promise((resolve, reject) => {
    http.defaultGet("https://restapi.amap.com/v3/weather/weatherInfo?key=" + amap_key + "&city=" + city).then(e => {
      resolve({
        code: 200,
        msg: '请求成功',
        data: e
      })
    }).catch(err => {
      resolve({
        code: 100,
        msg: '获取失败',
        data: err
      });
    })
  })
}

export default {
  getHitokoto,
  getConfig,
  getAdcode,
  getWeather
}