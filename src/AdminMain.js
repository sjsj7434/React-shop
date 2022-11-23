import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class AdminMain extends Component{
    constructor(){
        super();
        this.state={
            render : <></>,
            permission : false
        }
    }

    componentDidMount(){
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
                render : <div>You can Manage website in here!</div>,
                permission : true
            })
        }
        else{
            this.setState({
                render : <div><Redirect to="/admin/login"/></div>,
                permission : false
            });
        }
    }
    
    render(){
        if(this.state.permission === true){    
            return(
                <div>
                    <div style={{paddingTop:50, paddingBottom:50}}>
                        <h1>ADMIN PAGE</h1>
                        
                        {this.state.render}
                    </div>
                </div>
            );
        }
        else{
            return(
                this.state.render
            );
        }
        
    }
}

export default AdminMain;