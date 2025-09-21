import { MESSAGE_CODE } from '@/code/message.code';
import { schemas } from '@/endpoints/drizzle/schemas';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private readonly logger = new Logger(DrizzleService.name);
  private _db: NodePgDatabase<typeof schemas>;
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeDatabase();
  }

  get db(): NodePgDatabase<typeof schemas> {
    if (!this._db) {
      throw new Error(MESSAGE_CODE.DRIZZLE_INIT_ERROR);
    }
    return this._db;
  }

  /**
   * 지연 초기화된 데이터베이스 인스턴스를 반환합니다.
   * 멱등 보장: 다중 호출 시 한 번만 초기화됩니다.
   */
  getDb(): NodePgDatabase<typeof schemas> {
    if (!this._db) {
      // initializeDatabase는 예외 발생 시 로깅 후 그대로 던집니다.
      this.initializeDatabase();
    }
    return this._db;
  }

  private formatError(e: unknown): string {
    try {
      if (e instanceof Error) {
        return e.stack ?? e.message;
      }
      if (typeof e === 'string') {
        return e;
      }
      return JSON.stringify(e, null, 2);
    }
    catch {
      return MESSAGE_CODE.ERROR;
    }
  }

  private initializeDatabase(): void {
    if (this._db) {
      return; // 이미 초기화됨
    }
    try {
      const schema = this.configService.get<string>('database.schema');

      this.pool = new Pool({
        connectionString: this.configService.get('database.url'),
        options: `-c search_path=${schema},public`,
      });

      // 연결 후 스키마 설정
      this.pool.on('connect', (client) => {
        this.logger.log(MESSAGE_CODE.DB_CONNECTED);
        client.query(`SET search_path TO ${schema}, public`)
          .then(() => {
            this.logger.log(MESSAGE_CODE.DB_SEARCH_PATH_SET);
          })
          .catch((err: unknown) => {
            this.logger.error(MESSAGE_CODE.DB_SEARCH_PATH_SET_FAILED, this.formatError(err));
          });
      });

      // 풀 에러 핸들링
      this.pool.on('error', (err: unknown) => {
        this.logger.error(MESSAGE_CODE.DB_CONNECTION_ERROR, this.formatError(err));
      });

      this._db = drizzle(this.pool, {
        schema: {
          // schemas에 정의된 스키마 모음을 임포트.
          ...schemas,
        },
        logger: true, // 쿼리 로깅 활성화로 스키마 확인
      });

      this.logger.log(MESSAGE_CODE.DB_CONNECTED);
    }
    catch (error: unknown) {
      this.logger.error(MESSAGE_CODE.DRIZZLE_INIT_ERROR, this.formatError(error));
      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.log(MESSAGE_CODE.DB_DISCONNECTED);
    }
  }
}
