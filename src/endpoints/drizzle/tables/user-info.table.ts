import { userRole, yn } from '@/endpoints/drizzle/enums';
import { sql } from 'drizzle-orm';
import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';

// 테이블 정의
export const userInfo = pgTable('user_info', {
  userNo: integer('user_no')
    .primaryKey()
    .default(sql`nextval('user_info_seq')`),

  emlAddr: varchar('eml_addr', { length: 254, })
    .notNull()
    .unique(),
  userNm: varchar('user_nm', { length: 30, })
    .notNull()
    .unique(),
  userRole: userRole('user_role')
    .notNull()
    .default('USER'),

  proflImg: varchar('profl_img', { length: 1024, }),
  userBiogp: varchar('user_biogp', { length: 500, }),

  // 인증 정보
  encptPswd: varchar('encpt_pswd', { length: 255, })
    .notNull(),
  reshToken: varchar('resh_token', { length: 500, }),

  // 상태 관리
  useYn: yn('use_yn')
    .notNull()
    .default('Y'),
  delYn: yn('del_yn')
    .notNull()
    .default('N'),
  lastLgnDt: timestamp('last_lgn_dt', { withTimezone: true, }),

  // 메타데이터
  crtNo: integer('crt_no'),
  crtDt: timestamp('crt_dt', { withTimezone: true, })
    .notNull()
    .defaultNow(),
  updtNo: integer('updt_no'),
  updtDt: timestamp('updt_dt', { withTimezone: true, })
    .notNull()
    .defaultNow(),
  delNo: integer('del_no'),
  delDt: timestamp('del_dt', { withTimezone: true, }),
}, (table) => [
  index('user_info_eml_addr_idx')
    .on(table.emlAddr),
  index('user_info_user_nm_idx')
    .on(table.userNm),
]);
