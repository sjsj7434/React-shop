import React, { Component } from "react";
import axios from 'axios';

import Slides from './Slides';

import { Accordion, Card, Navbar, Button, Modal, Col, Row, InputGroup, FormControl, Badge } from "react-bootstrap";

class ProductInfoPage extends Component{
	constructor(props){
		super(props)
		this.buyClose = this.buyClose.bind(this);
		this.buyShow = this.buyShow.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.ClosePurchasePopup = this.ClosePurchasePopup.bind(this);
		this.ShowPurchasePopup = this.ShowPurchasePopup.bind(this);
		this.quantityPlus = this.quantityPlus.bind(this);
		this.quantityMinus = this.quantityMinus.bind(this);
		this.quantitychange = this.quantitychange.bind(this);
		this.buyConfirm = this.buyConfirm.bind(this);

		this.callProducts();
	}

	callProducts = async (event) => {
		const url = '/api/products/product_code';
		const header = {
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}
		const params = new URLSearchParams();
		params.append('product_code', this.props.match.params.product_code)

		await axios.post(url, params, header)
		.then((response) => {
			this.setState({
				product : response.data[0]
			});
		})
		.catch((error) => {
			alert("Error...");
		});
	}
	callStock = async (event) => {
		const url = '/api/products/product_code';
		const header = { headers: {'Content-Type' : 'application/x-www-form-urlencoded'} }
		const params = new URLSearchParams();
		params.append('product_code', this.props.match.params.product_code)

		const response = await axios.post(url, params, header);
		return response.data[0].product_stock;
	}

	buyClose(){
		this.setState({
			setBuyShow : false
		})
	}
	buyShow(){
		this.setState({
			setBuyShow : true
		})
	}

	addToCart(){
		if(window.localStorage.getItem(this.state.product.product_code) == null){
			window.localStorage.setItem(this.state.product.product_code, JSON.stringify({cartOrder: window.localStorage.length, name: this.state.product.product_name}));
			alert("Added!");
		}
		else{
			alert("It's already in your cart");
		}
	}

	ClosePurchasePopup(){
		this.setState({
			setPurchaseShow : false
		})
	}
	ShowPurchasePopup(){
		this.setState({
			setPurchaseShow : true
		})
	}

	quantitychange(event){
		const quantity = document.getElementById('quantity');
		const discountPercentage = this.state.product.product_discount;
		let productPrice = this.state.product.price;
		if(discountPercentage > 0){
			productPrice = parseInt(productPrice * ((100 - discountPercentage)/100));
		}

		this.callStock()
		.then((stock) => {
			if(quantity.value > stock){
				alert('Stock : '+stock)
				quantity.value = stock;
			}
			else if(quantity.value < 1){
				quantity.value = 1;
			}
		});

		document.getElementById('total_price').value = productPrice * quantity.value;
	}
	quantityPlus(event){
		const quantity = document.getElementById('quantity');
		if(quantity.value < this.state.product.product_stock){
			quantity.value++;
			this.quantitychange();
		}
		else{
			alert('Stock : '+this.state.product.product_stock)
		}
	}
	quantityMinus(event){
		const quantity = document.getElementById('quantity');
		if(quantity.value > 1){
			quantity.value--;
			this.quantitychange();
		}        
	}

	buyConfirm(event){
		event.preventDefault();
		document.getElementById("buyConfirmButton").disabled = true;

		if(!window.confirm("Do you wanna order?")){
			document.getElementById("buyConfirmButton").disabled = false;
			return;
		}
		this.callStock()
		.then((stock) => {
			const quantity = document.getElementById('quantity').value;
			const total_price = document.getElementById('total_price').value;
			if(quantity > stock){
				alert('Stock : '+stock)
			}
			else{
				if(quantity > 0){
					const params = new URLSearchParams();
					params.append('product_name', this.state.product.product_name);
					params.append('product_code', this.props.match.params.product_code);
					params.append('quantity', quantity);
					params.append('total_price', total_price);
				
					axios.post('/api/customer/check/session', {
						headers: { 
							'Content-Type' : 'application/x-www-form-urlencoded'
						}
					})
					.then((response) => {
						if(response.data.result === true){
							axios.post('/api/products/order', params,{
								headers: {
									'Content-Type' : 'application/x-www-form-urlencoded'
								}
							})
							.then((response) => {
								if(response.data.result === true){
									this.buyClose();
									this.ShowPurchasePopup();
								}
								else{
									alert('Ordering has failed!');
									document.getElementById("buyConfirmButton").disabled = false;
								}
							})
							.catch((error) => {
								alert('Ordering has failed!');
								document.getElementById("buyConfirmButton").disabled = false;
							});
						}
						else{
							alert('You need to login');
							window.location.replace('/customer/customerlogin');
						}
					})
					.catch((error) => {
						alert("Error...");
					});
				}
				else{
					alert('Please select how much you will buy');
					document.getElementById("buyConfirmButton").disabled = false;
				}
			}
		});
	}

