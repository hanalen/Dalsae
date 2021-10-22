<template>
  <div class="option-detail-modal">
    <!--전체화면-->
    <v-dialog
      class="modals"
      ref="modal"
      v-model="isShow"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!--왼쪽 네비 바-->
      <v-card class="flex">
        <div class="left">
          <v-list nav v-for="(menu, i) in state.listMenu" :key="i">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ menu.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ menu.subTitle }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              v-for="(sub, j) in menu.menuSub"
              :key="j"
              @click="state.selectMenu = sub.menuNumber"
            >
              <v-list-item-icon>
                <v-icon>{{ sub.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ sub.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div class="center">
          <v-tabs v-model="state.selectMenu" hide-slider hidden> </v-tabs>
          <v-tabs-items v-model="state.selectMenu">
            <v-tab-item :key="0">
              <v-card outlined height="100vh">
                <v-card-title>
                  단어 뮤트
                </v-card-title>
                <v-card-subtitle>
                  특정 단어가 들어간 트윗을 필터링합니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-list-item-group v-model="state.selectWord" color="primary">
                    <v-list-item v-for="(item, i) in muteOption.keyword" :key="i">
                      <v-list-item-content @click="state.input = item">
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-card-actions>
                  <v-text-field label="단어 입력" v-model="state.input"></v-text-field>
                  <v-btn
                    outlined
                    color="primary"
                    text
                    @click="OnAdd(muteOption.keyword, state.input)"
                  >
                    추가
                  </v-btn>
                  <v-btn
                    outlined
                    color="red"
                    text
                    @click="OnRemove(muteOption.keyword, state.input)"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="1">
              <v-card outlined height="100vh">
                <v-card-title>
                  사용자 뮤트
                </v-card-title>
                <v-card-subtitle>
                  특정 사용자의 트윗을 필터링합니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-list-item-group v-model="state.selectWord" color="primary">
                    <v-list-item v-for="(item, i) in muteOption.user" :key="i">
                      <v-list-item-content @click="state.input = item">
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-card-actions>
                  <v-text-field label="사용자 아이디 입력" v-model="state.input"></v-text-field>
                  <v-btn outlined color="primary" text @click="OnAdd(muteOption.user, state.input)">
                    추가
                  </v-btn>
                  <v-btn outlined color="red" text @click="OnRemove(muteOption.user, state.input)">
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-card outlined height="100vh">
                <v-card-title>
                  어플(서비스) 뮤트
                </v-card-title>
                <v-card-subtitle>
                  특정 어플(서비스)에서 등록한 트윗을 필터링합니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-list-item-group v-model="state.selectWord" color="primary">
                    <v-list-item v-for="(item, i) in muteOption.client" :key="i">
                      <v-list-item-content @click="state.input = item">
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-card-actions>
                  <v-text-field label="어플 명칭 입력" v-model="state.input"></v-text-field>
                  <v-btn
                    outlined
                    color="primary"
                    text
                    @click="OnAdd(muteOption.client, state.input)"
                  >
                    추가
                  </v-btn>
                  <v-btn
                    outlined
                    color="red"
                    text
                    @click="OnRemove(muteOption.client, state.input)"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="3">
              <v-card outlined height="100vh">
                <v-card-title>
                  트윗 뮤트
                </v-card-title>
                <v-card-subtitle>
                  특정 트윗을 필터링하며 해당 트윗에 온 답변, 리트윗, 인용리트윗을 필터링합니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-list-item-group color="primary">
                    <v-list-item v-for="(item, i) in muteOption.tweet" :key="i">
                      <v-list-item-content
                        @click="
                          state.input = item.full_text;
                          state.selectTweet = item;
                        "
                      >
                        <v-list-item-title v-text="item.full_text"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-card-actions>
                  <v-text-field
                    disabled
                    v-model="state.input"
                    label="추가 등록은 트윗 우클릭에서 등록 할 수 있습니다."
                  ></v-text-field>
                  <v-btn
                    outlined
                    color="red"
                    text
                    @click="OnRemoveTweet(muteOption.tweet, state.selectTweet)"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="4">
              <v-card outlined height="100vh">
                <v-card-title>
                  단어 알림
                </v-card-title>
                <v-card-subtitle>
                  특정 단어가 들어간 트윗을 알림 표시 합니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-list-item-group v-model="state.selectWord" color="primary">
                    <v-list-item v-for="(item, i) in muteOption.highlight" :key="i">
                      <v-list-item-content @click="state.input = item">
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-card-actions>
                  <v-text-field label="알림 단어 입력" v-model="state.input"></v-text-field>
                  <v-btn
                    outlined
                    color="primary"
                    text
                    @click="OnAdd(muteOption.highlight, state.input)"
                  >
                    추가
                  </v-btn>
                  <v-btn
                    outlined
                    color="red"
                    text
                    @click="OnRemove(muteOption.highlight, state.input)"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="5">
              <v-card outlined height="100vh">
                <v-card-title>
                  필터링 상세 설정
                </v-card-title>
                <v-card-subtitle>
                  특정 상황의 필터링 표시를 설정 합니다.<br />
                  ※달새는 차단한 사람을 절대 표시 하지 않습니다.
                </v-card-subtitle>
                <v-list class="overflow-y-auto" dense max-height="300px">
                  <v-switch
                    v-model="muteOption.isMuteMention"
                    label="멘션 및 알림 설정도 필터링 처리"
                  ></v-switch>
                </v-list>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="6" eager
              ><!--eager: mounted할때 렌더링하는 옵션-->
              <v-card outlined height="100vh">
                <v-card-title>
                  단축키 설정
                </v-card-title>
                <v-card-subtitle>
                  프로그램을 보다 편하게 사용 할 수 있게 합니다.
                </v-card-subtitle>
                <v-list dense max-height="500px" class="overflow-y-auto">
                  <v-list-item-group v-for="(item, i) in state.listHotkeyMenu" :key="i">
                    <v-list-item-title>
                      {{ item.title }}
                    </v-list-item-title>
                    <v-list-item v-for="(sub, j) in item.menuSub" :key="j">
                      <v-text-field
                        :ref="sub.hotKeyType"
                        :label="sub.label"
                        @keydown="OnKeyDown($event, sub.hotKeyType)"
                      ></v-text-field>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="right">
          <v-icon size="40" class="click-able" @click="OnClickClose"
            >mdi-close-circle-outline
          </v-icon>
        </div>
      </v-card>
      <!--오른쪽은 각 메뉴별로 구성, 하위 메뉴는 탭으로 할까 했지만 디코처럼 아래로 나열하자-->
      <!--트윗 뮤트 같은 경우는 트윗 정보 다 저장해서 해당 트윗을 표시해서 삭제하게-->
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.left {
  width: 220px;
}
.center {
  width: calc(100vw - 370px);
}
.right {
  width: 150px;
}
.click-able {
  cursor: pointer;
}
</style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { OptionDetailModalBase, PinModalBase } from '@/mixins';

@Component
export default class OptionDetailModal extends OptionDetailModalBase {
  async crated() {
    console.log('option detail modal created');
  }
}
</script>
