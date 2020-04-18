<template>
  <div class="dm-panel">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import DMCall from './DMCall.js';
import OAuth from '../../OAuth.js'
import axios from 'axios'

export default {
  name: "dmcall",
  props: {
  },
  created:function() {
		
  },
  data() {
    return {
    };
	},
	computed:{
		selectAccount(){
			return this.$store.state.Account.selectAccount;
    }
	},
  methods: {
		
	},
};
</script>

<style lang="scss">

</style>
