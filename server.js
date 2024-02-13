const fs = require('fs');
const multer = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const HASH_NUMBER = 113791;
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: '@#@$MYSIGN1#@$#$',
	resave: false,
	saveUninitialized: true
}));

// database 설정
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql2');
const { resolve } = require('path');
const connection = mysql.createConnection({
	host: conf.host,
	user: conf.user,
	password: conf.password,
	port: conf.port,
	database: conf.database
});
connection.connect();

const ADMIN_ID = "Admin.1" //Email Of Angie => shop owner

//////////////////////////////////////////////////////////
//////////////////////// product ////////////////////////
//////////////////////////////////////////////////////////
app.post('/api/main/product/new', (req, res) => {
	connection.query(
		'SELECT * FROM product ORDER BY product_added_date DESC LIMIT 0, 4',
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/main/product/discount', (req, res) => {
	connection.query(
		'SELECT * FROM product WHERE product_discount > 0 ORDER BY product_discount DESC, product_added_date DESC LIMIT 0, 4',
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/product/category/select', (req, res) => {
	connection.query(
		'SELECT * FROM product_category ORDER BY menu_rank ASC',
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});
app.post('/api/product/category/merge', (req, res) => {
	let category = req.body.category;
	let url = req.body.category.toString().toLowerCase();
	let menu_rank = req.body.menu_rank;
	if(menu_rank === null){
		menu_rank = 100;
	}
	let category_id = req.body.category_id;
	connection.query(
		'INSERT INTO product_category (category, url, menu_rank, category_id) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE category = ?, url = ?, menu_rank = ?',
		[category, url, menu_rank, category_id, category, url, menu_rank],
		(err, rows, fields) => {
			console.log(err)
			res.send(rows);
		}
	)
});
app.post('/api/product/category/delete', (req, res) => {
	let category_id = req.body.category_id;
	connection.query(
		'DELETE FROM product_category WHERE category_id = ?',
		category_id,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/product/getNumberForPagination', (req, res) => {
	let category = req.body.category;
	let numberForPagination = 0;

	connection.query(
		'SELECT COUNT(*) AS countRow FROM product WHERE category = ?',
		category,
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
		}
	)
});

app.post('/api/productCall', (req, res) => {
	let category = req.body.category;
	let limit = parseInt(req.body.limit);
	let params = [category, limit];

	connection.query(
		'SELECT * FROM product WHERE category = ? ORDER BY product_added_date DESC LIMIT ?, 10',
		params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/products/product_code', (req, res) => {
	let product_code = req.body.product_code;
	connection.query(
		'SELECT * FROM product WHERE product_code = ?',
		product_code,
		(err, rows, fields) => {
			res.send(rows);
		}
	);
});

app.post('/api/products/product_code_multiple', (req, res) => {
	let product_code_multiple = req.body.product_code_multiple;
	connection.query(
		'SELECT * FROM product WHERE product_code IN (' + product_code_multiple + ')',
		null,
		(err, rows, fields) => {
			res.send(rows);
		}
	);
});

app.post('/api/product/search/getNumberForPagination', (req, res) => {
	let searchKey = req.body.searchKey;
	let category = req.body.category;
	let numberForPagination = 0;

	connection.query(
		'SELECT COUNT(*) AS countRow FROM product WHERE category = ? AND product_name LIKE '+connection.escape('%'+searchKey+'%'),
		category,
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
		}
	)
});
app.post('/api/product/search/all/getNumberForPagination', (req, res) => {
	let searchKey = req.body.searchKey;
	let numberForPagination = 0;

	connection.query(
		'SELECT COUNT(*) AS countRow FROM product WHERE product_name LIKE '+connection.escape('%'+searchKey+'%'),
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
		}
	)
});

app.post('/api/products/search/all', (req, res) => {
	let searchKey = req.body.searchKey;
	let limit = parseInt(req.body.limit);
	let offset = parseInt(req.body.offset);
	let params = [limit, offset];

	connection.query(
		'SELECT * FROM product WHERE product_name LIKE '+connection.escape('%'+searchKey+'%')+'LIMIT ?, ?',
		params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});
app.post('/api/products/search', (req, res) => {
	let searchKey = req.body.searchKey;
	let category = req.body.category;
	let limit = parseInt(req.body.limit);
	let offset = parseInt(req.body.offset);
	let params = [category, limit, offset];

	connection.query(
		'SELECT * FROM product WHERE category = ? AND product_name LIKE '+connection.escape('%'+searchKey+'%')+'LIMIT ?, ?',
		params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/products/order', async function(req, res){
	if(req.session.customerData !== undefined){
		let product_name = req.body.product_name;
		let product_code = req.body.product_code;
		let quantity = req.body.quantity;
		let total_price = req.body.total_price;
		let customer_id = req.session.customerData.customer_id;

		let sql_insert = 'INSERT INTO orders (ordered_date, product_code, total_price, quantity, customer_id, product_name) VALUES(?, ?,?,?,?,?)';
		let sql_update = 'UPDATE product SET product_stock = product_stock - ? WHERE product_code = ?';    

		let params_insert = [new Date().toISOString().slice(0, 19).replace('T', ' '), product_code, total_price, quantity, customer_id, product_name];
		let params_update = [quantity, product_code];

		try {
			connection.query(sql_insert, params_insert);

			const customer_rows = await GetCustomerDataQuery(customer_id);
			const checkStr = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
			const customer_email = customer_rows[0].customer_email;
			let emailTitle = '[Purple And White] You ordered product!';
			let emailText = '';
			emailText += `<p>Product : [ <b>${product_name}</b> ]</p>`;
			emailText += `<p>Quantity : <b>${quantity}</b></p>`;
			emailText += `<p>Price : <b>${total_price}</b></p>`;
			
			const admin_rows = await GetAdminDataQuery(ADMIN_ID);
			const admin_email = admin_rows[0].email;
			let emailTitle_admin = `[Purple And White] New Order [${product_name}]`;
			let emailText_admin = '';
			emailText_admin += `<p>Please check admin page to see detail.</p>`;
			emailText_admin += `<div><a href="http://www.pwcosmetic.com/admin/login">Go to admin page!</a></div>`;
			emailText_admin += `<p>Product : [ <b>${product_name}</b> ]</p>`;
			emailText_admin += `<p>Quantity : <b>${quantity}</b></p>`;
			emailText_admin += `<p>Price : <b>${total_price}</b></p>`;
			
			if(checkStr.test(customer_email) === true){
				EmailSending(emailTitle, emailText, customer_email);
				EmailSending(emailTitle_admin, emailText_admin, admin_email);
			}
			else{
				console.log("email is invalid!!!!");
			}
		}
		catch (error) {
			console.log(error);
			res.send({
				result : false
			});
		}

		try {
			connection.query(sql_update, params_update)
		}
		catch (error) {
			console.log(error);
			res.send({
				result : false
			});
		}

		res.send({
			result : true
		});
	}
	else{
		res.send({
			result : false
		});
	}
});

app.post('/api/products/cart/order', async function(req, res){
	//장바구니 전체 주문
	if(req.session.customerData !== undefined){
		let product_code_string = req.body.product_code_string;
		let quantity_string = req.body.quantity_string;
		let product_name_string = req.body.product_name_string;
		let product_price_string = req.body.product_price_string;
		const customer_id = req.session.customerData.customer_id;

		let sql_proc = 'CALL ORDER_CART(?, ?, ?)';
		//CALL ORDER_CART('5,6,7', '3,3,1', 'customIDID') 장바구니 프로시저 생성함

		let params_proc = [product_code_string, quantity_string, customer_id];

		try {
			connection.query(sql_proc, params_proc, async (err, rows, fields) => {
					let orderResult = false;
					let resultMessage = "";

					if(rows[0][0].TRAN_MSG === "COMMIT"){
						orderResult = true;
						resultMessage = "Order done";

						const customer_rows = await GetCustomerDataQuery(customer_id);
						const customer_email = customer_rows[0].customer_email;
						let emailTitle = '[Purple And White] You ordered product!';
						let emailText = '';
						for(let index = 0; index < product_name_string.split(",").length; index++){
							emailText += `<p>Product : [ <b>${product_name_string.split(",")[index]}</b> ]</p>`;
							emailText += `<p>Quantity : <b>${quantity_string.split(",")[index]}</b></p>`;
							emailText += `<p>Price : <b>${quantity_string.split(",")[index] * product_price_string.split(",")[index]}</b></p>`;
							emailText += "<br><br>";
						}
						EmailSending(emailTitle, emailText, customer_email); //customer Email

						const admin_rows = await GetAdminDataQuery(ADMIN_ID);
						const admin_email = admin_rows[0].email;
						let emailTitle_admin = `[Purple And White] New Order [Multiple order(cart)]`;
						let emailText_admin = '';
						emailText_admin += `<p>Please check admin page to see detail.</p>`;
						emailText_admin += `<div><a href="http://www.pwcosmetic.com/admin/login">Go to admin page!</a></div>`;
						emailText_admin += emailText;
						EmailSending(emailTitle_admin, emailText_admin, admin_email); //admin Email
					}
					else{
						if(rows[0][0].ERROR_MSG !== undefined){
							switch (rows[0][0].ERROR_MSG) {
								case "SQL EXCEPTION":
									resultMessage = "Wrong input data";
									break;
								case "NOT SAME CODE STRING":
									resultMessage = "Order data is wrong";
									break;
								case "NOT ENOUGH STOCK":
									resultMessage = "Not enough stock of product";
									break;
								case "INPUT DATA IS WRONG":
									resultMessage = "Wrong input data";
									break;
								default:
									resultMessage = "Order failed";
									break;
							}
						}
					}

					res.send({
						result : orderResult
						, resultMessage : resultMessage
					});
				}
			);
		}
		catch (error) {
			res.send({
				result : false
			});
		}
	}
	else{
		res.send({
			result : false
			, type : 1
			, message : "you need to login"
		});
	}
});

//////////////////////////////////////////////////////////
//////////////////////// admin ////////////////////////
//////////////////////////////////////////////////////////

app.post('/api/admin/register', (req, res) =>{
	const id = req.body.id;
	const password = req.body.password;
	const email = req.body.email;
	const salt = generateRandomString(64);
	let encryptedPassword;

	crypto.pbkdf2(password, salt, HASH_NUMBER, 64, 'sha512', (err, key) => {
		encryptedPassword = key.toString('base64');

		let sql = 'INSERT INTO admin_account (id, password, email, salt) VALUES (?,?,?,?)';
		let params = [id, encryptedPassword, email, salt];

		connection.query(sql, params, (err, rows, fields) => {
			if(err !== null){
				res.send(err);
			}
			res.send(true);
		});
	});
});

app.post('/api/admin/register/idcheck', (req, res) => {
	let id = req.body.id;

	let sql = 'SELECT id FROM admin_account WHERE id = ?';
	let params = [id];

	connection.query(sql, params,
		(err, rows, fields) => {
			if(rows.length === 0){
				res.send(true);
			}
			else{
				res.send(false);
			}            
		}
	)
});

app.post('/api/admin/products/insert', (req, res) => {
	let product_name = req.body.product_name;
	let category = req.body.category;
	let price = req.body.price;
	let product_discount = req.body.product_discount;
	let product_image = req.body.product_image;
	let product_stock = req.body.product_stock;
	let product_desc = req.body.product_desc;

	let sql = 'INSERT INTO product (product_name,category,price,product_stock,product_desc,product_image,product_discount) VALUES (?,?,?,?,?,?,?)';
	let params = [product_name,category,price,product_stock,product_desc,product_image,product_discount];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

const storage = multer.diskStorage({
	/*
		파일 업로드 설정
		Admin이 올린 이미지 파일이 저장될 경로 설정 및 이미지 이름 변경
		폴더가 없으면 생성됨
	*/
	destination: "public/uploadsImgs",//이미지가 저장되는 장소
	filename: function(req, file, cb) {
		const randomizedFileName = Math.random().toString(36).substr(2, 11) + new Date().valueOf() + path.extname(file.originalname);
		cb(null, randomizedFileName);
		//파일 이름을 난수화 문자열과 확장자명으로 변환
	}
});
const upload = multer({
	/*
		모듈명 : 이미지 파일 업로드
		기능 : Admin이 올린 이미지 파일 저장 및 용량 제한 15MB
	*/
	storage: storage,
	limits: { fileSize: 15 * 1024 * 1024 }
});
app.post("/api/admin/uploadImage", upload.array("images"), function(req, res, next) {
	/*
		모듈명 : 이미지 파일 업로드
		기능 : Admin이 올린 이미지 파일이 저장될 경로 설정 및 이미지 이름 변경
			파일이 여러개이므로 두번째 인자에 upload.array(name) 을 이용
			혹시 파일이 한개인 경우는 upload.single(name)을 이용
	*/
	res.send({
		fileDetail: req.files
	});
});

app.post('/api/admin/products/update', (req, res) => {
	let category = req.body.category;
	let product_name = req.body.product_name;
	let product_image = req.body.product_image;
	let product_stock = req.body.product_stock;
	let product_desc = req.body.product_desc;
	let price = req.body.price;
	let product_code = req.body.product_code;
	let product_discount = req.body.product_discount;
	
	let sql = 'UPDATE product SET category = ?, product_name = ?, product_image = ?, product_stock = ?, product_desc = ?, price = ?, product_discount = ? WHERE product_code = ?';
	let params = [category, product_name, product_image, product_stock, product_desc, price, product_discount, product_code];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});
app.post('/api/admin/products/delete', (req, res) => {
	let product_code = req.body.product_code;
	let sql = 'DELETE FROM product WHERE product_code = ?';

	connection.query(sql, product_code,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/admin/products/orderlist/getNumberForPagination', (req, res) => {
	let customer_id = req.body.customer_id;
	let dateCheck = req.body.dateCheck;
	let datePicker = req.body.date;
	let from_time = new Date(new Date(datePicker).toLocaleDateString()+' 00:00:00');//시간이 어디 기준이냐 도데체?
	let to_time = new Date(new Date(datePicker).toLocaleDateString()+' 23:59:59');
	let numberForPagination = 0;
	let sql = 'SELECT COUNT(*) AS countRow FROM orders WHERE customer_id = ? AND ordered_date BETWEEN ? AND ?';
	let params = [customer_id, from_time, to_time];
	
	if(dateCheck === 'false'){
		sql = 'SELECT COUNT(*) AS countRow FROM orders WHERE customer_id = ?';
		params = [customer_id];
	}

	connection.query(
		sql,
		params,
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
		}
	)
});
app.post('/api/admin/products/orderlist/all/getNumberForPagination', (req, res) => {
	let dateCheck = req.body.dateCheck;
	let datePicker = req.body.date;
	let from_time = new Date(new Date(datePicker).toLocaleDateString()+' 00:00:00');
	let to_time = new Date(new Date(datePicker).toLocaleDateString()+' 23:59:59');
	let numberForPagination = 0;
	let sql = 'SELECT COUNT(*) AS countRow FROM orders WHERE ordered_date BETWEEN ? AND ?';
	let params = [from_time, to_time];

	if(dateCheck === 'false'){
		sql = 'SELECT COUNT(*) AS countRow FROM orders';
		params = [];
	}

	connection.query(
		sql,
		params,
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
		}
	)
});
app.post('/api/admin/products/orderlist', (req, res) => {
	let customer_id = req.body.customer_id;
	let dateCheck = req.body.dateCheck;
	let datePicker = req.body.date;
	let limit = parseInt(req.body.limit);
	let from_time = new Date(new Date(datePicker).toLocaleDateString()+' 00:00:00');
	let to_time = new Date(new Date(datePicker).toLocaleDateString()+' 23:59:59');
	let sql = 'SELECT * FROM orders WHERE customer_id = ? AND ordered_date BETWEEN ? AND ? ORDER BY ordered_date DESC LIMIT ?, 10';
	let params = [customer_id, from_time, to_time, limit];
	
	if(dateCheck === 'false'){
		sql = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY ordered_date DESC LIMIT ?, 10';
		params = [customer_id, limit];
	}

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});
app.post('/api/admin/products/orderlist/all', (req, res) => {
	let dateCheck = req.body.dateCheck;
	let datePicker = req.body.date;
	let limit = parseInt(req.body.limit);
	let from_time = new Date(new Date(datePicker).toLocaleDateString()+' 00:00:00');
	let to_time = new Date(new Date(datePicker).toLocaleDateString()+' 23:59:59');
	let sql = 'SELECT * FROM orders WHERE ordered_date BETWEEN ? AND ? ORDER BY ordered_date DESC LIMIT ?, 10';
	let params = [from_time, to_time, limit];

	if(dateCheck === 'false'){
		sql = 'SELECT * FROM orders ORDER BY ordered_date DESC LIMIT ?, 10';
		params = [limit];
	}

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/admin/products/order/update', (req, res) => {
	let delivery = req.body.delivery;
	let purchase = req.body.purchase;
	let order_id = req.body.order_id;

	let sql = 'UPDATE orders SET delivery_status = ?, purchase_approved = ? WHERE order_id = ?';

	const params = [delivery, purchase, order_id];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
});

app.post('/api/admin/products/order/cancel', (req, res) => {
	let order_id = req.body.order_id;
	let quantity = parseInt(req.body.quantity);
	let product_code = req.body.product_code;

	let sql_order = 'UPDATE orders SET order_status = ? WHERE order_id = ?';
	const params_order = ['canceled', order_id];
	connection.query(sql_order, params_order);

	let sql_product = 'UPDATE product SET product_stock = product_stock + ? WHERE product_code = ?';
	const params_product = [quantity, product_code];
	connection.query(sql_product, params_product, (error, rows, fields) => {
		if(error === null){
			res.send(rows);
		}
		else{
			console.log(error);
			res.send(error);
		}
	});
});

app.post('/api/admin/main/slide/show', (req, res) => {
	const sql = "SELECT * FROM main_slide WHERE show_slide = 'Y' ORDER BY priority";

	try {
		connection.query(sql, (error, rows, fields) => {
			if(error === null){
				res.send(rows);
			}
			else{
				console.log(error);
				res.send(error);
			}
		});
	}
	catch (error) {
		res.send(error);
	}
});

app.post('/api/admin/main/slide/get', (req, res) => {
	const sql = 'SELECT * FROM main_slide ORDER BY priority';

	try {
		connection.query(sql, (error, rows, fields) => {
			if(error === null){
				res.send(rows);
			}
			else{
				console.log(error);
				res.send(error);
			}
		});
	}
	catch (error) {
		res.send(error);
	}
});

app.post('/api/admin/main/slide/add', (req, res) => {	
	const image_name = req.body.image_name;
	const image_url = req.body.image_url;

	const sql = "INSERT INTO main_slide(image_name, image_url) VALUES(?, ?)";
	const params = [image_name, image_url];
	try {
		connection.query(sql, params, (error, rows, fields) => {
			if(error === null){
				res.send(rows);
			}
			else{
				console.log(error);
				res.send(error);
			}
		});
	}
	catch(error){
		console.log(error);
		res.send(error);
	}
});

app.post('/api/admin/main/slide/update', (req, res) => {
	const priority = parseInt(req.body.priority);
	const show_slide = req.body.show_slide;
	const image_cd = parseInt(req.body.image_cd);

	const sql = "UPDATE main_slide SET priority = ?, show_slide = ? WHERE image_cd = ?";
	const params = [priority, show_slide, image_cd];

	try {
		connection.query(sql, params, (error, rows, fields) => {
			if(error === null){
				res.send(rows);
			}
			else{
				console.log(error);
				res.send(error);
			}
		});
	}
	catch(error){
		console.log(error);
		res.send(error);
	}
});

app.post('/api/admin/main/slide/delete', (req, res) => {
	const image_cd = parseInt(req.body.image_cd);

	const sql = "DELETE FROM main_slide WHERE image_cd = ?";
	const params = [image_cd];
	try{
		connection.query(sql, params, (error, rows, fields) => {
			if(error === null){
				res.send(rows);
			}
			else{
				console.log(error);
				res.send(error);
			}
		});
	}
	catch(error){
		console.log(error);
		res.send(error);
	}
});

//////////////////////////////////////////////////////////
//////////////////////// customer ////////////////////////
//////////////////////////////////////////////////////////
app.post('/api/customer/register/idcheck', (req, res) => {
	let id = req.body.id;

	let sql = 'SELECT customer_id FROM customer WHERE customer_id = ?';
	let params = [id];

	connection.query(sql, params,
		(err, rows, fields) => {
			if(rows.length === 0){
				res.send(true);
			}
			else{
				res.send(false);
			}            
		}
	)
});

app.post('/api/customer/register', async function(req, res){
	/*
		모듈명 : 고객 회원가입
		기능 : 가입시에 적은 이메일로 링크를 보내 링크 클릭시 이메일 인증
			비밀번호 암호화, 개발자도 고객의 비밀번호를 알 수 없음
	*/
	const id = req.body.id;
	const password = req.body.password;
	const email = req.body.email;
	const address = req.body.address;
	const address_detail = req.body.address_detail;

	const homepageAddress = "http://www.pwcosmetic.com"
	const salt = generateRandomString(64);
	const email_verification_token = generateRandomString(20);
	const emailTitle = "[Purple And White] Please verify your email!";
	const verifyLink = homepageAddress + `/email/validate/${id}/${email_verification_token}`;
	const linkText = "Click here and verify YOUR EMAIL!";
	let emailText = "";
	emailText += "<div>";
	emailText += "<p>Click this link and verify your email</p>";
	emailText += `<a href='${verifyLink}'>${linkText}</a>`;
	emailText += "</div>";

	//get data of Admin
	const admin_rows = await GetAdminDataQuery(ADMIN_ID);
	const admin_email = admin_rows[0].email;

	crypto.pbkdf2(password, salt, HASH_NUMBER, 64, 'sha512', (err, key) => {
		const encryptedPassword = key.toString('base64');

		const sql_isnert = 'INSERT INTO customer (customer_id, customer_password, customer_email, address, address_detail, customer_salt, email_verification_token) VALUES (?,?,?,?,?,?,?)';
		const params_isnert = [id, encryptedPassword, email, address, address_detail, salt, email_verification_token];

		connection.query(sql_isnert, params_isnert);

		EmailSending(emailTitle, emailText, email);

		//send email alarm to the Admin
		let emailTitle_admin = `[Purple And White] New Customer Register [${id}]`;
		let emailText_admin = '';
		emailText_admin += `<p>A new customer register to our shop!</p>`;
		emailText_admin += `<p>What a happy day!, Que Feliz Dia~</p>`;
		EmailSending(emailTitle_admin, emailText_admin, admin_email);

		res.send(true);
	});
});

app.post('/api/customer/delete', function(req, res){
	const customer_id = req.body.customer_id;
	const sql = 'DELETE FROM customer WHERE customer_id = ?';
	const params = [customer_id];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
	});
});

app.post('/api/customer/get/customer', function(req, res){
	const id = req.body.id;
	const sql = 'SELECT * FROM customer WHERE customer_id = ?';
	const params = [id];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
	});
});

app.post('/api/customer/get/customer/order', function(req, res){
	const id = req.body.id;
	const limit = parseInt(req.body.limit);
	const sql = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY ordered_date DESC LIMIT ?, 10';
	const params = [id, limit];

	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
	});
});

