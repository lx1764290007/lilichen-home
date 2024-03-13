import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {Context} from "../../App";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import NoteIcon from '@material-ui/icons/Note';
import vcSubscribePublish from "vc-subscribe-publish";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ImageIcon from '@material-ui/icons/Image';
import {
    fetchSystemOpenDir,
    fetchSystemOpenSourceDir,
    fetchSystemRestart,
    fetchSystemStop
} from "../../lib/request/system";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        boxSizing: 'border-box'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        backdropFilter: 'blur(2px)'
    },
}));

export const SettingPage = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [target, setTaget] = useState(null);
    const toUserPage = () => {
        vcSubscribePublish.public("onNavigate", "/user-list")
    }
    const systemRestartHandle = async () => {
        setDialogOpen(true);
        setTaget('r');
    }
    const systemRestartHandleConfirm = async ()=> {
        setOpen(true);

        setTimeout(()=> {
            setOpen(false)
        }, 6000);
        await fetchSystemRestart();
    }
    const systemStopHandle = async () => {
        setDialogOpen(true);
        setTaget('s')
    }
    const systemStopHandleConfirm = async () => {
        setOpen(true);

        setTimeout(()=> {
            setOpen(false)
        }, 2000);
        await fetchSystemStop();
    }
    const onConfirm = async ()=> {
        dialogOnClose();
        if(target === 'r') {
            await systemRestartHandleConfirm()
        } else if(target === 's') {
            await systemStopHandleConfirm()
        }

    }
    const dialogOnClose = ()=> {
        setDialogOpen(false);
        setTaget(null);
    }
    const onOpenDir = async ()=> {
        setOpen(true);
        setTimeout(()=> setOpen(false), 2000);
        await fetchSystemOpenDir();
    }
    const onOpenSourceDir = async() => {
        setOpen(true);
        setTimeout(()=> setOpen(false), 2000);
        await fetchSystemOpenSourceDir();
    }
    const mc = React.useContext(Context);
    return (
        <div>
            <List className={`${classes.root} ${mc.mStyle}`} {...mc.mobileHook}>
                <ListItem onClick={toUserPage}>
                    <ListItemIcon>
                        <AssignmentIndIcon/>
                    </ListItemIcon>
                    <ListItemText primary="用户管理"/>
                    <ListItemSecondaryAction>
                        <ArrowRightIcon/>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem onClick={systemRestartHandle}>
                    <ListItemIcon>
                        <OfflineBoltIcon/>
                    </ListItemIcon>
                    <ListItemText primary="重启服务"/>
                    <ListItemSecondaryAction>
                        <ArrowRightIcon/>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem onClick={systemStopHandle}>
                    <ListItemIcon>
                        <PowerSettingsNewIcon/>
                    </ListItemIcon>
                    <ListItemText primary="关闭服务"/>
                    <ListItemSecondaryAction>
                        <ArrowRightIcon/>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem onClick={onOpenDir}>
                    <ListItemIcon>
                        <NoteIcon/>
                    </ListItemIcon>
                    <ListItemText primary="在服务器电脑里打开日志目录"/>
                    <ListItemSecondaryAction>
                        <ArrowRightIcon/>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem onClick={onOpenSourceDir}>
                    <ListItemIcon>
                        <ImageIcon/>
                    </ListItemIcon>
                    <ListItemText primary="在服务器电脑里打开图片目录"/>
                    <ListItemSecondaryAction>
                        <ArrowRightIcon/>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Dialog
                open={dialogOpen}
                onClose={()=> setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>此项活动会影响所有用户</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        服务重启会导致在重启阶段服务不可用, 也有可能启动失败(如数据库连接失败)..关闭系统之后网页和后台服务均不可用
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onConfirm} color="primary">
                        继续
                    </Button>
                    <Button onClick={dialogOnClose} color="secondary">
                        取消
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
