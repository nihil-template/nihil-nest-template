# Nest 템플릿
Nest를 편하게 하려고 만든 템플릿. 기본적으로 타입스크립트를 지원하며 여러 기초적인 패키지들이 설치되어있다.

# 준비물
## .env
데이터베이스와 prisma를 이용하기 위해서는 일단 env 파일에 DATABASE_URL을 넣어줘야한다.
```plaintext
[DBMS]://[user]:[password]@[host]:[port]/[db]?schema=public
ex) mysql://root:mysql@localhost:3306/todolist_nest?schema=public
```

JWT_SECRET과 JWT_EXP는 JWT를 위한 것으로 원하는대로 작성해준다.

## 데이터베이스
보통은 데이터베이스가 필요하다. 데이터베이스는 postgresql이나 mysql을 사용한다. prisma를 기용했으며 적용되어있다.

```bash
npx prisma init
```

prisma 스키마를 생성한다.

```bash
npx prisma migrate dev --name [name]
```

스키마 파일을 수정하고, 준비가 되면 위 명령어를 실행한다. 혹 스키마 파일을 수정했다면 다시 명령어를 실행해야 개발시 적용된다.
