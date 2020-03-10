<template>
  <div v-if="isShow" class="find-following">
    <div class="dis-flex">
      <following-item v-for="(item, index) in list"
        v-bind:key="item.index"
        v-bind:class="{selected: index === selectIndex}"
        :name="item.name"
        :screen_name="item.screen_name"
        :profile_image_url="item.profile_image_url" 
        ref="list"
        />
    </div>
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import FollowingItem from './Following-Item.vue'
export default {
  name: "findfollowing",
  components:{
    FollowingItem
  },
  props: {
    isShow:false,
    list:undefined,
    mentionID:''
  },
  data:function(){
    return{
      selectIndex:0
    }
  },
  methods:{
    GetSelectScreenName(){
      return this.list[this.selectIndex].screen_name;
    }
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('arrowDown', () => {
      this.selectIndex++;
      if(this.selectIndex >= this.list.length){
        this.selectIndex = this.list.length - 1;
      }
      this.$refs.list[this.selectIndex].Focus();
    });
    this.EventBus.$on('arrowUp', () => {
      this.selectIndex--;
      if(this.selectIndex < 0){
        this.selectIndex = 0;
      }
      this.$refs.list[this.selectIndex].Focus();
    });
  },
};
</script>
<style lang="scss" scoped>
.find-following{
  position: absolute;
  top:100px;
  z-index: 10;
  border-radius: 8px;
  border: 1px dashed black;
  overflow: hidden;
  .dis-flex{
    overflow-y: scroll;
    max-height: 300px;
    max-width: 500px;
  }
}
</style>