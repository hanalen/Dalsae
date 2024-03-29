<template>
  <div class="dm-panel" :style="stylePanel">
    <div class="dm-left">
      <dm-user v-for="(user, i) in listUser" :key="i" :user="user" />
    </div>
    <div class="dm-right" v-if="selectUser.id_str !== ''">
      <div class="dm-user-info">
        <propic :user="selectUser" :size="48" />
        <div class="name-area">
          <span class="bold ">{{ selectUser.name }}</span>
          <br />
          <span>@{{ selectUser.screen_name }}</span>
        </div>
      </div>
      <div class="dm-body" :style="styleBody">
        <dm-item v-for="(dm, i) in listDm" :key="i" :dm="dm" />
      </div>
      <div class="dm-input" :style="styleDmInput" @drop="OnDrop">
        <input
          ref="refFile"
          type="file"
          hidden="hidden"
          accept="image/gif, image/jpeg, image/png"
          @change="OnFileChange"
          multiple
        />
        <div class="add-image" v-if="image">
          <add-image :img="image" :index="0"></add-image>
        </div>
        <div>
          <v-icon v-if="!image" color="info" @click="OnClickAddImage" class="click-able"
            >mdi-image-outline</v-icon
          >
          <input
            ref="refText"
            :style="styleInput"
            background-color="white"
            v-on:paste="Paste"
            type="text"
            v-model="input"
            spellcheck="false"
            @keydown.enter="OnEnter"
            @keydown.esc="OnEsc"
          />
        </div>
        <!-- </input> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dm-panel {
  display: flex;
}
.dm-left {
  width: 300px;
  height: 100%;
  max-width: 300px;
  overflow-y: scroll;
}
.dm-right {
  width: calc(100vw - 300px);
  height: 100%;
  padding: 8px;
}
.dm-body {
  overflow-y: scroll;
}
.dm-user-info {
  display: flex;
  border-bottom: dashed 2px rgba(0, 0, 0, 0.12);
  margin-bottom: 4px;
  height: 60px;
}
.dm-input,
.dm-user-info {
  width: 100%;
  display: flex;
}
.dm-input {
  bottom: 4px;
  position: absolute;
  flex-direction: column;
  // height: 25px;
}
.name-area span {
  margin-left: 4px;
}

.add-image {
  max-width: calc(100vw - 350px);
  max-height: 240px;
  object-fit: cover;
}

input {
  border-radius: 4px;
  border: 1px solid #c1c1c1;

  font-family: 'Malgun Gothic' !important;
  height: 25px;
  font-size: 13px !important;
  background-color: white;
  padding: 2px 4px 2px 4px;
  resize: none;
}
input:focus {
  outline: none;
  border-radius: 4px;
  border: 1px solid #007cd6;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Mixins, Component, Ref, Provide, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleModal } from '@/store/modules/ModalStore';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleDm } from '@/store/modules/DmStore';
import * as M from '@/mixins';
import { moduleApi } from '@/store/modules/APIStore';

@Component
export default class DmPanel extends Vue {
  get image() {
    return moduleDm.stateInput.image;
  }
  set image(image: string) {
    moduleDm.SetStateDmInput({ ...moduleDm.stateInput, image: image });
  }
  get input() {
    return moduleDm.stateInput.input;
  }
  set input(value: string) {
    moduleDm.SetStateDmInput({ ...moduleDm.stateInput, input: value });
  }
  get stylePanel() {
    if (moduleOption.uiOption.isSmallInput) {
      return {
        height: 'calc(100vh - 99px)'
      };
    } else {
      return {
        height: 'calc(100vh - 156px)'
      };
    }
  }
  get styleInput() {
    if (!this.image) {
      return {
        width: 'calc(100vw - 360px)'
      };
    } else {
      return {
        width: 'calc(100vw - 330px)'
      };
    }
  }
  get styleBody() {
    let height = moduleOption.uiOption.isSmallInput ? 200 : 260;
    if (this.image) height += 240;
    return {
      height: `calc(100vh - ${height}px)`
    };
  }
  get styleDmInput() {
    if (!this.image) {
      return {
        height: '25px'
      };
    } else {
      return {
        height: '275px'
      };
    }
  }
  get selectUser() {
    return moduleDm.stateDm.selectUser;
  }
  get listUser() {
    return moduleDm.listUser;
  }
  get listDm() {
    return moduleDm.listDm;
  }

  @Ref()
  refFile!: HTMLInputElement;
  @Ref()
  refRight!: HTMLElement;

  OnClickAddImage(e: MouseEvent) {
    this.refFile.click();
  }

  OnFileChange(e: Event) {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
      this.FileToString(files[i]);
    }
  }

  Paste(e: ClipboardEvent) {
    if (!e.clipboardData) return;
    const files = e.clipboardData.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'image/png') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }

  OnDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const files = e.dataTransfer.items;
    for (let i = 0; i < files.length; i++) {
      if (files[i].kind == 'file') {
        this.FileToString(files[i].getAsFile());
      }
    }
  }

  FileToString(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = e.target?.result as string;
      this.AddImage(img);
    };
    reader.readAsDataURL(file);
  }

  AddImage(img: string) {
    if (this.image) {
      moduleModal.AddMessage({
        errorType: M.Messagetype.E_INFO,
        message: 'DM에서 이미지는 하나만 등록 가능합니다.',
        time: 3
      });
    } else if (this.image === img) {
      //동일한 이미지 등록 시 스킵처리
      moduleModal.AddMessage({
        errorType: M.Messagetype.E_INFO,
        message: '동일한 파일은 추가 할 수 없습니다.',
        time: 3
      });
    } else {
      this.image = img;
    }
  }

  OnEnter(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    moduleApi.directMessage.New(this.input, moduleDm.stateDm.selectUser.id_str, this.image);
    moduleDm.SetStateDmInput({ image: '', input: '' });
  }
  OnEsc(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    moduleDm.SetStateDmInput({ image: '', input: '' });
  }
}
</script>
