<template>
  <div ref="followitem" :class="{'following-item':true, 'selected' :selected}" @click="IDClick" tabindex="-1">
    <img v-bind:src="profile_image_url" />
    <div>
      <span class="bold">{{name}}</span>
      <br />
      <span class="thin">{{screen_name}}</span>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../main.js";
export default {
  name: "followingitem",
  components: {},
  props: {
    profile_image_url: "",
    name: "",
    screen_name: "",
    selected: true
  },
  created: function() {},
  methods: {
    IDClick(e) {
      this.EventBus.$emit("mentionSelect", this.screen_name);
    },
    Focus(e){
      this.$refs.followitem.scrollIntoView();
    },
  }
};
</script>
<style lang="scss" scoped>
.following-item:hover {
  background-color: #a3d9fe;
  cursor: pointer;
}
.selected {
  background-color: #a3d9fe !important;
}
.following-item {
  display: flex;
  background-color: white;
  width: 100%;
//   height: 60px;
  padding: 4px;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
  .bold {
    font-weight: bold;
  }
  .thin {
    color: hsla(0, 0, 20, 1.0);
  }
  img {
    border-radius: 5px;
    width: 30px;
    height: 30px;
  }
}
</style>