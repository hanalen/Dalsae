<template>
  <div class="progress-bar" v-show="percent>0">
		<progress ref="progress" :value="percent" max="100" />
  </div>
</template>

<script>

export default {
	name: "progressbar",
	data:function(){
		return{
			percent:-1,
		}
  },
  computed:{
	},
	methods:{
		SetValue(val){
			this.percent=val;
		}
	},
  mounted: function() {//EventBus등록용 함수들

	},
  components:{
  },
  props: {
  },
};
</script>
<style lang="scss" scoped>
.progress-bar{
	background-color: transparent !important;
}
.progress-bar progress{
	width: 90px;
	margin-left: 5px;
	margin-top: 4px;
}
</style>