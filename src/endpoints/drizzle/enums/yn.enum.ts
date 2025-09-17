import { pgEnum } from 'drizzle-orm/pg-core';

export const yn = pgEnum('yn_enum', [ 'Y', 'N', ]);
