import axios from "axios";
import React, { Component } from "react";

import { Form, FormControl, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class ResetPassword extends Component{
    constructor(){
        super();

        this.changePassword = this.changePassword.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.cancel = this.cancel.bind(this);

        this.state={
            userId:'',
            redirect:<></>
        }
    }

    checkPassword(){
        if(document.getElementById('repassword').value !== document.getElementById('password').value){
            this.setState({
                passwordCheckResult:<div style={{color:'red'}}>Passwords do not match</div>,
                passwordCheck:false
            })
        }
        else{
            this.setState({
                passwordCheckResult:<div style={{color:'green'}}>Passwords matches</div>,
                passwordCheck:true
            })
        }
    }

    async changePassword(event) {
        event.preventDefault();

        if(event.target.password.value === ''){
            alert('Please Write Password')
            return;
        }
        if(this.state.passwordCheck !== true){
            return;
        }

        const url = '/api/customer/reset/password';
        const header = {
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('password', event.target.password.value);

        const response_reset = await axios.post(url, params, header)
        if(response_reset.data !== 'error'){
            alert('Password Changed');
            const response_logout = await axios.post('/api/customer/logout', header);
            if(response_logout.data === 'ok'){
                this.setState({
                    redirect:<Redirect to='/customer/CustomerLogin'/>
                });
            }
            else{
                alert('Error!');
                this.setState({
                    redirect:<Redirect to='/customer/CustomerLogin'/>
                });
            }            
        }
        else{
            alert('Error!');
            this.setState({
                redirect:<Redirect to='/customer/CustomerLogin'/>
            });
        }
    }

    cancel(){
        this.setState({
            redirect:<Redirect to='/'/>
        });
    }

    render(){
        return(
            <Form onSubmit={this.changePassword} style={{padding:'10px'}}>
                {/* 데이터베이스에 비밀번호 초기화 됬는지 넣어서 초기화 후 로그인하면 변경하도록 유도 */}
                <h1>ResetPassword</h1>
                <InputGroup className="mb-3">
                    <FormControl id="password" type="password" placeholder="Your new password" onChange={this.checkPassword}/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl id="repassword" type="password" placeholder="Your new password, one more" onChange={this.checkPassword}/>
                </InputGroup>
                {this.state.passwordCheckResult}
                <Row style={{padding:10}}>
                    <Col><Button type="button" size='lg' variant="danger" block onClick={this.cancel}>Cancel</Button></Col>
                    <Col><Button type="submit" size='lg' variant="success" block>Change</Button></Col>
                </Row>

                <>{this.state.redirect}</>
            </Form>
        );
    }
}

export default ResetPassword;