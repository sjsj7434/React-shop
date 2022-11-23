import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './resources/css/HamburgerMenu.css';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { slide as Menu } from 'react-burger-menu';

class HamburgerMenu extends Component{
  constructor(){
    super();
    this.menuClicked = this.menuClicked.bind(this);
    this.menuOpenClose = this.menuOpenClose.bind(this);
    this.state = {
      opened : false
    }
  }
  menuClicked(e){
    document.body.style.overflow = 'unset';    
    this.setState({
      opened : false
    })
  }
  menuOpenClose(){    
    this.setState({
      opened : !this.state.opened
    })
    if(this.state.opened){   
      document.body.style.overflow = 'unset';
    }
    else{
      document.body.style.overflow = 'hidden';
    }    
  }

  render(){
    return(
      <Navbar fixed="top" style={{paddingLeft:0, paddingRight:0, paddingTop:0, backgroundColor:"white"}}>
        <Nav className="mr-auto">
          <Nav.Item>
            <Menu
              className="bm-menu"
              onOpen={this.menuOpenClose} onClose={this.menuOpenClose}
              isOpen={this.state.opened}
              width={'85%'}
              disableCloseOnEsc disableAutoFocus disableOverlayClick>
              <NavLink to="/pw/" onClick={this.menuClicked} menuinfo='home'>HOME</NavLink>
              <NavLink to={{pathname : '/pw/lipstick'}} onClick={this.menuClicked} menuinfo='lips'>LIPSTICK</NavLink>
              <NavLink to={{pathname : '/pw/eyeshadow'}} onClick={this.menuClicked} menuinfo='eyes'>EYESHADOW</NavLink>
              <NavLink to={'/pw/lotion'} onClick={this.menuClicked} menuinfo='lotion'>LOTION</NavLink>
              <NavLink to={'/AdminLogin'} onClick={this.menuClicked} menuinfo='lotion'>MustRemove</NavLink>
            </Menu>
          </Nav.Item>
          <Nav.Item className='companyName' style={{width: (window.innerWidth)}}>
          <p style={{marginBlockStart:"10px", marginBlockEnd:"0px"}}>PUPPLE & WHITE</p>
          </Nav.Item>
        </Nav>
      </Navbar>
    );
  }
}

export default HamburgerMenu;