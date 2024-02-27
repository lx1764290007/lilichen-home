import React, {useMemo, useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {autoCol} from "../../../tools/tools";
import {ButtonGroup, ClickAwayListener, Fade, Paper, Popper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {red} from "@material-ui/core/colors";
import {ImagePreview} from "../../../components/ImagePreviewById/ImagePreview";
// import Style from "./ImageList.module.css";
import {useDebounceFn, useMount} from "ahooks";
import {BONUS} from "../../../tools/tools";
import {Loading} from "../../../components/Loading/Loading";
import {useContainerStyle} from "../../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchProductList} from "../../../lib/request/produce";

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
const itemData = [
    {
        img: "https://v4.mui.com/static/images/image-list/morning.jpg",
        title: "完美的致命打击套",
        featured: true,
        description: "vencentlum"
    },
    {
        img: "https://v4.mui.com/static/images/image-list/vegetables.jpg",
        title: "完美的致命打击套",
        featured: false,
        description: "这是一段非常非常长的内容，长到需要换行~~~这是一段非常非常长的内容，长到需要换行"
    },
    {
        img: "https://v4.mui.com/static/images/image-list/honey.jpg",
        title: "完美的致命打击套",
        featured: false,
        description: "vencentlum"
    },
    {
        img: "https://v4.mui.com/static/images/image-list/mushroom.jpg",
        title: "完美的致命打击套",
        featured: true,
        description: "vencentlum"
    },
    {
        img: "https://v4.mui.com/static/images/image-list/star.jpg",
        title: "完美的致命打击套",
        featured: true,
        description: "vencentlum"
    },
];
export const AdvancedImageList = ()=> {
    const classes = useStyles();
    const classesContainer = useContainerStyle();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [testData, setTestData] = useState(itemData);
    const [text, setText] = useState("");
    const newCol = useMemo(()=> autoCol(testData), [testData]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [touchMoveY, setTouchMoveY] = useState(9999999);
    const [transformY, setTransformY] = useState(0);
    const scrollRef = useRef(null);
    // const [newCol, setNewCol] = useState(autoCol(itemData));
    const handleClickDesc = (event, description) => {
        if(open) return
        setAnchorEl(event.currentTarget);
        setText(description);
        setOpen(true);
        setTimeout(()=> setOpen(false), 3000);
    };
    const handleClickAway = (event) => {
      //  setOpen(false);
    }
    const test = async ()=> {
        setTestData([itemData[1]]);
        console.log(testData)
    }
    const previewOnOpen = ()=> {
        setPreviewOpen(true);
    }
    const previewOnClose = ()=> {
        setPreviewOpen(false);
    }
    /**
     * 判断手指前后滑动的距离来判断手指滑动方向，如果在滚动条上方下拉的话则触发下拉加载动画
     * @param {TouchEvent} event
     */
    const onTouchmoveHandler = (event)=> {
        if(touchMoveY < event.changedTouches[0].clientY && scrollRef.current.scrollTop <= 0){
            if(transformY < BONUS) {
                setTransformY(transformY + 1);
            }
        }
        setTouchMoveY(event.changedTouches[0].clientY)
    }
    /**
     * 判断下拉距离是否达到设定的阈值来决定是否要触发下拉加载事件
     * @param {TouchEvent} event
     */
    const onTouchendHandler = (event)=> {
        setTouchMoveY(999999);
        if (transformY >= BONUS) {
            vcSubscribePublish.public("onMessage", "hello world")
            setTimeout(()=> setTransformY(0), 2000);
            setTimeout(()=> vcSubscribePublish.public("onMessage", "hello world again"), 2000);
        } else {
            setTransformY(0)
        }
    }
    // const handLoadMore = ()=> {
    //     console.log("load more")
    // }
    const onscrollHandler = ({target})=> {
        const scrollHeight = target.scrollHeight, scrollTop = target.scrollTop, {height} = target.getBoundingClientRect();
        if(scrollHeight - scrollTop -height <= BONUS) {
            console.log("it work!")
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
    const fetchData = async ()=> {
        fetchProductList({
            current: 1,
            size: 10
        }).then(res=>{
            console.log(res)
        })
    }
    useMount(()=>{
        fetchData();
    })
    return (
        <div className={classes.root} >
            <Popper open={open} anchorEl={anchorEl} placement={"top-start"} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={100}>
                        <ClickAwayListener onClickAway={handleClickAway}><Paper>
                            {/*<CloseIcon className={classes.closeIcon} />*/}
                            <Typography className={classes.typography}>{text}</Typography>
                        </Paper></ClickAwayListener>
                    </Fade>
                )}
            </Popper>
            {transformY >= BONUS/2 && <div style={{position:"absolute", padding: 5, width: "100%"}}><Loading /></div>}
            <ImageList ref={scrollRef} rowHeight={230} gap={1} style={{transform: `translateY(${transformY}px)`}} className={`${classes.imageList} ${classesContainer.container}`} onTouchEnd={onTouchendHandler} onTouchMove={onTouchmoveHandler} onScroll={run}>
                {newCol.map((item) => (
                    <ImageListItem key={item.img} cols={item.featured ? 2 : 1} rows={item.featured ? 2 : 1}>
                        <img src={item.img} alt={item.title} />
                        <ImageListItemBar
                            title={<div onClick={previewOnOpen}>{item.title}</div>}
                            position="top"
                            actionIcon={
                                <IconButton aria-label={`star ${item.title}`} className={classes.icon}>
                                    <StarBorderIcon />
                                </IconButton>
                            }
                            actionPosition="left"
                            className={classes.titleBar}
                        />
                        <ImageListItemBar
                            title={<div onClick={(event)=> handleClickDesc(event, item.description)}>{item.description}</div>}
                            // subtitle={<span>by: {item.description}</span>}
                            actionIcon={
                                // <IconButton aria-label={`info about ${item.title}`} className={classes.icon}>
                                //     <InfoIcon />
                                // </IconButton>
                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                    <IconButton className={classes.icon} onClick={test}>
                                        <EditIcon />
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
            <ImagePreview open={previewOpen} onClose={previewOnClose}/>
        </div>
    );
}