app.post('/api/customer/cancle/customer/order', async function(req, res){
	let order_id = req.body.order_id;
	let quantity = parseInt(req.body.quantity);
	let product_code = req.body.product_code;
	let product_name = req.body.product_name;
	let customer_id = req.body.customer_id;
	let total_price = req.body.total_price

	let sql_order = 'UPDATE orders SET order_status = ? WHERE order_id = ?';
	const params_order = ['canceled', order_id];
	connection.query(sql_order, params_order);

	let sql_product = 'UPDATE product SET product_stock = product_stock + ? WHERE product_code = ?';
	const params_product = [quantity, product_code];
	connection.query(sql_product, params_product, (err, rows, fields) => {
		res.send(rows);
	});

	const rows = await GetCustomerDataQuery(customer_id);
	const checkStr = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	const customer_email = rows[0].customer_email;
	let emailTitle = '[Purple And White] You ordered canceled!';
	let emailText = '<h1>Your order has been canceled</h1>';
	emailText += `<p>Product : [ <b>${product_name}</b> ]</p>`;
	emailText += `<p>Quantity : <b>${quantity}</b></p>`;
	emailText += `<p>Price : <b>${total_price}</b></p>`;
	emailText += `<p>Gracias</p>`;
	
	if(checkStr.test(customer_email) === true){
		EmailSending(emailTitle, emailText, customer_email);
	}
	else{
		console.log("email is invalid!!!!");
	}
});

