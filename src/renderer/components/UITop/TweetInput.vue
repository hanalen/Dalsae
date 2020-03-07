<template>
  <div class="tweet-input">
    <div class="text-area-top" v-on:drop="Drop" v-on:dragover="DragOver" v-on:dragenter="DragEnter" >
      <textarea
        ref="inputTweet"
        @input="$emit('update:tweetText', tweetTextBinding);"
        v-model="tweetTextBinding"
        spellcheck="false"
        class="text"
        v-on:input="Input"
        v-on:select="selectionChange"
        v-on:paste="Paste"
        @keyup="selectionChange"
        @click="selectionChange"
        @focus="selectionChange"
        @keydown.down="ArrowDown"
        @keydown.up="ArrowUp"
        @keydown.enter="EnterDown"
        @keydown.esc="ClearInput"
        :class="{'tweet-over': tweetLength>280, 'small':option.isSmallInput}"
      />
      <span v-if="option.isSmallInput" class="count">{{txtCounting}}</span>
      <div class="btn-cross" v-if="option.isSmallInput">
        <button class="btn-img" v-if="option.isSmallInput" type="button" @click="BtnAddClick">
          <div class="cross"></div>
        </button>
      </div>
      <b-button v-if="option.isSmallInput" class="btn" variant="primary" @click="SendTweet">트윗하기</b-button>
    </div>
    <FindFollowing
      ref="find"
      v-bind:list="this.listMention"
      v-bind:isShow="this.isMention"
      v-bind:mentionID="this.mentionID"
    />
    <div class="bottom" :style="{ padding: option.isSmallInput&&arrImage.length == 0 ? 0+'px' : 4+'px'}">
      <div v-if="!option.isSmallInput">
        <span class="count">{{txtCounting}}</span>
        <b-button variant="primary" @click="SendTweet">트윗하기</b-button>
      </div>

      <div>
        <button class="btn-img" v-if="!option.isSmallInput" type="button" @click="BtnAddClick">
            <div class="cross"></div>
        </button>
        <div>
            <input ref="fileOne" type="file" hidden="hidden" accept=".gif, .jpg, .png" @change="OnFileChange" multiple/>
        </div>
      </div>
    </div>
    <div :class="{'preview-one':arrImage.length==1, 'preview-two':arrImage.length==2, 'preview-four':arrImage.length==4}"
        v-if="arrImage.length!=3">
        <AddImage v-if="arrImage.length>0" :index="0" :path="arrImage[0]"/>
        <AddImage v-if="arrImage.length>1" :index="1" :path="arrImage[1]"/>
        <AddImage v-if="arrImage.length>2" :index="2" :path="arrImage[2]"/>
        <AddImage v-if="arrImage.length>3" :index="3" :path="arrImage[3]"/>
    </div>
    <div class="preview-three" v-if="arrImage.length==3">
        <div class="left" v-if="arrImage.length==3">
            <AddImage v-if="arrImage.length>0" :index="0" :path="arrImage[0]"/>
            <AddImage v-if="arrImage.length>1" :index="1" :path="arrImage[1]"/>
        </div>
        <div class="right" v-if="arrImage.length==3">
            <AddImage v-if="arrImage.length>2" :index="2" :path="arrImage[2]"/>
        </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../main.js";
