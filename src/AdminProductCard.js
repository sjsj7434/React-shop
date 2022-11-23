import React, { Component } from "react";
import axios from 'axios';

import './resources/css/ProductCard.css';

import { Card, Form, Modal, Button, Row, Col, Badge } from "react-bootstrap";

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

class AdminProductCard extends Component{
    constructor(props){
        super();
        
        this.state={
            thumbNail : `/uploadsImgs/${props.product.product_image.split(',')[0]}`,
            category : props.product.category,
            originalImageNameList : [],
            fileList : [],
            imageFiles : []
        }

        this.updateModalClose = this.updateModalClose.bind(this);
        this.updateModalShow = this.updateModalShow.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.callCategoryList = this.callCategoryList.bind(this);
        this.setPreviewImage = this.setPreviewImage.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.addImage = this.addImage.bind(this);
        this.deleteOriginalImage = this.deleteOriginalImage.bind(this);
        this.deleteUpdateImage = this.deleteUpdateImage.bind(this);
        
        this.imageRef = React.createRef();
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
					<option key={index} value={response.data[index].url}>{response.data[index].category}</option>
				);
            };

            this.setState({
                selectFormInCategory:
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                            onChange={this.changeCategory}
                            name='category'
                            as="select"
                            className="mr-sm-2"
                            defaultValue={this.props.product.category}>
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

    changeCategory(event){
        this.setState({
            category:event.target.value
        })
    }

    setPreviewImage(imageNames){//업데이트 모달 보여줄 때 썸네일 띄우자
        this.setState({
            originalImageNameList : imageNames,
            imageFiles : [],
            fileList : []
        });
    }

    deleteProduct(){
        if(window.confirm('Really Delete?')){
            const params = new URLSearchParams();
            params.append('product_code', this.props.product.product_code)

            axios.post("/api/admin/products/delete", params, {
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                if(response.status){
                    alert('Product deleted');
                    this.props.workPagination();
                }
            });
        }
    }

    updateModalClose(){
        this.setState({
            setShowUpdate : false
        })
    }
    updateModalShow(){
        //이미지를 불러오고 나서 product_image에서 삭제하고, 새로 업로드하면 뒤에 추가한다.
        //지금 이미지 업로드가 다시하면 input 값이 초기화되는데 만약 뒤에 추가식으로 한다면?
        //20201207
        //input에서 이미지 이름만 삭제하면 안뜨잖아!
        const imageNames = this.props.product.product_image.split(',');

        this.callCategoryList();
        this.setPreviewImage(imageNames);        
        this.setState({
            setShowUpdate : true
        });
    }

    addImage(event){
        //let inputFileNames = this.state.originalImageNameList;
        for(let index = 0; index < this.imageRef.current.files.length; index++){
            //inputFileNames.push(event.target.files[index].name);
            let reader = new FileReader();
            reader.readAsDataURL(this.imageRef.current.files[index]);
            reader.onloadend = () => {
                this.setState( (prevState, props) => (
                    {
                        imageFiles : prevState.imageFiles.concat(reader.result),
                        fileList : prevState.fileList.concat(this.imageRef.current.files[index])
                    }
                ));
            };
        };
    }

    deleteOriginalImage(event){
        const index = event.target.getAttribute("index");
        let deletedOriginalImageNameList = this.state.originalImageNameList.filter(imageName => imageName !== this.state.originalImageNameList[index]);

        this.setState({
            originalImageNameList : deletedOriginalImageNameList
        });
    }
    
    deleteUpdateImage(event){
        const index = event.target.getAttribute("index");
        let deletedImageFiles = this.state.imageFiles.filter(imageName => imageName !== this.state.imageFiles[index]);
        let deletedFileList = this.state.fileList.filter(imageFile => imageFile !== this.state.fileList[index]);

        this.setState({
            imageFiles : deletedImageFiles,
            fileList : deletedFileList
        });
    }

    updateProduct(event){
        event.preventDefault();//기본 동작 방지
        document.getElementById("submitButton").disabled = true;

        if(event.target.category.value === '0'){
            //상품 카테고리 선택 필요
            alert('Please choose the category of product');
        }
        else{
            const url = '/api/admin/products/update';
            const header = {
                headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
            const params = new URLSearchParams();
            params.append('category', this.state.category);
            params.append('product_code', event.target.product_code.value);
            params.append('product_name', event.target.product_name.value);
            params.append('product_stock', event.target.product_stock.value);
            params.append('product_desc', event.target.product_desc.value);
            params.append('price', event.target.price.value);
            params.append('product_discount', event.target.product_discount.value);
            
            let imageNames = [];
            for(let index = 0; index < this.state.originalImageNameList.length; index++){
                //원래 등록된 이미지 이름들을 넣어줌
                imageNames.push(this.state.originalImageNameList[index]);
            }

            const formDataForImage = new FormData();

            if(this.state.fileList.length === 0 && this.state.originalImageNameList.length === 0){
                //상품의 이미지가 필요함
                alert('It Must has IMAGES');
                document.getElementById("submitButton").disabled = false;
            }
            else{
                for(var index = 0; index < this.state.fileList.length; index++){
                    //이미지를 서버에 업로드하기위해 images 라는 이름으로 fileList 객체를 서버에 넘겨줌
                    formDataForImage.append('images', this.state.fileList[index]);
                }
                axios.post("/api/admin/uploadImage", formDataForImage, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    for(var index = 0; index < response.data.fileDetail.length; index++){
                        //새로 등록한 이미지의 이름을 넣어줌
                        imageNames.push(response.data.fileDetail[index].filename);
                    }
                    params.append('product_image', imageNames);

                    axios.post(url, params, header)
                    .then((response) => {
                        this.props.workPagination();//페이징을 위한 함수
                        this.updateModalClose();//모달 닫기
                    })
                    .catch((error) => {
                        alert("Error...");
                        document.getElementById("submitButton").disabled = false;
                    });
                });
            }
        }
    }

    render(){
        let imagePreview = null;
        let cols= [];
        const originalImageNameList = this.state.originalImageNameList;
        const imageFiles = this.state.imageFiles;
        if(originalImageNameList.length !== 0){
            for(let index = 0; index < originalImageNameList.length; index++){
                cols.push(
                    <Col key={originalImageNameList[index] + index}>
                        <img width={'90vw'} alt={originalImageNameList[index]} src={`/uploadsImgs/${originalImageNameList[index]}`}/>
                        <p style={{overflow:'hidden', textOverflow:'ellipsis', marginBottom:'5px'}}>{originalImageNameList[index]}</p>
                        <Button onClick={this.deleteOriginalImage} index={index} style={{padding:'0px'}} variant="outline-danger">Delete</Button>
                    </Col>
                );
            };
        }
        if(imageFiles.length !== 0){
            for(let index = 0; index < imageFiles.length; index++){
                cols.push(
                    <Col key={imageFiles[index] + index}>
                        <img width={'90vw'} alt={imageFiles[index]} src={imageFiles[index]}/>
                        <p style={{overflow:'hidden', textOverflow:'ellipsis', marginBottom:'5px'}}>{'update '+index}</p>
                        <Button onClick={this.deleteUpdateImage} index={index} style={{padding:'0px'}} variant="outline-danger">DeleteUp</Button>
                    </Col>
                );
            };
        }
        imagePreview = <Row xs={3} style={{padding:'5px'}}> {cols} </Row>

        //Badge 설정
        const discountPercentage = this.props.product.product_discount;
        let howManyDaysAgo = new Date();
        howManyDaysAgo.setDate(howManyDaysAgo.getDate() - 7);
        let product_added_date = new Date(this.props.product.product_added_date);

        let newBadge = "";
        let discountBadge = "";
        let price = "";

        if(product_added_date > howManyDaysAgo){
            newBadge = (
                <span><Badge variant="danger">New</Badge>{' '}</span>
            );
        }

        if(discountPercentage > 0){
            const discountedPrice = parseInt(this.props.product.price * ((100 - discountPercentage)/100));
            discountBadge = (
                <span><Badge variant="warning">{discountPercentage} %</Badge></span>
            );
            price = (
                <>
                    <span className="no_discount_price">{this.props.product.price}</span>       
                    <span className="discount_price">{discountedPrice} cop</span>
                </>
            );
        }
        else{
            price = (
                <>
                    <span className="normal_price">{this.props.product.price} cop</span>
                </>
            );
        }

        return(
            <div>
                <div>
                    <Col style={{padding:'1px'}}>
                        <Card className="productCard">
                            <Card.Img src={this.state.thumbNail}/>
                            <Card.Body>
                                {newBadge}
                                {discountBadge}
                                <Card.Title className="cardText">{this.props.product.product_name}</Card.Title>
                                <Card.Text className="cardText">
                                    {this.props.product.product_desc}
                                </Card.Text>
                                <Card.Text className="cardText">
                                    {price}
                                </Card.Text>
                                <Row xs={2}>
                                    <Col style={{padding:'2px'}}>
                                        <Button block variant="warning" onClick={this.deleteProduct}>Delete</Button>
                                    </Col>
                                    <Col style={{padding:'2px'}}>
                                        <Button block onClick={this.updateModalShow}>Edit</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </div>
                
                {/* 여기부터 모달 영역 */}
                <div>
                    <Modal
                    show={this.state.setShowUpdate}
                    onHide={this.updateModalClose}
                    backdrop="static"
                    keyboard={false}>
                        <Form onSubmit={this.updateProduct}>
                            <Modal.Header closeButton>
                                <Modal.Title>EDIT</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input type='hidden' name='product_code' defaultValue={this.props.product.product_code}></input>
                                <input type='hidden' name='category' defaultValue={this.props.product.category}></input>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        {this.state.selectFormInCategory}
                                    </Col>
                                </Row>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        <Form.Group>
                                            <Form.Label>Product name</Form.Label>
                                            <Form.Control type="text" name='product_name' maxLength={100} placeholder="Enter product_name" defaultValue={this.props.product.product_name}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        <Form.Group>
                                            <Form.Label>Discount percentage</Form.Label>
                                            <Form.Control type="number" min={0} max={100} defaultValue={this.props.product.product_discount} placeholder="Enter discount percentage" name='product_discount'/>
                                            <Form.Text className="text-muted">
											{languageJson.AdminAddProduct.discount_percentage}
											</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea" name='product_desc' maxLength={200} placeholder="Description here..." rows={3} defaultValue={this.props.product.product_desc}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
								<Row style={{padding:'5px'}}>
									<Col style={{padding:'5px'}}>
										<Form.Group>
											<Form.Label>Stock</Form.Label>
											<Form.Control type="number" name='product_stock' min={0} max={100000000} placeholder="Enter product_stock" defaultValue={this.props.product.product_stock}/>
											<Form.Text className="text-muted">
											{languageJson.AdminAddProduct.product_stock}
											</Form.Text>
										</Form.Group>
									</Col>
								</Row>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        <Form.Group>
											<Form.Label>price</Form.Label>
											<Form.Control type="number" name='price' min={0} max={100000000} placeholder="Enter price" defaultValue={this.props.product.price}/>
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
                                        label="Upload image"
                                        data-browse="Find"
                                        custom/>
                                    </Col>
                                </Row>
                                <Row style={{padding:'5px'}}>
                                    <Col style={{padding:'5px'}}>
                                        <Button variant="secondary" onClick={this.updateModalClose} block>CLOSE</Button>
                                    </Col>
                                    <Col style={{padding:'5px'}}>
                                        <Button id="submitButton" type='submit' variant="success" block>SUBMIT</Button>
                                    </Col>
                                </Row>
                                {imagePreview}
                            </Modal.Body>
                        </Form>
                    </Modal>
                </div>
                {/* 여기까지 모달 영역 */}
            </div>
        );
    }
}

export default AdminProductCard;