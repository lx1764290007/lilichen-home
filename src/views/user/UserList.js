import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {BONUS} from "../../tools/tools";
import PersonPinIcon from '@material-ui/icons/PersonPin';
import {
    Avatar,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    ClickAwayListener,
    Fab,
    Fade,
    FormControlLabel,
    Paper,
    Popper,
    Switch
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {blue, red} from "@material-ui/core/colors";
import {useDebounceFn} from "ahooks";
import {Loading} from "../../components/Loading/Loading";
import {Context} from "../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchUserList, fetchUserRemove, fetchUserUpdate} from "../../lib/request/user";
import {PAGE_SIZE} from "../../lib/static";
import {Empty} from "../../components/Empty/Empty";
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from "@material-ui/core/Button";
import {DeleteOutlineSharp, VerifiedUserOutlined} from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";


const useStyles = makeStyles((theme) => ({
    supplierRoot: {
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.paper,
    },
    typography: {
        padding: theme.spacing(2),
    },
    media: {},
    avatar: {
        backgroundColor: blue[500],
    },
    closeIcon: {
        color: red[200],
        position: "absolute",
        right: 10
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
    fab: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        zIndex: 9
    },
    date: {
        fontSize: 14,
        color: '#adadad'
    },
    list: {
        boxSizing: 'border-box',
        position: 'relative',
        zoom: 1,
        padding: '1px 0',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    card: {
        marginBlockStart: theme.spacing(0),
        position: 'relative',
        // boxShadow: '1px 3px 5px #e5e5e5',
        borderTop: '1px solid #a7b2ef',
        '&::after': {
            clear: 'both'
        }
    },
    address: {
        fontSize: 'smaller',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
       // cursor: 'pointer',
        '&:hover': {
           // color: '#539ee1'
        }
    },
    titleIcon: {
        color: '#4f90d2',
        fontSize: 24,
        marginRight: 5,
        fontWeight: 600,
        display: 'none'
    },
    titleIcon2: {
        color: '#4f90d2',
        fontSize: 18,
        marginRight: 3,
        fontWeight: 600,
        transform: 'translateY(3px)'
    },
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 3, 3),
    },
    buttons: {
        position: 'relative',
        textAlign: 'right',
        marginTop: theme.spacing(2)
    },
    switch: {
        position: 'relative',
        textAlign: 'right',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box'
    }
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const itemData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *     featured: true,
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export const UserList = () => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [target, setTarget] = useState(null);
    const newCol = useMemo(() => dataSource, [dataSource]);
    const [touchMoveY, setTouchMoveY] = useState(9999999);
    const [transformY, setTransformY] = useState(0);
    const scrollRef = useRef(null);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [paramName, setParamName] = useState(null);
    const [modalOpen, setModalOpen] = useState(0);
    const handleClickMoreAction = (event, t) => {
        if (open) return
        setAnchorEl(event.currentTarget);
        setTarget(t);
        setOpen(true);
    };
    const handleClickAway = (event) => {
        setOpen(false);
    }
    /*
     * 判断手指前后滑动的距离来判断手指滑动方向，如果在滚动条上方下拉的话则触发下拉加载动画
     * @param {TouchEvent} event
     */
    const onTouchmoveHandler = (event) => {
        if (touchMoveY < event.changedTouches[0].clientY && scrollRef.current.scrollTop <= 0) {
            if (transformY < BONUS) {
                setTransformY(transformY + 1);
            }
        }
        setTouchMoveY(event.changedTouches[0].clientY)
    }
    /**
     * 判断下拉距离是否达到设定的阈值来决定是否要触发下拉加载事件
     */
    const onTouchendHandler = () => {
        setTouchMoveY(999999);
        if (transformY >= BONUS) {
            setTimeout(() => setTransformY(0), 2000);
            handleRefresh();
        } else {
            setTransformY(0)
        }
    }
    const handleLoadMore = async () => {
        if (dataSource?.length < total) {
            await fetchData(current + 1, paramName);
            setCurrent(current + 1);
        }
    }
    const handleRefresh = () => {
        fetchData(1).then(() => setCurrent(1));
    }
    const onscrollHandler = async ({target}) => {
        const scrollHeight = target.scrollHeight,
            scrollTop = target.scrollTop, {height} = target.getBoundingClientRect();
        if (scrollHeight - scrollTop - height <= BONUS) {
            await handleLoadMore();
        }

    }
    const {
        run
    } = useDebounceFn(
        onscrollHandler,
        {
            wait: 200
        }
    );
    const fetchData = async (c, name) => {
        const _current = c || current;
        const res = await fetchUserList({
            current: _current,
            size: PAGE_SIZE,
            name
        });
        if (_current === 1) {
            setDataSource(res?.data);
        } else {
            setDataSource(dataSource.concat(res?.data));
        }
        setTotal(res?.total);
        return res?.data;
    }

    useEffect(() => {
        fetchData().then(() => void 0);
        vcSubscribePublish.subscribe("appOnSearch", (args) => {
            setParamName(args[0]);
        })
        return () => vcSubscribePublish.unsubscribe("appOnSearch");
        // eslint-disable-next-line
    }, []);
    const handleToEdit = (event) => {
        vcSubscribePublish.public("onNavigate", "/profile?params=" + window.encodeURIComponent(JSON.stringify(event)));
    }
    const toAddItemHandle = () => {
        vcSubscribePublish.public("onNavigate", "/profile-add")
    }
    const handleToPassword = (account)=> {
        vcSubscribePublish.public("onNavigate", "/password?account=" + account)
    }
    const handleOnRemove = async () => {
        await fetchUserRemove({
            account: target.account
        });
        const newData = dataSource.filter(k => k.account !== target.account);
        setDataSource(newData);
        setOpen(false);
        setAnchorEl(null);
        setTarget(null);
    }
    const onHandleRemove = (event) => {
        setModalOpen(event);
    }
    const handleModalClose = () => {
        setModalOpen(0);
    }
    const handleConfirmRemove = async () => {
        if (modalOpen) {
            handleModalClose();
            handleOnRemove();
        }
    }
    const handleAuthChange = (item) => {
        const {account, root} = item;
        fetchUserUpdate({
            ...item,
            root: !root
        }).then(()=> {
            const d = dataSource.map(it => {
                if (it.account === account) {
                    return {
                        ...it,
                        root: !root
                    }
                } else {
                    return it
                }
            })
            setDataSource(d);
        })

    }
    const toGoodsSearchHandle = async (id) => {
       // vcSubscribePublish.public("onNavigate", "/search-goods-list?supplierId=" + id);
    }
    return (
        <div className={classes.supplierRoot}>
            {newCol?.length > 0 &&
                <React.Fragment><Popper open={open} anchorEl={anchorEl} placement={"left-end"} transition>
                    {({TransitionProps}) => (
                        <Fade {...TransitionProps} timeout={100}>
                            <ClickAwayListener onClickAway={handleClickAway}><Paper>
                                {/*<CloseIcon className={classes.closeIcon} />*/}
                                <ButtonGroup variant={"text"} orientation="vertical">
                                    <Button color={"primary"} startIcon={<EditIcon/>}
                                            onClick={() => handleToEdit(target)}>编辑</Button>

                                    <Button color={"secondary"} startIcon={<DeleteOutlineSharp/>}
                                            onClick={onHandleRemove}>删除</Button>
                                    <Button color={"primary"} startIcon={<VerifiedUserOutlined/>}
                                            onClick={() => handleToPassword(target.account)}>修改密码</Button>
                                </ButtonGroup>
                            </Paper></ClickAwayListener>
                        </Fade>
                    )}
                </Popper>
                    {transformY >= BONUS / 2 &&
                        <div style={{position: "absolute", padding: 5, width: "100%", boxSizing: 'border-box'}}>
                            <Loading/></div>}
                    <div ref={scrollRef}
                         style={{transform: `translateY(${transformY}px)`, [mc.mobileHook.height? 'height':'']:mc.mobileHook.height}}
                         className={`${classes.list} ${mc.mStyle}`}
                         onTouchEnd={onTouchendHandler} onTouchMove={onTouchmoveHandler} onScroll={run}>
                        {newCol.map(item => <Card key={item.id} className={classes.card}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        {item.name?.substring(0, 1)}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings"
                                                onClick={(event) => handleClickMoreAction(event, item)}>
                                        <MoreVertIcon/>
                                    </IconButton>
                                }
                                title={<Typography component={"h5"} className={classes.title}
                                                   onClick={() => toGoodsSearchHandle(item.id)}><PersonPinIcon
                                    className={classes.titleIcon}/>{item.name}</Typography>}
                                subheader={'@'+item.account}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    {item.remark}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <FormControlLabel
                                    className={classes.switch}
                                    control={
                                        <Switch
                                            checked={item.root}
                                            onChange={() => handleAuthChange(item)}
                                            name="管理员权限"
                                            color="primary"
                                        />
                                    }
                                    label="管理员权限"
                                />
                                {/*<Typography></Typography>*/}
                                {/*<Typography className={classes.date}>{dayjs(item.updateTime).format(FORMAT)}</Typography>*/}
                            </CardActions>
                        </Card>)}
                    </div>

                </React.Fragment>}
            {newCol.length < 1 && <div className={mc.mStyle}
                                       style={{width: '100%', paddingTop: 100, boxSizing: 'border-box'}}><Empty/></div>}
            <Fab className={classes.fab} color="primary" aria-label="add" onClick={toAddItemHandle}>
                <AddIcon/>
            </Fab>
            <Modal
                disableEnforceFocus
                open={Boolean(modalOpen)}
                className={classes.modal}
                onClose={handleModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Paper className={classes.paper}>
                    <Typography component={"h5"}>注意：二次确认!!</Typography>
                    <div className={classes.buttons}>
                        <Button variant={"text"} onClick={handleConfirmRemove} color={"primary"}>确定</Button>
                        <Button variant={"text"} onClick={handleModalClose} color={"secondary"}>再想想</Button>
                    </div>
                </Paper>
            </Modal>
        </div>
    );
}
