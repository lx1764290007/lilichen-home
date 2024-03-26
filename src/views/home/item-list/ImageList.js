import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {autoCol, BONUS} from "../../../tools/tools";
import {ButtonGroup, ClickAwayListener, Fab, Fade, Paper, Popper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {red} from "@material-ui/core/colors";
import {ImagePreview} from "../../../components/ImagePreviewById/ImagePreview";
// import Style from "./ImageList.module.css";
import {useDebounceFn} from "ahooks";
import {Loading} from "../../../components/Loading/Loading";
import {Context} from "../../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchProductList, fetchProductRemove} from "../../../lib/request/produce";
import {IMAGE_TYPE, LOCAL_STORAGE_USER, PAGE_SIZE} from "../../../lib/static";
import {Empty} from "../../../components/Empty/Empty";
import AddIcon from '@material-ui/icons/Add';
import dayjs from "dayjs";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutlined";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        position: 'relative',
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    typography: {
        padding: theme.spacing(2),
    },
    imageList: {
        // width: 500,
        // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
        transform: 'translateZ(0)',
        cursor: 'pointer',
        width: '100%'
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
    fab: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        zIndex: 9
    },
    date: {
        position: "absolute",
        bottom: 50,
        color: '#fefefe',
        zIndex: 1,
        right: 10,
        fontSize: 14
    },
    deleteIcon: {
        position: "absolute",
        right: 5,
        top: 0,
        zIndex: 10,
        color: '#dc5c58',
        fontWeight: 600
    },
    buttons: {
        position: 'relative',
        textAlign: 'right',
        marginTop: theme.spacing(2)
    },
}));
const FORMAT = "YYYY-MM-DD";
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
export const AdvancedImageList = () => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [text, setText] = useState("");
    const newCol = useMemo(() => dataSource, [dataSource]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [touchMoveY, setTouchMoveY] = useState(9999999);
    const [transformY, setTransformY] = useState(0);
    const scrollRef = useRef(null);
    const isAdmin =  window.localStorage.getItem(LOCAL_STORAGE_USER)? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_USER))?.root === 1:false;

    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [paramName, setParamName] = useState(null);
    const [picPreviewId, setPicPreviewId] = useState(null);
    const [modalOpen, setModalOpen] = useState(0);
    const handleClickDesc = (event, description) => {
        if (open) return
        setAnchorEl(event.currentTarget);
        setText(description);
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
    };
    const handleClickAway = (event) => {
        //  setOpen(false);
    }
    const previewOnOpen = (uuid, item) => {
        setPicPreviewId(uuid);
        setPreviewOpen(true);
    }
    const previewOnClose = () => {
        setPreviewOpen(false);
    }
    /**
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
     * @param {TouchEvent} event
     */
    const onTouchendHandler = (event) => {
        setTouchMoveY(999999);
        if (transformY >= BONUS) {
            setTimeout(() => setTransformY(0), 2000);
            handleRefresh();
        } else {
            setTransformY(0)
        }
    }
    const handleLoadMore = async () => {
        if (dataSource.length < total) {
            await fetchData(current + 1, paramName);
            setCurrent(current + 1);
        }
    }
    const handleRefresh = () => {
        setCurrent(1);
        fetchData(1);
    }
    const onscrollHandler = ({target}) => {
        const scrollHeight = target.scrollHeight,
            scrollTop = target.scrollTop, {height} = target.getBoundingClientRect();
        if (scrollHeight - scrollTop - height <= BONUS) {
            handleLoadMore();
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
        const res = await fetchProductList({
            current: _current,
            size: PAGE_SIZE,
            name
        });
        const _data = res?.data?.map?.(it => {
            return {
                ...it,
                img: it.preview,
                title: it.name,
                featured: true,
                description: it.description,
            }
        });
        if (_current === 1) {
            setDataSource(autoCol(_data));
        } else {
            setDataSource(dataSource.concat(autoCol(_data)));
        }
        setTotal(res?.total);
        return _data;
    }

    useEffect(() => {
        fetchData();
        vcSubscribePublish.subscribe("appOnSearch", (args) => {
            setParamName(args[0]);
            fetchData(current, args[0]);
        })
        return () => vcSubscribePublish.unsubscribe("appOnSearch");
        // eslint-disable-next-line
    }, []);
    const handleToEdit = (event) => {
        vcSubscribePublish.public("onNavigate", "/product?params=" + window.encodeURIComponent(JSON.stringify(event)));
    }
    const toAddItemHandle = () => {
        vcSubscribePublish.public("onNavigate", "/product-add")
    }
    const onHandleRemove = (event) => {
        setModalOpen(event);
    }
    const handleModalClose = () => {
        setModalOpen(0);
    }
    const handleConfirmRemove = async () => {
        if (modalOpen) {
            await fetchProductRemove({
                id: modalOpen
            })
            setDataSource(dataSource.filter(it => it.id !== modalOpen));
            handleModalClose();
        }
    }
    const toSearchGoods = (event)=> {
        vcSubscribePublish.public("onNavigate", "search-goods-list?productId=" + event);
    }
    return (
        <div className={classes.root}>
            {newCol.length > 0 &&
                <React.Fragment><Popper open={open} anchorEl={anchorEl} placement={"top-start"} transition>
                    {({TransitionProps}) => (
                        <Fade {...TransitionProps} timeout={100}>
                            <ClickAwayListener onClickAway={handleClickAway}><Paper>
                                {/*<CloseIcon className={classes.closeIcon} />*/}
                                <Typography className={classes.typography}>{text}</Typography>
                            </Paper></ClickAwayListener>
                        </Fade>
                    )}
                </Popper>
                    {transformY >= BONUS / 2 &&
                        <div style={{position: "absolute", padding: 5, width: "100%"}}><Loading/></div>}
                    <ImageList ref={scrollRef} rowHeight={230} gap={1}
                               style={{transform: `translateY(${transformY}px)`,[mc.mobileHook.height? 'height':'']:mc.mobileHook.height}}
                               className={`${classes.imageList} ${mc.mStyle}`}
                               onTouchEnd={onTouchendHandler} onTouchMove={onTouchmoveHandler} onScroll={run}>
                        {newCol.map((item, key) => (
                            <ImageListItem key={key} cols={item.featured ? 2 : 1} rows={item.featured ? 2 : 1}>
                                {isAdmin && <IconButton className={classes.deleteIcon} onClick={() => onHandleRemove(item.id)}>
                                    <DeleteOutlineIcon/>
                                </IconButton>}
                                <img src={item.img} alt={item.title} onClick={() => previewOnOpen(item.uuid, item)} />
                                <ImageListItemBar
                                    title={<div onClick={()=> toSearchGoods(item.id)} >{item.title}</div>}
                                    position="top"
                                    actionIcon={
                                        <IconButton aria-label={`star ${item.title}`} className={classes.icon}>
                                            <StarBorderIcon/>
                                        </IconButton>
                                    }
                                    actionPosition="left"
                                    className={classes.titleBar}
                                />
                                <ImageListItemBar
                                    title={<div
                                        onClick={(event) => handleClickDesc(event, item.description)}>{item.description}</div>}
                                    // subtitle={<span>by: {item.description}</span>}
                                    actionIcon={
                                        // <IconButton aria-label={`info about ${item.title}`} className={classes.icon}>
                                        //     <InfoIcon />
                                        // </IconButton>
                                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                                            <IconButton className={classes.icon} onClick={() => handleToEdit(item)}>
                                                <EditIcon/>
                                            </IconButton>
                                            {/*<IconButton className={classes.icon} style={{color: "red"}}>*/}
                                            {/*    <DeleteIcon />*/}
                                            {/*</IconButton>*/}
                                        </ButtonGroup>
                                    }
                                />
                                <Typography
                                    className={classes.date}>{dayjs(item.updateTime).format(FORMAT)}</Typography>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </React.Fragment>}
            {newCol.length < 1 &&
                <div className={mc.mStyle}  style={{width: '100%', paddingTop: 100,[mc.mobileHook.height? 'height':'']:mc.mobileHook.height}}><Empty/></div>}
            <ImagePreview type={IMAGE_TYPE.PRODUCT} open={previewOpen} uuid={picPreviewId} onClose={previewOnClose}/>
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
                    <Typography component={"h5"}>注意：删除此内容也将删除所有与之关联的产品！！</Typography>
                        <div className={classes.buttons}>
                        <Button variant={"text"} onClick={handleConfirmRemove} color={"primary"}>确定</Button>
                        <Button variant={"text"} onClick={handleModalClose} color={"secondary"}>再想想</Button>
                        </div>
                </Paper>
            </Modal>
        </div>
    );
}
