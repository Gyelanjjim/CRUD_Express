# crud_express.js

## 주제📈
express.js 프레임워크와 TypeORM(pooling기능)을 사용하여 데이터베이스에 Create, Read, Update, Delete API 서버 구축하기

## 기간📆
2022.11.02 ~ 2022.11.02 (CommonJS로 구현)<br />
2023.01.16 ~ 2023.01.17 (추가: ES모듈로 구현)

## 링크🔗
- [기술블로그](https://velog.io/@scroll0908/BENode-4.-Express와-TypeORM을-활용한-CRUD-API-만들기211.2)

## 기술스택
- JavaScript
- NodeJS
- ExpressJS

## 설명
- ES모듈로 서버 구동 시 package.js에서 "main"항목 다음에 `"type" : "module"` 추가해야 함
- ES모듈로 서버 구동 시 다음의 에러가 있으며 아직 해결하지 못함
  > throw new MissingDriverError_1.MissingDriverError(type, [ 
MissingDriverError: Wrong driver: "undefined" given. ~
