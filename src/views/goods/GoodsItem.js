import React, {useEffect, useMemo, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {PhotoCamera} from "@material-ui/icons";
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import vcSubscribePublish from "vc-subscribe-publish";
import {Context} from "../../App";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, InputAdornment
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {fetchFileRemove, fetchUploadGoods} from "../../lib/request/upload";
import {useSafeState} from "ahooks";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import {fetchGoodsAdd, fetchGoodsList, fetchGoodsPics, fetchGoodsUpdate} from "../../lib/request/goods";
import DeleteOutlineIcon from '@material-ui/icons/Delete';
import {useLocation} from "react-router-dom";
import {ProductSelector} from "../../components/ProductSeletor/ProductSelector";
import {SupplierSelector} from "../../components/SupplierSelector/SupplierSelector";
import {IMAGE_TYPE} from "../../lib/static";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'relative',
        overflowY: 'auto'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    imgPreviewWrapper: {
        maxHeight: 300,
        overflow: 'hidden'
    },
    input: {
        display: 'none',
    },
    back: {
        color: '#fff'
    },
    form: {
        display: 'block',
        boxSizing: 'border-box',
        padding: theme.spacing(1)
    },
    formButton2: {
        width: '100%',
        marginTop: theme.spacing(2),
        minHeight: 36,
        backgroundColor: '#3f51b5',
        color: '#fff'
    },
    preview: {
        width: '100%',
        maxHeight: '100%',
        minHeight: 100
    },
    previewText: {
        position: 'absolute',
        zIndex: 1,
        color: '#fff',
        display: 'inline-block',
        backgroundColor: 'rgba(0,0,0,.5)',
        width: '100%',
        boxSizing: 'border-box',
        padding: theme.spacing(1),
        letterSpacing: 1
    },
    previewList: {
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        overflowY: 'hidden',
        padding: theme.spacing(1),
        '&::-webkit-scrollbar': {
            height: 5,
            backgroundColor: '#dde1e3'
        },
        '&::-webkit-scrollbar-thumb': {
            height: 5,
            backgroundColor: '#a79adc'
        }
    },
    img: {
        width: 120
        // height: '100%',
        // maxHeight: '100%',

    },
    imgWrapper: {
        display: 'inline-block',
        width: 120,
        height: 120,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        marginRight: theme.spacing(1),
        overflow: 'hidden',
        position: 'relative'
    },
    imgDescButton: {
        position: "absolute",
        bottom: 0,
        left: 'calc(50% - 24px)',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)'
    },
    imgDescText: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(0.5),
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)',
        fontSize: 'smaller'
    },
    fab: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        zIndex: 9
    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 1,
        color: '#e73630',
        zIndex: 10,
        fontWeight: 600
    },
    topRightButton: {},

}));

