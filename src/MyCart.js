import React, { Component } from "react";
import axios from 'axios';
import { Col, Row, Image, Navbar, Button, InputGroup, FormControl } from "react-bootstrap";

class MyOrder extends Component{
	constructor(){
		super();
		
		this.callProducts = this.callProducts.bind(this);
		this.deleteCartItemAll = this.deleteCartItemAll.bind(this);
		this.orderCartItem = this.orderCartItem.bind(this);
		this.setTotalPrice = this.setTotalPrice.bind(this);
		
		this.state = {
			initState : true
		}
	}

	componentDidMount(){
		this.setCartData();
	}

	componentWillUnmount(){
	}

	setTotalPrice(){
		const quantityArray = document.querySelectorAll("input[id^=quantity]");
		const priceArray = document.querySelectorAll("input[id^=price]");

		let quantity = 0;
		let price = 0;
		let total = 0;
		
		for(let index = 0; index < quantityArray.length; index++){
			quantity = parseInt(quantityArray[index].value, 10);
			price = parseInt(priceArray[index].value, 10);
			total = total + (quantity * price);
		}

		document.getElementById("total_price").innerHTML = total;
	}

	quantitychange(product_code){
		const quantity = document.getElementById("quantity" + product_code);
		//const discountPercentage = document.getElementById("product_discount" + product_code).value;
		// let productPrice = document.getElementById("price" + product_code).value;
		// if(discountPercentage > 0){
		// 	productPrice = parseInt(productPrice * ((100 - discountPercentage)/100));
		// }

		this.callStock(product_code)
		.then((stock) => {
			if(quantity.value > stock){
				alert("Stock : " + stock)
				quantity.value = stock;
			}
			else if(quantity.value < 1){
				quantity.value = 1;
			}
		});

		this.setState({ //상품 개수 저장
			["product_code_" + product_code] : quantity.value //key에 []를 사용하여 동적 이름 사용 가능
		});

		this.setTotalPrice();
	}
	quantityPlus(product_code){
		const quantity = document.getElementById("quantity" + product_code);
		const product_stock = document.getElementById("product_stock" + product_code).value;
		if(quantity.value < product_stock){
			quantity.value++;
			this.quantitychange(product_code);
		}
		else{
			alert("Stock : " + product_stock);
		}
	}
	quantityMinus(product_code){
		const quantity = document.getElementById("quantity" + product_code);
		if(quantity.value > 1){
			quantity.value--;
			this.quantitychange(product_code);
		}        
	}

	setCartData(){
		let product_code_multiple = "";

		for (let index = 0; index < window.localStorage.length; index++) {
			product_code_multiple += window.localStorage.key(index) + ",";
		}

		if(product_code_multiple !== ""){
			product_code_multiple = product_code_multiple.substring(0, product_code_multiple.length - 1);
			this.callProducts(product_code_multiple);
		}
		else{
			this.setState({
				productElement : <span style={{color:"red"}}>Your cart is empty</span>
			}, () => {
				this.setTotalPrice();
			});
		}
	}

	callStock = async (product_code) => {
		const url = '/api/products/product_code';
		const header = { headers: {'Content-Type' : 'application/x-www-form-urlencoded'} }
		const params = new URLSearchParams();
		params.append('product_code', product_code);

		const response = await axios.post(url, params, header);
		return response.data[0].product_stock;
	}

