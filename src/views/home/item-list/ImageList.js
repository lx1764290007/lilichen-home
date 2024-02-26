import React, {useMemo, useState} from 'react';
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
        height: 'calc(100vh - 64px - 64px)',
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

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [testData, setTestData] = useState(itemData);
    const [text, setText] = useState("");
    const newCol = useMemo(()=> autoCol(testData), [testData]);
    const [previewOpen, setPreviewOpen] = useState(false);

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
    return (
        <div className={classes.root}>
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
            <ImageList rowHeight={230} gap={1} className={classes.imageList}>
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
