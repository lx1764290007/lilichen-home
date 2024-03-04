import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse} from "@material-ui/core";
import Typography from "@material-ui/core/Typography"
import {deepOrange} from "@material-ui/core/colors";
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from '@material-ui/icons/Share';
import PersonPinIcon from "@material-ui/icons/PersonPin";
import {HomeWork} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root2: {
        maxWidth: '100%',
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
        fontWeight: 600
    },
    product: {
        paddingBottom: 0,
        marginBottom: 0
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
                    <IconButton aria-label="settings" onClick={(event)=> props.onMoreActionClick?.(event,props.dataSource)}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={<Typography component={"h4"} className={classes.title}><PersonPinIcon
                    className={classes.titleIcon}/>{props.dataSource?.name}</Typography>}
                subheader={<Typography  color={"primary"} paragraph variant={'subtitle2'} component={'p'}><HomeWork className={classes.titleIcon2}/>{props.dataSource?._supplierName}</Typography>}
            />
            <CardMedia
                className={classes.media}
                image={props.dataSource?.preview}
                title="pics"
            />
            <CardContent>
                <Typography paragraph variant={'h6'} className={classes.product} component={'p'}>
                    {props.dataSource?._productName}
                </Typography>

            </CardContent>
            <CardActions disableSpacing className={classes.footer}>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>

                <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    className={classes.expand2}
                >
                    <ExpandMoreIcon className={expanded? classes.moreIconUp:classes.moreIconDown} />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="subtitle1" color="textPrimary" >
                        {props.dataSource?.description}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