app.post('/api/customer/get/customer/order/count', function(req, res){
	const customer_id = req.body.customer_id;
	const sql = 'SELECT COUNT(*) AS countRow FROM orders WHERE customer_id = ?';
	const params = [customer_id];

	connection.query(sql, params,
		(err, rows, fields) => {
			numberForPagination = parseInt(rows[0].countRow/10);
			if(rows[0].countRow%10 > 0){
				numberForPagination++;
			}
			res.send({'numberForPagination':numberForPagination});
	});
});

app.post('/api/customer/reset/password', async function(req, res){
	if(req.session.customerData === undefined){
		res.send('error');
	}
	else{
		const password = req.body.password;
		const customer_id = req.session.customerData.customer_id;
		const sql = 'UPDATE customer SET last_password_change = ?, customer_password = ?, customer_salt = ?, password_reset = 0 WHERE customer_id = ?';
		const salt = generateRandomString(64);
		let params = [];

		const newPassword = await new Promise((resolve) => {
			crypto.pbkdf2(password, salt, HASH_NUMBER, 64, 'sha512', (err, key) => {
				resolve(key.toString('base64'));
			})
		});
		params = [new Date(), newPassword, salt, customer_id];

		connection.query(sql, params, (err, rows, fields) => {
			res.send(rows);
		});
	}
});

