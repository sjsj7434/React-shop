# react_shop
react_shop

<div>
	<h1>다운로드 후 실행법</h1>
	<p>2024-02-13 / npm 패키지 갱신 및 리액트 버전 업데이트</p>
	<p>VSCode 콘솔창에 node.js 설치 이후에 해야함</p>
	<ol>
		<li>
			npm install
		</li>
		<li>
			database.json 파일 루트에 생성
		</li>
		<li>
			DB 세팅, 스키마 & 테이블 생성 및 데이터 삽입
		</li>
		<li>
			public\uploadsImgs 폴더에 배너와 제품 이미지 넣기
		</li>
		<li>
			npm start
		</li>
		<li>
			node server.js
		</li>
	</ol>
</div>
<hr/>

<div>
	<p>database.json은 아래 형식</p>

	{
		"host" : "localhost"
		, "user" : "root"
		, "password" : "passswrd"
		, "port" : 3306
		, "database" : "shopDB"
	}
</div>

<hr/>
<div>
	<p>필수 테이블 생성, 데이터도 넣어야 함</p>

	CREATE TABLE `main_slide` (
		`image_cd` int NOT NULL AUTO_INCREMENT,
		`image_name` varchar(100) DEFAULT NULL,
		`image_url` varchar(500) DEFAULT NULL,
		`priority` int DEFAULT NULL,
		`show_slide` varchar(45) DEFAULT NULL,
		PRIMARY KEY (`image_cd`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


	CREATE TABLE `product` (
		`product_code` int NOT NULL AUTO_INCREMENT,
		`category` varchar(50) DEFAULT NULL,
		`product_name` varchar(200) DEFAULT NULL,
		`product_image` varchar(300) DEFAULT NULL,
		`price` int DEFAULT '0',
		`product_discount` int DEFAULT NULL,
		`product_added_date` datetime DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (`product_code`)
	) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


</div>