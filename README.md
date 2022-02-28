# Nest 템플릿
Nest를 편하게 하려고 만든 템플릿. 기본적으로 타입스크립트를 지원하며 여러 기초적인 패키지들이 설치되어있다.

# 준비물

## 데이터베이스
보통은 데이터베이스가 필요하다. 데이터베이스 관련 패키지를 설치해주어야한다. 경우에 따라서는 설정 자체를 없애버려도 된다.

## env 파일 만들기
.env 파일을 만들어 아래와 같이 설정한다.

```dotenv
DB_HOST=localhost
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRY=
```

각 항목을 데이터베이스에 따라 맞게 입력한다. DB_NAME은 데이터베이스의 이름을 입력한다.
