import React, { Component } from "react";
import axios from 'axios';

import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Row } from "react-bootstrap";

class PrepareProductCard extends Component{
    constructor(){
        super();

        this.changeLimit = this.changeLimit.bind(this);

        this.state={
            productList:[]
        }
    }

    componentDidMount(){
        this.readyForData();
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.category !== this.props.match.params.category){
            this.readyForData();
        }
    }

    async readyForData(){
        await this.getNumberForPagination(this.props.match.params.category);
        await this.callProducts(this.props.match.params.category);
    }

    async getNumberForPagination(category){
        const url = '/api/product/getNumberForPagination';
        const header = {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams();
        params.append('category', category);

        const response = await axios.post(url, params, header);

        this.setState({
            currentPage:1,
            limit:0,
            numberForPagination : response.data.numberForPagination
        })
    }

    async callProducts(category){
        const url = '/api/productCall';
        const header = {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('limit', this.state.limit);

        const response = await axios.post(url, params, header);
        const productList = response.data.map((product, index) => {
            return (
                <ProductCard product={product} key={index}/>
            );
        });
        this.setState({
            productList:
            <Row xs={2} md={3} lg={4} style={{margin:'0px'}}>
                {productList}
            </Row>
        });
    }

    changeLimit(new_limit, new_currentPage){
        this.setState({
            currentPage:new_currentPage,
            limit:new_limit
        }, () => this.callProducts(this.props.match.params.category));
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
                {/* http:/product/lipstick/page13 이렇게 페이지를 설정해야 편할까? */}
            </>
        );
    }
}

export default PrepareProductCard;