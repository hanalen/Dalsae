<template>
  <div class="user-list">
    <span class="title">{{title}}</span>
    <div class="list" v-if="listUser!=undefined">
      <UserItem v-for="(item, index) in listUser" :key="index" :user="item"/>
    </div>
  </div>
</template>

<script>
import UserItem from './UserItem.vue'
export default {
  name: "userlist",
  components: {
		UserItem,
  },
  data: function() {
    return {
      title:'',
    };
  },
	props:{
    listUser:undefined,
	},
  created: function() {
  },
  methods: {
    ChangeList(name, screenName, isFollowing){
      var str = this.title='@'+screenName+' ('+name+') 님의';
      if(isFollowing)
        str+='팔로잉 목록'
      else
        str+='팔로워 목록'
      this.title=str;
    }
  },
};
</script>

<style lang="scss" scoped>
.title{
  width: 100%;
  height: 20px;
}
.user-list{
	width: 100%;
	height: 490px;
}
.list{
	width: 100%;
	height: 470px;
	overflow-x:hidden;
  overflow-y: auto;
}
</style>
