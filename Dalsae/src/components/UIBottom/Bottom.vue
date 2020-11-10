<template>
  <div class="ui-bottom">
    <v-btn icon rounded @click="ClickOption">
      <v-icon color="primary">mdi-menu</v-icon>
    </v-btn>
    <v-btn icon rounded v-for="(item, i) in listIcons" :key="i" @click="ClickMenu(item.value)">
      <v-icon :color="item.value === tweetPanel.state.selectMenu ? 'primary' : 'secondary'">{{
        item.name
      }}</v-icon>
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.ui-bottom {
  display: flex;
  place-items: 2px;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class Bottom extends Mixins(DalsaePage) {
  listIcons = [
    {
      name: 'mdi-home',
      value: 0
    },
    {
      name: 'mdi-bell-outline',
      value: 1
    },
    {
      name: 'mdi-email-outline',
      value: 2
    },
    {
      name: 'mdi-heart-outline',
      value: 3
    },
    {
      name: 'mdi-link',
      value: 4
    }
  ];
  async created() {
    console.log('aaaaa');
  }

  async ClickOption() {
    console.log('click option');
  }

  async ClickMenu(menu: number) {
    this.tweetPanel.MenuChange(menu);
  }
}
</script>
