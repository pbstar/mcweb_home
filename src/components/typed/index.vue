<template>
  <div>
    <div class="typedText" :class="overflow == 'scroll' ? 'scroll' : ''">
      {{ typedText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "typed",
  props: {
    typedList: [],
    loop: {
      type: Boolean,
      default: true,
    },
    overflow: {
      type: String,
      default: "auto",
    },
    speed: {
      type: Number,
      default: 200,
    },
    scrollLength: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      typedText: "",
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      let j = 0;
      let k = 0;
      this.typedText = "";
      if (this.typedList.length <= 0) {
        console.error("typedList数据缺失");
        return;
      }
      let arr = this.typedList[k].split("");
      let timer = setInterval(() => {
        if (j < arr.length) {
          if (
            this.overflow == "scroll" &&
            this.typedText.length > this.scrollLength
          ) {
            this.typedText = this.typedText.slice(1);
          }
          this.typedText += arr[j++];
        } else if (j == arr.length) {
          this.typedText += "";
          j++;
        } else {
          if (k < this.typedList.length - 1) {
            k++;
            j = 0;
            this.typedText = "";
            arr = this.typedList[k].split("");
          } else {
            clearInterval(timer);
            if (this.loop) {
              this.start();
            }
          }
        }
      }, this.speed);
    },
  },
};
</script>
<style lang="scss" scoped>
.typedText::after {
  content: "|";
  animation: blink 1s infinite;
}
@keyframes blink {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.scroll {
  white-space: nowrap;
}
</style>
