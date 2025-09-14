import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schemas } from '@/drizzle/schemas';
import { sql } from 'drizzle-orm';
import { type UserInfoType } from '@repo/drizzle';
import { CreateAdminDto, CreateUserDto } from '@repo/dto';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schemas>
  ) {}

  /**
   * 사용자 번호로 사용자 정보 조회
   * @param userNo 사용자 번호
   * @returns 사용자 정보 또는 null
   */
  async findById(userNo: number): Promise<UserInfoType | null> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        SELECT
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        FROM
          USER_INFO
        WHERE
          USER_NO = ${userNo}
      `
    );

    return result.rows[0] || null;
  }

  /**
   * 사용자 번호로 사용자 정보 조회 (findById와 동일)
   * @param userNo 사용자 번호
   * @returns 사용자 정보 또는 null
   */
  async findByUserNo(userNo: number): Promise<UserInfoType | null> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        SELECT
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        FROM
          USER_INFO
        WHERE
          USER_NO = ${userNo}
      `
    );

    return result.rows[0] || null;
  }

  /**
   * 관리자 계정 생성
   * @param signUpData 회원가입 데이터
   * @param hashedPassword 해시된 비밀번호
   * @returns 생성된 관리자 정보
   */
  async createAdmin(signUpData: CreateAdminDto, hashedPassword: string): Promise<UserInfoType> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        INSERT INTO USER_INFO (
            EML_ADDR
          , USER_NM
          , USER_ROLE
          , PROFL_IMG
          , USER_BIOGP
          , ENCPT_PSWD
          , RESH_TOKEN
          , USE_YN
          , DEL_YN
          , LAST_LGN_DT
          , CRT_NO
          , CRT_DT
          , UPDT_NO
          , UPDT_DT
          , DEL_NO
          , DEL_DT
        ) VALUES (
          ${signUpData.emlAddr}
        , ${signUpData.userNm}
        , ${signUpData.userRole}
        , NULL
        , NULL
        , ${hashedPassword}
        , NULL
        , 'Y'
        , 'N'
        , NULL
        , NULL
        , NOW()
        , NULL
        , NOW()
        , NULL
        , NULL
        ) RETURNING (
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        )
      `
    );

    return result.rows[0];
  }

  /**
   * 일반 사용자 계정 생성
   * @param signUpData 회원가입 데이터
   * @param hashedPassword 해시된 비밀번호
   * @returns 생성된 사용자 정보
   */
  async createUser(signUpData: CreateUserDto, hashedPassword: string): Promise<UserInfoType> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        INSERT INTO USER_INFO (
            EML_ADDR
          , USER_NM
          , USER_ROLE
          , PROFL_IMG
          , USER_BIOGP
          , ENCPT_PSWD
          , RESH_TOKEN
          , USE_YN
          , DEL_YN
          , LAST_LGN_DT
          , CRT_NO
          , CRT_DT
          , UPDT_NO
          , UPDT_DT
          , DEL_NO
          , DEL_DT
        ) VALUES (
          ${signUpData.emlAddr}
        , ${signUpData.userNm}
        , 'USER'
        , NULL
        , NULL
        , ${hashedPassword}
        , NULL
        , 'Y'
        , 'N'
        , NULL
        , NULL
        , NOW()
        , NULL
        , NOW()
        , NULL
        , NULL
        ) RETURNING (
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        )
      `
    );

    return result.rows[0];
  }

  /**
   * 로그인 정보 업데이트 (리프레시 토큰, 마지막 로그인 시간)
   * @param userNo 사용자 번호
   * @param reshToken 리프레시 토큰
   */
  async updateSignInInfo(userNo: number, reshToken: string): Promise<void> {
    await this.db.execute(
      sql`
        UPDATE
          USER_INFO 
        SET 
            RESH_TOKEN = ${reshToken}
          , LAST_LGN_DT = NOW()
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
      `
    );
  }

  /**
   * 리프레시 토큰 업데이트
   * @param userNo 사용자 번호
   * @param reshToken 새로운 리프레시 토큰
   */
  async updateRefreshToken(userNo: number, reshToken: string): Promise<void> {
    await this.db.execute(
      sql`
        UPDATE
          USER_INFO 
        SET 
            RESH_TOKEN = ${reshToken}
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
      `
    );
  }

  /**
   * 리프레시 토큰 삭제 (로그아웃 시)
   * @param userNo 사용자 번호
   */
  async clearRefreshToken(userNo: number): Promise<void> {
    await this.db.execute(
      sql`
        UPDATE
          USER_INFO 
        SET 
            RESH_TOKEN = NULL
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
      `
    );
  }

  /**
   * 사용자 탈퇴 처리 (USE_YN = 'N', DEL_YN = 'Y')
   * @param userNo 사용자 번호
   * @returns 탈퇴 처리된 사용자 정보
   */
  async withdrawUser(userNo: number): Promise<UserInfoType> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        UPDATE
          USER_INFO
        SET
            USE_YN = 'N'
          , DEL_YN = 'Y'
          , DEL_DT = NOW()
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
        RETURNING
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
      `
    );

    return result.rows[0];
  }

  /**
   * 사용자 비밀번호 업데이트
   * @param userNo 사용자 번호
   * @param encptPswd 해시된 비밀번호
   * @returns 업데이트된 사용자 정보
   */
  async updatePassword(userNo: number, encptPswd: string): Promise<UserInfoType> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        UPDATE
          USER_INFO
        SET
            ENCPT_PSWD = ${encptPswd}
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
        RETURNING
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
      `
    );

    return result.rows[0];
  }

  /**
   * @description 사용자 목록 조회 (페이지네이션 포함)
   * @param strtRow 시작 행 (선택사항)
   * @param endRow 종료 행 (선택사항)
   * @param srchType 검색 타입 (선택사항)
   * @param srchKywd 검색 키워드 (선택사항)
   * @returns 사용자 목록과 총 개수
   */
  async getUsers(
    strtRow?: number,
    endRow?: number,
    srchType?: 'userNm' | 'emlAddr',
    srchKywd?: string
  ): Promise<UserInfoType[]> {
    const keyword = srchKywd?.trim() || '';

    const like = keyword
      ? `%${keyword}%`
      : null;

    const where = keyword
      ? (
        srchType === 'userNm'
          ? sql`AND USER_NM ILIKE ${like}`
          : sql`AND EML_ADDR ILIKE ${like}`
      )
      : sql``;

    const limit = strtRow
      ? sql`LIMIT ${strtRow}`
      : sql``;
    const offset = endRow
      ? sql`OFFSET ${endRow}`
      : sql``;

    const result = await this.db.execute<UserInfoType>(
      sql`
        SELECT
            ROW_NUMBER() OVER (ORDER BY CRT_DT DESC) AS "rowNo"
          , COUNT(1) OVER () AS "totalCnt"
          , USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        FROM
          USER_INFO
        WHERE
          1 = 1
          ${where}
        ORDER BY
          CRT_DT DESC
        ${limit}
        ${offset}
      `
    );

    return result.rows;
  }

  /**
   * 이메일로 사용자 조회
   * @param emlAddr 이메일 주소
   * @returns 사용자 정보
   */
  async findByEmail(emlAddr: string): Promise<UserInfoType | null> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        SELECT
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
        FROM
          USER_INFO
        WHERE
          EML_ADDR = ${emlAddr}
        AND
          DEL_YN = 'N'
        LIMIT 1
      `
    );

    return result.rows[0] || null;
  }

  /**
   * 사용자 프로필 수정
   * @param userNo 사용자 번호
   * @param updateData 수정할 데이터
   * @returns 수정된 사용자 정보
   */
  async updateProfile(userNo: number, updateData: {
    userNm?: string;
    proflImg?: string;
    userBiogp?: string;
  }): Promise<UserInfoType> {
    const result = await this.db.execute<UserInfoType>(
      sql`
        UPDATE USER_INFO
        SET
            USER_NM = COALESCE(${updateData.userNm}, USER_NM)
          , PROFL_IMG = COALESCE(${updateData.proflImg}, PROFL_IMG)
          , USER_BIOGP = COALESCE(${updateData.userBiogp}, USER_BIOGP)
          , UPDT_DT = NOW()
        WHERE
          USER_NO = ${userNo}
          AND DEL_YN = 'N'
        RETURNING
            USER_NO AS "userNo"
          , EML_ADDR AS "emlAddr"
          , USER_NM AS "userNm"
          , USER_ROLE AS "userRole"
          , PROFL_IMG AS "proflImg"
          , USER_BIOGP AS "userBiogp"
          , ENCPT_PSWD AS "encptPswd"
          , RESH_TOKEN AS "reshToken"
          , USE_YN AS "useYn"
          , DEL_YN AS "delYn"
          , TO_CHAR(LAST_LGN_DT, 'YYYY-MM-DD HH24:MI:SS') AS "lastLgnDt"
          , CRT_NO AS "crtNo"
          , TO_CHAR(CRT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "crtDt"
          , UPDT_NO AS "updtNo"
          , TO_CHAR(UPDT_DT, 'YYYY-MM-DD HH24:MI:SS') AS "updtDt"
          , DEL_NO AS "delNo"
          , TO_CHAR(DEL_DT, 'YYYY-MM-DD HH24:MI:SS') AS "delDt"
      `
    );

    return result.rows[0];
  }

  /**
   * 사용자명 중복 확인
   * @param userNm 사용자명
   * @param excludeUserNo 제외할 사용자 번호 (자기 자신)
   * @returns 중복 여부
   */
  async isUserNameExists(userNm: string, excludeUserNo?: number): Promise<boolean> {
    const excludeCondition = excludeUserNo
      ? sql`AND USER_NO != ${excludeUserNo}`
      : sql``;

    const result = await this.db.execute<{ count: number }>(
      sql`
        SELECT COUNT(1) AS "count"
        FROM USER_INFO
        WHERE
          USER_NM = ${userNm}
        AND
          DEL_YN = 'N'
        ${excludeCondition}
      `
    );

    return result.rows[0].count > 0;
  }
}
