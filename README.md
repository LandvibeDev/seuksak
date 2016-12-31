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
$ git add 'file'
$ git add . ( all changed file )
$ git commit -a -m 'message'
$ git push origin dev
```

#### 의존성 관리
```
$ npm install
```

## 프로젝트 시작
```
$ DEBUG=seuksak:* npm start
```


markdown 문법
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
