import React, { Component } from "react";
import axios from "axios";

import './resources/css/Slides.css';

import { Carousel, Row, Col } from "react-bootstrap";

class MainSlides extends Component{
    componentDidMount(){
        const url = '/api/admin/main/slide/show';
        const params = new URLSearchParams();
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header)
        .then((response) => {
            if(response.status === 200){
                this.setState({
                    images : response.data
                })
            }
            else{
                alert(`Error : ${response.status}`);
            }
        })
    }

    render(){
        let imageArray = [];

        if(this.state !== undefined && this.state !== null){
            this.state.images.map((image, index)=>{
                return(
                    imageArray.push(
                        <Carousel.Item key={index}>
                            <img alt={image.image_name} src={`/uploadsImgs/${image.image_url}`} style={{ maxHeight: "18rem", minHeight: "18rem" }}/>
                        </Carousel.Item>
                    )
                );
            });
        }
        
        return(
            <Row>
                <Col>
                    <Carousel className="slides" style={{ height : "18rem" }}>
                        {imageArray}
                    </Carousel>
                </Col>
            </Row>
        );
    }
}

export default MainSlides;