//////////////////////////////////////////////////////////
//////////////////////// login ////////////////////////
//////////////////////////////////////////////////////////

app.post('/api/admin/login', (req, res) => {
	const id = req.body.id;
	const password = req.body.password;
	
	let sql_select = 'SELECT ';
	sql_select += 'role, id, salt, password, last_login_date, email, approved, email_verified';
	sql_select += ' FROM admin_account WHERE id = ?';
	let params = [id];

	connection.query(sql_select, params, (err, rows, fields) => {
		if(rows.length > 0){
			crypto.randomBytes(64, (err, buf) => {
				crypto.pbkdf2(password, rows[0].salt, HASH_NUMBER, 64, 'sha512', (err, key) => {
					const typedPassword = key.toString('base64');
					if(typedPassword === rows[0].password){
						if(rows[0].approved){
							let sql_update= 'UPDATE admin_account SET last_login_date = ? WHERE id = ?';
							params = [new Date().toISOString().slice(0, 19).replace('T', ' '), id];
							connection.query(sql_update, params);//마지막 로그인 날짜 갱신
							
							req.session.adminData = {
								admin_id : rows[0].id
							};
							res.send(
								{
									result: true,
									adminData : req.session.adminData
								}
							);
						}
						else{
							res.send(
								{
									result: false,
									message: 'This account is not approved'
								}
							);
						}
					}
					else{
						res.send(
							{ result: false }
						);
					}
				});
			});
		}
		else{
			res.send(
				{ result: false }
			);
		}
	});
});

