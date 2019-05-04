# seuksak

## 개요

대학생들이 손쉽게 사용할 수 있는 자동화된 팀 프로젝트 빌드&분석 툴
그저 팀원이 '슥'하고 던진 Github URL을 이용하여 자동화된 빌드&분석을 거친 데이터(결과물 및 결과정보)를 '삭'하고 내놓는다.

## 주요 기능

github 연동을 통한 코드관리
CI 서버 개념을 탑재한 자동화된 빌드
빌드 후 결과물에대한 처리(에러 분석, 빌드 정보, 결과물 보관)

## 확장성

탑재된 언어이외의 다양한 언어 지원
커뮤니티 기능을 추가하여 다양한 피드백을 지원

## 관련 소개자료

PPT URL : http://www.slideshare.net/SeongHyukJeong/seuk-sak

video URL : https://youtu.be/azqUOcwPvRY

테스트 웹 사이트 : http://52.78.234.237:3000/

테스트 ID : lso, PW : 1234

## 프로젝트 복사

#### Repository 복사
```
$ git clone https://github.com/LandvibeDev/seuksak
```

#### dev branch 변경
```
cd seuksak
git checkout dev
```

#### 프로젝트 모듈 설치 & 서버시작
```
npm install
npm start
```

#### dev branch 변경
```
$ cd seuksak
$ git branch
*master
$ git checkout dev
```
#### 변경된 branch 확인
```
$ git branch
* dev
master
```

## 변경사항 커밋
```
$ git commit -a -m 'message'
$ git push origin dev
```


markdown 문법
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
