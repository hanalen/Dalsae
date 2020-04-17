<template>
  <div :class="{'context-menu-item':true, 'selected':selected}" @click="Click" tabindex="-1"
				@focus="Focused" v-on:focusout="FocusOut" @mouseenter="Hover" @keydown.enter="Enter">
		<div class="inner-box">
			<div class="context-item-left">
		 		<span>{{menuText}}</span>
			</div>
			<div class="context-item-right">
		 		<span>{{hotkeyText}}</span>
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
		hotkeyText(){
			if(this.hotkey=='') return '';

			var hotkey = this.$store.state.DalsaeOptions.hotKey[this.hotkey];
			if(hotkey==undefined) return '';

			var str = hotkey.isCtrl ? 'Ctrl+' : ''
			str += hotkey.isAlt ? 'Alt+' : '' 
			str += hotkey.isShift ? 'Shift+' : '' 
			str += (hotkey.key.charAt(0).toUpperCase()+hotkey.key.substring(1,999));
			return str;
		}
	},
	methods:{
		Enter(e){
			e.preventDefault();
			if(this.callback!=undefined){
				if(this.url)
					this.callback(this.url);
				else
					this.callback(this.menuText);
			}
		},
		Click(e){
			e.preventDefault();
			if(this.callback!=undefined){
				if(this.url)
					this.callback(this.url);
				else
					this.callback(this.menuText);
			}
		},
		Focused(e){
			this.selected=true;
		},
		FocusOut(e){
			this.selected=false;
		},
		Hover(e){
			if(this.mouseenter){
				this.mouseenter(this);
			}
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
		url:undefined,
		menuText:undefined,
		hotkey:undefined,
		callback:undefined,
		mouseenter:undefined,
  },
};
</script>
<style lang="scss" scoped>
.context-menu-item{
	font-size: 14px;
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