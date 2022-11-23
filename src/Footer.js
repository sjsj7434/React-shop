import React, { Component } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Footer extends Component{
    render(){
        return(
            <Container fluid style={{
                backgroundColor:'black', color:'white',
                textAlign:'left', fontSize:'15px',
                paddingTop:'20px', paddingBottom:'84px', margin:0,
                width:'100vw',
                fontWeight:'400'
                }}>
                <Row style={{paddingBlockEnd:'10px', fontSize:"20px"}}>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Purple&White</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Queremos ser complices de tu belleza</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Beauty shop located in Colombia</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Instagram : purplewhite.makeup</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Facebook : Purple & White</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Contact : +57 3226595493 / +57 3207515060</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
                <Row>
                    <Col style={{padding:0}}></Col>                    
                    <Col style={{padding:0}} xs={8}>Email : purplewhite.makeup@gmail.com</Col>
                    <Col style={{padding:0}}></Col>
                </Row>
            </Container>
        );
    }
}

export default Footer;