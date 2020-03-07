<template>
  <div class="option-modal">
    <div class="close">
      <i @click="Close" class="fas fa-times"></i>
    </div>
    <h4>UI 설정</h4>
    <div class="custom-control custom-switch">
      <input v-model="option.isShowPropic" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchShowPropic" true-color="#ff6565">
      <label class="custom-control-label" for="switchShowPropic">인장을 표시 합니다.</label><br>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isBigPropic" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchBigPropic" true-color="#ff6565">
      <label class="custom-control-label" for="switchBigPropic">인장을 크게 표시 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isShowPreview" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchShowPreview" true-color="#ff6565">
      <label class="custom-control-label" for="switchShowPreview">이미지 미리보기를 표시 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isSmallTweet" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchSmallTweet" true-color="#ff6565">
      <label class="custom-control-label" for="switchSmallTweet">트윗을 한 줄로 표시 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isUseRead" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchUseRead" true-color="#ff6565">
      <label class="custom-control-label" for="switchUseRead">읽지 않은 트윗을 굵게 표시 합니다.</label>
    </div>
    
    
    <br/>
    <h4>트윗 입력 칸 설정</h4>
    <div class="custom-control custom-switch">
      <input v-model="option.isSmallInput" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchInputSmall" true-color="#ff6565">
      <label class="custom-control-label" for="switchInputSmall">작게 표시합니다.</label>
    </div>
    
    <br/>
    <h4>트윗 전송 설정</h4>
    <div class="custom-control custom-switch">
      <input v-model="option.isSendCheck" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchSendCheck" true-color="#ff6565">
      <label class="custom-control-label" for="switchSendCheck">트윗 전송 시 확인 창을 띄웁니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isSendEnter" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchSendEnter" true-color="#ff6565">
      <label class="custom-control-label" for="switchSendEnter">Enter키로 트윗을 전송 합니다.<br/>해제 시 Ctrl+Enter로 전송.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isSendRTProtected" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchsendRTProtected">
      <label class="custom-control-label" for="switchsendRTProtected">잠금 사용자의 트윗도 리트윗 합니다.<br/>아이디는 *** 처리 됩니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isSendRTCheck" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchsendRTCheck">
      <label class="custom-control-label" for="switchsendRTCheck">리트윗 시 확인 창을 띄웁니다.</label>
    </div>
    
    <br/>
    <h4>이미지 뷰어 설정</h4>
    <div class="custom-control custom-switch">
      <input v-model="option.isShowTweet" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchshowTweet">
      <label class="custom-control-label" for="switchshowTweet">트윗 내용을 함께 표시 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isShowBottomPreview" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchshowBottomPreview">
      <label class="custom-control-label" for="switchshowBottomPreview">하단에 미리보기를 표시 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isLoadOrgImg" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchloadOrgImg">
      <label class="custom-control-label" for="switchloadOrgImg">이미지 원본을 불러옵니다.<br/>체크 시 불러오기가 오래 걸립니다.</label>
    </div>
    
    <br/>
    <h4>뮤트 표시 설정</h4>
    <div class="custom-control custom-switch">
      <input v-model="option.isMuteMention" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchmuteMention">
      <label class="custom-control-label" for="switchmuteMention">멘션함도 뮤트 처리 합니다.</label>
    </div>
    <div class="custom-control custom-switch">
      <input v-model="option.isShowMute" @change="OptionChange" type="checkbox" class="custom-control-input" id="switchShowmute">
      <label class="custom-control-label" for="switchShowmute">뮤트 트윗을 가림 처리 합니다.</label>
    </div>
    <br/>
    <h4>알림 및 뮤트 상세 설정</h4>
    <div class="custom-control custom-switch">
      <b-button variant="primary" @click="ClickMuteOption">새창으로 여는 것이야</b-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'uioptionmodal',
  data() {
    return {
      option:{
        isSmallTweet:false,//트윗 한줄 표시
        isShowPropic: true,//인장 표시
        isBigPropic: true,//인장 크게 표시
        isShowPreview:true,//이미지 미리보기 표시
        isUseRead:false,//읽은 트윗 여부

        isSmallInput:false,//트윗 입력칸 작게 표시

        isSendEnter:true,//enter키로 트윗 전송
        isSendCheck:false,//트윗 전송 시 확인
        isSendRTProtected:true,//플텍계 트윗 rt
        isSendRTCheck:false,//rt 시 확인 창

        isShowTweet:true,//이미지 뷰어 트윗 표시
        isShowBottomPreview:true,//이미지 뷰어 하단 미리보기 표시
        isLoadOrgImg:false,//이미지 뷰어 원본 불러오기

        isMuteMention:false,//멘션함도 뮤트
        isShowMute:false,//뮤트 된 트윗도 일단 표시 할지 여부
      }
    };
  },

  components: { 
  },
  methods: {
    Close(){
      this.EventBus.$emit('CloseUIOption');
    },
    OptionChange(){
      this.$store.dispatch('UIOption', this.option);
    },
    ClickMuteOption(e){
      var ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('OpenMuteOptionPopup', this.$store.state.DalsaeOptions.muteOptions);
    },
  },
  created: function(){
    var orgOption=this.$store.state.DalsaeOptions.uiOptions;
    this.option=JSON.parse(JSON.stringify(orgOption));
  },
  mounted:function(){
  },
  destroyed:function(){
    this.EventBus.$emit('SaveOption');
  }
}
</script>


<style lang="scss" scoped>
h4{
  font-size:13px;
  font-weight: bolder;
}
.btn{
  font-size: 14px !important;
  height: 30px;
  padding: 0 6px !important
}
.option-modal{
  color:rgba(44,44,44,.85);
	display: flex;
	// flex: 1;
	flex-direction: column;
	height: 100%;
	min-width: 200px;
	// overflow: scroll;
	background-color: hsl(0, 70%, 90%);
	// width: 500px;
  padding: 8px;
}
.custom-control-label{
  font-size:12px;
  &::before{
    border-color:hsl(0, 60%, 80%);
    background-color:hsl(0, 60%, 80%);
  }
  &::after{
    background-color:rgb(255,255,255)!important;
  }
}
.close{
  color:rgba(44,44,44,.85);
  margin:4px 4px 4px auto;
  text-shadow: none;
}

</style>