app.post('/api/admin/check/session', (req, res) => {
	if(req.session.adminData === undefined){
		res.send({
			result : false
		});
	}
	else{
		res.send({
			result : true,
			adminData : req.session.adminData
		});
	}
});

app.post('/api/admin/logout', (req, res) => {
	req.session.destroy(function(err){
		if(err){
			res.send(err);
		}
		else{
			res.send('ok');
		}
	});
});

app.post('/api/customer/login', (req, res) => {
	const id = req.body.id;
	const password = req.body.password;
	let message = "Please check ID, Password";
	
	let sql_select = 'SELECT ';
	sql_select += 'customer_id, customer_email ,customer_password, customer_salt, ';
	sql_select += 'customer_register_date, customer_point, last_login_date, password_reset, last_password_change, email_approved ';
	sql_select += 'FROM customer WHERE customer_id = ?';
	let params = [id];

	connection.query(sql_select, params, (err, rows, fields) => {
		if(rows.length === 1){
			crypto.randomBytes(64, (err, buf) => {
				crypto.pbkdf2(password, rows[0].customer_salt, HASH_NUMBER, 64, 'sha512', (err, key) => {
					let typedPassword = key.toString('base64');
					if(typedPassword === rows[0].customer_password){
						if(rows[0].email_approved){
							let sql_update= 'UPDATE customer SET last_login_date = ? WHERE customer_id = ?';
							params = [new Date().toISOString().slice(0, 19).replace('T', ' '), id];
							connection.query(sql_update, params);//마지막 로그인 날짜 갱신
							
							req.session.customerData = {
								password_reset : rows[0].password_reset,
								customer_id : rows[0].customer_id
							};

							message = "OK";
							res.send({result: true, message: message, password_reset: rows[0].password_reset});	
						}
						else{
							message = "You need to verify your E-mail!";
							res.send({result: false, message: message});
						}
					}
					else{
						res.send({result: false, message: message});
					}
				});
			});
		}
		else{
			res.send({result: false, message: message});
		}
	});
});

