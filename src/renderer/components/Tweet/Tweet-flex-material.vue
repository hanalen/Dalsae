<template>
  <div>
    <img
      :class="{'profile':!option.isBig,'profile-big':option.isBig}"
      v-bind:src="propic(tweet.user)"
      v-if="option.isShowPropic"
    />
    <div class="tweet-text">
      <div class="tweet-name">
        <span
          class="tweet-name-content"
          :class="{'protected':tweet.user.protected}"
        >{{tweet.user.name+"/"+tweet.user.screen_name}}</span>
      </div>
      <div class="tweet-content">{{tweet.full_text}}</div>
      <div class="tweet-timestamp">{{tweet.created_at}}</div>
    </div>
    <div
      class="tweet-images"
      v-if="tweet.extended_entities!=undefined"
      @mouseover="showpreview"
      @mouseleave="hidepreview"
    >
      <img
        class="tweet-image"
        v-for="(image) in tweet.extended_entities.media"
        :key="image.index"
        :src="image.media_url_https"
      />
    </div>
    <div v-if="preview" class="tweet-images-preview">
      <img
        class="tweet-image"
        v-for="(image) in tweet.extended_entities.media"
        :key="image.index"
        :src="image.media_url_https"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "tweet",
  props: {
    tweet: undefined,
    option: undefined
  },
  data: function() {
    return {
      preview: false
    };
  },
  methods: {
    propic: function(user) {
      return this.option.isBig
        ? user.profile_image_url_https.replace("_normal", "_bigger")
        : user.profile_image_url_https;
    },
    showpreview: function(event) {
      this.preview = true;
    },
    hidepreview: function(event) {
      this.preview = false;
    }
  }
};
</script>

<style lang="scss">
.tweet {
  color: black;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  display: flex;
  padding: 10px;
  margin-bottom:4px;
  border-radius:4px;
  align-items: stretch;
}
@mixin profile() {
  object-fit: contain;
  border-radius: 12px;
  margin-bottom:auto;
}
.profile {
  @include profile();
  width: 40px;
}
.profile-big {
  @include profile();
  width: 80px;
}
.tweet-text {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  padding: 0px 12px;
  .tweet-name{
    margin-bottom: 10px;
    .tweet-name-content {
      background: #ffe0e0;
      border-radius: 4px;
      padding:4px;
      font-weight: bold;
      .protected::after {
        width: 10px;
        height: 10px;
        content: "🔒";
      }
    }
  }
  .tweet-content {
    flex: 1;
    font-size:14px;
  }
  .tweet-timestamp{
    font-size: 12px;
    color:hsla(0, 0, 20, .8)
  }
}

.tweet-images-preview {
  position: absolute;
  display: inline-flex;
  right: 140px;
  background: hsla(0, 0, 0, 0.2);
  padding: 4px;
  margin-top: -8px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  :not(:last-child) {
    margin-right: 4px;
  }
}
.tweet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
.tweet-images {
  display: inline-flex;
  cursor: pointer;
  :not(:last-child) {
    margin-right: -95px;
  }
}
</style>