	MoveToPay(){
		window.location.href="https://recarga-daviplata.epayco.co/pagar?terminal=5060";
	}

	render(){
		if(this.state === null){
			return(
				<div></div>
			);
		}
		else{
			const discountPercentage = this.state.product.product_discount;
			let howManyDaysAgo = new Date();
			howManyDaysAgo.setDate(howManyDaysAgo.getDate() - 7);
			let product_added_date = new Date(this.state.product.product_added_date);

			let newBadge = "";
			let discountBadge = "";
			let price = "";

			if(product_added_date > howManyDaysAgo){
				newBadge = (
					<span><Badge variant="danger">New</Badge>{' '}</span>
				);
			}

			if(discountPercentage > 0){
				const discountedPrice = parseInt(this.state.product.price * ((100 - discountPercentage)/100));
				discountBadge = (
					<span><Badge variant="warning">{discountPercentage} %</Badge></span>
				);
				price = (
					<>
						<span className="no_discount_price">{this.state.product.price}</span>       
						<span className="discount_price">{discountedPrice} cop</span>
					</>
				);
			}
			else{
				price = (
					<>
						<span className="normal_price">{this.state.product.price} cop</span>
					</>
				);
			}

			return(
				<div style={{backgroundColor:'whitesmoke'}}>
					<Slides productImages={this.state.product.product_image}/>
					<div style={{textAlign:'start', padding:'10px'}}>
						{"Category > " + this.state.product.category}
						<br/>
						{newBadge}
						{discountBadge}
						<h2>{this.state.product.product_name}</h2>                
						<p>{price}</p> 
					</div>

					<Navbar style={{position:'bottom',backgroundColor:"whitesmoke"}}>
						<Row className="justify-content-md-center" style={{width:window.innerWidth}}>
							<Col>
								<Button onClick={this.buyShow} variant="success" size="lg" block>COMPRAR</Button>
							</Col>
							<Col>
								<Button onClick={this.addToCart} variant="info" size="lg" block>Add to Cart</Button>
							</Col>
						</Row>
					</Navbar>
					
					<Accordion defaultActiveKey="" style={{textAlign:'start'}}>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="0">
								Product Description
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="0">
								<Card.Body>{this.state.product.product_desc}</Card.Body>
							</Accordion.Collapse>
						</Card>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="1">
								Refund
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="1">
								<Card.Body>Contact to owner on whatsapp please.</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>

					<Navbar style={{position:'bottom',backgroundColor:"whitesmoke"}}>
						<Row className="justify-content-md-center" style={{width:window.innerWidth}}>
							<Col>
								<Button onClick={this.buyShow} variant="success" size="lg" block>COMPRAR</Button>
							</Col>
							<Col>
								<Button onClick={this.addToCart} variant="info" size="lg" block>Add to Cart</Button>
							</Col>
						</Row>
					</Navbar>

					<Modal
					show={this.state.setBuyShow}
					onHide={this.BuyClose}
					backdrop="static"
					keyboard={false}>
						<form onSubmit={this.buyConfirm}>
							<Modal.Header closeButton>
							<Modal.Title>COMPRAR</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Row>
									<Col>Price</Col>
									<Col>
										<FormControl aria-describedby="basic-addon1" defaultValue={0} type='number' readOnly name='total_price' id='total_price'/>
									</Col>
								</Row>
								<Row>
									<Col>Quantity</Col>
									<Col>
										<InputGroup className="mb-3">
											<InputGroup.Prepend>
												<Button variant="outline-secondary" onClick={this.quantityMinus}>-</Button>
											</InputGroup.Prepend>
											
											<FormControl aria-describedby="basic-addon1" defaultValue={0} type='number' name='quantity' id='quantity' onChange={this.quantitychange}/>
											
											<InputGroup.Append>
												<Button variant="outline-secondary" onClick={this.quantityPlus}>+</Button>
											</InputGroup.Append>
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col>Send money to here "100202030523521"</Col>
								</Row>
							</Modal.Body>
							<Modal.Footer>
							<Button variant="secondary" onClick={this.buyClose}>
								CANCLE
							</Button>
							<Button id="buyConfirmButton" variant="primary" type='submit'>CONFRIRM</Button>
							</Modal.Footer>
						</form>
					</Modal>

					<Modal
					show={this.state.setPurchaseShow}
					onHide={this.ClosePurchasePopup}
					backdrop="static"
					keyboard={false}>
						<Modal.Header closeButton>
						<Modal.Title>Complete purchase</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row><Button block variant="success" size="lg" onClick={this.MoveToPay}>Pago con Daviplata</Button></Row>
							<Row>
								<img alt="purchase.jpg" width="100%" src="http://ec2-15-228-69-138.sa-east-1.compute.amazonaws.com/uploadsImgs/sdkl2wh7f2h1620013550582.jpg"/>
							</Row>
						</Modal.Body>
					</Modal>
				</div>
			);
		}
	}
}

export default ProductInfoPage;