app.post('/api/customer/check/session', function(req, res){
	if(req.session.customerData === undefined){//Mypage로 이동되는디??
		res.send({
			result: false
		});
	}
	else{
		res.send({
			result: true,
			customerData: req.session.customerData
		});
	}
});

app.post('/api/customer/logout', function(req, res){
	req.session.destroy(function(err){
		if(err){
			res.send(err);
		}
		else{
			res.send('ok');
		}
	});
});

//////////////////////////////////////////////////////////
//////////////////////// email ////////////////////////
//////////////////////////////////////////////////////////
app.post('/api/email/verification', async function (req, res){
	const id = req.body.id;
	const email_verification_token = req.body.token;
	let verify = false;
	let message = "Your E-mail can not be verified!";

	let sql_select = 'SELECT email_approved, email_verification_token FROM customer WHERE customer_id = ?';
	let params_select= [id];

	connection.query(sql_select, params_select, (err, rows, fields) => {
		if(rows.length === 1){
			if(email_verification_token === rows[0].email_verification_token && 0 === rows[0].email_approved){
				let sql_update = 'UPDATE customer SET email_approved = 1 WHERE customer_id = ?';
				let params_update= [id];
				connection.query(sql_update, params_update);
				
				verify = true;
				message = "Your E-mail is verified!";
			}
			else{
				message = "The Link is expired";
			}
		}
		else{
			message = "Error";
		}
		res.send({
			verify: verify,
			message: message
		});
	});
});

