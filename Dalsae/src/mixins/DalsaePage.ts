// 일반 컴포넌트(트윗, uitop 등)
// 페이지(전체적인 다이얼로그 등?)
// yes, no 다이얼로그
// 확인 다이얼로그
// 오류 메시지 표시
// api콜
// 공용 기능은 그냥 여기에 구현 해버리기
// 모든 컴포넌트가 이걸 상속 받기
// 근데 오류 표시 같은 건 메인 컴포넌트에서 하는 게 맞는 거 같은데...
// 그냥 전처럼 여기서 다 띄우는 게 나을까
// 트윗, 일반 분리할까
// 컨텍스트는 트윗에다 포함하는 게 맞을 거 같다 선택한 트윗 이런 거 없이
// 일단 pin 다이얼로그 추가 하고 인증하는 거까지 구현 해보자
// 파일도 만들어야 되네
// 파일은 어차피 프리로드에서 할텐데 분리를 어떻게 할지 고민 해보자

// v-app 밑에 message modal(뷰티파이의 app이 최상위)
// message modal 밑에 프레임
// 프레임 밑에 v-content &  라우터 뷰

// 라우터뷰 내에서 메시지 호출
// 그럼 부모의? 함수가 호출되는 구조인 거 같다

// v-app의 v-footer를 써서 하단 버튼을 만들면 될 거 같다

// 메인화면 구성
// <v-app>
// <message-modal>
// <v-app-bar> ui top이 이 위치
// <v-main> 이부분이 메인 화면?
// <v-bottom-navigation> 하단 버튼들

// 공용 기능은 DalsaePageBase에 기본 틀 => emit은 DalsaePage => 수신은 DalsaeApp, 기능은 메시지&팝업만
// api 콜 같은 기능은 추후 생각...

// 공식 계정 표시, 알림 표시는 뱃지 사용 https://vuetifyjs.com/en/components/badges/#usage

// 트윗 패널기능은 최후에 진행 하기로 하며
// 메인화면 디자인 다듬기
// api콜 후 데이터 관리 등 백그라운드 작업 더 진행하기
// 옵션 기능 넣기
// 이미지 팝업 기능 구현하기
// 프로필 팝업 기능 구현하기
// 등등 최대한 많은 작업을 다 끝낸 후 트윗 패널 작업을 진행 한다

import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import * as I from '@/mixins';
import TwitterAPI from '@/API/APICall';
import * as M from '@/Managers';

@Component
export class DalsaePage extends Vue implements I.DalsaePageBase {
  async created() {
    type WithPrepare = { prepare: Function };
    if (((this as unknown) as WithPrepare).prepare) {
      await ((this as unknown) as WithPrepare).prepare();
    }
  }
  @Inject()
  api!: M.APIManager;

  @Inject()
  mngAccount!: M.AccountManager;

  @Inject()
  mngOption!: M.OptionManager;

  @Inject()
  mngTweet!: M.TweetDataManager;

  @Inject()
  tweetPanel!: I.TweetPanelBase;

  @Inject()
  ShowConfirm!: (msg: string) => Promise<boolean>;

  @Inject()
  ShowMessage!: (msg: string) => void;

  @Inject()
  ShowPin!: () => void;

  @Inject()
  ShowOptionModal!: () => void;

  @Inject()
  isShowOptionModal!: boolean;
}
