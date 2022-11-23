import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import AdminProductCard from "./AdminProductCard";
import Pagination from "./Pagination";

import { Form, FormControl, InputGroup, Button, Row } from 'react-bootstrap'

class AdminProductManage extends Component{
    constructor(){
        super();

        this.searchProduct = this.searchProduct.bind(this);
        this.workPagination = this.workPagination.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.getNumberForPagination = this.getNumberForPagination.bind(this);
        this.changeLimit = this.changeLimit.bind(this);

        this.state={
            searchKey:'',
            searchResult:null,
            category:'all',
            currentPage:1,
            limit:0,
            offset:10
        }
    }

    componentDidMount(){
        this.checkAdminSession();
        const url = '/api/product/category/select';
        const params = new URLSearchParams();
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header).then((response) => {
            let options = [];

            for(let index = 0; index < response.data.length; index++){
                options.push(
                    <option key={index} value={response.data[index].category}>{response.data[index].category}</option>
                );
            };

            this.setState({
                selectFormInSearch:
                    <Form.Control
                    name='category'
                    as="select"
                    className="mr-sm-2"
                    onChange={this.selectChange}>
                        <option value="all">All</option>
                        {options}
                    </Form.Control>
            });
        });
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

    inputChange(e){
        this.setState({
            searchKey:e.target.value
        });
    }
    selectChange(e){
        this.setState({
            category:e.target.value
        })
    }

    searchProduct(){
        if(this.state.searchKey !== ''){
            window.scrollTo(0,0);
            this.getNumberForPagination();

            let url = '';
            if(this.state.category === 'all'){
                url = '/api/products/search/all';
            }
            else{
                url = '/api/products/search';
            }
            
            const header = {
                headers: { 
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('searchKey', this.state.searchKey);
            params.append('category', this.state.category);
            params.append('limit', 0);
            params.append('offset', this.state.offset);

            axios.post(url, params, header)
            .then((response) => {
                if(response.data.length !== 0){
                    var ele = [];
                    ele = response.data.map((products, index) => {
                        return (
                            <AdminProductCard key={index} limit={this.state.limit} currentPage={this.state.currentPage} product={products} workPagination={this.workPagination}/>
                        );
                    });

                    this.setState({
                        searchResult:null
                    });
                    this.setState({
                        searchResult:ele,
                        currentPage:1
                    });
                }
                else{
                    this.setState({
                        searchResult:'empty'
                    });
                }
            })
        }
        else{
            alert('Please type at least 1 letter');
        }
    }

    workPagination(){
        this.getNumberForPagination();

        let url = '';
        if(this.state.category === 'all'){
            url = '/api/products/search/all';
        }
        else{
            url = '/api/products/search';
        }
        
        const header = {
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams();
        params.append('searchKey', this.state.searchKey);
        params.append('category', this.state.category);
        params.append('limit', this.state.limit);
        params.append('offset', this.state.offset);
        
        axios.post(url, params, header)
        .then((response) => {
            var ele = [];
            ele = response.data.map((products, index) => {
                return (
                    <AdminProductCard key={index} limit={this.state.limit} currentPage={this.state.currentPage} product={products} workPagination={this.workPagination}/>
                );
            });

            this.setState({
                searchResult: null
            });
            this.setState({
                searchResult: ele             
            });
        })
    }

    getNumberForPagination(){
        let url = '';
        if(this.state.category === 'all'){
            url = '/api/product/search/all/getNumberForPagination';
        }
        else{
            url = '/api/product/search/getNumberForPagination';
        }

        const params = new URLSearchParams();
        params.append('category', this.state.category);
        params.append('searchKey', this.state.searchKey);

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
        }, () => this.workPagination());
        //callBack 지정하여 setstate 완료 후 호출
    }

    render(){
        let searchResult = [];
        if(this.state.searchResult === null){

        }
        else if(this.state.searchResult === 'empty'){
            searchResult = 'No result';
        }
        else{
            searchResult.push(
                <div key={'row'}>
                    <Row xs={2} md={3} lg={4} style={{margin:'0px'}}>
                        {this.state.searchResult}
                    </Row>
                    <Pagination currentPage={this.state.currentPage} numberForPagination={this.state.numberForPagination} changeLimit={this.changeLimit}/>
                </div>
            );
        }

        return(
            <div>
                {this.state.render}
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Manage Products</h1>
                </div>
                <div>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend style={{width:'30vw'}}>
                            {this.state.selectFormInSearch}
                        </InputGroup.Prepend>
                        <FormControl
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    this.searchProduct();
                                }
                            }}
                            onChange={this.inputChange}
                            name='searchKey'
                            placeholder="Search..."/>
                        <InputGroup.Append>
                            <Button onClick={this.searchProduct} variant="outline-secondary">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div>
                    {searchResult}
                    <div style={{paddingBottom:'75px'}}></div>
                </div>
            </div>
        );
    }
}

export default AdminProductManage;