app.post('/api/customer/send/email', async function(req, res){
	const userId = req.body.userId;
	
	const rows = await GetCustomerDataQuery(userId);

	if(rows.length === 1){
		const createNewPasswordResult = await CreateNewPassword();
		const checkStr = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		const customer_email = rows[0].customer_email;
		let emailTitle = '[Purple And White] Your Password has changed!';
		let emailText = '';
		emailText += "<p>Password of [ <b>" + userId + "</b> ] has changed!</p>";
		emailText += "<p>New password : <h3>" + createNewPasswordResult.temporalPassword + "</h3></p>";
		emailText += "<p>Plese change your PASSWORD after login!</p>";
		
		if(checkStr.test(customer_email) === true){
			const emailSendingResult = await EmailSending(emailTitle, emailText, customer_email);

			ResetCustomerPasswordQuery(createNewPasswordResult.encryptedTemporalPassword, createNewPasswordResult.newSalt, userId);

			res.send(emailSendingResult);
		}
		else{
			res.send('no');
		}
	}
	else{
		res.send('no');
	}
});

const CreateNewPassword = (param) => new Promise((resolve) => {
	const temporalPassword = crypto.randomBytes(20).toString('base64');
	const newSalt = crypto.randomBytes(64).toString('base64');
	
	crypto.pbkdf2(temporalPassword, newSalt, HASH_NUMBER, 64, 'sha512', (err, key) => {
		const encryptedTemporalPassword = key.toString('base64');
		resolve({
			temporalPassword: temporalPassword,
			newSalt: newSalt,
			encryptedTemporalPassword: encryptedTemporalPassword
		});
	});
});

