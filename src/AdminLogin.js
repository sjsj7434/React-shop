import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";

class AdminLogin extends Component{
    constructor(){
        super();
        this.state = {
            render : <div>Please login</div>
        }
        this.login = this.login.bind(this);
        this.cancle = this.cancle.bind(this);
        this.adminRegister = this.adminRegister.bind(this);        

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
                render : <div><Redirect to="/admin/main"/></div>
            });
        }
    }
    
    async login(e) {
        e.preventDefault()
        const url = '/api/admin/login';
        const header = {
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('id', e.target.id.value)
        params.append('password', e.target.password.value)
    
        const response = await axios.post(url, params, header);
        if(response.data.result === true){
            this.setState({
                render : <div><Redirect to="/admin/main"/></div>
            });
        }
        else{
            if(response.data.message !== undefined){
                alert(response.data.message)
            }
            this.setState({
                render : <div>Login Failed</div>
            })
        }
    }

    cancle(){
        this.setState({
            render : <div><Redirect to="/"/></div>
        })
    }

    passwordEyes(){
        if(document.getElementById("hidePassword").style.display === 'none'){
            document.getElementById("hidePassword").style.display = 'block';
            document.getElementById("showPassword").style.display = 'none';
            document.getElementById("formPassword").type = 'password';
        }
        else{
            document.getElementById("hidePassword").style.display = 'none';
            document.getElementById("showPassword").style.display = 'block';
            document.getElementById("formPassword").type = 'text';
        }
    }

    adminRegister(){
        this.setState({
            render : <Redirect to="/admin/register"/>
        });
    }

    render(){
        return(
            <div style={{backgroundColor:'ivory', height:window.innerHeight}}>
                <div style={{paddingTop:100, paddingBottom:100}}>
                    <h1>Admin Page</h1>
                    {this.state.render}
                </div>
                <Form onSubmit={this.login} style={{padding:15}}>
                    <Form.Group as={Row} controlId="formID">
                        <Col>
                            <Form.Control type="text" name="id" placeholder="ID" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPassword">
                        <Col>
                            <InputGroup>
                                <Form.Control type="password" name="password" placeholder="Password"/>
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
                    <div style={{paddingTop:30}}>
                        <Row>
                            <Col style={{paddingRight:5}}><Button onClick={this.cancle} variant="danger" size="lg" block>CANCLE</Button></Col>
                            <Col style={{paddingLeft:5}}><Button type='submit' variant="success" size="lg" block>LOGIN</Button></Col>
                        </Row>
                    </div>
                    <div style={{paddingTop:20}}>
                        <Row style={{paddingTop:10}}>
                            <Col><Button onClick={this.adminRegister} size="lg" block>Request Register</Button></Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

export default AdminLogin;