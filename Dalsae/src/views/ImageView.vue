<template>
  <!-- v-app으로 변경 v-app으로 바꾸면 트윗,이미지,보톰 사이즈 알아서 계산 해줌 -->
  <v-app>
    <div class="app-alert">
      <v-alert
        dense
        text
        :type="item.errorType"
        v-for="(item, i) in listMsg"
        :key="i"
        transition="scale-transition"
      >
        {{ item.message }}
      </v-alert>
    </div>
    <v-main app>
      <v-container fluid :style="styleTop" v-if="isShowTweet">
        <div :style="styleTweet" ref="refTweet">
          <tweet-selector
            v-if="option.isShowTweet"
            :selected="false"
            :tweet="tweet"
          ></tweet-selector>
        </div>
        <v-btn
          v-if="isBigTweet && !bExpanded"
          icon
          rounded
          width="100vw"
          height="30"
          class="btn-expand"
          @click="OnClickExpand"
        >
          <v-icon :color="'primary'" size="40">
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </v-container>
      <v-container @contextmenu="OnContext">
        <image-content :style="styleContent" :tweet="tweet" :index="index"> </image-content>
      </v-container>
    </v-main>
    <v-footer fixed height="130" v-if="isShowBottom">
      <div class="bottom">
        <image-popup-preview
          v-for="(media, i) in media"
          :media="media"
          :progress="listProgress[i]"
          :key="i"
          v-on:on-click-media="OnClickMedia"
        >
        </image-popup-preview>
      </div>
    </v-footer>
    <v-menu v-model="isShowContext" :position-x="x" :position-y="y" absolute offset-y>
      <v-list>
        <v-list-item-group v-model="indexContext">
          <v-list-item value="0">
            <template>
              <div class="context-item" @click="OnClickSave">
                <span>
                  현재 이미지 저장
                </span>
                <span>
                  (Ctrl + S)
                </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item value="1">
            <template>
              <div class="context-item" @click="OnClickSaveAll">
                <span>
                  모든 이미지 저장
                </span>
                <span>
                  (Ctrl + A)
                </span>
              </div>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app>
</template>

<style lang="scss" scoped>
#main {
  height: calc(100% - 130px) !important;
}
.btn-expand {
  background-color: rgba(160, 160, 160, 0.11);
}
.bottom {
  display: flex;
}
.v-toolbar__content {
  align-items: baseline !important;
}

.v-list-item {
  min-height: 24px !important;
  max-width: 300px !important;
  font-size: 14px !important;
}
.context-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins, Ref } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';
import { moduleImage } from '@/store/modules/ImageStore';
import { moduleOption } from '@/store/modules/OptionStore';
@Component
export default class ImageView extends Mixins(MIX.ImagePage) {
  @Ref()
  refTweet!: HTMLElement;
  bExpanded = false;
  bMounted = false;
  get styleTop() {
    if (!this.bExpanded) {
      return {
        'max-height': '180px'
      };
    }
  }
  get styleTweet() {
    if (!this.bExpanded) {
      return {
        'max-height': '150px',
        overflow: 'hidden'
      };
    }
  }
  get styleContent() {
    let height = 310;
    if (!this.isShowBottom) height -= 130;
    if (!this.isShowTweet) height -= 180;
    return {
      height: `calc(100vh - ${height}px)`
    };
  }
  get isBigTweet() {
    if (!this.bMounted) return;
    const height = this.refTweet.clientHeight;
    if (height >= 150) {
      return true;
    } else {
      return false;
    }
  }
  OnClickExpand(e: MouseEvent) {
    this.bExpanded = true;
  }

  async created() {
    this.$nextTick(() => {
      this.bMounted = true;
      window.addEventListener('keydown', this.OnKeyDown);
    });
    const id = this.$route.query.tweetId;
    if (id) {
      const option = window.ipc.image.GetOption(id.toString());
      moduleOption.ChangeOption(JSON.parse(option));
      const json = window.ipc.image.GetTweet(id.toString());
      moduleImage.SetTweet(new I.Tweet(JSON.parse(json)));
    }
  }
}
</script>
