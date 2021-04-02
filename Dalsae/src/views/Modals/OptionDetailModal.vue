<template>
  <div class="option-detail-modal">
    <v-dialog class="modals" ref="modal" v-model="state.isShow" max-width="300">
      <!--전체화면-->
      <v-card width="600px" height="800px">
        <!--왼쪽 네비 바-->
        <!--오른쪽은 각 메뉴별로 구성, 하위 메뉴는 탭으로 할까 했지만 디코처럼 아래로 나열하자-->
        <!--트윗 뮤트 같은 경우는 트윗 정보 다 저장해서 해당 트윗을 표시해서 삭제하게-->
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

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
