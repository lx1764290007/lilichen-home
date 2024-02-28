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
import {useContainerStyle} from "../../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchProductList} from "../../../lib/request/produce";
import {PAGE_SIZE} from "../../../lib/static";
import {Empty} from "../../../components/Empty/Empty";
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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
        cursor: 'pointer'
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
        position: 'fixed',
        bottom: 80,
        right: 30,
        zIndex: 9
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
export const AdvancedImageList = () => {
    const classes = useStyles();
    const classesContainer = useContainerStyle();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [text, setText] = useState("");
    const newCol = useMemo(() => autoCol(dataSource), [dataSource]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [touchMoveY, setTouchMoveY] = useState(9999999);
    const [transformY, setTransformY] = useState(0);
    const scrollRef = useRef(null);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [paramName, setParamName] = useState(null);
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
    const previewOnOpen = () => {
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
    const handleLoadMore = () => {
        if (dataSource.length < total) {
            fetchData(current + 1, paramName);
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
        fetchProductList({
            current: _current,
            size: PAGE_SIZE,
            name
        }).then((res = {}) => {
            const _data = res.data?.map?.(it => {
                return {
                    img: it.preview,
                    title: it.name,
                    featured: true,
                    description: it.description
                }
            });
            if (_current === 1) {
                setDataSource(_data);
            } else {
                setDataSource(dataSource.concat(_data));
            }
            setTotal(res.total);
        })
    }
    useEffect(() => {
        fetchData();
        vcSubscribePublish.subscribe("product-search", (args) => {
            setParamName(args[0]);
            fetchData(current, args[0]);
        })
        return () => vcSubscribePublish.unsubscribe("product-search");
    }, [])
    const toAddItemHandle = ()=> {
        vcSubscribePublish.public("onNavigate", "/product-add")
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
                               style={{transform: `translateY(${transformY}px)`}}
                               className={`${classes.imageList} ${classesContainer.container}`}
                               onTouchEnd={onTouchendHandler} onTouchMove={onTouchmoveHandler} onScroll={run}>
                        {newCol.map((item, key) => (
                            <ImageListItem key={key} cols={item.featured ? 2 : 1} rows={item.featured ? 2 : 1}>
                                <img src={item.img} alt={item.title}/>
                                <ImageListItemBar
                                    title={<div onClick={previewOnOpen}>{item.title}</div>}
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
                                            <IconButton className={classes.icon}>
                                                <EditIcon/>
                                            </IconButton>
                                            {/*<IconButton className={classes.icon} style={{color: "red"}}>*/}
                                            {/*    <DeleteIcon />*/}
                                            {/*</IconButton>*/}
                                        </ButtonGroup>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </React.Fragment>}
            {newCol.length < 1 && <div className={classesContainer.container} style={{width: '100%', paddingTop: 100}}><Empty/></div>}
            <ImagePreview open={previewOpen} onClose={previewOnClose}/>
            <Fab className={classes.fab} color="primary" aria-label="add" onClick={toAddItemHandle}>
                <AddIcon />
            </Fab>
        </div>
    );
}
