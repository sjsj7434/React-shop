import React, { Component } from "react";

import MainSlides from './MainSlides';
import MainNewProduct from './MainNewProduct';
import MainDiscountProduct from './MainDiscountProduct';

class Home extends Component{
    render(){
        return(
            <div>
                <MainSlides/>

                <MainNewProduct/>

                <MainDiscountProduct/>
            </div>
        );
    }
}

export default Home;