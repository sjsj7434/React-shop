import axios from "axios";
import React, { Component } from "react";

import Spinner from "react-bootstrap/Spinner";
import { Form, FormControl, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class FindPassword extends Component{
    constructor(){
        super();

        this.changeUserId = this.changeUserId.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.cancel = this.cancel.bind(this);

        this.state={
            userId:'',
            redirect:<></>
        }
    }

    cancel(){
        this.setState({
            redirect:<><Redirect to='/'/></>
        })
    }

    sendMail() {
        if(this.state.userId !== ''){
            document.getElementById("findButton").disabled = true;
            document.getElementById("loading").innerText = "Loading...";

            const url = '/api/customer/send/email';
            const header = {
                headers: { 
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('userId', this.state.userId);

            this.setState({
                redirect:<Spinner/>
            });

            axios.post(url, params, header)
            .then((response) => {
                if(response.data === "ok"){
                    document.getElementById("loading").innerText = "Email sent";
                    alert('Email sent, check your Email');
                    this.setState({
                        redirect:<><Redirect to='/customer/CustomerLogin'/></>
                    });
                }
                else{
                    document.getElementById("loading").innerText = "ID is not exist or E-mail is not verified";
                    alert('ID is not exist or E-mail is not verified');
                }
            });
        }
        else{
            alert('Please Write ID')
        }
        document.getElementById("findButton").disabled = false;
    }

    changeUserId(event){
        this.setState({
            userId:event.target.value
        });
    }

    render(){
        return(
            <Form style={{padding:10}}>
                <h1>FindPassword</h1>
                {/* 이메일 처리과정이 조금 오래 걸리네 로딩 화면 준비할까? */}
                <Form.Group as={Row} controlId="id">
                    <Col>
                        <InputGroup className="mb-3">
                            <FormControl placeholder="Your ID..." onChange={this.changeUserId} onKeyDown={(event)=>{if(event.keyCode === 13){event.preventDefault(); this.sendMail()}}}/>
                        </InputGroup>
                        <Form.Text className="text-muted" style={{textAlign:'left'}}>
                        New password will be sent to your Email
                        </Form.Text>
                    </Col>
                </Form.Group>
                
                <Row>
                    <Col><Button size='lg' variant='danger' block onClick={this.cancel}>Cancel</Button></Col>
                    <Col><Button id="findButton" onClick={this.sendMail} size='lg' disabled={false} variant="success" block>Find</Button></Col>
                </Row>
                <div id="loading"></div>
                <div>{this.state.redirect}</div>
            </Form>
        );
    }
}

export default FindPassword;