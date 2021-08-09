<template>
  <router-view></router-view>
</template>

<style lang="scss" src="@/Styles/vuetify.scss"></style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
