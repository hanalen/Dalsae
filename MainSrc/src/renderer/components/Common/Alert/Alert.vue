<template>
  <div class="alert-item" v-if="msg != undefined">
		<div class="alert alert-primary" role="alert" v-if="msg.type=='normal'">
  		{{msg.msg}}
		</div>
		<div class="alert alert-danger" role="alert" v-if="msg.type=='error'">
  		{{msg.msg}}
		</div>
  </div>
</template>

<script>
import {EventBus} from '../../../main.js';
import Alert from './Alert.vue'
export default {
  name: "alertagent",
  data() {
    return {
    };
	},
	props:{
		msg:undefined,
	},
	created:function() {
  },
	computed:{
	},
  methods: {
	},
};
</script>

<style lang="scss" scoped>
.alert-item{
	width: 60vw;
	margin: auto;
	height: auto;
}

.alert{
	padding: 6px !important;
}
</style>
