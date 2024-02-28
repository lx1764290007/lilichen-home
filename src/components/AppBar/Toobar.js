import AppBar from "@material-ui/core/AppBar";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: 68
    },
    title: {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
    }
}));
export const AppToolbar = (props) => {
    const classes = useStyles();
    return <div className={classes.root}>
        <AppBar position="static">
        <Toolbar>
            {props.left}
            <Typography variant="h6" className={classes.title}>
                {props.title}
            </Typography>
            {props.right}
        </Toolbar>
    </AppBar>
    </div>
}
