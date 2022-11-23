import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { Row, Col, Button, Form, Modal } from "react-bootstrap";

//다언어 처리
const language = "english";
let languageJson;
if(language === "english"){
    languageJson = require('./resources/languages/english.json');
}
else{
    languageJson = require('./resources/languages/spanish.json');
}
//다언어 처리

class AdminAddProduct extends Component{
    constructor(){
        super();
        this.categoryModalClose = this.categoryModalClose.bind(this);
        this.categoryModalShow = this.categoryModalShow.bind(this);
        this.AddProduct = this.AddProduct.bind(this);
        this.categoryAdd = this.categoryAdd.bind(this);
        this.categoryDelete = this.categoryDelete.bind(this);
        this.callCategoryList = this.callCategoryList.bind(this);
        this.addImage = this.addImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.imageRef = React.createRef();

        this.state={
            inputFileNames : [],
            imageFiles : [],
            fileList : []
        }
    }

    componentDidMount(){
        this.callCategoryList();
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

    callCategoryList(){
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
                selectFormInCategory:
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                            name="category"
                            as="select"
                            className="mr-sm-2"
                            defaultValue={0}>
                                <option key={"Choose"} value={0}>{"Choose..."}</option>
                                {options}
                            </Form.Control>
                            <Form.Text className="text-muted">
                            {languageJson.AdminAddProduct.category}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Add category</Form.Label>
                            <Button block onClick={this.categoryModalShow}>+New</Button>
                            <Form.Text className="text-muted">
                            {languageJson.AdminAddProduct.add_category}
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
            });
        });
    }

    addImage(event){
        let inputFileNames = [];
        for(let index = 0; index < this.imageRef.current.files.length; index++){
            inputFileNames.push(event.target.files[index].name);
            let reader = new FileReader();
            reader.readAsDataURL(this.imageRef.current.files[index]);
            reader.onloadend = () => {
                this.setState( (prevState, props) => (
                    {
                        inputFileNames : prevState.inputFileNames.concat(inputFileNames),
                        imageFiles : this.state.imageFiles.concat(reader.result),
                        fileList : prevState.fileList.concat(this.imageRef.current.files[index])
                    }
                ));
            }
        }
    }

    deleteImage(event){
        const index = event.target.getAttribute("index");
        let deletedInputFileNames = this.state.inputFileNames.filter(imageName => imageName !== this.state.inputFileNames[index]);
        let deletedImageFiles = this.state.imageFiles.filter(imageName => imageName !== this.state.imageFiles[index]);
        let deletedFileList = this.state.fileList.filter(imageFile => imageFile !== this.state.fileList[index]);

        this.setState({
            inputFileNames : deletedInputFileNames,
            imageFiles : deletedImageFiles,
            fileList : deletedFileList
        });
    }

    AddProduct(event){
        event.preventDefault();
        let imageNames = [];
        const formDataForImage = new FormData();

        if(event.target.category.value === '0'){
            alert('Please choose the category of product');
            return;
        }
        if(event.target.product_name.value === ''){
            alert('Please write the name of product');
			return;
        }
		if(event.target.product_desc.value === ''){
			alert('Please write the description of product');
			return;
		}
		if(this.state.fileList.length < 1){
			alert('It Must has IMAGES');
			return;
		}
		
		for(var index = 0; index < this.state.fileList.length; index++){
			formDataForImage.append('images', this.state.fileList[index]);
		}

		const params = new URLSearchParams();
		params.append('category', event.target.category.value);
		params.append('product_name', event.target.product_name.value);
		params.append('product_desc', event.target.product_desc.value);
		params.append('product_stock', event.target.product_stock.value);
		params.append('price', event.target.price.value);
		params.append('product_discount', event.target.product_discount.value);

        this.setState({
            setShowLoadingModal : true
        })

		axios.post("/api/admin/uploadImage", formDataForImage, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then((response) => {
			for(var index = 0; index < response.data.fileDetail.length; index++){
				imageNames.push(response.data.fileDetail[index].filename);
			}

			params.append('product_image', imageNames);

			axios.post("/api/admin/products/insert", params, {
				headers: {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			})
			.then((response) => {
				if(response.status){
					alert('Product Added');

					//Form 내용 비우고, 이미지 비우기
					document.getElementById("addForm").reset();
					this.setState({
						imageFiles:[],
                        setShowLoadingModal : false
					})
				}
			});
		});
    }
    
    categoryModalShow(e){
        this.setState({
            setShowCategoryModal : true
        });
    }
    categoryAdd(e){
        e.preventDefault();
        const url = '/api/product/category/merge';
        const params = new URLSearchParams();
        params.append('category', e.target.category.value);
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header).then((response) => {
            if(response.status){
                this.categoryModalClose();
                this.callCategoryList();
            }
            else{
                alert('ERROR')
            }
        })
    }
    categoryDelete(e){
        const url = '/api/product/category/delete';
        const params = new URLSearchParams();
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, params, header);
    }
    categoryModalClose(){
        this.setState({
            setShowCategoryModal : false
        });
    }

    render(){
        let imagePreview = null;
        let cols= [];
        const imageFiles = this.state.imageFiles;
        if(imageFiles.length !== 0){
            for(var index = 0; index < imageFiles.length; index++){
                cols.push(
                    <Col key={index}>
                        {/* 스크린 크기에 따라서 다른 이미지 크기 */}
                        <img alt='preview' src={imageFiles[index]} width={'90'}/>
                        <p style={{overflow:'hidden', textOverflow:'ellipsis', margin:'0px'}}>
                            {this.state.inputFileNames[index]}
                        </p>
                        <h4>
                            <Button onClick={this.deleteImage} index={index} style={{padding:'0px'}} variant="outline-danger">Delete</Button>
                        </h4>
                    </Col>
                )
            }
            imagePreview = <Row xs={3} style={{padding:'5px'}}> {cols} </Row>
        }

        return(
            <div>
                {this.state.render}
                <div style={{paddingTop:50, paddingBottom:50}}>
                    <h1>Add Product</h1>
                </div>
                <div style={{textAlign:'left'}}>
                    <Form id="addForm" onSubmit={this.AddProduct}>
                        <Modal.Body>
                            <input type='hidden' name='product_image'/>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    {this.state.selectFormInCategory}
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.Group>
                                        <Form.Label>Product name</Form.Label>
                                        <Form.Control type="text" maxLength={100} placeholder="Enter product_name" name='product_name'/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.Group>
                                        <Form.Label>Discount percentage</Form.Label>
                                        <Form.Control type="number" min={0} max={100} defaultValue={0} placeholder="Enter discount percentage" name='product_discount'/>
                                        <Form.Text className="text-muted">
                                        {languageJson.AdminAddProduct.discount_percentage}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Desctiption</Form.Label>
                                        <Form.Control as="textarea" name='product_desc' maxLength={200} placeholder={'Description here...'} rows={3}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.Group>
                                        <Form.Label>Product stock</Form.Label>
                                        <Form.Control type="number" min={0} max={100000000} placeholder="Enter product_stock" name='product_stock'/>
                                        <Form.Text className="text-muted">
                                        {languageJson.AdminAddProduct.product_stock}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.Group>
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type="number" min={0} max={100000000} placeholder="Enter price" name='price'/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{padding:'5px'}}>
                                <Col style={{padding:'5px'}}>
                                    <Form.File 
                                    accept='.jpg, .png, .jpeg'
                                    multiple
                                    ref={this.imageRef}
                                    onChange={this.addImage}
                                    label="Image here"
                                    data-browse="Find"
                                    custom/>
                                </Col>
                            </Row>
                            {imagePreview}
                        </Modal.Body>
                        <div style={{padding:10}}>
                            <Button type='submit' block variant="success">SUBMIT</Button>
                        </div>
                    </Form>
                </div>
                <div>
                    <Modal
                    show={this.state.setShowCategoryModal}
                    onHide={this.categoryModalClose}
                    backdrop="static"
                    keyboard={false}>
                        <div>
                            <form onSubmit={this.categoryAdd}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Category Add</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row style={{padding:'10px'}}>
                                        <Col>Category</Col>
                                        <Col><input type='text' name='category' maxLength={100}/></Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.categoryModalClose}>CLOSE</Button>
                                    <Button type='submit' variant="success">Add</Button>
                                </Modal.Footer>
                            </form>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal
                    show={this.state.setShowLoadingModal}
                    backdrop="static"
                    keyboard={false}>
                        <div>
                            <form onSubmit={this.categoryAdd}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Image Uploading...</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    It could takes some minutes...(1~2 mins)
                                </Modal.Body>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default AdminAddProduct;