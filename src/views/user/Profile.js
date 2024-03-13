import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Context} from "../../App";
import EditIcon from '@material-ui/icons/Edit';
import vcSubscribePublish from "vc-subscribe-publish";
import Button from "@material-ui/core/Button";
import {fetchUserRegister, fetchUserUpdate} from "../../lib/request/user";
import {FormControlLabel, Switch} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1)
    },
    form: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexFlow: 'column nowrap'
    },
    textField: {
        margin: theme.spacing(1, 0)
    }
}));
const USER = window.localStorage.getItem("info") ? JSON.parse(window.localStorage.getItem("info")) : {};
export const Profile = (props) => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [editState, setEditState] = useState(props.editState || false);
    const [obj, setObj] = useState(props.editState? {}:USER);
    const [password, setPassword] = useState("");
    const [root, setRoot] = useState(false);
    useEffect(() => {
        vcSubscribePublish.subscribe("profile-edit-state-change", (val) => {
            setEditState(val[0])
        });
        return () => vcSubscribePublish.unsubscribe("profile-edit-state-change");
    })
    const onSubmit = (event) => {
        event.preventDefault();
        if (props.editState) {
            if (obj.name && obj.account && password) {
                fetchUserRegister({
                    name: obj.name,
                    password,
                    account: obj.account,
                    root,
                    remark: obj.remark
                }).then(()=> {
                    vcSubscribePublish.public("onNavigate", -1);
                })
            } else {
                vcSubscribePublish.public("onErrorMessage", "名称、密码、登录名必填～");
            }
        } else {
            if (obj.name && obj.account) {
                fetchUserUpdate(obj).then(() => {
                    vcSubscribePublish.public("onMessage", "已保存");
                    window.localStorage.setItem("info", JSON.stringify(obj));
                })
            } else {
                vcSubscribePublish.public("onErrorMessage", "名称必填～");
            }
        }

    }
    return (
        <div className={`${classes.root} ${mc.mStyle}`} {...mc.mobileHook}>
            <form className={classes.form} noValidate autoComplete="off" onSubmit={onSubmit}>

                <TextField type='text'
                           defaultValue={obj.account}
                           value={obj.account}
                           disabled={!props.editState}
                           variant="filled"
                           required
                           onInput={(event) => setObj({...obj, account: event.target.value})}
                           fullWidth label={"登录名"}/>
                <TextField type="text"
                           onInput={(event) => setObj({...obj, name: event.target.value})}
                           variant="filled"
                           required
                           className={classes.textField}
                           disabled={!editState}
                           defaultValue={obj.name}
                           fullWidth
                           label={"名称"}/>
                {props.editState && <TextField type='text'
                                               value={password}
                                               disabled={!editState}
                                               onInput={(event) => setPassword(event.target.value)}
                                               variant="filled"
                                               required
                                               fullWidth label={"初始密码"}/>}
                <TextField type="text"
                           variant="filled"
                           multiline
                           maxRows={4}
                           className={classes.textField}
                           fullWidth
                           disabled={!editState}
                           defaultValue={obj.remark}
                           onInput={(event) => setObj({...obj, remark: event.target.value})}
                           minRows={3}
                           label={"备注"}/>
                {props.editState && <FormControlLabel
                    className={classes.switch}
                    control={
                        <Switch
                            checked={root}
                            onChange={() => setRoot(!root)}
                            name="管理员权限"
                            color="primary"
                        />
                    }
                    label="管理员权限"
                />}
                {editState && <Button type="submit"

                                      style={{marginTop: 30}}
                                      fullWidth color={"primary"} variant={"contained"}>保存</Button>}
            </form>
        </div>
    )
}

export const ProfileEditor = () => {
    const classes = useStyles();
    const [state, setState] = useState(false)
    const onToggleState = () => {
        vcSubscribePublish.public("profile-edit-state-change", !state);
        setState(!state);
    }
    return (
        <>
            {state === false ? <EditIcon className={classes.editIcon} onClick={onToggleState}/> :
                <span onClick={onToggleState}>取消</span>}
        </>
    )
}
