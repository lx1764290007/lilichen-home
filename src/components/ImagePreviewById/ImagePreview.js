import React, {useEffect, useMemo} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {IMAGE_TYPE} from "../../lib/static";
import {fetchProductPics} from "../../lib/request/produce";
import {useSafeState, useToggle} from "ahooks";
import {Pagination} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {fetchGoodsPics} from "../../lib/request/goods";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        boxShadow: theme.shadows[5],
        display: 'block',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'relative',
        width: '100%',
        maxWidth: 1000,
        maxHeight: '100vh',
        overflowX: 'auto'
    },
    img: {
        width: '100%',
        maxWidth: '100%',
        minHeight: 80,
        backgroundColor: '#fff',
        color: '#333',
        textAlign: 'center',
        margin: '0 auto',
        display: 'block',
        position: 'relative',
        transition: '.3s all linear'
    },
    pagination: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        left: 0,
        right: 0,
        position: 'fixed',
        zIndex: 10,
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-around',
        backdropFilter: 'blur(3px)'
    },
    p: {
        color: '#fff'
    },
    show: {
        display: 'block'
    },
    hide: {
        display: 'none'
    },
    ty: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(1),
        backgroundColor: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(3px)',
        color: '#fcfcfc',
        fontSize: 14
    },
    closeIcon: {
        position: 'fixed',
        top: 30,
        right: 10,
        color: '#fff',
        fontSize: 64,
        zIndex: 10
    }
}));

export const ImagePreview = (props) => {
    const classes = useStyles();
    const [dataSource, setDataSource] = useSafeState([]);
    const [previewIndex, setPreviewIndex] = useSafeState(1);
    const [state, { toggle, setLeft }] = useToggle(false);

    const currentPath = useMemo(() => dataSource[previewIndex - 1]?.path, [previewIndex, dataSource]);
    const currentDesc = useMemo(() => dataSource[previewIndex - 1]?.description, [previewIndex, dataSource]);
    const handleClose = () => {
        props.onClose?.();
        setLeft();
    };
    useEffect(() => {

        if (props.type === IMAGE_TYPE.PRODUCT && props.uuid) {
            fetchProductPics({
                uuid: props.uuid
            }).then(res => {
                setDataSource(res.data);
            }).catch((e) => console.log(e));
        } else if (props.type === IMAGE_TYPE.GOODS && props.uuid) {
            fetchGoodsPics({
                uuid: props.uuid
            }).then(res => {
                setDataSource(res.data);
            }).catch((e) => console.log(e));
        } else if(props.data instanceof Array){
            console.log(props.previewIndex)
            setDataSource(props.data);

        }
        return () => {
            setPreviewIndex(1);
        }
        // eslint-disable-next-line
    }, [props.uuid, props.data]);

    useEffect(()=> {

        if(props.previewIndex <= dataSource.length){
            setPreviewIndex(props.previewIndex + 1 || 1);
        }
        // eslint-disable-next-line
    }, [props.previewIndex, dataSource.length])

    const onChange = (_, n) => {
        setPreviewIndex(n);
    }
    const onScale = (event)=> {
        const {width, height}  = event.target.getBoundingClientRect();
        if(!state){
            event.target.style.width = width * 2 + 'px';
            event.target.style.maxWidth = "200%";
            event.target.style.height = height * 2 + 'px';
            event.target.style.maxHidth = "200%";
        } else {
            event.target.style.width = width / 2 + 'px';
            event.target.style.maxWidth = "100%";
            event.target.style.height = height / 2 + 'px';
            event.target.style.maxHidth = "100%";
        }
        toggle();
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <div>
                    <Fade in={props.open}>
                        <div className={classes.paper}>
                            <IconButton className={classes.closeIcon} onClick={props.onClose}>
                                <CloseIcon/>
                            </IconButton>
                            {currentDesc &&
                                <Typography component={"h6"} className={classes.ty}>{currentDesc}</Typography>}
                            {currentPath &&
                                <img alt={"图片加载失败！它可能在物理上已经不存在~"} className={`${classes.img}`}
                                     onDoubleClick={onScale}

                                     src={currentPath}/>}
                            {dataSource.length > 0 &&
                                 <div style={{display: state? 'none':'flex'}} className={classes.pagination}>
                                     <Pagination className={classes.p} color="primary"
                                                 count={dataSource.length}
                                                 page={previewIndex }
                                                 onChange={onChange}/></div>}
                        </div>

                    </Fade>
                    {dataSource.length < 1 && <h5 style={{color: '#fefefe',padding: '10px 20px'}}>~没有照骗~</h5> }

                </div>
            </Modal>
        </div>
    );
}