// {path: string, description: string, id?:number}
let _data = [];
let deletePath = [];
export const GoodsItem = () => {
    const classes = useStyles();
    const mc = React.useContext(Context);
    const [paths, setPaths] = useSafeState("");
    const [dialogOpen, setDialogOpen] = useSafeState(false);
    const [currentTargetIndex, setCurrentTargetIndex] = useSafeState(-1);
    // eslint-disable-next-line
    const p = useMemo(() => _data, [paths, currentTargetIndex]);
    const location = useLocation();
    const editData = useMemo(() => {
        if (/^\?params/g.test(location.search)) {
            return JSON.parse(window.decodeURIComponent(location.search?.replace?.("?params=", "")))
        } else return null;
    }, [location]);
    useEffect(() => {
        vcSubscribePublish.subscribe("goods-upload", args => {
            uploadHandle(args[0]).catch(e => console.log(e))
        });
        return () => {
            vcSubscribePublish.unsubscribe("goods-upload");
            deletePath = [];
        }
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (editData) {
            fetchGoodsList({
                id: editData.id,
                current: 1,
                size: 1
            }).then(res => {
                if (res?.data?.[0]) {
                    fetchGoodsPics({
                        uuid: res.data[0].uuid
                    }).then(result=> {
                        if(result?.data) {
                            _data = result.data.map(it=> {
                                return {
                                    path: it.path,
                                    description: it.description,
                                    id: it.id
                                }
                            });
                            setPaths(result.data[0]?.path);
                        }

                    })
                }
            })
        }
        return ()=> _data = []
        // eslint-disable-next-line
    }, [editData])
    const onDialogClose = () => {
        setDialogOpen(false);
    }
    const onDialogConfirm = (event) => {
        if (currentTargetIndex > -1) {
            _data[currentTargetIndex].description = event;
        }
        onDialogClose();
    }
    const uploadHandle = async (formDatas) => {
        const fn = async (i=0)=> {
            const res = await fetchUploadGoods(formDatas[i]);
            uploadDone(res?.path);
            if(formDatas.length - 1 > i) {
                await fn(i+1);
            }
        }
        fn(0);
        // const res = await fetchUploadGoods(formData);
        // uploadDone(res?.path);
    }
    const uploadDone = (path) => {
        if (path) {
            _data.push({path, description: ""});
            setPaths(path);
        }
    }
    const handleDelete = (path, ignore = false) => {
        _data = _data.filter((it) => it.path !== path);
        (!editData || ignore) &&
        fetchFileRemove({
            target: window.encodeURIComponent(path),
            type: editData? IMAGE_TYPE.GOODS:undefined
        }).catch(e => console.log(e));
        setPaths(paths === path ? "" : path);
        editData && !ignore && deletePath.push(path)
    }
    const onImgDescOpenHandle = (i) => {
        setDialogOpen(true);
        setCurrentTargetIndex(i);
    }
    const onConfirm = ()=> {
        for(let k of Array.from(new Set(deletePath))){
            handleDelete(k, true);
        }
    }
    return (
        <div className={`${classes.root} ${mc.mStyle}`}>

            {p[0] && <div className={classes.imgPreviewWrapper}><Typography
                className={classes.previewText}>预览图的长度可能会被裁剪，但这不影响实际效果</Typography>
                <img
                    src={p[0].path}
                    alt={"大预览"} className={classes.preview}/></div>}
            <div className={classes.previewList}>
                {p.map((it, key) => {
                    return <div key={key} className={classes.imgWrapper}>
                        <IconButton className={classes.deleteIcon} onClick={() => handleDelete(it.path)}>
                            <DeleteOutlineIcon/>
                        </IconButton>
                        {Boolean(it.description) &&
                            <Typography className={classes.imgDescText}>{it.description}</Typography>}
                        <img className={classes.img}
                             src={it.path}
                             alt={"小预览"}/>
                        <IconButton className={classes.imgDescButton} onClick={() => onImgDescOpenHandle(key)}>
                            <AddIcon/>
                        </IconButton>
                    </div>
                })}
            </div>
            <Form paths={p} editData={editData} onConfirm={onConfirm} />

            <FormDialog open={dialogOpen} defaultValue={p[currentTargetIndex]?.description} onClose={onDialogClose}
                        onConfirm={onDialogConfirm}/>
        </div>
    );
}

