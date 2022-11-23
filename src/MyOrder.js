import React, { Component } from "react";
import axios from 'axios';
import { NavLink, Redirect } from 'react-router-dom';

import Pagination from './Pagination';

import { Form, Spinner, Modal, Button, Image, Col, Row } from "react-bootstrap";
import Divider from '@material-ui/core/Divider';

class MyOrder extends Component{
    constructor(){
        super();
        
        this.mounted = true;
        this.getNumberForPagination = this.getNumberForPagination.bind(this);
        this.changeLimit = this.changeLimit.bind(this);
        this.orderDetailModalShow = this.orderDetailModalShow.bind(this);
        this.orderDetailModalClose = this.orderDetailModalClose.bind(this);
        this.orderCancel = this.orderCancel.bind(this);

        this.state = {
            limit:0,
            currentPage : 1,
            numberForPagination : 0,
            imagePath:[]
        }
    }

    componentDidMount(){
        this.checkSession();
    }

    componentWillUnmount(){
        this.mounted = false;
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
            
            if(this.mounted === true)
                this.setState({
                    user:customerData
                });

            this.getOrderList(customerData.customer_id);
            this.getNumberForPagination(customerData.customer_id);
        }
        else{
            if(this.mounted === true)
                this.setState({
                    redirect : <Redirect to='/customer/customerlogin'/>
                });
        }
    }

    async getOrderList(customer_id){//상품을 한번에 가져와야 해, 한개씩 가져오니까 느리잖아
        const params = new URLSearchParams();
        params.append('id', customer_id);
        params.append('limit', this.state.limit);
        const url = '/api/customer/get/customer/order';
        const header = {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        const response = await axios.post(url, params, header);
        if(this.mounted === true){
            this.setState({
                orderList:response.data
            });   
        }

        // let str = "";
        // for(let i = 0; i < response.data.length; i++){
        //     str += "," + response.data[i].product_code
        // };
        
        const imagePath = [];
        const url2 = '/api/products/product_code';
        for(let i = 0; i < response.data.length; i++){
            const params2 = new URLSearchParams();
            params2.append('product_code', response.data[i].product_code);
            const response2 = await axios.post(url2, params2, header);
            if(response2.data[0] !== undefined){
                imagePath.push(response2.data[0].product_image.split(',')[0]);
            }
            else{
                imagePath.push('error.jpg');
            }
            if(this.mounted === true)
                this.setState({
                    imagePath:imagePath
                });
        };
    }

    getNumberForPagination(customer_id){
        let url = '/api/customer/get/customer/order/count';
        const params = new URLSearchParams();
        params.append('customer_id', customer_id);

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
        if(this.mounted === true){
            window.scrollTo(0,0);
            this.setState({
                currentPage:new_currentPage,
                limit:new_limit
            }, () => this.checkSession());
        }
    }

    orderDetailModalShow(){
        if(this.mounted === true)
            this.setState({
                setShowOrderDetailModal : true
            });
    }
    orderDetailModalClose(){
        if(this.mounted === true)
            this.setState({
                setShowOrderDetailModal : false
            });
    }

    orderCancel(event){
        event.preventDefault();
        document.getElementById("orderCancel"+event.target.index.value).disabled = true;

        if(window.confirm('Do you want to cancel this order?')){
            const url = "/api/customer/cancle/customer/order";
            const header = {
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            };
            const params = new URLSearchParams();
            params.append('product_name', event.target.product_name.value);
            params.append('order_id', event.target.order_id.value);
            params.append('quantity', event.target.quantity.value);
            params.append('product_code', event.target.product_code.value);
            params.append('customer_id', this.state.user.customer_id);
            params.append('total_price', event.target.total_price.value);
            
            axios.post(url, params, header)
            .then((response) => {
                if(response.status === 200){
                    this.getOrderList(this.state.user.customer_id);
                    this.getNumberForPagination(this.state.user.customer_id);
                }
            })
            .catch((error) => {
                document.getElementById("orderCancel"+event.target.index.value).disabled = false;
            });
        }
        else{
            document.getElementById("orderCancel"+event.target.index.value).disabled = false;
        }
    }

    render(){
        let orderList = null;
        if(this.state.orderList !== undefined){
            orderList = this.state.orderList.map((order, index) => {
                if(this.state.imagePath[index] !== undefined){
                    let buttons = <></>;
                    let backColor = '';

                    if(order.order_status !== 'canceled'){
                        backColor = 'white';
                        buttons = (
                            <Form onSubmit={this.orderCancel}>
                                <input type="hidden" name="product_name" defaultValue={order.product_name}/>
                                <input type="hidden" name="order_id" defaultValue={order.order_id}/>
                                <input type="hidden" name="product_code" defaultValue={order.product_code}/>
                                <input type="hidden" name="quantity" defaultValue={order.quantity}/>
                                <input type="hidden" name="total_price" defaultValue={order.total_price}/>
                                <input type="hidden" name="index" defaultValue={index}/>
    
                                <Row>
                                    <Col style={{marginLeft:'20px',marginRight:'20px',marginBottom:'10px'}}>
                                        <Button style={{backgroundColor:'#C70039', border:0, borderRadius:'30px'}} type="submit" block id={"orderCancel"+index}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                            Cancellation
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        );
                    }
                    else{
                        buttons = <></>;
                        backColor = '#FF9494';
                    }

                    return(
                        <div key={index} style={{border:'2px solid', backgroundColor:backColor, marginBottom:'5px'}}>
                            <Row style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin:'5px',
                                textAlign:'left',
                                fontSize:'14px'
                                }}>
                                <Col xs={6} md={4}>
                                    {
                                        order.order_status !== 'canceled' ? 
                                        <NavLink to={{pathname : `/product/productInfo/${order.product_code}`}}>
                                            <Image width={'171px'} height={'180px'} src={`/uploadsImgs/${this.state.imagePath[index]}`} rounded/>
                                        </NavLink>
                                        :
                                        <Image width={'171px'} height={'180px'} src={`/uploadsImgs/${this.state.imagePath[index]}`} rounded/>
                                    }
                                    
                                </Col>
                                <Col style={{padding:0}}>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Name</strong></Col>
                                        <Col style={{padding:0}}>{order.product_name}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Date</strong></Col>
                                        <Col style={{padding:0}}>{order.ordered_date.split('T')[0]}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Price</strong></Col>
                                        <Col style={{padding:0}}>{order.total_price} COP</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Quantity</strong></Col>
                                        <Col style={{padding:0}}>{order.quantity}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Delivery</strong></Col>
                                        <Col style={{padding:0}}>{order.delivery_status}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Status</strong></Col>
                                        <Col style={{padding:0}}>{order.order_status}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Approved</strong></Col>
                                        <Col style={{padding:0}}>{order.purchase_approved}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            {buttons}
                        </div>
                    );
                }
                else{
                    //로딩화면
                    return(
                        <div key={index} style={{border:'2px solid', marginBottom:'5px'}}>
                            <Row style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin:'5px',
                                textAlign:'left',
                                fontSize:'14px'
                                }}>
                                <Col xs={6} md={4}>
                                    <Spinner animation="grow" style={{width:"171px", height : "180px"}}/>
                                </Col>
                                <Col style={{padding:0}}>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Name</strong></Col>
                                        <Col style={{padding:0}}>{order.product_name}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Date</strong></Col>
                                        <Col style={{padding:0}}>{order.ordered_date.split('T')[0]}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Price</strong></Col>
                                        <Col style={{padding:0}}>{order.total_price} COP</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Quantity</strong></Col>
                                        <Col style={{padding:0}}>{order.quantity}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Delivery</strong></Col>
                                        <Col style={{padding:0}}>{order.delivery_status}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Status</strong></Col>
                                        <Col style={{padding:0}}>{order.order_status}</Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col style={{paddingRight:0}}><strong>Approved</strong></Col>
                                        <Col style={{padding:0}}>{order.purchase_approved}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            });
            if(this.state.orderList.length === 0){
                orderList = <div>Sin historial de pedidos...</div>
            }
        }
        return(
            <div style={{backgroundColor:'lavender'}}>
                {this.state.redirect}
                <Row>
                    <Col><h2>My Orders</h2></Col>
                </Row>
                {orderList}
                <Pagination key={'pagination'} currentPage={this.state.currentPage} numberForPagination={this.state.numberForPagination} changeLimit={this.changeLimit}/>
                <Modal
                show={this.state.setShowOrderDetailModal}
                onHide={this.orderDetailModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Header</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row style={{padding:'10px'}}>
                            <Col>Body</Col>
                            <Col><input type='text' name='category' maxLength={100}/></Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.orderDetailModalClose}>CLOSE</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default MyOrder;