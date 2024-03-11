import React, {useMemo} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useSafeState} from "ahooks";
import {fetchSupplierAdd, fetchSupplierUpdate} from "../../lib/request/supplier";
import vcSubscribePublish from "vc-subscribe-publish";
import {Context} from "../../App";
import {InputAdornment} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        position: 'relative',
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    form: {
        display: 'block',
        boxSizing: 'border-box',
        padding: theme.spacing(1),
        '&>*':{
            marginTop: theme.spacing(2)
        }
    },
    formButton: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    icon: {
        color: '#7986cb'
    },
    button: {
        backgroundColor: '#7986cb'
    }
}))

export const SupplierItem = (props)=> {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [loading, setLoading] = useSafeState(false);
    const location = useLocation();
    const editData = useMemo(() => {
        if (/^\?params/g.test(location.search)) {
            return JSON.parse(window.decodeURIComponent(location.search?.replace?.("?params=", "")))
        } else return null;
    }, [location]);
    const [name, setName] = useSafeState(editData?.name);
    const [description, setDescription] = useSafeState(editData?.remark);
    const [phone, setPhone] = useSafeState(editData?.phone);
    const [address, setAddress] = useSafeState(editData?.address);
    const helpText = useMemo(() => !name ? '名称必填' : '', [name]);
    const onSubmit = async (event) => {
        event.preventDefault();
        if (!name || loading) {
            return
        }
        setLoading(true);

        if(editData?.id) {
            await fetchSupplierUpdate({
                id: editData?.id,
                name,
                phone,
                address,
                remark: description
            }).finally(() => {
                setLoading(false);
            })
        } else {
            await fetchSupplierAdd({
                name,
                phone,
                address,
                remark: description
            }).finally(() => {
                setLoading(false);
            })
        }
        vcSubscribePublish.public("onMessage", "已保存！！");
        vcSubscribePublish.public("onNavigate", -1);
    }
     return <div className={`${classes.root} ${mc.mStyle}`} {...mc.mobileHook}>
        <form onSubmit={onSubmit} className={classes.form} noValidate autoComplete="off">
            <TextField
                margin="dense"
                name={'name'}
                label="输入名称"
                maxLength={50}
                type="text"
                required
                defaultValue={editData?.name}
                onInput={(event) => setName(event.target.value)}
                fullWidth
                error={Boolean(helpText)}
                helperText={helpText}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle className={classes.icon} />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'phone'}
                label="输入联系方式"
                maxLength={20}
                type="text"
                defaultValue={editData?.phone}
                onInput={(event) => setPhone(event.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PhoneIcon className={classes.icon} />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'address'}
                label="输入地址"
                type="text"
                defaultValue={editData?.address}
                onInput={(event) => setAddress(event.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LocationOnIcon className={classes.icon} />
                        </InputAdornment>
                    ),
                }}
                maxRows={4} />
            <TextField
                margin="dense"
                name={'remark'}
                label="输入描述"
                defaultValue={editData?.remark}
                maxLength={100}
                type="text"
                multiline
                onInput={(event) => setDescription(event.target.value)}
                fullWidth
                minRows={3}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <BookmarkIcon className={classes.icon} />
                        </InputAdornment>
                    ),
                }}
                maxRows={4}
            />
            <Button loading={loading}
                    disabled={loading}
                    fullWidth
                    variant="contained"
                    className={classes.button}
                    color="primary" type={'submit'}>
                保存
            </Button>
        </form>
    </div>
}
