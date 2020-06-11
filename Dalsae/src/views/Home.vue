<template>
  <div class="home" v-if="option != undefined">
    <input type="button" value="눌러라!" @click="ClickAdd" /><br />
    <input type="checkbox" v-model="option.bShow" />
    <Scroll v-show="!option.bShow" />
    <TestWindow v-if="false" />
  </div>
</template>

<script>
import { DataMng } from '@/views/Test/TestDataManager';
import Scroll from './Test/Scroll.vue';
import TestWindow from '@/views/Test/TestWindow.vue';

export default {
  name: 'Home',
  components: {
    Scroll,
    TestWindow
  },
  data: function() {
    return {
      bCheck: false,
      option: undefined
    };
  },
  computed: {
    bShow() {
      return DataMng.Instence().option;
    }
  },
  created: function() {
    this.$nextTick(() => {
      this.option = DataMng.Instence().option;
    });
  },
  methods: {
    ClickAdd(e) {
      console.log(e);
      DataMng.Instence().TweetAdd({
        isFav: false,
        id: 6,
        fullText: `서(序)ㅡ랄 것이 아니라
내가 무엇이고 정성껏 몇 마디 써야만 할 의무를 가졌건만 붓을 잡기가 죽기보담 싫은 날, 나는 천의를 뒤집어쓰고 차라리 병 아닌 신음을 하고 있다.
무엇이라고 써야 하나?
재조(才操)도 탕진하고 용기도 상실하고 8.15 이후에 나는 부당하게도 늙어 간다.
누가 있어서 "너는 일편(一片)의 정성까지도 잃었느냐?" 질타한다면 소허(少許) 항론(抗論)이 없이 앉음을 고쳐 무릎을 꿇으리라.
아직 무릎을 꿇을 만한 기력이 남았기에 나는 이 붓을 들어 시인 윤동주의 유고(遺稿)에 분향하노라.
겨우 30여 편 되는 유시(遺詩) 이외에 윤동주의 그의 시인 됨에 관한 아무 목증(目證)한 바 재료를 나는 갖지 않았다.`,
        name: 'hanalen'
      });
    }
  }
};
</script>
