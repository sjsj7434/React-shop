import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

const CommonMenuList = [
    'AdminHome'
];
const CommonMenuUrlList = [
    '/admin/main'
];

const ManageMenuList = [
    'Add Product'
    , 'Manage Product'
    , 'Manage Order'
    , 'Manage MainSlide'
    , 'Manage Category'
    , 'Search History'
];
const ManageMenuUrlList = [
    '/admin/product/add'
    , '/admin/product/manage'
    , '/admin/order/manage'
    , '/admin/main/slide/manage'
    , '/admin/category/manage'
    , '/admin/customer/serach/log'
];

export default function TemporaryDrawer() {
    const classes = useStyles();
    let [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
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
                    <ChevronLeftIcon/>
                    <ListItemText primary={'Close'}/>
                </IconButton>
            </div>
            <Divider/>
            <List>
                {CommonMenuList.map((text, index) => (
                    <NavLink
                        to={{
                            pathname : CommonMenuUrlList[index]
                        }}
                        key={text}>
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
            <Divider/>
            <List>
                {ManageMenuList.map((text, index) => (
                    <NavLink
                        to={{
                            pathname : ManageMenuUrlList[index]
                        }}
                        key={text}>
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            <div onClick={toggleDrawer('left', true)}>
                <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
            </div>
            <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
                {list('left')}
            </Drawer>
        </div>
    );
}