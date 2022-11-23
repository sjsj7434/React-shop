import React, { Component } from "react";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

class Pagination extends Component{
    constructor(props){
        super(props);
        this.prevButton = this.prevButton.bind(this);
        this.nextButton = this.nextButton.bind(this);
    }
    
    prevButton(){
        let currentPage = parseInt(document.getElementById('currentPage').innerHTML);
        if((currentPage-1) > 0){
            currentPage--;
            document.getElementById('currentPage').innerHTML = currentPage;
            this.props.changeLimit((currentPage-1)*10, currentPage);
        }
    }
    nextButton(){
        let currentPage = parseInt(document.getElementById('currentPage').innerHTML);
        if((currentPage+1) <= this.props.numberForPagination){
            currentPage++;
            document.getElementById('currentPage').innerHTML = currentPage;
            this.props.changeLimit((currentPage-1)*10, currentPage);
        }
    }

    render(){
        return(
            <div>
                <Row xs={5} style={{width:'100%', margin:0, padding:'10px'}}>
                    <Button onClick={this.prevButton}>Prev</Button>
                    <div id={'currentPage'}>{this.props.currentPage}</div>
                    <div>{'/'}</div>
                    <div id={'lastPage'}>{this.props.numberForPagination}</div>
                    <Button onClick={this.nextButton}>Next</Button>
                </Row>
            </div>
        );     
    }
}

export default Pagination;