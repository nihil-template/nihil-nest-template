export interface Config {
  server?: {
    port?: number;
    host?: string;
  };
  swagger?: {
    docsName?: string;
    docsDescription?: string;
    docsVersion?: string;
    path?: string;
  };
  jwt?: {
    access?: {
      secret?: string;
      expiresIn?: string;
    };
    refresh?: {
      secret?: string;
      expiresIn?: string;
    };
  };
  nodemailer?: {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
  };
  initialAdmin?: {
    email?: string;
    username?: string;
    password?: string;
  };
  database?: {
    url?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    name?: string;
  };
  app?: {
    name?: string;
    description?: string;
    version?: string;
    url?: string;
  };
}
