import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {Camera, PhotoCamera} from "@material-ui/icons";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import vcSubscribePublish from "vc-subscribe-publish";
import {useContainerWithoutNavigationBarStyle} from "../../../App";
import {Fab} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { fetchUploadProduct} from "../../../lib/request/upload";
import {useSafeState} from "ahooks";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    input: {
        display: 'none',
    },
    back: {
        color: '#fff'
    },
    preview: {
        width: '100%',
        height: 'auto'
    },
    previewText: {
        position: 'absolute',
        content: '"列表预览图"',
        zIndex: 1,
        color: '#fff',
        display: 'inline-block',
        backgroundColor: 'rgba(0,0,0,.5)',
        width: '100%',
        padding: theme.spacing(1),
        letterSpacing: 1
    },
    previewList: {
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
    },
    img: {
        width: '14ch',
        height: 'auto',
        marginRight: theme.spacing(1)
    },
    imgWrapper: {
        display: 'inline-block'
    },
    fab: {
        position: 'fixed',
        bottom: 80,
        right: 30,
        zIndex: 9
    }
}));
export const Back = () => {
    const classes = useStyles();
    const onClick = () => {
        vcSubscribePublish.public("onNavigate", -1);
    }
    return <IconButton className={classes.back} onClick={onClick}><ArrowBackIosIcon/></IconButton>
}

export const ProductItem = () => {
    const classes = useStyles();
    const classesContainer = useContainerWithoutNavigationBarStyle();
    const [paths, setPaths] = useSafeState([]);
    const uploadHandle = async (formData)=> {
        const res = await fetchUploadProduct(formData);
        uploadDone(res?.path);
    }
    const uploadDone = (path)=> {
        if(path) {
            setPaths([path, ...paths]);
        }
    }
    const onSelectFile = (event)=> {
        const files = event.target.files;
        for(let x of files) {
            const formData = new FormData();
            formData.append("image", x);
            uploadHandle(formData);
        }

    }
    return (
        <div className={`${classes.root} ${classesContainer.container}`}>
            {paths[0] && <><Typography className={classes.previewText}>这是列表里的预览图</Typography>
            <img
                src={paths[0]}
                alt={"大预览"} className={classes.preview}/></> }
            <div className={classes.previewList}>
                {paths.map((it, key)=> {
                    return <div key={key} className={classes.imgWrapper}>
                        <img className={classes.img}
                             src={it}
                             alt={"小预览"}/>
                    </div>
                })}
            </div>
            <Fab className={classes.fab} color="primary" aria-label="add">
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={onSelectFile}
                />
                <label htmlFor="contained-button-file">
                     <PhotoCamera style={{marginTop: 10}} />
                </label>
            </Fab>
        </div>
    );
}
