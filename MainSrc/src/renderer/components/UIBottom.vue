<template>
  <div class="ui-bottom">
      <i class="fas fa-bars fa-2x" @click="ClickMenu"></i>
      <i class="fas fa-home fa-2x" @click="ClickHome"></i>
      <i class="far fa-bell fa-2x" @click="ClickMention"></i>
      <!-- <i class="far fa-envelope fa-2x" @click="ClickDM"></i> -->
      <i class="far fa-heart fa-2x" @click="ClickFavorite"></i>
      <!-- <i class="fas fa-link fa-2x" @click="ClickLink"></i> -->
  </div>
</template>

<script>
export default {
  name: "uitop",
  components:{
  },
  props: {
  },
  methods:{
    ClickMenu(e){
      this.EventBus.$emit('OpenUIOption');
    },
    ClickHome(e){
      this.EventBus.$emit('FocusPanel', 'home');
    },
    ClickMention(e){
      this.EventBus.$emit('FocusPanel', 'mention');
    },
    ClickDM(e){
      this.EventBus.$emit('FocusPanel', 'dm');
    },
    ClickFavorite(e){
      this.EventBus.$emit('FocusPanel', 'favorite');
    },
    ClickLink(e){
      this.EventBus.$emit('FocusPanel', 'link');
    },
    
  }
};
</script>
<style lang="scss" scoped>
.ui-bottom{
    position:fixed;
    padding: 4px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: auto;
    background-color: #76c6fe;
    padding-left:14px;
    i{
      font-size:20px;
      padding:8px;
      transition: all .5s cubic-bezier(.25,.8,.25,1);
      color:white;
      margin-right:10px;
      &:hover{
        cursor: pointer;
        border-radius: 10px;
        background-color: hsla(0, 0%, 91%,.4);
        transition: all .5s cubic-bezier(.25,.8,.25,1);
      }
    }
    
}
</style>