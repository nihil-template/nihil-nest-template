import { CreateAdminDto } from '@/dto/admin.dto';
import { CreateUserDto } from '@/dto/auth.dto';
import { UpdateUserDto } from '@/dto/user.dto';
import { DRIZZLE } from '@/endpoints/drizzle/drizzle.module';
import { schemas } from '@/endpoints/drizzle/schemas';
import { UserInfoType } from '@/endpoints/drizzle/schemas/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { sql, type SQLChunk } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schemas>
  ) {}

  // search_path를 사용하므로 스키마 접두는 제거합니다.

  /**
   * 사용자 정보 통합 조회 (조건별 단건 조회)
   * @param conditions 조회 조건
   * @returns 사용자 정보 또는 null
   */
  async findUser(conditions: {
    userNo?: number;
    emlAddr?: string;
    userNm?: string;
    includeDeleted?: boolean;
  }): Promise<UserInfoType | null> {
    const whereClauses: SQLChunk[] = [];

    if (conditions.userNo !== undefined) {
      whereClauses.push(sql`USER_NO = ${conditions.userNo}`);
    }
    if (conditions.emlAddr !== undefined) {
      whereClauses.push(sql`EML_ADDR = ${conditions.emlAddr}`);
    }
    if (conditions.userNm !== undefined) {
      whereClauses.push(sql`USER_NM = ${conditions.userNm}`);
    }

    // 기본적으로 삭제되지 않은 사용자만 조회
    if (!conditions.includeDeleted) {
      whereClauses.push(sql`DEL_YN = 'N'`);
    }

    if (whereClauses.length === 0) {
      throw new Error('조회 조건이 필요합니다.');
    }

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
          ${sql.join(whereClauses, sql` AND `)}
        LIMIT 1
      `
    );

    return result.rows[0] || null;
  }

  /**
   * 사용자 계정 생성 (역할 지정 가능)
   * @param signUpData 회원가입 데이터 (userRole 포함)
   * @param hashedPassword 해시된 비밀번호
   * @returns 생성된 사용자 정보
   */
  async createUserWithRole(
    signUpData: CreateUserDto | CreateAdminDto,
    hashedPassword: string
  ): Promise<UserInfoType> {
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
        ) RETURNING
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
   * 사용자 정보 통합 업데이트 (모든 필드 선택적 업데이트 가능)
   * @param userNo 사용자 번호 (필수)
   * @param updateData 업데이트할 데이터 (모든 필드 선택사항)
   * @returns 업데이트된 사용자 정보
   */
  async updateUser(userNo: number, updateData: UpdateUserDto): Promise<UserInfoType> {
    // 업데이트할 필드만 동적으로 구성
    const setClauses: SQLChunk[] = [];

    if (updateData.userNm !== undefined) {
      setClauses.push(sql`USER_NM = ${updateData.userNm}`);
    }
    if (updateData.proflImg !== undefined) {
      setClauses.push(sql`PROFL_IMG = ${updateData.proflImg}`);
    }
    if (updateData.userBiogp !== undefined) {
      setClauses.push(sql`USER_BIOGP = ${updateData.userBiogp}`);
    }
    if (updateData.userRole !== undefined) {
      setClauses.push(sql`USER_ROLE = ${updateData.userRole}`);
    }
    if (updateData.useYn !== undefined) {
      setClauses.push(sql`USE_YN = ${updateData.useYn}`);
    }
    if (updateData.delYn !== undefined) {
      setClauses.push(sql`DEL_YN = ${updateData.delYn}`);
    }
    if (updateData.encptPswd !== undefined) {
      setClauses.push(sql`ENCPT_PSWD = ${updateData.encptPswd}`);
    }
    if (updateData.reshToken !== undefined) {
      setClauses.push(sql`RESH_TOKEN = ${updateData.reshToken}`);
    }
    if (updateData.lastLgnDt !== undefined) {
      setClauses.push(sql`LAST_LGN_DT = ${updateData.lastLgnDt}`);
    }
    if (updateData.crtNo !== undefined) {
      setClauses.push(sql`CRT_NO = ${updateData.crtNo}`);
    }
    if (updateData.updtNo !== undefined) {
      setClauses.push(sql`UPDT_NO = ${updateData.updtNo}`);
    }
    if (updateData.delNo !== undefined) {
      setClauses.push(sql`DEL_NO = ${updateData.delNo}`);
    }

    // 항상 UPDT_DT는 현재 시간으로 업데이트
    setClauses.push(sql`UPDT_DT = NOW()`);

    if (setClauses.length === 1) { // UPDT_DT만 있는 경우 (업데이트할 데이터가 없음)
      throw new Error('업데이트할 데이터가 없습니다.');
    }

    const result = await this.db.execute<UserInfoType>(
      sql`
        UPDATE USER_INFO
        SET ${sql.join(setClauses, sql`, `)}
        WHERE USER_NO = ${userNo}
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
    srchType?: 'userNm' | 'emlAddr' | 'userRole',
    srchKywd?: string
  ): Promise<UserInfoType[]> {
    const keyword = srchKywd?.trim() || '';

    const like = keyword
      ? `%${keyword}%`
      : null;

    let where = sql``;

    if (keyword) {
      if (srchType === 'userNm') {
        where = sql`AND USER_NM ILIKE ${like}`;
      }
      else if (srchType === 'emlAddr') {
        where = sql`AND EML_ADDR ILIKE ${like}`;
      }
      else if (srchType === 'userRole') {
        where = sql`AND USER_ROLE ILIKE ${like}`;
      }
    }

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
