import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './resources/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
import MyPage from './MyPage';
import MyCart from './MyCart';
import MyOrder from './MyOrder';
import Footer from './Footer';
import FooterMenu from './FooterMenu';
import Register from './Register';
import Search from './Search';
import PrepareProductCard from './PrepareProductCard';
import CustomerLogin from './CustomerLogin';
import ProductInfoPage from './ProductInfoPage';
import FindPassword from './FindPassword';
import ResetPassword from './ResetPassword';
import EmailVerification from './EmailVerification';

import AdminMain from './AdminMain';
import AdminLogin from './AdminLogin';
import AdminFooterMenu from "./AdminFooterMenu";
import AdminProductManage from './AdminProductManage';
import AdminOrderManage from './AdminOrderManage';
import AdminAddProduct from './AdminAddProduct';
import AdminSlideManage from './AdminSlideManage';
import AdminRegister from './AdminRegister';
import AdminCategoryManage from './AdminCategoryManage';
import AdminSearchLog from './AdminSearchLog';

class App extends Component {
	constructor(){
        super();
        this.resized = this.resized.bind(this);
    
		window.addEventListener('resize', this.resized);
		
        this.state = {
            screenSize : {
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            }
        }
    }

	componentDidMount(){
		//방문자 집계
		const url = "/api/customer/visit/log";
		const header = {
			headers: { 
				"Content-Type" : "application/x-www-form-urlencoded"
			}
		}
		const params = new URLSearchParams();
		
		params.append("visitor_referrer", document.referrer);
		
		axios.post(url, params, header);
	}

    resized(){
        this.setState({
            screenSize : {
                screenWidth : window.innerWidth,
                screenHeight : window.innerHeight
            }
        });
	}
	
	render() {
		document.title = "P&W COSMETIC"
		return (
			<div className="App" id='App'>
				<Switch>
					<Route exact path='/email/validate/:id/:token' render={ ({match}) => {
						return(
							<EmailVerification match={match}/>
						);
					}}>
					</Route>

					<Route exact path='/'>
						<Home/>
						<FooterMenu/>
						<Footer/>
					</Route>
					<Route exact path='/home'>
						<Home/>
						<FooterMenu/>
						<Footer/>
					</Route>

					<Route path='/admin'>
						<Switch>
							<Route exact path='/admin'>
								<AdminMain/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
							<Route exact path='/admin/'>
								<AdminMain/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
							<Route exact path='/admin/login'>
								<AdminLogin/>
							</Route>

							<Route exact path='/admin/register'>
								<AdminRegister/>
							</Route>

							<Route exact path='/admin/main'>
								<AdminMain/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
							<Route exact path='/admin/main/slide/manage'>
								<AdminSlideManage/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>

							<Route exact path='/admin/product/manage'>
								<AdminProductManage/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
							<Route exact path='/admin/product/add'>
								<AdminAddProduct/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
							
							<Route exact path='/admin/order/manage'>
								<AdminOrderManage/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>

							<Route exact path='/admin/category/manage'>
								<AdminCategoryManage/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>

							<Route exact path='/admin/customer/serach/log'>
								<AdminSearchLog/>
								<div style={{paddingBottom:"100px"}}></div>
								<AdminFooterMenu/>
							</Route>
						</Switch>
					</Route>

					<Route path='/customer'>
						<Switch>
							<Route exact path='/customer/customerLogin'>
								<CustomerLogin/>
							</Route>

							<Route exact path='/customer/register'>
								<Register/>
							</Route>

							<Route exact path='/customer/resetpassword'>
								<ResetPassword/>
							</Route>

							<Route exact path='/customer/findpassword'>
								<FindPassword/>
							</Route>

							<Route exact path='/customer/mypage'>
								<MyPage/>
								<FooterMenu/>
								<Footer/>
							</Route>

							<Route exact path='/customer/mycart'>
								<MyCart/>
								<FooterMenu/>
								<Footer/>
							</Route>

							<Route exact path='/customer/myorder'>
								<MyOrder/>
								<FooterMenu/>
								<Footer/>
							</Route>
						</Switch>
					</Route>

					<Route path='/product'>
						<Switch>
							<Route exact path='/product/search'>
								<Search/>
								<FooterMenu/>
							</Route>

							<Route exact path='/product/productlist/:category'
								render={({ match }) => {
									return (
										<div>
											<PrepareProductCard match={match}/>
											<FooterMenu/>
											<Footer/>
										</div>
									);
								}}>
							</Route>

							<Route path='/product/productinfo/:product_code'
								render={({ match }) => {
									return (
										<div>
											<ProductInfoPage match={match}/>
											<FooterMenu/>
											<Footer/>
										</div>
									);
								}}>
							</Route>
						</Switch>
					</Route>
				</Switch>
			</div>
		);
	}
}

export default App;