const EmailSending = (emailTitle, emailText, customer_email) => new Promise((resolve) => {
	const AWS = require('aws-sdk');
	AWS.config.loadFromPath('./aws_ses.json'); //ap-northeast-2에서 관리 중(왜냐면 시작을 한국에서 해서 ㅎㅎ;;)

	let emailParams = {
		Source: 'PurpleAndWhiteCosmetic@pwcosmetic.com',
		Destination: {
			ToAddresses: [
				customer_email
			],
		},
		ReplyToAddresses: [],
		Message: {
			Subject: {
				Charset: 'UTF-8',
				Data: emailTitle,
			},
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: emailText,
				},
			}
		}
	};

	const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(emailParams).promise();
	sendPromise.then((data) => {
		resolve(data);
	}).catch((err) => {
		console.log(err);
		console.log(emailTitle, emailText, customer_email);
	});
});

const GetAdminDataQuery = (adminId) => new Promise((resolve) => {
	try{
		const sql_select = 'SELECT role, id, email FROM admin_account WHERE id = ? AND approved = 1';
		const params_select = [adminId];
	
		connection.query(sql_select, params_select, (err, rows, fields) => {
			resolve(rows);
		});
	}
	catch(error){
		console.log(error);		
	}
});

const GetCustomerDataQuery = (userId) => new Promise((resolve) => {
	try{
		const sql_select = 'SELECT customer_id, customer_email FROM customer WHERE customer_id = ? AND email_approved = 1';
		const params_select = [userId];
	
		connection.query(sql_select, params_select, (err, rows, fields) => {
			resolve(rows);
		});
	}
	catch(error){
		console.log(error);
	}
});

function ResetCustomerPasswordQuery(encryptedTemporalPassword, newSalt, userId){
	//비밀번호 찾기시에 비밀번호 업데이트
	const sql_update = 'UPDATE customer SET customer_password = ?, customer_salt = ?, password_reset = 1 WHERE customer_id = ?';
	const params_update = [encryptedTemporalPassword, newSalt, userId];
	connection.query(sql_update, params_update);
}

function generateRandomString(lengthOfString) {
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = "";
	const charactersLength = characters.length;

	for ( let i = 0; i < lengthOfString; i++ ) {
		randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return randomString;
}

app.post("/api/customer/search/log", function(req, res){
	const search_category = req.body.search_category;
	const search_text = req.body.search_text;
	const sql = "INSERT INTO search_log(search_category, search_text) VALUES(?, ?)";
	const params = [search_category, search_text];

	connection.query(sql, params, 
		(err, rows, fields) => {
			res.send(rows);
	});
});
app.get("/api/customer/search/log", function(req, res){
	const search_date = req.query.search_date;
	const sql = "SELECT * FROM search_log WHERE DATE_FORMAT(search_date, '%Y-%m-%d') = ?";
	const params = [search_date];

	connection.query(sql, params, 
		(err, rows, fields) => {
			res.send(rows);
	});
});

app.post("/api/customer/visit/log", function(req, res){
	const visitor_referrer = req.body.visitor_referrer;
	const sql = "INSERT INTO visit_log(visitor_referrer) VALUES(?)";
	const params = [visitor_referrer];

	connection.query(sql, params, 
		(err, rows, fields) => {
			res.send(rows);
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));