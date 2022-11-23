import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { Form, InputGroup, Button, Col, Row } from "react-bootstrap";

class Register extends Component{
    constructor(){
        super();
        this.state = {
            registerResult:<div></div>,
            passwordCheckResult : <div></div>,
            idCheckResult : <div></div>,
            emailCheckResult : <div></div>,
            passwordCheck : false,
            idCheck : false,
            emailCheck : false
        }
        this.register = this.register.bind(this);
        this.cancle = this.cancle.bind(this);
        this.passwordCheck = this.passwordCheck.bind(this);
        this.idCheck = this.idCheck.bind(this);
        this.emailCheck = this.emailCheck.bind(this);
    }
    
    register(e) {
        e.preventDefault();

        if(this.state.passwordCheck && this.state.idCheck && this.state.emailCheck){            
            const url = '/api/customer/register';
            const header = {
                headers: { 
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('id', e.target.id.value)
            params.append('password', e.target.password.value)
            params.append('email', e.target.email.value)
            params.append('address', e.target.address.value)
            params.append('address_detail', e.target.address_detail.value)
                
            axios.post(url, params, header)
            .then((response) => {
                if(response){
                    alert('You need to verify your Email before login\nPlease check your Email');
                    this.setState({
                        registerResult : <div><Redirect to="/"/></div>
                    })
                }
                else{
                    this.setState({
                        registerResult : <div style={{color:'red'}}>Register Failed</div>
                    })
                }
            })
            .catch((error) => {
                alert("Error...")
            });
        }
        else{
            alert('Please check the form');
        }
    }

    cancle(){
        this.setState({
            registerResult : <div><Redirect to="/"/></div>
        })
    }

    emailCheck(event){
        const checkStr = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        if(checkStr.test(event.target.value) === false){
            this.setState({
                emailCheckResult: <p style={{color:'red'}}>Email is Not Available</p>,
                emailCheck: false
            });
        }
        else{
            this.setState({
                emailCheckResult: <p style={{color:'green'}}>Email is Available</p>,
                emailCheck: true
            });
        }
    }

    idCheck(e){
        const params = new URLSearchParams();
        params.append('id', e.target.value);
        axios.post('/api/customer/register/idcheck', params,{
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if(response.status){
                if(response.data){
                    this.setState({
                        idCheckResult:<p style={{color:'green'}}>ID is Available</p>,
                        idCheck:true
                    })
                }
                else{
                    this.setState({
                        idCheckResult:<p style={{color:'red'}}>ID is Not Available</p>,
                        idCheck:false
                    })
                }
            }
        });
    }

    passwordCheck(){
        if(document.getElementById('repassword').value !== document.getElementById('password').value){
            this.setState({
                passwordCheckResult:<p style={{color:'red'}}>Password is not match</p>,
                passwordCheck:false
            })
        }
        else{
            this.setState({
                passwordCheckResult:<p style={{color:'green'}}>Password is matched</p>,
                passwordCheck:true
            })
        }
    }

    passwordEyes(){
        if(document.getElementById("hidePassword").style.display === 'none'){
            document.getElementById("hidePassword").style.display = 'block';
            document.getElementById("showPassword").style.display = 'none';
            document.getElementById("password").type = 'password';
        }
        else{
            document.getElementById("hidePassword").style.display = 'none';
            document.getElementById("showPassword").style.display = 'block';
            document.getElementById("password").type = 'text';
        }
    }

    render(){
        return(
            <div>
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Register Page</h1>
                    {this.state.registerResult}
                </div>
                <div>
                    <Form onSubmit={this.register} style={{padding:15}}>
                        <Form.Group as={Row} controlId="id">
                            <Col>
                                <Form.Control type="text" name="id" placeholder="ID" onChange={this.idCheck}/>
                            </Col>
                        </Form.Group>
                        {this.state.idCheckResult}
                        <Form.Group as={Row} controlId="password">
                            <Col>
                                <InputGroup>
                                    <Form.Control type="password" name="password" placeholder="Password" onChange={this.passwordCheck}/>
                                    <InputGroup.Append>
                                        <InputGroup.Text id="inputGroupPrepend" onClick={this.passwordEyes}>
                                            <svg id="hidePassword" style={{display: 'block'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.027 7.027 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.088z"/>
                                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.707z"/>
                                            </svg>

                                            <svg id="showPassword" style={{display: 'none'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                            </svg>
                                        </InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="repassword">
                            <Col>
                                <InputGroup>
                                    <Form.Control type="password" name="repassword" placeholder="Password one more time" onChange={this.passwordCheck}/>
                                </InputGroup>
                                <Form.Text className="text-muted" style={{textAlign:'left'}}>
                                We recommend at least 8 characters
                                </Form.Text>
                                {this.state.passwordCheckResult}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="email">
                            <Col>
                                <InputGroup>
                                    <Form.Control type="email" name="email" onChange={this.emailCheck} placeholder="Email"/>
                                </InputGroup>
                                <Form.Text className="text-muted" style={{textAlign:'left'}}>
                                Email will be used when you forgot password
                                <br></br>
                                You need to verift Email, Please write actual Email please
                                </Form.Text>
                                {this.state.emailCheckResult}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="address">
                            <Col>
                                <InputGroup>
                                    <Form.Control type="text" name="address" placeholder="Your City"/>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="addressDetail">
                            <Col>
                                <InputGroup>
                                    <Form.Control type="text" name="address_detail" placeholder="Your Detailed address"/>
                                </InputGroup>
                                <Form.Text className="text-muted" style={{textAlign:'left'}}>
                                This address will be used for package
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <div style={{paddingTop:30}}>
                            <Row>
                                <Col style={{paddingRight:5}}><Button onClick={this.cancle} variant="danger" size="lg" block>CANCLE</Button></Col>
                                <Col style={{paddingLeft:5}}><Button type='submit' variant="success" size="lg" block>CREATE</Button></Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Register;