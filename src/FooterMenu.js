import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import './resources/css/HamburgerMenu.css';

import DrawerMenu from "./DrawerMenu";

import { Navbar, Col, Row } from "react-bootstrap";

class FooterMenu extends Component{
	constructor(){
		super();
		this.clickSearch = this.clickSearch.bind(this);
		this.logInClicked = this.logInClicked.bind(this);
		this.logOutClicked = this.logOutClicked.bind(this);
		this.clickMyCart = this.clickMyCart.bind(this);
		
		this.state = {
			render:'',
			button:
			<Col style={{padding:1}} onClick={this.logInClicked}>
				<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
					<path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
				</svg>
				<p style={{margin:0}}>LogIn</p>
			</Col>
		}
	}

	componentDidMount(){
		const url = '/api/customer/check/session';
		const header = {
			headers: { 
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}
	
		axios.post(url, header)
		.then((response) => {
			if(response.data.result === true){
				this.setState({
					button:
					<Col style={{padding:1}} onClick={this.logOutClicked}>
						<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-backspace" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M6.603 2h7.08a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7.08a1 1 0 0 1-.76-.35L1 8l4.844-5.65A1 1 0 0 1 6.603 2zm7.08-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zM5.829 5.146a.5.5 0 0 0 0 .708L7.976 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
						</svg>
						<p style={{margin:0}}>LogOut</p>
					</Col>
				})
			}
		})
		.catch((error) => {
		});
	}
	
	clickSearch(){
		this.setState({
			render:<Redirect to="/product/Search"/>
		})
	}

	logInClicked(){
		this.setState({
			render:<Redirect to="/customer/CustomerLogin"/>
		})
	}
	logOutClicked(){
		const url = '/api/customer/logout';
		const header = {
			headers: { 
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}
	
		axios.post(url, header)
		.then((response) => {

		})
		.catch((error) => {

		});

		window.location.replace("/");
	}

	clickWhatsApp(){
		window.location.href = "https://api.whatsapp.com/message/4GTUM6V3J7L2P1";
	}

	clickMyCart(){
		this.setState({
			render:<Redirect to="/customer/mycart"/>
		})
	}

	render(){
		return(
			<Navbar fixed='bottom' style={{backgroundColor:"pink"}}>
				<Row className="justify-content-md-center" style={{width:window.innerWidth}}>
					<Col style={{padding:1}}>
						<DrawerMenu/>
						<p style={{margin:0}}>Menu</p>
					</Col>
					<Col style={{padding:1}} onClick={this.clickSearch}>
						<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
							<path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
						</svg>
						<p style={{margin:0}}>Search</p>
					</Col>

					{this.state.button /* 로그인 여부에 따라 바뀌는 버튼 */}

					<Col style={{padding:1}} onClick={this.clickMyCart}>
						<svg width="1.5em" height="1.5em" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
							<path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
						</svg>
						<p style={{margin:0}}>My Cart</p>
					</Col>

					<Col style={{padding:1}} onClick={this.clickWhatsApp}>
						<svg width="1.5em" height="1.5em" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
							<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
						</svg>
						<p style={{margin:0}}>WhatsApp</p>
					</Col>

					{this.state.render /* 버튼 클릭 시 redirect 용도 */}
				</Row>
			</Navbar>
		);
	}
}

export default FooterMenu;