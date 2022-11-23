import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import logo from './resources/images/logo.svg';

class StickTopMenu extends Component{
	render(){
		function alertClicked() {
			alert('You clicked the third ListGroupItem');
		}
		return(
			<Navbar expand="lg" bg="light" fixed="top">
				<div>
					<Nav activeKey="/home">
						<Nav.Item>
							<Navbar.Brand href="#">
								<img alt="logo" src={logo} width="30" height="30" className="d-inline-block align-top" />{' '}
								Pupple & White
							</Navbar.Brand>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="link-1">Link</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="link-2">test</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="disabled" disabled>
								Disabled
							</Nav.Link>
						</Nav.Item>
					</Nav>
					
					<Nav activeKey="/home">
						<Nav.Item>
							<Accordion defaultActiveKey="0">
								<Card>
									<Accordion.Toggle as={Card.Header} eventKey="1">
										CATEGORY
									</Accordion.Toggle>
									<Accordion.Collapse eventKey="1">
										<Card.Body>
												<Row>
													<Col>
														<ListGroup horizontal>
															<ListGroup.Item>
																<h2>Yves Saint Laurent</h2>
																<ListGroup>
																	<ListGroup.Item action>
																		Yves Saint Laurent
																	</ListGroup.Item>
																	<ListGroup.Item action>
																		Coco Chanel
																	</ListGroup.Item>
																	<ListGroup.Item action onClick={alertClicked}>
																		Louis Vuitton
																	</ListGroup.Item>
																</ListGroup>
															</ListGroup.Item>
															<ListGroup.Item action>
																Coco Chanel
															</ListGroup.Item>
															<ListGroup.Item action onClick={alertClicked}>
																Louis Vuitton
															</ListGroup.Item>
														</ListGroup>
													</Col>
													<Col>
														<ListGroup>
															<ListGroup.Item action>
																Yves Saint Laurent
															</ListGroup.Item>
															<ListGroup.Item action>
																Coco Chanel
															</ListGroup.Item>
															<ListGroup.Item action onClick={alertClicked}>
																Louis Vuitton
															</ListGroup.Item>
														</ListGroup>
													</Col>
													<Col>
														<ListGroup>
															<ListGroup.Item action>
																Yves Saint Laurent
															</ListGroup.Item>
															<ListGroup.Item action>
																Coco Chanel
															</ListGroup.Item>
															<ListGroup.Item action onClick={alertClicked}>
																Louis Vuitton
															</ListGroup.Item>
														</ListGroup>
													</Col>
												</Row>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
							</Accordion>
						</Nav.Item>
					</Nav>
				</div>        
			</Navbar>      
		);
	}
}

export default StickTopMenu;