import AddImage from "./AddImage.vue";
import FindFollowing from "./FindFollowing.vue";
import Bootstrap from "bootstrap-vue";
const { ShowValue } = require("../../oauth.js");
export default {
  name: "tweetinput",
  data: function() {
    return {
      regex: undefined,
      tweetLength: 10,
      txtCounting: "(0 / 280)",
      tweetText: "",
      tweetTextBinding: "",
      isMention: false,
      listMention: Array,
      mentionID: "",
      word: "", //멘션 id 단어
      arrImage:[],//업로드 할 이미지 목록
    };
  },
  computed: {},
  created: function() {
    this.regex = new RegExp(
      /[(http|ftp|https):\/\/]*[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi
    );
  },
  components: {
    AddImage,
    FindFollowing,
    Bootstrap
    // OAuth
  },
  props: {
    following: undefined,
    sendCallBack: undefined,
    option:undefined,
  },
  mounted: function() {
    //EventBus등록용 함수들
    this.EventBus.$on("mentionSelect", screen_name => {
      this.ReplaceMentionID(screen_name);
    });
    this.EventBus.$on("FocusInput", () => {
      this.FocusInput();
    });
    this.EventBus.$on("RemoveAddImage", (index)=>{
        this.arrImage.splice(index, 1);
    });
  },
  methods: {
    Paste(e){
      var items =e.clipboardData.items;
      for(var i=0;i<items.length;i++){
        if(items[0].type.indexOf('image')==-1) continue;
        var file = items[i].getAsFile();
        this.CreateImage(file);
      }
    },
    DragEnter(e){
      e.preventDefault();
    },
    DragOver(e){
      e.preventDefault();
    },
    Drop(e){
      e.preventDefault();
      var data = e.dataTransfer;
      var files=[];
      if (data.items) {
        for (var i = 0; i < data.items.length; i++) {
          if (data.items[i].kind == "file") {
            files.push(data.items[i].getAsFile());
          }
        }
      }
      else {
        for (var i = 0; i < data.files.length; i++) {
          files.push(data.files[i])
        }
      }
      if(files.length>4){
        files.splice(4, files.length - 4);
      }
      files.forEach((file)=>{
        this.CreateImage(file);
      })
    },
    SendTweet(){
      if(this.tweetText.length==0 && this.arrImage.length==0) {
        return;
      }
      this.sendCallBack();
      this.ClearInput();
      this.EventBus.$emit('FocusPanel','');
    },
    OnFileChange(e){
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      var fileCount=files.length;
      if(fileCount>4)
        fileCount=4;
      for(var i=0;i<fileCount;i++)
        this.CreateImage(files[i]);
    },
    CreateImage(file) {
      var image = new Image();
      var reader = new FileReader();

      reader.onload = (e) => {
        this.arrImage.push(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    BtnAddClick(e) {
        this.$refs.fileOne.click(e);
    },
    SetReply(str) {
      this.EventBus.$emit("update:tweetText", str);
      this.TextChange(str);
      this.tweetTextBinding = str;
    },
    FocusInput() {
      this.$nextTick(() => {
        //이벤트에서 show가 되기 전에 focus 호출 시 focus가 되지 않는 문제가 있어서 nextTick사용
        this.$refs.inputTweet.focus();
      });
    },
    ClearInput() {
      this.txtCounting = "(0 / 280)";
      this.HideMention();
      this.tweetTextBinding = "";//양방향 바인딩용 값, 이 값을 바꿔야 ui 밑 전송 데이터가 적용 된다.
      this.tweetText = "";
      this.tweetLength = 0;
      this.$refs.inputTweet.focus();
      this.arrImage=[];
    },
    ReplaceMentionID(screen_name) {
      this.tweetTextBinding = this.tweetText.replace(
        this.word,
        "@" + screen_name + " "
      );
      this.tweetText = this.tweetTextBinding;
      this.$refs.inputTweet.focus();
      this.HideMention();
    },
    ArrowUp(e) {
      if (!this.isMention) {
      } else {
        this.EventBus.$emit("arrowUp");
      }
    },
    CheckLastLine(e) {
      var index = this.tweetText.lastIndexOf("\n");
      if (index == -1) return true;
      var pos = e.target.selectionStart; //커서 위치

      // console.log('index: '+index + '/ pos: '+pos + '/ len: '+this.tweetText.length)
      if (index < pos && pos <= this.tweetText.length) {
        return true;
      } else {
        return false;
      }
    },
    ArrowDown(e) {
      if (!this.isMention) {
        if (this.CheckLastLine(e)) {
          //마지막줄에서 아래키 누를 경우 focus tweet!
          e.preventDefault();
          this.EventBus.$emit("focusTweet", e);
        }
      } else {
        this.EventBus.$emit("arrowDown");
      }
    },
    EnterDown(e) {
      e.preventDefault();
      if (this.isMention) {
        var v = this.$refs.find.GetSelectScreenName();
        this.ReplaceMentionID(v);
        return;
      }
      if(e.ctrlKey){
        this.SendTweet();
      }
      else if(e.shiftKey){//new line
        var index = e.target.selectionStart;//커서 위치
        this.tweetTextBinding = [this.tweetTextBinding.slice(0, index), '\r\n', this.tweetTextBinding.slice(index)].join('');
      }
      else{
        if(this.tweetTextBinding.length==0 && this.arrImage.length==0){//입력 중인 트윗이 없을 경우 패널 포커스
          this.EventBus.$emit('FocusPanel','');
        }
        else{
          this.SendTweet();
        }
      }
    },
    GetTweetLength(str) {
      var ret = 0;
      for (var i = 0; i < str.length; i++) {
        var num = str[i].charCodeAt(0);
        if (0 <= num && num <= 4351) ret += 1;
        else if (8192 <= num && num <= 8205) ret += 1;
        else if (8208 <= num && num <= 8223) ret += 1;
        else if (8242 <= num && num <= 8247) ret += 1;
        else if (num < 0) ret += 0;
        else ret += 2;
      }
      return ret;
    },
    Input(e) {
      // this.tweetText=e.target.value;
      this.TextChange(e.target.value);
    },
    TextChange(str) {
      this.tweetText = str;
      var count = this.GetTweetLength(this.tweetText);
      if (this.regex.test(this.tweetText)) {
        //링크가 있을 경우
        var arr = this.tweetText.match(this.regex);
        arr.forEach(function(url) {
          count = count - url.length + 23;
        });
      }
      this.tweetLength = count;
      this.txtCounting = "(" + this.tweetLength.toString() + " / 280)";
    },
    selectionChange(e) {
      this.CheckMention(e.target.selectionStart);
    },
    CheckMention(position) {
      //position: TextArea의 cursor position
      var sIndex = 0; //word로 끊을 시작 index
      var eIndex = 0; //word로 끊을 끝 index
      for (var i = position; i > -1; i--) {
        //현재 커서 앞의 최초 스페이스 찾기
        sIndex = i; //index 0이 @일 경우도 있으므로 시작이 0일 수도 있어서 매번 대입
        if (this.tweetText[i - 1] === " ") {
          break;
        }
      }
      for (var i = position; i <= this.tweetText.length; i++) {
        //현재 커서 뒤의 최초 스페이스 찾기
        eIndex = i; //index가 length일 경우도 있으므로 매번 대입
        if (this.tweetText[i] === " " || this.tweetText[i] === "\n") {
          break;
        }
      }
      var word = this.tweetText.substring(sIndex, eIndex);
      // console.log('p: '+position+' / s: '+sIndex+'/ e: '+eIndex+'/ w: "'+word+'"');
      if (word[0] === "@") {
        this.isMention = true;
        this.word = word;
        this.CutMentionID(word.replace("@", ""));
      } else {
        this.HideMention();
      }
    },
    HideMention(){
      this.isMention=false;
      this.listMention=[];
    },
    CutMentionID(word) {
      if (word.length == 0) return;
      this.listMention = [];

      this.listMention = this.following.filter(item => {
        if (
          item.name.indexOf(word) > -1 ||
          item.screen_name.indexOf(word) > -1
        ) {
          return item;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
textarea {
  font-family: "Malgun Gothic" !important;
}
.text-area-top{
  padding: 4px 4px 0px 4px;
  display: flex;
  .count{
    margin: 0px 4px;
    width: 100px;
  }
  .btn{
    margin: 0px 4px;
    width: 120px;
    height: 22px;
    font-size: 14px;
    padding: 0;
  }
  .btn-cross{
    width: 30px;
    .btn-img{
        width: 22px;
        height: 22px;
        padding: 0;
        margin: 0;
        border-radius: 15px;
        background-color: transparent;
        border: 1px solid #007bff;
        outline: none;
      .cross {
        background: #3798ff;
        height: 14px;
        position: relative;
        width: 2px;
        left: 9px;
      }
      .cross:after {
        background: #3798ff;
        content: "";
        height: 2px;
        left: -6px;
        position: absolute;
        top: 6px;
        width: 14px;
      }
    }
  }
}
.tweet-input {
  .tweet-over {
    background-color: #ffe0e0;
  }
  background-color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: auto;
  .count {
    align-items: right;
  }
  .preview-one {
    display: flex;
    flex-direction: row;
    max-width: 500px;
    max-height: 280px;
    .add-image {
      width: 100%;
      // object-fit: cover;
    }
  }
  .preview-two {
    display: flex;
    flex-direction: row;
    max-width: 500px;
    max-height: 280px;
    .add-image {
      width: 50%;
      height: 280px;
      // object-fit: cover;
    }
  }
  .preview-three {
    display: flex;
    flex-direction: row;
    max-width: 500px;
    max-height: 280px;
    .left {
      display: flex;
      flex: 1;
      flex-direction: column;
      .add-image {
        width: 100%;
        height: 140px;
      }
    }
    .right {
      display: flex;
      flex: 1;
      .add-image {
        width: 100%;
        height: 280px;
      }
    }
  }
  .preview-four {
    display: flex;
    flex-wrap: wrap;
    max-width: 500px;
    width: 500px;
    .add-image {
      width: 50%;
      height: 140px;
    }
  }
  .text {
    font-family: "맑은 고딕";
    box-sizing: border-box;
    // height: 100%;
    // height: 80px;
    // height: 100%;
    max-height: 150px;
    resize: none;
    width: 100%;
    outline: none;
  }
  .text.small{
    height: 22px;
  }
  .bottom {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    button{
      padding: 0 6px !important;
    }
    .btn {
      font-size: 14px !important;
      height: 30px;
    }
    .btn-img {
      width: 30px;
      height: 30px;
      padding: 0;
      margin: 0;
      border-radius: 15px;
      background-color: transparent;
      border: 1px solid #007bff;
      outline: none;
      .cross {
        background: #3798ff;
        height: 18px;
        position: relative;
        width: 2px;
        left: 7px;
      }
      .cross:after {
        background: #3798ff;
        content: "";
        height: 2px;
        left: -8px;
        position: absolute;
        top: 8px;
        width: 18px;
      }
    }
    .btn-img:hover {
      background-color: #b8daff;
    }
  }
}
</style>