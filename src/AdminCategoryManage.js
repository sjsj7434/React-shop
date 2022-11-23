import React, { Component } from "react";
import axios from 'axios';

import { Form, Button } from "react-bootstrap";

class Register extends Component{
    constructor(){
        super();
        this.state = {
            registerResult:<div></div>,
            selectFormInCategory: <div>{'Loading...'}</div>
        }
        this.callCategoryList = this.callCategoryList.bind(this);
        this.categoryAdd = this.categoryAdd.bind(this);
        this.categoryDelete = this.categoryDelete.bind(this);
        this.categoryUpdate = this.categoryUpdate.bind(this);
        
        this.callCategoryList();
    }

    callCategoryList(){
        const url = '/api/product/category/select';
        const params = new URLSearchParams();
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        axios.post(url, params, header).then((response) => {
            if(response.data.length > 0){
                let categoryCards = [];

                for(let index = 0; index < response.data.length; index++){
                    categoryCards.push(
                        <Form style={{margin : '25px', padding : '5px', border : '2px dashed'}} key={response.data[index].category_id}>
                            <h5>Category {index + 1}</h5>
                            category name<Form.Control type="text" name={"category"+response.data[index].category_id} defaultValue={response.data[index].category} placeholder="category..." maxLength={20} style={{marginBottom : '5px'}}/>
                            order priority(0 is first)<Form.Control type="number" name={"menu_rank"+response.data[index].category_id} defaultValue={response.data[index].menu_rank} placeholder="order priority" max={999999} style={{marginBottom : '5px'}}/>
                            <div>
                                <Button onClick={this.categoryUpdate} category_id={response.data[index].category_id} variant="warning" block>UPDATE</Button>
                                <Button onClick={this.categoryDelete} category_id={response.data[index].category_id} variant="danger" block>DELETE</Button>
                            </div>
                        </Form>
                    );
                };
    
                this.setState({
                    selectFormInCategory : <div>{categoryCards}</div>
                });
            }
            else{
                this.setState({
                    selectFormInCategory : <div>{'No category now...'}</div>
                });
            }
        });
    }
    categoryAdd(event){
        event.preventDefault();
        if(event.target.category.value === ''){
            alert("Write Category");
            return;
        }
        const url = '/api/product/category/merge';
        const params = new URLSearchParams();
        params.append('category', event.target.category.value);
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        this.setState({
            selectFormInCategory : <div>{'Loading...'}</div>
        });
        axios.post(url, params, header).then((response) => {
            if(response.status){
                this.callCategoryList();
                alert("ADDED");
            }
            else{
                alert('ERROR')
            }
        })
    }
    categoryUpdate(event){
        let category = document.getElementsByName("category" + event.target.getAttribute("category_id"))[0];
        let menu_rank = document.getElementsByName("menu_rank" + event.target.getAttribute("category_id"))[0];
        if(menu_rank > 999999){
            menu_rank = 999999;
        }
        const url = '/api/product/category/merge';
        const params = new URLSearchParams();
        params.append('category', category.value);
        params.append('menu_rank', menu_rank.value);
        params.append('category_id', event.target.getAttribute("category_id"));
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header).then((response) => {
            if(response.status){
                this.callCategoryList();
                alert("UPDATED");
            }
            else{
                alert('ERROR')
            }
        });
    }
    categoryDelete(event){
        const url = '/api/product/category/delete';
        const params = new URLSearchParams();
        params.append('category_id', event.target.getAttribute("category_id"));
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header).then((response) => {
            if(response.status){
                this.callCategoryList();
                alert("DELETED");
            }
            else{
                alert('ERROR')
            }
        });
    }

    render(){
        return(
            <div>
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Category Manage</h1>
                    {this.state.registerResult}
                </div>
                
                <div style={{border : '3px solid #ccafff'}}>
                    <Form onSubmit={this.categoryAdd} style={{padding:15}}>
                        <h3>Category Add</h3>
                        <Form.Control type="text" name="category" placeholder="category..." maxLength={20}/><br/>
                        <Button type='submit' variant="success" size="lg" block>Add</Button>
                    </Form>
                </div>

                <div style={{marginTop : '10px', border : '3px solid #ccafff'}}>
                    {this.state.selectFormInCategory}
                </div>
            </div>
        );
    }
}

export default Register;