const FormDialog = (props) => {
    const ref = useRef(null);
    const handleClose = () => {
        props.onClose();
        const target = ref.current.querySelector("textarea");
        if (target) {
            target.value = "";
        }
    };
    const handleConfirm = () => {
        const value = ref.current.querySelector("textarea")?.value;
        props.onConfirm(value)
    }
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>给图片添加一段注释</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        辅助其他人解读这张图片的内容，但这应该不是必要的
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        ref={ref}
                        label="输入内容"
                        maxLength={100}
                        type="text"
                        multiline
                        defaultValue={props.defaultValue}
                        minRows={3}
                        variant="outlined"
                        maxRows={4}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default">
                        取消
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export const GoodsItemTopRightButton = () => {
    const classes = useStyles();

    const onSelectFile = (event) => {
        const formDatas = [];
        const files = event.target.files;
        for (let x of files) {
            const formData = new FormData();
            formData.append("image", x);
            formDatas.push(formData);
        }
        vcSubscribePublish.public("goods-upload", formDatas);
    }
    return <div className={classes.topRightButton}>
        <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={onSelectFile}
        />
        <IconButton>
            <label htmlFor="contained-button-file">
                <PhotoCamera style={{color: '#fcfcfc', marginTop: 5}}/>
            </label>
        </IconButton>
    </div>
}
const Form = (props) => {
    const classes = useStyles();
    const [name, setName] = useSafeState(props.editData?.name);
    const [description, setDescription] = useSafeState(props.editData?.description);
    const helpText = useMemo(() => !name ? '名称必填' : '', [name]);
    const [loading, setLoading] = useSafeState(false);
    const [stock, setStock] = useSafeState(props.editData?.stock);
    const [price, setPrice] = useSafeState(props.editData?.price);
    const [specs, setSpecs] = useSafeState(props.editData?.specs);
    const [fabric, setFabric] = useSafeState(props.editData?.fabric);
    const [product, setProduct] = useSafeState({id: props.editData?.product, name: props.editData?.productName});
    const [supplier, setSupplier] = useSafeState({id: props.editData?.company, name: props.editData?.companyName});
    const onSubmit = async (event) => {
      //  console.log(name, supplier, product, fabric, price,stock)
        event.preventDefault();
        if (!name || loading || !supplier || !product || !props.paths[0]?.path) {
            vcSubscribePublish.public("onErrorMessage", "关键信息未填或者没有上传图片..")
            return
        }
        setLoading(true);

        if(props.editData?.id) {
            fetchGoodsUpdate({
                id: props.editData?.id,
                name,
                description,
                stock,
                price,
                fabric,
                uuid: props.editData?.uuid,
                product: product.id,
                company: supplier.id,
                productName: product.name,
                companyName: supplier.name,
                specs,
                paths: window.encodeURIComponent(JSON.stringify(props.paths)),
                preview: window.encodeURIComponent(props.paths[0]?.path)
            }).finally(() => {
                setLoading(false);
            }).then(()=>{
                props.onConfirm?.();
                vcSubscribePublish.public("onMessage", "已保存！！");
                vcSubscribePublish.public("onNavigate", -1);
            })

        } else {
            fetchGoodsAdd({
                name,
                description,
                stock,
                price,
                fabric,
                product: product.id,
                company: supplier.id,
                productName: product.name,
                companyName: supplier.name,
                specs,
                paths: window.encodeURIComponent(JSON.stringify(props.paths)),
                preview: window.encodeURIComponent(props.paths[0]?.path)
            }).finally(() => {
                setLoading(false);
            }).then(()=>{
                vcSubscribePublish.public("onMessage", "已保存！！");
                vcSubscribePublish.public("onNavigate", -1);
            })
        }

    }

    const HandleProductChange = (val)=> {
        setProduct(val);
    }
    const HandleSupplierChange = (val)=> {
        setSupplier(val);
    }
    return <div className={classes.form}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
            <TextField
                margin="dense"
                name={'name'}
                label="输入名称"
                maxLength={50}
                type="text"
                required
                defaultValue={props.editData?.name}
                onInput={(event) => setName(event.target.value)}
                fullWidth
                error={Boolean(helpText)}
                helperText={helpText}
                variant="outlined"/>

            <ProductSelector required defaultValue={props.editData?.product} onChange={HandleProductChange} />
            <SupplierSelector required defaultValue={props.editData?.company} onChange={HandleSupplierChange} />
            <TextField
                margin="dense"
                name={'fabric'}
                label="材质"
                maxLength={50}
                type="text"
                defaultValue={props.editData?.fabric}
                onInput={(event) => setFabric(event.target.value)}
                fullWidth
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'specs'}
                label="规格"
                maxLength={50}
                type="text"
                defaultValue={props.editData?.specs}
                onInput={(event) => setSpecs(event.target.value)}
                fullWidth
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'price'}
                label="单价"
                type={"number"}
                maxLength={50}
                defaultValue={props.editData?.price}
                onInput={(event) => setPrice(event.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start">￥</InputAdornment>,
                }}
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'stock'}
                label="库存"
                type={"number"}
                maxLength={50}
                defaultValue={props.editData?.stock}
                onInput={(event) => setStock(event.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: <InputAdornment position="start">件</InputAdornment>,
                }}
                variant="outlined"/>
            <TextField
                margin="dense"
                name={'description'}
                label="输入描述"
                defaultValue={props.editData?.description}
                maxLength={100}
                type="text"
                multiline
                onInput={(event) => setDescription(event.target.value)}
                fullWidth
                minRows={3}
                variant="outlined"
                maxRows={4}
            />
            <Button loading={loading}
                    disabled={loading}
                    variant="contained"
                    className={classes.formButton2}
                    color="primary" type={'submit'}>
                保存
            </Button>
        </form>
    </div>
}
