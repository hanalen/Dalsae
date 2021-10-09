<template>
  <div class="message-modal">
    <v-dialog class="modals" ref="modal" v-model="state.isShow" max-width="300">
      <v-card>
        <v-card-title class="headline">
          {{ state.title }}
        </v-card-title>
        <v-card-text>
          {{ state.msg }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="state.isShow = false">
            확인
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { MessageModalBase } from '@/mixins';

@Component
export default class MessageModal extends MessageModalBase {
  async crated() {
    console.log('msg modal crated');
  }
}
</script>
