import type { UserInfoType } from '@repo/drizzle';

/**
 * @description 사용자 예시 데이터.
 */
export function createExampleUser() {
  const now = new Date();
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return {
    userNo: 1,
    emlAddr: 'user@example.com',
    userNm: '홍길동',
    userRole: 'USER',
    proflImg: null,
    userBiogp: '안녕하세요. 반갑습니다.',
    encptPswd: null,
    reshToken: null,
    useYn: 'Y',
    delYn: 'N',
    lastLgnDt: formatDate(now),
    crtNo: 1,
    crtDt: formatDate(now),
    updtNo: 1,
    updtDt: formatDate(now),
    delNo: null,
    delDt: null,
  } as UserInfoType;
}
