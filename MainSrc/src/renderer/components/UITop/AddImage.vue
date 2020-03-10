<template>
  <div class="add-image">
    <img v-bind:src="path" />
    <button class="close" @click="OnClickRemove"></button>
  </div>
</template>

<script>
import { EventBus } from "../../main.js";

export default {
  name: "tweetinput",
  components: {
    EventBus
  },
  created() {
    // console.log('aa');
    // console.log(path);
  },
  props: {
    path: undefined,
    width: undefined,
    height: undefined,
    index: 0
  },
  methods: {
    OnClickRemove(e) {
      this.EventBus.$emit("RemoveAddImage", this.index);
    }
  }
};
</script>
<style lang="scss" scoped>
.add-image {
  // display: flex;
  position: relative;
  // flex: 1;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 13px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    // margin-bottom: 10px;
  }
  // button {
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  // }
  .close {
    outline: none;
    position: absolute;
    right: 10px;
    top: 5px;
    width: 30px;
    height: 30px;
    opacity: 0.7;
    border-radius: 14px;
    background-color: black;
  }
  .close:hover {
    opacity: 1.0;
  }
  .close:before,
  .close:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 16px;
    width: 2px;
    top:7px;
    left:14px;
    background-color: white;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }
}
</style>