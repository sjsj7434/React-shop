import React, { Component } from "react";
import axios from 'axios';

import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Row } from "react-bootstrap";

class EyeshadowCardCall extends Component{
    constructor(){
        super();
        
        this.changeLimit = this.changeLimit.bind(this);

        this.state={
            productList:[],
            limit:0,
            currentPage:1
        }
    }
    
    componentDidMount(){
        this.callProducts(this.props.match.params.category);
        this.getNumberForPagination(this.props.match.params.category);
    }

    async callProducts(category){
        window.scrollTo(0,0);
        const url = '/api/productCall';
        const header = {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        const params = new URLSearchParams();
        params.append('category', category);
        params.append('limit', 0);

        const res = await axios.post(url, params, header);
        const products = res.data.map((product, index) => {
            return (
                <ProductCard product={product} key={index}/>
            );
        });
        this.setState({
            productList:
            <Row xs={2} md={3} lg={4} style={{margin:'0px'}}>
                {products}
            </Row>
        });
    }

    getNumberForPagination(category){
        const url = '/api/product/getNumberForPagination';
        const params = new URLSearchParams();
        params.append('category', category);

        axios.post(url, params, {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        })
        .then((response) => {
            if(response.status){
                this.setState({
                    numberForPagination : response.data.numberForPagination
                })
            }
            else{
                throw new Error();
            }
        });
    }

    changeLimit(new_limit, new_currentPage){
        this.setState({
            currentPage:new_currentPage,
            limit:new_limit
        }, () => this.callProducts(this.props.match.params.category));
        //callBack 지정하여 setstate 완료 후 호출
    }

    render(){
        let ele = <div></div>;
        if(this.state.productList !== null){
            ele = this.state.productList;
        }
        return(
            <>
            {ele}
            <Pagination currentPage={this.state.currentPage} numberForPagination={this.state.numberForPagination} changeLimit={this.changeLimit}/>
            </>
        );
    }
}

export default EyeshadowCardCall;