# 달새 소스 공식 문서입니다.

## 개발 환경 구축
### 각종 버전
- node `16.13.0`이상
  16버전을 사용한 이유가 있...는데 기억이 안 납니다...
- npm `무관'
- Vue.js `2.6.14`를 사용하고 있습니다. 환경 구축과는 무관하지만 적어둡니다.
- Electron `15.3.1`를 사용하고 있습니다. 환경 구축과는 무관하지만 적어둡니다.
- AppKey 할당 `달새 App키는 비공개로 운영하기에 사용 시 키를 수동 할당 하셔야 돌아갑니다.`
  * `src\Interfaces\DalsaeDatas\AppKeys.ts` 파일을 아래와 같은 모양으로 생성
``` js
export default {
  ConsumerKey: 'App의 퍼블릭 키',
  ConsumerSecretKey: 'App의 시크릿 키'
};
```
### 버전과 키 파일을 생성 후
- 모두가 하는 그것 `npm install`
- Vue 빌드 명령어 `npm run build`
- electron 빌드 명령어 `npm run electron:build`
- 개발 환경 명령어 `npm run electron:serve`
### 아래 내용은 개발 하며 바뀔 가능성이 높습니다.
- 최종 수정일 `2022.01.06`
- 최종 커밋 링크
  * https://github.com/hanalen/Dalsae/commit/eaa736c66571bd9096f3edc266d9a42d47eb1efe
## 폴더 구조
- `/src/API`
  * 네트워크 처리를 담당하는 파일이 모여있습니다.
- `/src/components/`
  * 공용으로 사용되는 `*.vue` 파일이 모여있습니다.

- `/src/mixins/`
   * 컴포넌트 파일이 길어지는 걸 방지하기 위해 소스만 따로 모아놓고
   * 컴포넌트에서 mixin 해서 사용하는 파일들이 모여있습니다.
- `/src/plugins/`
   * 이벤트버스 파일이 있습니다. 아예 없애는 걸 목표로 하고 있습니다.
- `/src/preloads/`
  * electron의 메인프로세스와 렌더러 프로세스간 통신을 하기 위한 preload 파일이 모여있습니다.
- `/src/router/`
  * Vue의 router파일이 있습니다. 파일 단, 하나!
- `src/store/`
  * vuex 파일들이 모여있습니다.
- `/src/store/Interface/`
  * vuex 디스패치용 인터페이스가 모여있습니다.
- `/src/store/modules/`
  * 달새는 vuex를 모듈화 하여 사용합니다. vuex 모듈들이 모여있습니다.
- `/src/views/`
  * 라우트 된 페이지를 모아둠
- `/src/views/modals/`
  * 모달은 예외적으로 views 하위에 모아둠
- `/src/Interface/`
  * 트위터 API 오브젝트 객체들이 모여있음
  * 하위 폴더 구조는 트위터 API 구조를 따라갑니다.
- `/src/Interface/DalsaeDatas/`
  * 달새에서 사용하는 데이터가 들어있습니다.
- `/src/main.ts`
  * Vue.js의 `main`파일입니다.
- `/src/MainProcess.ts`
  * Electron의 `main`파일입니다.
