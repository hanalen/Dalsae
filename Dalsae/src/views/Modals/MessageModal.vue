<template>
  <div class="message-modal">
    <v-dialog class="modals" ref="modal" v-model="state.isShow">
      <v-card>
        <v-card-title class="headline">
          {{ state.title }}
        </v-card-title>
        <v-card-text>
          {{ state.msg }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="state.isShow = false">
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="state.isShow = false">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Mixins, Component, Ref } from 'vue-property-decorator';
import { DalsaePage, MessageModalBase } from '@/mixins';
// interface BaseInterface extends DalsaePage {}

@Component
export default class MessageModal extends Mixins(DalsaePage, MessageModalBase) {
  // @Ref()
  // modal!: HTMLDialogElement;

  async created() {
    this.$nextTick(() => {
      this.$on('show-message', (msg: string) => {
        console.log('aejkraeq12312232');
      });
    });
    setTimeout(() => {
      // this.modal.addEventListener('cancel', e => {
      //   e.preventDefault();
      //   this.state.event(-1);
      // });
    }, 0);
  }
}
</script>
