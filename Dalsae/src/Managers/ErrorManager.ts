import * as I from '@/Interfaces';

export enum ErrorType {
  E_ERROR = 'error',
  E_INFO = 'info',
  E_WARNING = 'warning',
  E_MESSAGE = 'success'
}

interface ErrorMessage {
  msg: string;
  errorType: ErrorType;
  time: number;
}

export class ErrorManager {
  private static _instence: ErrorManager = new ErrorManager();

  public static instence() {
    return this._instence;
  }

  listMsg: ErrorMessage[] = [];

  Error(e: Error) {
    console.log(e);
    this.AddMessage(e.message, ErrorType.E_ERROR);
  }

  APIError(e: I.ResponseTwitterError) {
    console.log(e);
    let message = '';
    if (!e.errors && e.errors) return;
    switch (e.errors[0].code) {
      case 34:
        message = '해당 유저는 없습니다.';
        break;
      case 44:
        message = '잘못 된 요청';
        break;
      case 64:
        message = '계정이 일시 정지 되었습니다.';
        break;
      case 87:
        message = '달새는 해당 동작을 할 수 없습니다.';
        break;
      case 88:
        message = '불러오기 제한, 몇 분 뒤 시도해주세요.';
        break;
      case 89:
        message =
          '잘못되거나 만료 된 토큰. 오류가 지속될 경우 Data폴더에 Switter를 지운 후 시도해주세요';
        break;
      case 130:
      case 131:
        message = '트위터 내부 오류';
        break;
      case 135:
        message = '인증할 수 없습니다.';
        break;
      case 136:
        message = '저런, 당신을 차단한 사람입니다.';
        break;
      case 139:
        message = '이미 관심글에 등록 된 트윗입니다.';
        break;
      case 144:
        message = '삭제된 트윗입니다.';
        break;
      case 150:
        message = '상대방에게 쪽지를 보낼 수 없습니다.';
        break;
      case 151:
        message = '메시지를 보내는 중 에러가 발생했습니다';
        break;
      case 179:
        message = '대화 트윗을 쓴 유저가 잠금 계정입니다.';
        break;
      case 185:
        message = '트윗 제한. 트잉여님 트윗 적당히 써주세요.';
        break;
      case 187:
        message = '중복 트윗입니다. 같은 내용을 적지 말아주세요 :(';
        break;
      case 327:
        message = '이미 리트윗 한 트윗입니다.';
        break;
      case 323:
        message = 'GIF와 이미지를 동시에 업로드 할 수 없습니다.';
        break;
      case 324:
        message = '이미지 용량이 5mb를 넘어 업로드 할 수 없습니다.';
        break;
      case 386:
        message = '트윗이 280자를 넘어 전송할 수 없습니다.';
        break;
    }
    this.AddMessage(message, ErrorType.E_ERROR);
  }

  private AddMessage(msg: string, errorType: ErrorType, second = 2) {
    const errorMsg = { msg: msg, errorType: errorType, time: second };
    this.listMsg.push(errorMsg);
    setTimeout(() => {
      this.listMsg.splice(this.listMsg.indexOf(errorMsg), 1);
    }, second * 1000);
  }
}
