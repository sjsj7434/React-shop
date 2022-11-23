import React, { Component } from "react";
import axios from 'axios';

import ProductCard from './ProductCard';
import { Row, Col } from "react-bootstrap";

class MainNewProduct extends Component{
	componentDidMount(){
		const url = '/api/main/product/new';
		const header = {
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		};

		axios.post(url, header)
		.then((response)=>{
			const productList = response.data.map((product, index) => {
				return (
					<ProductCard product={product} key={index}/>
				);
			});
			this.setState({
				productList:
				<Row xs={2} md={3} lg={4} style={{margin:'0px'}}>
					{productList}
				</Row>
			});
		});
	}

	render(){
		if(this.state !== undefined && this.state !== null){
			if(this.state.productList.props.children.length > 0){
				return(
					<>
						<div style={{marginTop:'1px', backgroundColor:'goldenrod'}}>
							<Row>
								<Col>
									<div>
										<span style={{fontSize:'40px', color:'aliceblue', fontStyle:'italic'}}><strong>NEW!</strong></span>
									</div>
								</Col>
							</Row>
	
							{this.state.productList}
						</div>
					</>
				);
			}
			else{
				return(
					<></>
				);
			}
		}
		else{
			return(
				<></>
			);
		}
	}
}

export default MainNewProduct;