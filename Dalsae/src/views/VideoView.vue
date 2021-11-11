<template>
  <v-app> </v-app>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Vue, Component, Mixins, Ref } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleOption } from '@/store/modules/OptionStore';
@Component
export default class VideoView extends Vue {
  async created() {
    this.$nextTick(() => {
      this.bMounted = true;
      window.addEventListener('keydown', this.OnKeyDown);
    });
    const id = this.$route.query.tweetId;
    if (id) {
      const option = window.preload.image.GetOption(id.toString());
      moduleOption.ChangeOption(JSON.parse(option));
      const json = window.preload.image.GetTweet(id.toString());
      moduleImage.SetTweet(new I.Tweet(JSON.parse(json)));
    }
  }
}
</script>
