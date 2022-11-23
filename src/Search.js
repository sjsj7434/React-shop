import React, { Component } from "react";
import axios from 'axios';

import ProductCard from "./ProductCard";
import Pagination from './Pagination';

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

class Search extends Component{
	constructor(){
		super();
		
		this.changeLimit = this.changeLimit.bind(this);
		this.sendLogData = this.sendLogData.bind(this);
		this.searchProduct = this.searchProduct.bind(this);
		this.selectChange = this.selectChange.bind(this);
		this.searchKeyChange = this.searchKeyChange.bind(this);
		this.workPagination = this.workPagination.bind(this);

		this.state={
			category : "all"
			, searchKey : ""
			, searchResult :  null
			, limit : 0
			, offset : 10
			, currentPage : 1
			, categoryElementArray : null
		}
	}

	componentDidMount(){
		this.setCategory();
	}

	selectChange(e){
		this.setState({
			category:e.target.value
		})
	}

	searchKeyChange(e){
		this.setState({
			searchKey:e.target.value
		})
	}

	setCategory(){
		//상품 메뉴를 불러오는 함수
		const url = '/api/product/category/select';
		const params = new URLSearchParams();
		const header = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(url, params, header)
		.then((response) => {
			let arr = [];

			for(let i = 0; i < response.data.length; i++){
				arr.push(
					<option key={response.data[i].category} value={response.data[i].category}>{response.data[i].category}</option>
				);
			}

			this.setState({
				categoryElementArray : arr
			})
		});
	}

	sendLogData(category, searchKey){
		let url = "/api/customer/search/log";
			
		const header = {
			headers: { 
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}
		const params = new URLSearchParams();
		
		params.append('search_category', category);
		params.append('search_text', searchKey);
		
		axios.post(url, params, header);
	}

	searchProduct(){
		if(this.state.searchKey !== ''){
			this.sendLogData(this.state.category, this.state.searchKey);

			this.getNumberForPagination(this.state.category, this.state.searchKey);

			let url = '';
			if(this.state.category === 'all'){
				url = '/api/products/search/all';
			}
			else{
				url = '/api/products/search';
			}
			
			const header = {
				headers: { 
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}
			const params = new URLSearchParams();
			params.append('searchKey', this.state.searchKey);
			params.append('category', this.state.category);
			params.append('limit', 0);
			params.append('offset', this.state.offset);
			
			axios.post(url, params, header)
			.then((response) => {
				if(response.data.length !== 0){
					var element = [];
					element = response.data.map((products, index) => {
						return (
							<ProductCard test={index} product={products} key={index} cardClick={this.cardClicked}/>
						);
					});

					this.setState({
						searchResult:null
					});
					this.setState({
						searchResult:element,
						currentPage:1
					});
				}
				else{
					this.setState({
						searchResult:'empty'
					});
				}
			})
		}
		else{
			alert('Please type at least 1 letter');
		}
	}

	workPagination(){
		if(this.state.searchKey !== ''){
			window.scrollTo(0, 0);
			this.getNumberForPagination(this.state.category, this.state.searchKey);

			let url = '';
			if(this.state.category === 'all'){
				url = '/api/products/search/all';
			}
			else{
				url = '/api/products/search';
			}
			
			const header = {
				headers: { 
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}
			const params = new URLSearchParams();
			params.append('searchKey', this.state.searchKey);
			params.append('category', this.state.category);
			params.append('limit', this.state.limit);
			params.append('offset', this.state.offset);
			
			axios.post(url, params, header)
			.then((response) => {
				var element = [];
				element = response.data.map((products, index) => {
					return (
						<ProductCard test={index} product={products} key={index} cardClick={this.cardClicked}/>
					);
				});

				this.setState({
					searchResult:null
				});
				this.setState({
					searchResult:element
				});
			})
		}
		else{
			alert('Please type at least 1 letter');
		}
	}

	getNumberForPagination(category, searchKey){
		let url = '';
		if(this.state.category === 'all'){
			url = '/api/product/search/all/getNumberForPagination';
		}
		else{
			url = '/api/product/search/getNumberForPagination';
		}
		const params = new URLSearchParams();
		params.append('category', category);
		params.append('searchKey', searchKey);

		axios.post(url, params, {
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		})
		.then((response) => {
			if(response.status){
				this.setState({
					numberForPagination:response.data.numberForPagination
				})
			}
			else{
				throw new Error();
			}
		});
	}

	changeLimit(new_limit, new_currentPage){
		this.setState({
			currentPage:new_currentPage,
			limit:new_limit
		}, () => this.workPagination());
	}

	render(){
		let render = [];
		if(this.state.searchResult === null){

		}
		else if(this.state.searchResult === 'empty'){
			render = 'No result';
		}
		else{
			render.push(
				<div key={'searchResult'}>
					<Row key={'row'} xs={2} md={3} lg={4} style={{margin:'0px'}}>
						{this.state.searchResult}
					</Row>
					<Pagination key={'pagination'} currentPage={this.state.currentPage} numberForPagination={this.state.numberForPagination} changeLimit={this.changeLimit}/>
				</div>
			);
		}

		return(
			<div>
				<div style={{paddingTop:50, paddingBottom:50}}>
					<h1>Search Page</h1>
				</div>

				<div>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<Form.Control
							name='category'
							as="select"
							className="mr-sm-2"
							onChange={this.selectChange}>
								<option value="all">All</option>
								{this.state.categoryElementArray}
							</Form.Control>
						</InputGroup.Prepend>
						<FormControl
							name='searchKey'
							placeholder="Search..."
							onChange={this.searchKeyChange}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									this.searchProduct();
								}
							}}/>
						<InputGroup.Append>
							<Button type='button' onClick={this.searchProduct} variant="outline-secondary">Search</Button>
						</InputGroup.Append>
					</InputGroup>
				</div>
				<div>
					{render}
					<div style={{paddingBottom:'75px'}}></div>
				</div>
			</div>
		);
	}
}

export default Search;