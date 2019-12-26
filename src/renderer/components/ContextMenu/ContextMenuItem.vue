<template>
  <div :class="{'context-menu-item':true, 'selected':selected}" @click="Click" tabindex="-1"
				@focus="Focused" v-on:focusout="FocusOut">
		<div class="inner-box">
			<div class="context-item-left">
		 		<span>{{menuText}}</span>
			</div>
			<div class="context-item-right">
		 		<span>{{hotkey}}</span>
			</div>
		</div>
  </div>
</template>

<script>

export default {
	name: "contextmenuitem",
	data:function(){
		return{
			selected:false,
		}
  },
  computed:{
	},
	methods:{
		Click(e){
			e.preventDefault();
			if(this.callback!=undefined){
				this.callback(this.menuText);
			}
		},
		Focused(e){
			this.selected=true;
		},
		FocusOut(e){
			this.selected=false;
		},
	},
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('ContextEnter', (e) => {
			if(this.selected && this.callback!=undefined){
				this.callback(this.menuText);
			}
		});
	},
  components:{
  },
  props: {
		menuText:undefined,
		hotkey:undefined,
		callback:undefined,
  },
};
</script>
<style lang="scss" scoped>
.context-menu-item{
	color: black;
	.line{
		border-bottom: 1px solid rgb(151, 151, 151);
	}
	.inner-box{
		display: flex;
		flex-direction: row;
		margin-left: 10px;
		.context-item-left{
			text-align: left;
			width: 90%;
		}
		.context-item-right{
			margin-left: 10px;
			margin-right: 10px;
			text-align: right;
			width: auto;
		}
	}
}
.context-menu-item.selected{
	background-color: #c3e0ee !important;
}
.context-menu-item:hover{
		background-color: #c3e0ee;
}
</style>