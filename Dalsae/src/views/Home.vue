<template>
  <div class="home">
    <my-button role="save">Hello ~</my-button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Scroll />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Scroll from './Test/Scroll.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Scroll
  }
};
</script>
