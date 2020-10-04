<template>
  <div class="window-area">
    <span>이미지 윈도우 </span>
    <span>{{ dataValue }}</span>
  </div>
</template>

<script>
export default {
  name: 'ImageWindow',
  components: {},
  data: function() {
    return {
      dataValue: {
        type: String,
        default: ''
      }
    };
  },
  props: {
    userid: {
      type: String,
      default: '000'
    },
    test: undefined
  },
  methods: {},
  created: function() {
    const value = window.preload.image.GetTweet(this.$route.query.tweetId);
    this.dataValue = value;
  }
};
</script>
