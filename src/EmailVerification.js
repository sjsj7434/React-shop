import React, { Component } from "react";
import axios from 'axios';

class EmailVerification extends Component{
	constructor(){
		super();

		this.state = {
			verify: "wait",
			message: "Please wait..."
		}
	}
	componentDidMount(){
		const params = new URLSearchParams();
		params.append('id', this.props.match.params.id);
        params.append('token', this.props.match.params.token);

		axios.post('/api/email/verification', params,{
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
			this.setState({
				verify: response.data.verify,
				message: response.data.message
			})
        });
	}
	render(){
		if(this.state.verify === "wait"){
			return(
				<div>
					<h1>{this.state.message}</h1>
				</div>
			);
		}
		else if(this.state.verify === true){
			return(
				<div>
					<h1>{this.state.message}</h1>
					<h2>you can close this page!</h2>
				</div>
			);
		}
		else{
			return(
				<div>
					<h1>{this.state.message}</h1>
					<h2>Please Ask to shop manager</h2>
				</div>
			);
		}		
	}
}

export default EmailVerification;