<template>
<div ref="followitem" :class="{'following-item':true, 'selected' :selected}" @click="IDClick">
    <img v-bind:src="profile_image_url"/>
    <div>
        <span class="bold">{{name}}</span><br>
        <span class="thin">{{screen_name}}</span>
    </div>
</div>
</template>

<script>
import {EventBus} from '../../main.js';
export default {
  name: "followingitem",
  components:{
  },
  props: {
      profile_image_url:'',
      name:'',
      screen_name:'',
      selected:true
  },
  created:function(){
  },
  methods:{
      IDClick(e){
        this.EventBus.$emit('mentionSelect', this.screen_name);
      }
  }
};
</script>
<style lang="scss" scoped>
div:hover{
    background-color: rgb(216, 216, 216);
    
    cursor: pointer;
}
.selected{
    background-color: rgb(110, 110, 110) !important;
}
.following-item{
    display: flex;
    background-color: white;
    width: 100%;
    border-bottom: 1px solid black;
    
    .bold{
        font-weight: bold;
    }
    .thin{
        color: gray;
    }
    img{
    border-radius: 5px;
    margin: 5px;
}
}

</style>