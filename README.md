# 로컬호스트에 스마트루트 서버를 켰을 때를 위한 로컬클라이언트

## 실행 방법 ( Node Version : 22	)
	node express-app.js
	
## 테스트방법
 인터넷 웹브라우저에서 khw-test-001.smartroot.co.kr:3334 접근
 하면 127.0.0.1 에 접근한것과 같은 페이지가 나와야 함
 
## 전제 조건
### 스마트루트 서버
	로컬 스마트루트 주소 : 127.0.0.1
	포트 : 80
	context path : /
	
	
### 몽고 DB
	위치 : 127.0.0.1
	포트:27017
	DB : basic-info-database
			subdomains
		
			예시:{
					"subdomain": "khw-test-001",
					"clientPort": "8888",
					"fullURL": "http://khw-test-001.smartroot.co.kr:3334"
				}
### 로컬터널링 서버
	에는 클라이언트연결에 대비해 동일한 정보가 있어야 함.
				{
					"subdomain": "khw-test-001",
					"port": "5021"
				}
