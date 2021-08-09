<template>
  <div class="download-item">
    <div class="complete" v-if="isComplete">
      <span>완료</span>
    </div>
    <div class="fail" @click="Retry" v-if="isError">
      <i class="fas fa-redo-alt"></i>
      <span>실패</span>
    </div>
    <img class="img" :src="media.media_url_https+':thumb'"/>
    <ProgressBar ref="progress" />
  </div>
</template>

<script>
const app = require('electron').remote.app
import ProgressBar from '../../Common/ProgressBar.vue'
export default {
  name: "downloaditem",
  components: {
		ProgressBar,
  },
  data: function() {
    return {
      isComplete:false,
      isError:false,
    };
  },
  props:{
    path:{
      type:String,
      default:'',
    },
    media:undefined,
    index:{
      type:Number,
      default:0,
    }
  },
  computed:{

  },
  created: function() {
    this.$nextTick(()=>{
      this.DownloadImage()
    })
  },
  methods: {
    Complete(){
      this.isComplete=true;
    },
    Error(){
      this.isError=true;
    },
    Retry(){
      this.isComplete=false;
      this.isError=false;
    },
		DownloadImage(){
      //progress show, hide 해야 함
			var vthis=this;
      var progress = this.$refs.progress
      var http = require('http');
      var url = this.media.media_url + ':orig';
			var fs = require('fs');
      var fileName = this.media.media_url.substring(this.media.media_url.lastIndexOf('/')+1,9999999999);
			var file = fs.createWriteStream(this.path+'/Dalsae/Image/'+fileName);
			const request = http.get(url).on('response', function(res) {
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
			let percent = 0
      res
        .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
					percent = (100.0 * downloaded / len).toFixed(2)
					progress.SetValue(percent);
        })
        .on('end', function() {
          file.end()
          vthis.Complete();
        })
        .on('error', function (err) {
          vthis.Error();
					console.log('img down error!!!')
					console.log(err)
        })
    	})
		},
  },
};
</script>

<style lang="scss" scoped>
.download-item{
  position: relative;
  padding: 10px;
  .complete{
    background-color: rgba(0, 0, 0, 0.568);
    width: 100px;
    height: 100px;
    position: absolute;
    span{
      color: white;
      font-size: 20px;
    }
  }
  .fail{
    background-color: rgba(255, 157, 157, 0.473);
    cursor: pointer;
    span{
      color: white;
      font-size: 20px;
    }
  }
  .img{
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 10px;
  }
}
i{
  font-size: 30px;
}
</style>
