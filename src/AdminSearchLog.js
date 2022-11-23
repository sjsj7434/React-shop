import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";

class AdminSearchLog extends Component{
	constructor(){
		super();

		this.getSearchLogData = this.getSearchLogData.bind(this);

		this.state = {
			render : <></>
			, searchDateValue : new Date().toISOString().split("T")[0]
		}
	}
	
	componentDidMount(){
		this.checkAdminSession();
		this.getSearchLogData();
	}

	async checkAdminSession(){
		const url = '/api/admin/check/session';
		const header = {
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		};
		
		const response = await axios.post(url, header);
		if(response.data.result === true){
			this.setState({
				render : <></>,
				permission : true
			})
		}
		else{
			this.setState({
				render : <Redirect to="/admin/login"/>,
				permission : false
			});
		}
	}

	getSearchLogData(){
		const url = "/api/customer/search/log";
		let searchDate = document.getElementById("searchKey").value;

		if(searchDate === null){
			searchDate = this.state.searchDateValue;
		}

		axios.get(url, {
			params:{search_date : searchDate}
		})
		.then((response) => {
			if(response.status){
				if(response.data.length === 0){
					this.setState({
						searchLogArray : (<div>Nothing...</div>)
					});

					return;
				}

				let arr = [];

				arr = response.data.map((logData, index) => {
					if(index === 0){
						return(
							<div key="tableHead">
								<p style={{textAlign : "left"}}>Total : {response.data.length}</p>
								<div style={{backgroundColor : "#eaffb5", display : "flex"}}>
									<div style={{width : "25%", border : "1px solid #8d8d8d"}}><b>Date</b></div>
									<div style={{width : "25%", border : "1px solid #8d8d8d"}}><b>Category</b></div>
									<div style={{width : "50%", border : "1px solid #8d8d8d"}}><b>Search Text</b></div>
								</div>

								<div key={logData.log_code} style={{backgroundColor : "#eaf5ff", display : "flex"}}>
									<div style={{width : "25%", border : "1px solid #8d8d8d"}}>{logData.search_date.split("T")[0]}</div>
									<div style={{width : "25%", border : "1px solid #8d8d8d"}}>{logData.search_category}</div>
									<div style={{width : "50%", border : "1px solid #8d8d8d", textAlign : "left"}}>{logData.search_text}</div>
								</div>
							</div>
						);
					}
					else{
						return(
							<div key={logData.log_code} style={{backgroundColor : "#eaf5ff", display : "flex"}}>
								<div style={{width : "25%", border : "1px solid #8d8d8d"}}>{logData.search_date.split("T")[0]}</div>
								<div style={{width : "25%", border : "1px solid #8d8d8d"}}>{logData.search_category}</div>
								<div style={{width : "50%", border : "1px solid #8d8d8d", textAlign : "left"}}>{logData.search_text}</div>
							</div>
						);
					}
				});

				this.setState({
					searchLogArray : arr
				})
			}
			else{
				throw new Error();
			}
		});
	}

	render(){
		return(
			<div>
				{this.state.render}
				<div style={{padding : 10, paddingTop:50, paddingBottom:50}}>
					<h1>Serach History</h1>
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
								placeholder="Search..."
								name="searchKey"
								id="searchKey"
								defaultValue={this.state.searchDateValue}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										this.getSearchLogData();
									}
								}}/>
							<InputGroup.Append>
								<Button type="button" onClick={this.getSearchLogData} variant="outline-secondary">Search</Button>
							</InputGroup.Append>
						</InputGroup>
					</div>
					<div>
						{this.state.searchLogArray}
					</div>
				</div>
			</div>
		);
	}
}

export default AdminSearchLog;