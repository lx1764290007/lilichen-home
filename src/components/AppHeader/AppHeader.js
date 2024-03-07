import React, {useRef} from 'react';
import {alpha, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {AvatarDefault} from "../Avatar/Avatar";
import vcSubscribePublish from "vc-subscribe-publish";
import {InputAdornment} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        height: 68
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
}));

export const HomePageAppBar = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState("");
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const ref = useRef(null);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const onSubmit = (event)=> {
        const value = ref.current.querySelector("input")?.value;
        vcSubscribePublish.public("appOnSearch", value);
        event.preventDefault();
    }
    const onClearHandler = ()=> {
        setValue("");
        const _input = ref.current.querySelector("input");
        if(_input) {
            _input.value = "";
            vcSubscribePublish.public("appOnSearch", "");
        }
    }
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <div className={classes.sectionDesktop} style={{marginRight: 5}}>
                        <IconButton
                            edge="start"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            {props.icon}
                        </IconButton>
                    </div>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {props.title}
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <form onSubmit={onSubmit}>
                        <InputBase
                            ref={ref}
                            placeholder={props.placeholder || "根据名称搜索…"}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onInput={(event)=> setValue(event.target.value)}
                            inputProps={{'aria-label': 'search'}}
                            endAdornment={
                                value && <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear input value"
                                        style={{color: '#fff'}}
                                        onClick={onClearHandler}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        </form>
                    </div>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        {/*<IconButton*/}
                        {/*    edge="end"*/}
                        {/*    aria-label="account of current user"*/}
                        {/*    aria-controls={menuId}*/}
                        {/*    aria-haspopup="true"*/}
                        {/*    onClick={handleProfileMenuOpen}*/}
                        {/*    color="inherit"*/}
                        {/*>*/}
                        {/*    <AccountCircle/>*/}
                        {/*</IconButton>*/}
                        <AvatarDefault aria-controls={menuId} onClick={handleProfileMenuOpen} />
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
