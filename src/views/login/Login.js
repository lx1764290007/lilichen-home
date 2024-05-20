import React, {useRef, useState} from 'react';
import {Context} from '../../App';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {fetchLogin} from "../../lib/request/login";
import {LOCAL_STORAGE_USER} from "../../lib/static";
import vcSubscribePublish from "vc-subscribe-publish";
import {useMount} from "ahooks";
import {AvatarDefault} from "../../components/Avatar/Avatar";
import IconButton from "@material-ui/core/IconButton";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import {Popover} from "@material-ui/core";

const IMAGES = [require("../../assets/cat.jpg"), require("../../assets/cat2.jpg"), require("../../assets/dog.jpg"), require("../../assets/dog2.jpg"), require("../../assets/dog3.jpg")];
const RANDOM_NUMBER = Math.floor(Math.random() * IMAGES.length);
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "1ch",
        '& > *': {
            margin: theme.spacing(2),
            width: '30ch',
        },
    },
    img: {
        width: "16ch",
        display: "inline-block",
        height: "auto",
        margin: "0 calc(50% - 8ch)"
    },
    helpIcon: {
        color: "#fff"
    },
    typography: {
        padding: theme.spacing(2),
    },
    p: {
        lineHeight: '1.5em',
        letterSpacing: 1
    }
}));

export const LoginAppBarLeft = () => {
    return <div>
        <AvatarDefault/>
    </div>
}
export const LoginAppBarRight = () => {
    const classesRoot = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'login-popover-help' : undefined;
    return <React.Fragment>
        <IconButton onClick={handleClick} title={"无法登陆？"}
                    className={classesRoot.helpIcon}><LiveHelpIcon/></IconButton>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
                <div className={classesRoot.typography}>
                    <p className={classesRoot.p}>忘记登录密码？？</p>
                    <p className={classesRoot.p}>联系管理员重置你的密码！！！</p>
                </div>
        </Popover>
    </React.Fragment>
}
export const Login = () => {
    const mc = React.useContext(Context);
    const classesRoot = useStyles();
    const accountValue = useRef('preview');
    const passwordValue = useRef('preview');
    const [accountErrorText, setAccountErrorText] = useState("");
    const [passwordErrorText, setPasswordErrorText] = useState("");
    useMount(() => {
        if (document.cookie) {
            vcSubscribePublish.public("onNavigate", "/");
        }
    })
    const onSubmit = (event) => {

        const accountVal = accountValue.current.querySelector("input").value,
            pwdVal = passwordValue.current.querySelector("input").value;
        if (!accountVal) {
            setAccountErrorText("需要输入账号！！");
        } else {
            setAccountErrorText("");
        }
        if (!pwdVal) {
            setPasswordErrorText("需要输入密码~~！！")
        } else {
            setPasswordErrorText("");
        }
        if (accountVal && pwdVal) {
            fetchLogin({
                account: accountVal,
                password: pwdVal
            }).then((res) => {
                if(res){
                    window.localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(res.data));
                    vcSubscribePublish.public("onNavigate", "/");
                }
            })
        }
        event.preventDefault();
    }
    return (
        <div className={mc.mStyle} {...mc.mobileHook}>
            <img src={IMAGES[RANDOM_NUMBER]} alt={"funny"} className={classesRoot.img}/>
            <form className={classesRoot.root} autoComplete="off" onSubmit={onSubmit}>
                <TextField error={Boolean(accountErrorText)} ref={accountValue} label="账号"
                           helperText={accountErrorText}
                           variant="outlined"/>
                <TextField type={"password"} error={Boolean(passwordErrorText)} ref={passwordValue} label="密码"
                           helperText={passwordErrorText}
                           variant="outlined"/>
                <Button type={"submit"} size="large" variant="contained" color="primary">登 录</Button>
            </form>
        </div>
    )
}

