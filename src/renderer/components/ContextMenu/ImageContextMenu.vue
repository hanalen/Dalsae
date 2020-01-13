<template>
  <div ref="context" v-if="isVisible" class="context-menu" @keydown.down="ArrowDown" @keydown.up="ArrowUp"
      @keydown.enter="Enter" @keydown.esc="Esc" tabindex="-1"
			v-bind:style="[{'left':x+'px', 'top':y+'px'}]" v-on:focusout="FocusOut" @focus="Focused">
    <div class="context-list" ref="list" tabindex="-1">
      <ContextMenuItem ref="save" :menuText="'저장'" :hotkey="'S'" :callback="Save"/>
      <ContextMenuItem ref="saveAll" :menuText="'모두 저장'" :hotkey="'A'" :callback="SaveAll"/>
    </div>
		
  </div>
</template>

<script>
import axios from 'axios'
import ContextMenuItem from "./ContextMenuItem.vue";
import { Readable } from 'stream';
export default {
  name: "contextmenu",
  data: function() {
    return {
      isVisible: false,
      x: 300,
      y: 0,
      selectIndex: 0
    };
  },
  computed: {},
  mounted: function() {
    //EventBus등록용 함수들
    this.EventBus.$on("TTTT", e => {});
  },
  props: {
		index:undefined,
		images:undefined,
  },
  methods: {
    Save(){
      this.EventBus.$emit('Save')
			// this.DownloadFile2(this.images[this.index]);
    },
    SaveAll(){
      this.EventBus.$emit('SaveAll')
			// for(var i=0;i<this.images.length;i++)
      // 	this.DownloadFile2(this.images[i]);
		},
		DownloadFile2(media){
			var http = require('http');
			var url = media.media_url;
			var fs = require('fs');
			var fileName = url.substring(url.lastIndexOf('/'),9999999999);
			var file = fs.createWriteStream('Image/'+fileName);

			const request = http.get(url).on('response', function(res) {
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      let percent = 0
      res
        .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / len).toFixed(2)
          console.log(`Downloading ${percent}% ${downloaded} bytes\r`)
        })
        .on('end', function() {
					file.end()
					console.log('down ok~')
        })
        .on('error', function (err) {
					console.log('img down error!!!')
					console.log(err)
        })
    })
		},
		DownloadFile(media){//트윗 media객체
			var http = require('http');
			var url = media.media_url;
			var fs = require('fs');
			var fileName = url.substring(url.lastIndexOf('/'),9999999999);
			var filePath = fs.createWriteStream('Image/'+fileName);
			const request = new HttpRequest('GET', url,  {
				reportProgress: true
			});

			http.request(request).subscribe(event => {
				// progress
				if (event.type === HttpEventType.DownloadProgress) {
					console.log(event.loaded, event.total); 
					// event.loaded = bytes transfered 
					// event.total = "Content-Length", set by the server
					const percentage = 100 / event.total * event.loaded;
					console.log(percentage);
				}

				// finished
				if (event.type === HttpEventType.Response) {
					response.pipe(filePath);
					console.log('down ok')
					// console.log(event.body);
				}
			})

			// var request = http.get(url+':orig', function(response) {
			// 	console.log(response)
			// 	response.pipe(filePath);
			// 	console.log('down ok')
			// });
		},
		// DownloadFile(media){//트윗 media객체
		// 	var method='GET';
		// 	var url = media.media_url;
		// 	axios({
		// 		method:method,
		// 		url:url,
		// 		responseType:'stream'
		// 	}).then((res)=>{
		// 		console.log('img down ok~');
		// 		var fs = require('fs');
		// 		var fileName = url.substring(url.lastIndexOf('/'),9999999999);
		// 		var file = fs.createWriteStream('Image/'+fileName);
		// 		console.log(fileName);
		// 		console.log(file);
		// 		console.log(res);
		// 		const readable  = new Readable(res.data);
		// 		console.log(readable)
		// 		readable.pipe(file);
		// 		// res.data.pipe(file);
		// 	}).catch((err)=>{
		// 		console.log('get image error!');
		// 		console.log(err);
		// 	});
		// },
		Focused(e){
			// console.log('focus....')
		},
		FocusOut(e){
      if(this.$el.contains(e.relatedTarget)==false){//자식이 포커스인지 체크
        this.Hide();
      }
    },
    ArrowDown(e){
      e.stopPropagation();
      e.preventDefault();
      this.selectIndex++;
      if (this.selectIndex >= this.$refs.list.children.length) {
        this.selectIndex--;
      }
      if(this.$refs.list.children[this.selectIndex].className=='context-group'){//라인 선택 중이면 한칸더 이동
        this.selectIndex++;
      }
      this.$refs.list.children[this.selectIndex].focus();
    },
    ArrowUp(e){
      e.preventDefault();
      e.stopPropagation();
      this.selectIndex--;
      if(this.$refs.list.children[this.selectIndex].className=='context-group'){//라인 선택 중이면 한칸더 이동
        this.selectIndex--;
      }
      if (this.selectIndex < 0) {
        this.selectIndex = 0;
      }
      this.$refs.list.children[this.selectIndex].focus();
    },
    Show(e) {
      this.isVisible = true;
      this.$nextTick(() => {
        var x=e.clientX;
        var y=e.clientY;
        var winWidth = window.innerWidth;//윈도우 넓이
        var winHeight = window.innerHeight;//윈도우 높이
        var width = this.$refs.context.clientWidth;//컨텍스트 넓이
        var height = this.$refs.context.clientHeight;//컨텍스트 높이
        if(x+width>winWidth){//컨텍스트가 화면 우측으로 나갈 경우
          x-=width;
        }
        if(y+height>winHeight){//컨텍스트가 화면 아래로 내려갈 경우
          y-=height;
        }

        this.x=x;
        this.y=y;
        this.FocusChild(e);
      });
    },
    Hide() {
      this.isVisible = false;
    },
    FocusChild(e) {
			e.preventDefault();
			this.$refs.save.$el.focus();
      
    },
    Esc(e) {
      e.preventDefault();
      e.stopPropagation();
      this.Hide();
    },
    Enter(e){
      e.preventDefault();
      e.stopPropagation();
      this.EventBus.$emit('ContextEnter');
    },
  },
  components: {
    ContextMenuItem
  },
};
</script>
<style lang="scss" scoped>
.context-menu {
  position:fixed;
  overflow: hidden;
  background-color: #f5f5f5;
  width: auto;
  box-shadow: 4px 4px 4px #928080;
  padding: 4px;
	min-width: 200px;
  border: 1px solid #959595;
  border-radius: 5px;
  :focus {
    outline: none;
  }
  .context-list{
    .context-group{
      border-bottom: 1px solid #d7d7d7;
    }
  }
}
</style>