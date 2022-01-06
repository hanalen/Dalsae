# 달새 소스 공식 문서입니다.

## 개발 환경 구축
### 각종 버전
- node `16.13.0`이상
  16버전을 사용한 이유가 있...는데 기억이 안 납니다...
- npm `무관'
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
