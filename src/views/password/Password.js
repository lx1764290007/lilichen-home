import React, {useMemo, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Context} from "../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import Button from "@material-ui/core/Button";
import {PASSWORD_REGEX} from "../../lib/static";
import {fetchUserUpdatePwd} from "../../lib/request/user";
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1)
    },
    form: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexFlow: 'column nowrap'
    }
}));
const USER = window.localStorage.getItem("info")? JSON.parse(window.localStorage.getItem("info"))?.account:"";
export const UpdatePassword = () => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const location = useLocation();
    const p = useMemo(()=> location.search.replace("?account=",""), [location]);
    const onSubmit = (event) => {
        event.preventDefault();
        if (password !== password2) {
            vcSubscribePublish.public("onErrorMessage", "两次密码不一样~")
        } else if (PASSWORD_REGEX.test(password) === false) {
            vcSubscribePublish.public("onErrorMessage", "密码需要包含特殊字符，字母，数字，至少包含两种且长度是6-20")
        } else {
            fetchUserUpdatePwd({
                password,
                account: p||USER
            }).then(()=> {
                vcSubscribePublish.public("onMessage", "已保存");
                vcSubscribePublish.public("onNavigate", -1);
            })
        }
    }
    return (
        <div className={`${classes.root} ${mc.mStyle}`} {...mc.mobileHook}>
            <form className={classes.form} noValidate autoComplete="off" onSubmit={onSubmit}>
                <TextField type="password"
                           onInput={(event) => setPassword(event.target.value)}
                           variant="filled"
                           required
                           fullWidth
                           maxLengh={20}
                           label={"新密码"}/>
                <TextField type="password"
                           onInput={(event) => setPassword2(event.target.value)}
                           variant="filled"
                           required
                           maxLength={20}
                           fullWidth
                           label={"重复密码"}/>
                <Button type="submit"
                        style={{marginTop: 30}}
                        fullWidth color={"primary"} variant={"contained"}>保存</Button>
            </form>
        </div>
    )
}

