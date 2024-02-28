import React from 'react';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '0 auto'
    },
    ty: {
        padding: theme.spacing(1),
        color: '#aaa',
        fontSize: 14
    },
    icon: {
        fontSize: 70,
        color: '#bbb'
    }
}))
export const Empty = ()=> {
    const classes = useStyles();
    return <div className={classes.root}>
         <FreeBreakfastIcon className={classes.icon} />
         <Typography className={classes.ty}>没有记录</Typography>
    </div>
}

