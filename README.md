# seuksak


## 프로젝트 복사

#### Repository 복사
```
$ git clone https://github.com/LandvibeDev/seuksak
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
#### user 등록
```
$ git config --global user.name "사용자명"
```

#### 변경사항 커밋
```
# 주의!! 작업을 시작하기 전 항상 먼저 pull 받고 시작한다. 작업을 마친 후 git에 작업한 소스코드를 반영한다.
$ git pull origin dev

$ git add 'file'
$ git add . ( all changed file )
$ git commit -a -m 'message'
$ git push origin dev
```
### git에서 실수로 git add 한  취소하는 방법
```
git rm --cached <filename>
```

## 프로젝트 내려받을 때
```
$ git pull origin dev
$ npm install
```

#### 프로젝트 시작 & 서버시작
```
$ DEBUG=seuksak:* npm start
```


markdown 문법
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
