import React, { Component } from "react";
import axios from 'axios';

import { Redirect } from 'react-router-dom';
import { Button, Col, Row, ListGroup } from "react-bootstrap";

class MyCart extends Component{
    constructor(){
        super();

        this.DeleteAccount = this.DeleteAccount.bind(this);
        
        this.state = {
            redirect:<></>
        };
    }

    componentDidMount(){
        this.checkSession();
    }

    async checkSession(){
        const url = '/api/customer/check/session';
        const header = {
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }

        const response = await axios.post(url, header);
        if(response.data.result === true){
            const customerData = response.data.customerData;

            const params = new URLSearchParams();
            params.append('id', customerData.customer_id);
            const response2 = await axios.post('/api/customer/get/customer', params, header);
            this.setState({
                user:response2.data[0]
            });
        }
        else{
            this.setState({
                redirect:<Redirect to='/customer/CustomerLogin'/>
            });
        }
    }

    DeleteAccount(){
        if(window.prompt("Do you want to delete?\nIt Can not be undone\nIf you wanna delete, write 'delete' in here") === "delete"){
            let url = '/api/customer/delete';
            let header = {
                headers: { 
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
            let params = new URLSearchParams();
            params.append('customer_id', this.state.user.customer_id);

            axios.post(url, params, header)
            .then((response) => {
                alert('Account has been Deleted');

                url = '/api/customer/logout';
                axios.post(url, header)
                
                this.setState({
                    redirect:<Redirect to='/customer/CustomerLogin'/>
                });
            })
        }
        else{
            alert('Canceled');
        }
    }

    render(){
        if(this.state.user === undefined){
            return(
                <div>
                    {this.state.redirect}
                    <h1>My Page</h1>
                    <h3>Loading...</h3>
                </div>
            );
        }
        else{
            return(
                <div>
                    {this.state.redirect}
                    <h1>My Page</h1>                    
                    <div style={{padding:'30px', textAlign:'left'}}>
						<ListGroup variant="">
							<ListGroup.Item>
								<Row>
									<Col>
										<ListGroup variant="flush">
											<ListGroup.Item>
												<strong>User ID</strong>
												</ListGroup.Item>
											<ListGroup.Item>
												<strong>Last login</strong>
											</ListGroup.Item>
											<ListGroup.Item>
												<strong>Address</strong>
											</ListGroup.Item>
										</ListGroup>
									</Col>
									<Col>
										<ListGroup variant="flush">
											<ListGroup.Item>
												{this.state.user.customer_id}
											</ListGroup.Item>
											<ListGroup.Item>
												{this.state.user.last_login_date.split("T")[0]}
											</ListGroup.Item>
											<ListGroup.Item>
												{this.state.user.address}<br/>{this.state.user.address_detail}
											</ListGroup.Item>
										</ListGroup>
									</Col>
								</Row>
							</ListGroup.Item>
						</ListGroup>
						<br/>
                        <Button href="/customer/myorder" block size="lg" variant="success">My Orders</Button>
                        <Button href="/customer/ResetPassword" block size="lg" variant="danger">Change Password</Button>
                        <Button onClick={this.DeleteAccount} block size="lg" variant="danger">Delete Account</Button>
                    </div>
                </div>
            );
        }
    }
}

export default MyCart;