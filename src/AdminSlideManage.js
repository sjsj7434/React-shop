import React, { Component, Fragment } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import MainSlides from './MainSlides';
import { Col, Row, Image, Button, Form } from "react-bootstrap";

class AdminSlideManage extends Component{
    constructor(){
        super();

        this.state = {
            priority : null,
            show_slide : null,
            render : <></>,
            slide : <MainSlides/>,
            imageList : <></>,
            preview : <></>
        }

        this.chageImage = this.chageImage.bind(this);
        this.addMainSlide = this.addMainSlide.bind(this);
        this.getMainSlide = this.getMainSlide.bind(this);
        this.deleteMainSlide = this.deleteMainSlide.bind(this);
        this.udpateMainSlide = this.udpateMainSlide.bind(this);
        this.changeShowSlide = this.changeShowSlide.bind(this);
        this.changePriority = this.changePriority.bind(this);
    }
    
    componentDidMount(){
        this.checkAdminSession();
    }

    async checkAdminSession(){
        const url = '/api/admin/check/session';
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        
        const response = await axios.post(url, header);
        if(response.data.result === true){
            this.getMainSlide();
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

    getMainSlide(){
        const url = '/api/admin/main/slide/get';
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        axios.post(url, header)
        .then((response) => {
            let imageList = [];
            response.data.forEach( (element, index) => {
                imageList.push(
                    <Fragment key={index+'slideGet'}>
                        <div style={{padding:10, margin:5, backgroundColor:'beige'}}>
                            <Row>
                                <Col>
                                    <img alt="slides" src={`/uploadsImgs/${element.image_url}`} width="100"></img>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            {element.image_name}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            priority :
                                        </Col>
                                        <Col>
                                            <input type="number" defaultValue={element.priority} style={{width:"100%"}} onChange={this.changePriority}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            show :
                                        </Col>
                                        <Col>
                                            <label><input type="radio" defaultChecked={element.show_slide === "Y" ? true : false} name={"show_slide"+index} value="Y" onChange={this.changeShowSlide}/>Yes</label>
                                            <label><input type="radio" defaultChecked={element.show_slide === "N" ? true : false} name={"show_slide"+index} value="N" onChange={this.changeShowSlide}/>No</label>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{padding:5}}>
                                <Col>
                                    <Form onSubmit={this.udpateMainSlide}>
                                        <input type="hidden" name="priority" defaultValue={element.priority}/>
                                        <input type="hidden" name="show_slide" defaultValue={element.show_slide}/>
                                        <input type="hidden" name="image_cd" defaultValue={element.image_cd}/>

                                        <Button type="submit" variant='warning' block>UPDATE</Button>
                                    </Form>
                                </Col>
                                <Col>
                                    <Button onClick={this.deleteMainSlide} image_cd={element.image_cd} variant='danger' block>DELETE</Button>
                                </Col>
                            </Row>
                        </div>
                    </Fragment>
                );
            });
            this.setState({
                imageList : []
            })
            this.setState({
                imageList : imageList
            })
        });
    }

    addMainSlide(imageResponse){
        const url = '/api/admin/main/slide/add';
        const params = new URLSearchParams();
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        params.append('image_name', imageResponse.originalname);
        params.append('image_url', imageResponse.filename);
        
        axios.post(url, params, header)
        .then((response) => {
            this.getMainSlide()
            this.setState({
                slide : <></>,
                show : null,
                priority : null
            });
            this.setState({
                slide : <MainSlides/>
            });
        });
    }

    udpateMainSlide(event){
        event.preventDefault();

        const image_cd = event.target.image_cd.value;
        const url = '/api/admin/main/slide/update';
        const params = new URLSearchParams();
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        const show_slide = this.state.show_slide === null ? event.target.show_slide.value : this.state.show_slide;
        const priority = this.state.priority === null ? event.target.priority.value : this.state.priority;
        
        params.append('image_cd', image_cd);
        params.append('show_slide', show_slide);
        params.append('priority', priority);

        axios.post(url, params, header)
        .then((response) => {
            this.getMainSlide()
            this.setState({
                slide : <></>,
                show : null,
                priority : null
            });
            this.setState({
                slide : <MainSlides/>
            });
        });
    }

    deleteMainSlide(event){
        const image_cd = event.target.getAttribute('image_cd');
        const url = '/api/admin/main/slide/delete';
        const params = new URLSearchParams();
        const header = {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };

        params.append('image_cd', image_cd);

        axios.post(url, params, header)
        .then((response) => {
            this.getMainSlide()
            this.setState({
                slide : <></>,
                show : null,
                priority : null
            });
            this.setState({
                slide : <MainSlides/>
            });
        });
    }

    chageImage(event){
        const imageFile = event.target.files[0];
        if(imageFile.size > 5000000){
            alert('image is over size, (max is 5 MB)')
        }
        else{
            const formDataForImage = new FormData();
            formDataForImage.append('images', imageFile);
            axios.post("/api/admin/uploadImage", formDataForImage, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                this.addMainSlide(response.data.fileDetail[0]);
                
                let reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onloadend = () => {
                    this.setState({
                        preview : <Image width={'171px'} height={'180px'} src={reader.result} rounded/>
                    });
                }
            });
        }
    }

    changeShowSlide(event){
        this.setState({
            show_slide : event.target.value
        });
    }

    changePriority(event){
        this.setState({
            priority : event.target.value
        });
    }

    render(){
        return(
            <div>
                {this.state.render}
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Manage Slide</h1>
                    <div>
                        <Form style={{padding:10}}>
                            <Form.File
                                accept='.jpg, .png, .jpeg'
                                name='imageFile'
                                onChange={this.chageImage}
                                label="Upload image"
                                data-browse="Find"
                                custom
                            />
                        </Form>
                    </div>
                </div>

                <div>
                    <hr></hr>
                    {this.state.imageList}
                </div>

                <div>
                    <hr></hr>
                    <h2>Preview Slide</h2>
                    {this.state.slide}
                </div>
            </div>
        );
    }
}

export default AdminSlideManage;