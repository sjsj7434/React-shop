import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import Pagination from "./Pagination";

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Card, Form, FormControl, InputGroup, Button, Row, Col } from "react-bootstrap";

class AdminOrderManage extends Component{
    constructor(){
        super();
        this.datePickerChange = this.datePickerChange.bind(this);
        this.orderList = this.orderList.bind(this);
        this.orderUpdate = this.orderUpdate.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.orderCancel = this.orderCancel.bind(this);
        this.numberForPagination = this.numberForPagination.bind(this);
        this.changeLimit = this.changeLimit.bind(this);
        this.changeDelivery = this.changeDelivery.bind(this);
        this.changePurchase = this.changePurchase.bind(this);
        this.changeDateCheckBox = this.changeDateCheckBox.bind(this);
        
        this.state={
            selectedDate: new Date(),
            selectedCategory:'',
            customer_id:'',
            limit:0,
            currentPage:1,
            view:<div></div>,
            deliveryStatus : '',
            purchaseApproved : '',
            dateCheck: false
        }
    }

    componentDidMount(){
        this.checkAdminSession();
    }

    async checkAdminSession(){
        const url = '/api/admin/check/session';
        const params = new URLSearchParams();
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        
        const response = await axios.post(url, params, header);
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

    datePickerChange(event){
        this.setState({
            selectedDate:event
        });
    }

    inputChange(event){
        this.setState({
            customer_id:event.target.value
        })
    }

    changeDelivery(event){
        this.setState({
            deliveryStatus:event.target.value
        })
    }

    changePurchase(event){
        this.setState({
            purchaseApproved:event.target.value
        })
    }

    changeDateCheckBox(event){
        this.setState({
            dateCheck: event.target.checked
        })
    }

    numberForPagination(){
        let url = '';
        if(this.state.customer_id === ''){
            url = '/api/admin/products/orderlist/all/getNumberForPagination';
        }
        else{
            url = '/api/admin/products/orderlist/getNumberForPagination';
        }

        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('dateCheck', this.state.dateCheck);
        params.append('date', this.state.selectedDate);
        params.append('customer_id', this.state.customer_id);

        axios.post(url, params, header)
        .then((response) => {
            this.setState({
                numberForPagination : response.data.numberForPagination
            });
        });
    }

    changeLimit(new_limit, new_currentPage){
        this.setState({
            currentPage:new_currentPage,
            limit:new_limit
        }, () => this.workPagination());
        //callBack 지정하여 setstate 완료 후 호출
    }

    workPagination(){
        this.numberForPagination()

        let url = '';
        const params = new URLSearchParams();
        const header = {
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        if(this.state.customer_id === ''){
            url = "/api/admin/products/orderlist/all";
        }
        else{
            url = "/api/admin/products/orderlist"
            params.append('customer_id', this.state.customer_id);
        }
        
        params.append('dateCheck', this.state.dateCheck);
        params.append('date', this.state.selectedDate);
        params.append('limit', this.state.limit);

        axios.post(url, params, header)
        .then((response) => {
            this.setState({
                orderList:[]
            });
            this.setState({
                orderList:response.data
            });
        })
        .catch((error) => {
            alert("Error...");
        });
    }

    orderList(){
        this.numberForPagination()

        let url = '';
        const params = new URLSearchParams();
        const header = {
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        if(this.state.customer_id === ''){
            url = "/api/admin/products/orderlist/all";
        }
        else{
            url = "/api/admin/products/orderlist"
            params.append('customer_id', this.state.customer_id);
        }
        
        params.append('dateCheck', this.state.dateCheck);
        params.append('date', this.state.selectedDate);
        params.append('limit', 0);

        axios.post(url, params, header)
        .then((response) => {
            this.setState({
                orderList:[],
                currentPage:1,
                limit:0
            });
            this.setState({
                orderList:response.data
            });
        })
        .catch((error) => {
            alert("Error...")
        });
    }

    orderUpdate(event){
        event.preventDefault();

        const url = "/api/admin/products/order/update";
        const header = {
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams();
        const delivery = this.state.deliveryStatus === '' ? event.target.delivery.value : this.state.deliveryStatus;
        const purchase = this.state.purchaseApproved === '' ? event.target.purchase.value : this.state.purchaseApproved;
        params.append('delivery', delivery);
        params.append('purchase', purchase);
        params.append('order_id', event.target.order_id.value);
        
        axios.post(url, params, header)
        .then((response) => {
            if(response.status === 200)
                alert('Updated');
        })
        .catch((error) => {
            alert("Error...")
        });
    }

    orderCancel(event){
        event.preventDefault();

        if(window.confirm('Do you want to cancel this order?')){
            const url = "/api/admin/products/order/cancel";
            const header = {
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            };
            const params = new URLSearchParams();
            params.append('order_id', event.target.order_id.value);
            params.append('quantity', event.target.quantity.value);
            params.append('product_code', event.target.product_code.value);
            
            axios.post(url, params, header)
            .then((response) => {
                if(response.status){
                    this.workPagination();
                    alert('Order has been canceled');
                }
            })
            .catch((error) => {
                alert("Error...")
            });
        }
    }

    render(){
        let view = [];
        if(this.state.orderList === undefined){
            view.push(
                <div key={'div0'}>
                    Select Date and Type ID
                </div>
            )
        }
        else if(this.state.orderList.length > 0){
            let order = [];
            let cardStyle = {};
            let statusStyle = {};
            let selectDisable = false;
            let buttons = <></>;
            for(var index = 0; index < this.state.orderList.length; index++){
                if(this.state.orderList[index].order_status === 'canceled'){
                    cardStyle = {textAlign:'left', backgroundColor:'#FFB6C1'};
                    statusStyle = {fontWeight:'500', color:'red'};
                    selectDisable = true;
                    buttons = <></>;
                }
                else{
                    cardStyle = {textAlign:'left', backgroundColor:'#87CEEB'};
                    statusStyle = {color:'black'};
                    selectDisable = false;
                    buttons = (
                        <Row>
                            <Col>
                                <Form onSubmit={this.orderCancel}>
                                    <input type="hidden" name="order_id" defaultValue={this.state.orderList[index].order_id}/>
                                    <input type="hidden" name="product_code" defaultValue={this.state.orderList[index].product_code}/>
                                    <input type="hidden" name="quantity" defaultValue={this.state.orderList[index].quantity}/>
                                    <Button variant="warning" type="submit" block>
                                        Cancellation
                                    </Button>
                                </Form>
                            </Col>
                            <Col>
                                <Form onSubmit={this.orderUpdate}>
                                    <input type='hidden' name="order_id" defaultValue={this.state.orderList[index].order_id}/>
                                    <input type="hidden" name="delivery" defaultValue={this.state.orderList[index].delivery_status}/>
                                    <input type="hidden" name="purchase" defaultValue={this.state.orderList[index].purchase_approved}/>
                                    <Button type="submit" block>
                                        Update
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    );
                }
                order.push(
                    <div key={index} style={{paddingBottom:'10px'}}>
                        <Card style={cardStyle}>
                            <Card.Body>
                                <Card.Title>Customer ID : {this.state.orderList[index].customer_id}</Card.Title>

                                <Card.Text>
                                    Ordered date : {this.state.orderList[index].ordered_date.split('T')[0] +' '+ this.state.orderList[index].ordered_date.split('T')[1].split('.')[0]}
                                </Card.Text>

                                <Card.Text style={statusStyle}>
                                    Ordered status : {this.state.orderList[index].order_status}
                                </Card.Text>

                                <Card.Text>
                                    Product name : {this.state.orderList[index].product_name}
                                </Card.Text>

                                <Card.Text>
                                    Quantity : {this.state.orderList[index].quantity}
                                </Card.Text>

                                <Card.Text>
                                    Price : {this.state.orderList[index].total_price}
                                </Card.Text>

                                <Card.Text>
                                    <Form.Label className="my-1 mr-2">
                                        Delivery status
                                    </Form.Label>
                                    <Form.Control
                                    onChange={this.changeDelivery}
                                    disabled={selectDisable}
                                    as="select"
                                    className="my-1 mr-sm-2"
                                    name="delivery"
                                    defaultValue={this.state.orderList[index].delivery_status}>
                                        <option value="not yet">Not yet</option>
                                        <option value="on shipping">On Shipping</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="error">Error</option>
                                    </Form.Control>
                                </Card.Text>
                                <Card.Text>
                                    <Form.Label className="my-1 mr-2">
                                        Purchase approved
                                    </Form.Label>
                                    <Form.Control
                                    onChange={this.changePurchase}
                                    disabled={selectDisable}
                                    as="select"
                                    className="my-1 mr-sm-2"
                                    name="purchase"
                                    defaultValue={this.state.orderList[index].purchase_approved}>
                                        <option value="no">No</option>
                                        <option value="pending">Pending</option>
                                        <option value="yes">Yes</option>
                                        <option value="error">Error</option>
                                    </Form.Control>
                                </Card.Text>
                                {buttons}
                            </Card.Body>
                        </Card>
                    </div>
                );
            };
            view = 
                <div>
                    {order}
                    <Pagination currentPage={this.state.currentPage} numberForPagination={this.state.numberForPagination} changeLimit={this.changeLimit}/>
                </div>;
        }
        else{
            view.push(
                <div key={'div0'}>
                    No result
                </div>
            )
        }

        return(
            <div>
                {this.state.render}
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Manage Order</h1>
                </div>

                <div>
                    <div>
                        <label><input type="checkbox" onChange={this.changeDateCheckBox}/>Date search</label>
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            format="yyyy/MM/dd"
                            margin="normal"
                            value={this.state.selectedDate}
                            onChange={this.datePickerChange}/>
                    </MuiPickersUtilsProvider>
                </div>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Customer ID</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                this.orderList();
                            }
                        }}
                        onChange={this.inputChange}
                        name='customer_id'
                        placeholder="Empty is all customer"/>
                    <InputGroup.Append>
                        <Button onClick={this.orderList} variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>

                {view}
            </div>
        );
    }
}

export default AdminOrderManage;