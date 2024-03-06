import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {autoCol, BONUS} from "../../tools/tools";
import {
    ButtonGroup,
    ClickAwayListener,
    Fab,
    Fade,
    Paper,
    Popper
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {red} from "@material-ui/core/colors";
import {ImagePreview} from "../../components/ImagePreviewById/ImagePreview";
// import Style from "./ImageList.module.css";
import {useDebounceFn} from "ahooks";
import {Loading} from "../../components/Loading/Loading";
import {Context} from "../../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchGoodsList, fetchGoodsRemove, fetchGoodsSearch} from "../../lib/request/goods";
import {IMAGE_TYPE, PAGE_SIZE} from "../../lib/static";
import {Empty} from "../../components/Empty/Empty";
import AddIcon from '@material-ui/icons/Add';
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import {AdvancedGoodsListItem} from "./GoodListItem";
import EditIcon from "@material-ui/icons/Edit";
import {DeleteOutlineSharp} from "@material-ui/icons";
import {fetchSupplierList} from "../../lib/request/supplier";
import {fetchProductList} from "../../lib/request/produce";
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
    typography: {
        padding: theme.spacing(2),
    },
    list: {
        // width: 500,
        // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
        transform: 'translateZ(0)',
        cursor: 'pointer',
        width: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box'
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
        border: '1px solid #a79adc',
        boxShadow: theme.shadows[5],
        width: '80%',
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
export const SEARCH_PLACEHOLDER = "综合搜索";
export const AdvancedGoodsList = () => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [touchMoveY, setTouchMoveY] = useState(9999999);
    const [transformY, setTransformY] = useState(0);
    const scrollRef = useRef(null);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [target, setTarget] = useState(null);
    const [paramName, setParamName] = useState(null);
    const [picPreviewId, setPicPreviewId] = useState(null);
    const [modalOpen, setModalOpen] = useState(0);
    const [productList, setProductList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const location = useLocation();
    const newCol = useMemo(() => dataSource.map(it=>{
        return {
            ...it,
            _productName: productList.find(its=> its.id === it.product)?.name,
            _supplierName: supplierList.find(its=> its.id === it.company)?.name
        }
    }), [dataSource, productList, supplierList]);
    const handleClickAway = (event) => {
        setOpen(false);
        setAnchorEl(null);
        setTarget(null);
    }
    const previewOnOpen = (uuid) => {
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
    //fetchGoodsSearch
    const searchData = async (c, name) => {
        const _current = c || current;
        const res = await fetchGoodsSearch({
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

    const fetchData = async (c, name) => {
        const a = /\?productId=/g, b=/\?supplierId=/g;
        let a_r, b_r;
        if(a.test(location.search)){
            a_r = location.search?.replace(a, "");
        }else if (b.test(location.search)) {
            b_r = location.search?.replace(b, "");
        }
        const _current = c || current;
        const res = await fetchGoodsList({
            current: _current,
            size: PAGE_SIZE,
            name,
            product: a_r,
            company: b_r
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
        fetchData().then(()=> fetchSupplierList({
            current: 1,
            size: 9999
        }).then(res=> setSupplierList(res?.data))).finally(()=> fetchProductList({
            current: 1,
            size: 9999
        }).then(res=> setProductList(res?.data)));
        vcSubscribePublish.subscribe("appOnSearch", (args) => {
            setParamName(args[0]);
            searchData(current, args[0]).catch(e=> console.log(e));
        })
        return () => vcSubscribePublish.unsubscribe("appOnSearch");
        // eslint-disable-next-line
    }, []);
    const handleToEdit = (event) => {
        vcSubscribePublish.public("onNavigate", "/goods-update?params=" + window.encodeURIComponent(JSON.stringify(event)));
    }
    const toAddItemHandle = () => {
        vcSubscribePublish.public("onNavigate", "/goods-add")
    }
    const onHandleRemove = (event) => {
        setModalOpen(event);
    }
    const handleModalClose = () => {
        setModalOpen(0);
    }
    const handleConfirmRemove = async () => {
        if (modalOpen) {
            await fetchGoodsRemove({
                id: modalOpen
            })
            setDataSource(dataSource.filter(it => it.id !== modalOpen));
            handleModalClose();
        }
    }
    const onMoreActionClick = (event, t)=> {
        if (open) return
        setAnchorEl(event.currentTarget);
        setTarget(t);
        setOpen(t?.id);
    }

    return (
        <div className={classes.root}>
            <Popper open={open} anchorEl={anchorEl} placement={"left-end"} transition>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={100}>
                        <ClickAwayListener onClickAway={handleClickAway}><Paper>
                            {/*<CloseIcon className={classes.closeIcon} />*/}
                            <ButtonGroup variant={"text"} orientation="vertical">
                                <Button color={"primary"} startIcon={<EditIcon/>} onClick={()=> handleToEdit(target)}>编辑</Button>
                                <Button color={"secondary"} startIcon={<DeleteOutlineSharp/> } onClick={()=> onHandleRemove(target?.id)}>删除</Button>
                            </ButtonGroup>
                        </Paper></ClickAwayListener>
                    </Fade>
                )}
            </Popper>
            {newCol.length > 0 &&
                <React.Fragment>
                    {transformY >= BONUS / 2 &&
                        <div style={{position: "absolute", padding: 5, width: "100%"}}><Loading/></div>}
                    <div ref={scrollRef}
                               style={{transform: `translateY(${transformY}px)`}}
                               className={`${classes.list} ${mc.mStyle}`}
                               onTouchEnd={onTouchendHandler} onTouchMove={onTouchmoveHandler} onScroll={run}>
                        {newCol.map((item, key) => (
                            <AdvancedGoodsListItem onOpenPicPreview={previewOnOpen} dataSource={item} onMoreActionClick={onMoreActionClick} />
                        ))}
                    </div>
                </React.Fragment>}
            {newCol.length < 1 &&
                <div className={mc.mStyle} style={{width: '100%', paddingTop: 100, boxSizing: 'border-box'}}><Empty/></div>}
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
                    <Typography component={"h5"}>注意：删除二次确认!!</Typography>
                    <div className={classes.buttons}>
                        <Button variant={"text"} onClick={handleConfirmRemove} color={"primary"}>确定</Button>
                        <Button variant={"text"} onClick={handleModalClose} color={"secondary"}>再想想</Button>
                    </div>
                </Paper>
            </Modal>
            <ImagePreview type={IMAGE_TYPE.GOODS} open={previewOpen} uuid={picPreviewId} onClose={previewOnClose}/>
        </div>
    );
}
