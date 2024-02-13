import React, { Component } from "react";
import { NavLink } from 'react-router-dom';

import './resources/css/ProductCard.css';

import { Card, Col, Badge } from "react-bootstrap";

class ProductCard extends Component{    
    render(){
        const discountPercentage = this.props.product.product_discount;
        let howManyDaysAgo = new Date();
        howManyDaysAgo.setDate(howManyDaysAgo.getDate() - 7);
        let product_added_date = new Date(this.props.product.product_added_date);

        let newBadge = "";
        let discountBadge = "";
        let price = "";

        if(product_added_date > howManyDaysAgo){
            newBadge = (
                <span><Badge variant="danger">New</Badge>{' '}</span>
            );
        }

        if(discountPercentage > 0){
            const discountedPrice = parseInt(this.props.product.price * ((100 - discountPercentage)/100));
            discountBadge = (
                <span><Badge variant="warning">{discountPercentage} %</Badge></span>
            );
            price = (
                <>
                    <span className="no_discount_price">{this.props.product.price}</span>       
                    <span className="discount_price">{discountedPrice} cop</span>
                </>
            );
        }
        else{
            price = (
                <>
                    <span className="normal_price">{this.props.product.price} cop</span>
                </>
            );
        }

        return(
            <Col style={{padding:'1px'}}>
                <NavLink
                    id={`nav${this.props.product.product_code}`}
                    to={{
                        pathname : `/product/productInfo/${this.props.product.product_code}`
                    }}>
                    <Card border="1" className="productCard">
                        <Card.Img src={`/uploadsImgs/${this.props.product.product_image.split(',')[0]}`} style={{ maxHeight: "180px", minHeight: "180px" }} />
                        <Card.Body>
                            {newBadge}
                            {discountBadge}
                            <Card.Title className="cardText">{this.props.product.product_name}</Card.Title>
                            <Card.Text className="cardText">
                                {this.props.product.product_desc}
                            </Card.Text>
                            <Card.Text className="cardText">
                                {price}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </NavLink>
            </Col>
        );
    }
}

export default ProductCard;