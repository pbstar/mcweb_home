<template>
  <div>
    <div :class="screenType == 'small' ? 'footerSmall footer' : 'footer'">
      <span
        >Copyright&nbsp;&copy;&nbsp;2023
        <a :href="$config.webUrl">{{ $config.nameCn }}</a>
      </span>
      <span class="hidden" v-show="screenType != 'small'"
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
export default {
  name: "footer",
  props: {
    screenType: "",
  },
};
</script>
<style lang="scss" scoped>
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
.footerSmall {
  font-size: 12px;
  height: 40px;
}
</style>
