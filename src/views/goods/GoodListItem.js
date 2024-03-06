import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Avatar, Card, CardContent, CardHeader, CardMedia, Collapse} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {deepOrange, indigo} from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import {HomeWork} from "@material-ui/icons";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
    root2: {
        maxWidth: '100%',
        position: 'relative'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: deepOrange[500],
    },
    moreIconUp: {
        position: 'relative',
        transform: 'translateX(180deg)'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600
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
    footer: {
        justifyContent: 'space-between'
    },
    expand2: {
        fontSize: "larger",
        fontWeight: 600,
        position: 'absolute',
        top: 10,
        right: 10
    },
    product: {
        paddingBottom: 0,
        marginBottom: 0
    },
    property: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontSize: 16,
        paddingBottom: 20
    },
    footerItem: {
        backgroundColor: indigo[100],
        color: '#2b74d3',
        overflow: 'hidden',
        padding: '1px 8px',
        boxSizing: 'content-box',
        borderRadius: 15,
        marginTop: 5,
        marginLeft: 1
    },
    date: {
        position: "absolute",
        top: 100,
        color: '#fefefe',
        zIndex: 1,
        right: 10,
        fontSize: 14
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
export const AdvancedGoodsListItem = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (

        <Card className={classes.root2}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {props.dataSource?.name?.substring?.(0, 1)}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings"
                                onClick={(event) => props.onMoreActionClick?.(event, props.dataSource)}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={<Typography component={"h4"} className={classes.title}><PersonPinIcon
                    className={classes.titleIcon}/>{props.dataSource?.name}</Typography>}
                subheader={<Typography color={"primary"} paragraph variant={'subtitle2'} component={'p'}><HomeWork
                    className={classes.titleIcon2}/>{props.dataSource?._supplierName}</Typography>}
            />
            <CardMedia
                className={classes.media}
                image={props.dataSource?.preview}
                title="pics"
                onClick={()=> props.onOpenPicPreview?.(props.dataSource?.uuid)}
            />
            <Typography
                className={classes.date}>{dayjs(props.dataSource?.updateTime).format(FORMAT)}</Typography>
            <CardContent style={{position: 'relative'}}>
                <Typography paragraph variant={'h6'} className={classes.product} color={'textPrimary'} component={'p'}>
                    {props.dataSource?._productName}
                </Typography>
                <Typography paragraph variant={'caption'} color={'textSecondary'}>
                    (相关产品)
                </Typography>
                <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    className={classes.expand2}
                > <Typography paragraph variant={'caption'} style={{marginBottom: 0}} component={'span'} color={'textSecondary'}>{expanded?'收起':'更多'}</Typography>
                    <ExpandMoreIcon style={{transform: `rotateX(${expanded?'180deg':0})`}} />
                </IconButton>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <div className={classes.property}>
                        {props.dataSource?.fabric && <Typography className={classes.footerItem}
                                                                 variant={'body1'}>材质: {props.dataSource?.fabric}</Typography>}
                        {props.dataSource?.specs && <Typography className={classes.footerItem}
                                                                variant={'body1'}>规格: {props.dataSource?.specs}</Typography>}
                        {props.dataSource?.price && <Typography className={classes.footerItem}
                                                                variant={'body1'}>单价: {props.dataSource?.price}</Typography>}
                        {props.dataSource?.stock && <Typography className={classes.footerItem}
                                                                variant={'body1'}>库存: {props.dataSource?.stock}</Typography>}
                    </div>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.dataSource?.description}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>

    );
}
