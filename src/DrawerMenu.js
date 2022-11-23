import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
	list: {
		width: window.innerWidth * 0.9,
	},
	fullList: {
		width: 'auto',
	},
});

export default function TemporaryDrawer() {
	let [checkSession, setCheckSession] = useState(false);
	let [categoryList, setCategoryList] = useState(['']);
	let [userMenu, setUserMenu] = useState([{name : 'Home', url : 'home'}]);

	useEffect( () => {
		//로그인 여부에 따라 보이는 메뉴를 다르게 함
		const url = '/api/customer/check/session';
		const header = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(url, header)
		.then((response) => {
			if (response.data.result === true) {
				setUserMenu([{name : 'Home', url : 'home'}, {name : 'My Page', url : 'customer/mypage'}]);
				setCheckSession(true);
			}
			else{
				setCheckSession(false);
			}
		});
	}, [checkSession]);

	useEffect( () => {
		//상품 메뉴를 불러오는 함수
		const url = '/api/product/category/select';
		const params = new URLSearchParams();
		const header = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(url, params, header)
		.then((response) => {
			let arr = [];
			for(let i = 0; i < response.data.length; i++){
				arr.push(response.data[i]);
			}
			setCategoryList(arr)
		});
	}, []);

	const classes = useStyles();
	let [state, setState] = useState({
		top: false,
		left: false,
		bottom: false,
		right: false
	});

	const toggleDrawer = (anchor, open) => (event) => {
		setState({ ...state, [anchor]: open });
		return;
	};

	const list = (anchor) => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom',
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}>
			<div className={classes.drawerHeader}>
				<IconButton>
					<ChevronLeftIcon />
					<ListItemText primary={'Close'} />
				</IconButton>
			</div>
			<Divider />
			<List>
				{userMenu.map((item, index) => (
					<NavLink
						to={{
							pathname: `/${item.url}`
						}}
						key={'userMenu' + item.name}>
						<ListItem button>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItem>
					</NavLink>
				))}
			</List>
			<Divider/>
			<List>
				{categoryList.map((item, index) => (
					<NavLink
						to={{
							pathname: `/product/productList/${item.url}`
						}}
						key={'productList' + item.category}>
						<ListItem button>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={item.category} />
						</ListItem>
					</NavLink>
				))}
			</List>
		</div>
	);

	return (
		<div>
			<div onClick={toggleDrawer('left', true)}>
				<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
				</svg>
			</div>
			<Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
				{list('left')}
			</Drawer>
		</div>
	);
}