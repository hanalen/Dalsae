<template>
  <div class="hotkey-popup">
    <div class="hotkey-area">
      <div class="left">
        <div class="hotkey-type">
          <span class="title">메뉴 보기</span>
          <div class="hotkey">
            <span>타임라인 보기</span>
            <input ref="showTL" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>알림 보기</span>
            <input ref="showMention" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>쪽지 보기</span>
            <input ref="showDM" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>관심글 보기</span>
            <input ref="showFavorite" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>최근 연 링크 보기</span>
            <input ref="showUrl" class="input" type="text" @keydown="KeyDown"/>
          </div>
        </div>
        <div class="hotkey-type">
          <span class="title">답변 하기</span>
          <div class="hotkey">
            <span>모두에게 답변 하기</span>
            <input ref="reply" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>작성자에게 답변 하기</span>
            <input ref="replyAll" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>쪽지 보내기</span>
            <input ref="sendDM" class="input" type="text" @keydown="KeyDown"/>
          </div>
        </div>
        <div class="hotkey-type">
          <span class="title">기타 기능</span>
          <div class="hotkey">
            <span>글 불러오기</span>
            <input ref="loading" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>트윗 내용 복사하기</span>
            <input ref="copy" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>입력 취소하기</span>
            <input ref="cancle" class="input" type="text" @keydown="KeyDown"/>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="hotkey-type">
          <span class="title">트윗 기능</span>
          <div class="hotkey">
            <span>대화 불러오기</span>
            <input ref="loadConv" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>인용트윗 보기</span>
            <input ref="showQt" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>리트윗 하기</span>
            <input ref="retweet" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>인용 리트윗 하기</span>
            <input ref="sendQt" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>관심글 추가</span>
            <input ref="sendFavorite" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>해시 태그 추가</span>
            <input ref="hash" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>내 트윗 삭제</span>
            <input ref="delete" class="input" type="text" @keydown="KeyDown"/>
          </div>
        </div>
        <div class="hotkey-type">
          <span class="title">UI 기능</span>
          <div class="hotkey">
            <span>입력 칸 가기</span>
            <input ref="input" class="input" type="text" @keydown="KeyDown" @focusout="FocusOut"/>
          </div>
          <div class="hotkey">
            <span>트윗 메뉴 보기</span>
            <input ref="showContext" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>가장 위로 가기</span>
            <input ref="home" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>가장 아래로 가기</span>
            <input ref="end" class="input" type="text" @keydown="KeyDown"/>
          </div>
          <div class="hotkey">
            <span>이미지, 동영상 열기</span>
            <input ref="showImage" class="input" type="text" @keydown="KeyDown"/>
          </div>
        </div>
      </div>
    </div>
    <input type="button" value="저장" @click="Save">
  </div>
</template>

<script>
export default {
  name: "hotkeypopup",
  components: {
  },
  data: function() {
    return {
      hotkey:{//기본 단축키
        showTL:{isCtrl:false, isShift:false, isAlt:false, key:'1'},
        showMention:{isCtrl:false, isShift:false, isAlt:false, key:'2'},
        showDM:{isCtrl:false, isShift:false, isAlt:false, key:'3'},
        showFavorite:{isCtrl:false, isShift:false, isAlt:false, key:'4'},
        showUrl:{isCtrl:false, isShift:false, isAlt:false, key:'5'},
        
        reply:{isCtrl:false, isShift:false, isAlt:false, key:'r'},
        replyAll:{isCtrl:false, isShift:false, isAlt:false, key:'a'},
        sendDM:{isCtrl:false, isShift:false, isAlt:false, key:'d'},
        
        loading:{isCtrl:false, isShift:false, isAlt:false, key:'space'},
        copy:{isCtrl:true, isShift:false, isAlt:false, key:'c'},
        cancle:{isCtrl:false, isShift:false, isAlt:false, key:'escape'},
        
        loadConv:{isCtrl:false, isShift:false, isAlt:false, key:'c'},
        showQt:{isCtrl:false, isShift:false, isAlt:false, key:'x'},
        retweet:{isCtrl:false, isShift:false, isAlt:false, key:'t'},
        sendQt:{isCtrl:false, isShift:false, isAlt:false, key:'w'},
        sendFavorite:{isCtrl:false, isShift:false, isAlt:false, key:'f'},
        hash:{isCtrl:false, isShift:false, isAlt:false, key:'h'},
        delete:{isCtrl:false, isShift:false, isAlt:false, key:'delete'},
        
        input:{isCtrl:false, isShift:false, isAlt:false, key:'u'},
        showContext:{isCtrl:false, isShift:false, isAlt:false, key:'v'},
        home:{isCtrl:false, isShift:false, isAlt:false, key:'home'},
        end:{isCtrl:false, isShift:false, isAlt:false, key:'end'},
        showImage:{isCtrl:false, isShift:false, isAlt:false, key:'g'},
      }
    };
  },
  created: function() {
    this.$nextTick(()=>{
      this.SetHotkey();
    })
  },
  methods: {
    SetHotkey(){//키 읽은 거 출력
      Object.keys(this.$refs).forEach((key)=>{
        var hotkey = this.hotkey[key];
        var str = hotkey.isCtrl ? 'Ctrl+' : ''
        str += hotkey.isAlt ? 'Alt+' : '' 
        str += hotkey.isShift ? 'Shift+' : '' 
        str += (hotkey.key.charAt(0).toUpperCase()+hotkey.key.substring(1,999));
        this.$refs[key].value =str;
      })
    },
    KeyDown(e){
      e.preventDefault();
      e.target.value=''
      if(e.ctrlKey){
        e.target.value+='Ctrl+'
      }
      if(e.shiftKey){
        e.target.value+='Shift+'
      }
      if(e.altKey){
        e.target.value+='Alt+'
      }
      if(e.code !='ControlLeft'&& e.code !='ShiftLeft' && e.code!='AltLeft'){
        e.target.value+=(e.key.charAt(0).toUpperCase()+e.key.substring(1,999));//키는 첫글자만 대문자로. home->Home
      }
    },
    FocusOut(e){
      if(e.target.value[e.target.value.length-1]=='+'){//키입력을 ctrl, alt, shift만 했었을 경우 문자 삭제
        e.target.value=''
      }
    },
    Save(e){
      var hotkey=new Object();
      Object.keys(this.$refs).forEach((key)=>{
        var obj = new Object();
        var str = this.$refs[key].value;
        obj.isCtrl= str.indexOf('Ctrl') > -1 
        obj.isAlt= str.indexOf('Alt') > -1 
        obj.isShift= str.indexOf('Shift') > -1 
        obj.key = str.replace('Ctrl+','').replace('Shift+','').replace('Alt+')
        hotkey[key]=obj;
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.hotkey-popup{
  .hotkey-area{
    display: flex;
    .left{

    }
    .right{

    }
  }
}
.hotkey{
  position: relative;
  margin-bottom: 6px;
}
.hotkey-type{
  border: 1px solid black;
  padding: 4px;
  border-radius: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 320px;
  .title{
    text-align: middle;
  }
}
span{
  // margin: 4px;
}
input[type=text]{
  position: absolute;
  right: 4px;
}
input[type=button]{
  margin-left: 10px;
}
</style>