	callProducts = async (product_code_multiple) => {
		const url = '/api/products/product_code_multiple';
		const header = {
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}
		const params = new URLSearchParams();
		params.append('product_code_multiple', product_code_multiple);

		await axios.post(url, params, header)
		.then((response) => {
			if(response.data.length > 0){
				const cartElement = response.data.map((product, index) => {
					let quantityOfProduct = this.state["product_code_" + product.product_code] === undefined ? 0 : this.state["product_code_" + product.product_code]
					return(
						<Row key={"cartItem" + index} style={{border : "1px solid #c4bdb7", textAlign : "left"}}>
							<input type="hidden" id={"category" + product.product_code} value={product.category}></input>
							<input type="hidden" id={"price" + product.product_code} value={product.price}></input>
							<input type="hidden" id={"product_added_date" + product.product_code} value={product.product_added_date}></input>
							<input type="hidden" id={"product_code" + product.product_code} value={product.product_code}></input>
							<input type="hidden" id={"product_desc" + product.product_code} value={product.product_desc}></input>
							<input type="hidden" id={"product_discount" + product.product_code} value={product.product_discount}></input>
							<input type="hidden" id={"product_image" + product.product_code} value={product.product_image.split(",")[0]}></input>
							<input type="hidden" id={"product_name" + product.product_code} value={product.product_name}></input>
							<input type="hidden" id={"product_stock" + product.product_code} value={product.product_stock}></input>

							<Col style={{paddingRight : 0}}>
								<Image width={'171px'} height={'180px'} src={`/uploadsImgs/${product.product_image.split(",")[0]}`} rounded/>
							</Col>
							<Col style={{paddingLeft : 0, marginRight : 10}}>
								<span style={{fontWeight : 650}}>{product.product_name}</span><br></br>
								<span>{product.price} COP</span><br></br>

								<InputGroup className="mb-3">
									<InputGroup.Prepend>
										<Button variant="outline-secondary" onClick={this.quantityMinus.bind(this, product.product_code)}>-</Button>
									</InputGroup.Prepend>
									
									<FormControl aria-describedby="basic-addon1" readOnly value={quantityOfProduct} type="number" id={"quantity" + product.product_code} onChange={this.quantitychange.bind(this, product.product_code)}/>
									
									<InputGroup.Append>
										<Button variant="outline-secondary" onClick={this.quantityPlus.bind(this, product.product_code)}>+</Button>
									</InputGroup.Append>
								</InputGroup>

								<Button onClick={this.deleteCartItem.bind(this, product.product_code)} variant="danger" style={{width : "45%"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
										<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
									</svg>
								</Button>
							</Col>
						</Row>
					);
				});
				
				this.setState({
					productElement : cartElement
				});
			}
		})
		.then(() => {
			this.setTotalPrice();
		})
		.catch((error) => {
			alert("Error...");
		});
	}

	deleteCartItemAll(askConfirm){
		if(askConfirm === true){
			if(window.confirm("Do you want to delete 'ALL'?") === false){
				return;
			}
		}
		window.localStorage.clear();
		this.setCartData();
	}

	deleteCartItem(item){
		if(window.confirm("Do you want to delete?") === true){
			window.localStorage.removeItem(item);
			this.setCartData();
		}
	}

	async orderCartItem(){
		if(window.confirm("Do you want to order all of item in cart?") === false){
			return;
		}

		const productCodeArray = document.querySelectorAll("input[id^=product_code]");
		const quantityArray = document.querySelectorAll("input[id^=quantity]");
		const productNameArray = document.querySelectorAll("input[id^=product_name]");
		const priceArray = document.querySelectorAll("input[id^=price]");
		const checkSessionResponse = await axios.post('/api/customer/check/session', {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}); //is login?

		if(productCodeArray.length <= 0){
			alert("Nothing in your cart");
			return;
		}

		document.getElementById("loadingScreen").style.display = ""; //show loading
		document.getElementById("loadingScreen").style.top = window.pageYOffset + "px";
		document.body.style.overflow = "hidden"; //scroll block

		if(checkSessionResponse.data.result === true){
			//new code
			let product_code_string = "";
			let quantity_string = "";
			let product_name_string = "";
			let product_price_string = "";
			for (let index = 0; index < productCodeArray.length; index++) {
				if(quantityArray[index].value === "" || quantityArray[index].value === 0 || quantityArray[index].value === "0"){
					document.getElementById("loadingScreen").style.display = "none"; //hide loading
					document.body.style.overflow = ""; //scroll unblock

					alert("Please write how much you will buy");
					quantityArray[index].focus();
					return;
				}
				product_code_string += productCodeArray[index].value + ",";
				quantity_string += quantityArray[index].value + ",";
				product_name_string += productNameArray[index].value + ",";
				product_price_string += priceArray[index].value + ",";
			}
			product_code_string = product_code_string.substring(0, product_code_string.length - 1).replaceAll(" ", ""); //뒤의 콤마 제거, 공백 제거
			quantity_string = quantity_string.substring(0, quantity_string.length - 1).replaceAll(" ", ""); //뒤의 콤마 제거, 공백 제거
			product_name_string = product_name_string.substring(0, product_name_string.length - 1).replaceAll(" ", ""); //뒤의 콤마 제거, 공백 제거
			product_price_string = product_price_string.substring(0, product_price_string.length - 1).replaceAll(" ", ""); //뒤의 콤마 제거, 공백 제거

			const params = new URLSearchParams();
			params.append('product_code_string', product_code_string);
			params.append('quantity_string', quantity_string);
			params.append('product_name_string', product_name_string);
			params.append('product_price_string', product_price_string);
			const response = await axios.post('/api/products/cart/order', params, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});

			if(response.data.result){
				alert("Order done");
				this.deleteCartItemAll(false);
			}
			else{
				alert(response.data.resultMessage);
			}
		}
		else{
			window.location.replace('/customer/customerlogin');
			alert("Please login before order");
			return;
		}

		document.getElementById("loadingScreen").style.display = "none"; //hide loading
		document.body.style.overflow = ""; //scroll unblock
	}

	render(){
		return(
			<div style={{backgroundColor:'lavender'}}>
				<Row>
					<Col><h2>My Cart</h2></Col>
				</Row>
				{this.state.productElement}
				<Row>
					<Col>
						<h3 style={{color : "black"}}>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-cash-coin" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
								<path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
								<path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
								<path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
							</svg>&nbsp;
							Total : <span id="total_price">0</span> COP
						</h3>
					</Col>
				</Row>

				<Navbar style={{position:'bottom'}}>
					<Row className="justify-content-md-center" style={{width:window.innerWidth}}>
						<Col>
							<Button onClick={this.deleteCartItemAll.bind(this, true)} variant="danger" size="lg" block>Delete All</Button>
						</Col>
						<Col>
							<Button onClick={this.orderCartItem} variant="success" size="lg" block>Order All</Button>
						</Col>
					</Row>
				</Navbar>

				<div id="loadingScreen" style={{display : "none", top : 0, zIndex : 14, position : "absolute"
					, backgroundColor : "rgba(139, 218, 255, 0.95)"
					, width : "100%", height : "100%"}}>
					<h2 style={{paddingTop : 100}}>Wait a minute please...</h2>
				</div>
			</div>
		);
	}
}

export default MyOrder;