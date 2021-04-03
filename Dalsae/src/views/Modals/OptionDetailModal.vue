<template>
  <div class="option-detail-modal">
    <!--전체화면-->
    <v-dialog
      class="modals"
      ref="modal"
      v-model="state.isShow"
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
          <!--탭으로 해서 표시하자-->
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
          </v-tabs-items>
        </div>
        <div class="right">wererawer</div>
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
  background-color: aliceblue;
}
.center {
  width: calc(100vw - 370px);
  background-color: antiquewhite;
}
.right {
  width: 150px;
  background-color: gray;
}
</style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { DalsaePage, OptionDetailModalBase, PinModalBase } from '@/mixins';
// interface BaseInterface extends DalsaePage {}

@Component
export default class OptionDetailModal extends Mixins(OptionDetailModalBase) {
  async crated() {
    console.log('option detail modal created');
  }
}
</script>
