import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import './resources/css/HamburgerMenu.css';

import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AdminDrawerMenu from "./AdminDrawerMenu";

class FooterMenu extends Component{
    constructor(){
        super();
        this.resized = this.resized.bind(this);
        this.logOutClicked = this.logOutClicked.bind(this);
        
        window.addEventListener('resize', this.resized);

        this.state = {
            render : ''
        }
    }

    resized(){
        this.setState({
            screenSize : {
                screenWidth:window.innerWidth,
                screenHeight:window.innerHeight
            }
        })
    }
    
    async logOutClicked(){
        if(window.confirm('Really?')){
            const url = '/api/admin/logout';
            const params = new URLSearchParams();
            const header = {
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            };
            const response = await axios.post(url, params, header);
            if(response.status === 200){
                this.setState({
                    render : <div><Redirect to="/"/></div>
                });
            }
            else{
                this.setState({
                    render : <div>Error occured try again!</div>
                });
            }
        }
    }

    render(){
        return(
            <Navbar fixed='bottom' style={{backgroundColor:"gainsboro"}}>
                <Row className="justify-content-md-center" style={{width:window.innerWidth}}>
                    <Col>
                        <AdminDrawerMenu/>
                        <p style={{margin:0}}>Menu</p>
                    </Col>
                    <Col onClick={this.logOutClicked}>
                        <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-backspace" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6.603 2h7.08a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7.08a1 1 0 0 1-.76-.35L1 8l4.844-5.65A1 1 0 0 1 6.603 2zm7.08-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zM5.829 5.146a.5.5 0 0 0 0 .708L7.976 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
                        </svg>
                        <p style={{margin:0}}>LogOut</p>
                    </Col>

                    {this.state.render}
                </Row>
            </Navbar>
        );
    }
}

export default FooterMenu;