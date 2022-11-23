import React, { Component } from "react";

import Carousel from "react-bootstrap/Carousel";

class Slides extends Component{
    render(){
        let imagesArray = [];
        if(this.props.productImages.split(',').length > 1){
            for(var index = 0; index < this.props.productImages.split(',').length; index++){
                imagesArray.push(
                    <Carousel.Item key={index}>
                        <img alt='product' src={"/uploadsImgs/"+this.props.productImages.split(',')[index]}
                            style={{width : window.innerWidth, height : window.screen.height/2}}/>
                    </Carousel.Item>
                )
            }
        }
        else if(this.props.productImages.split(',').length === 1){
            imagesArray.push(
                <Carousel.Item key={0}>
                    <img alt='product' src={"/uploadsImgs/"+this.props.productImages}
                        style={{width : window.innerWidth, height : window.screen.height/2}}/>
                </Carousel.Item>
            )
        }

        return(            
            <Carousel>
                {imagesArray}
            </Carousel>
        );
    }
}

export default Slides;