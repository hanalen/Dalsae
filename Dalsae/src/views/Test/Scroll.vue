<template>
  <div class="scroll-area">
    <VirtualList
      class="list"
      :data-key="'index'"
      :data-sources="items"
      :data-component="ScrollItemComponent"
      :estimate-size="20"
    >
    </VirtualList>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import ScrollItem from './ScrollItem.vue';
export default {
  name: 'VirtualScroll',
  components: {
    // ScrollItem
    VirtualList
  },
  data: function() {
    return {
      items: [
        {
          name: 'abc',
          index: 1,
          text:
            'aaaaaaaaaaaaawefwf eaaaaaaaaaaaaawefwfeaaa aaaaaaaaaawefwfeaaaaaa aaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 2,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 3,
          text:
            'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 4,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 5,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 6,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 7,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 8,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 9,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 10,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        },
        {
          name: 'abc',
          index: 11,
          text: 'aaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfeaaaaaaaaaaaaawefwfe'
        }
      ],
      ScrollItemComponent: ScrollItem
    };
  }
};
</script>
