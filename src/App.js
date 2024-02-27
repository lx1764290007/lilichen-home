import './App.css';
import React, {useMemo, useState} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {BottomNavigation, createTheme, Snackbar, ThemeProvider} from "@material-ui/core";
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from "@material-ui/core/Container";
import {routes} from "./routes/Routes";
import vcSubscribePublish from "vc-subscribe-publish";
import {useMount} from "ahooks";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    bottomBar: {
        height: 64,
        backgroundColor: indigo[100]
    },
    snackbar: {
        [theme.breakpoints.down('xs')]: {
            bottom: 60,
        }
    }
}));
export const useContainerStyle = makeStyles((theme) => ({
    container: {
        height: `calc(100vh - 64px - 64px)`
    }
}));
export const useContainerWithoutNavigationBarStyle = makeStyles((theme) => ({
    container: {
        height: `calc(100vh - 64px)`
    }
}));
const outerTheme = createTheme({
    palette: {
        primary: {
            main: indigo[300]
        },
    },
});
const Style = {
    container: {
        backgroundColor: 'aliceblue',
        padding: 0
    }
}

function App() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const appBar = useMemo(() => routes.find(it => it.path === location.pathname)?.appBar, [location]);
    const menuValue_ = useMemo(() => routes.find(it => it.path === location.pathname)?.path, [location]);
    const bottomNavigationBarShow = useMemo(() => routes.find(it => it.path === location.pathname)?.bottomNavigationBarShow, [location]);
    const [messageOpen, setMessageOpen] = useState(false);
    const [message, setMessage] = useState("UNKNOWN");
    const onRouteChangeHandler = (_, newValue) => {
        // setMenuValue(newValue);
        navigate(newValue);
    }
    useMount(() => {
        vcSubscribePublish.subscribe("onMessage", (args) => {
            setMessageOpen(false);
            setMessage(args[0]);
            setMessageOpen(true);
        });
        vcSubscribePublish.subscribe("onNavigate", (args) => {
            navigate(args[0]);
        })
    })
    return (
        <div className="App">
            <ThemeProvider theme={outerTheme}>
                <Container style={Style.container} maxWidth="md" fixed>
                    {appBar}
                    <Routes>
                        {
                            routes.map(item => {
                                return <Route path={item.path} key={item.path} name={item.name}
                                              element={item.component}/>
                            })
                        }
                    </Routes>
                    {bottomNavigationBarShow && <BottomNavigation
                        value={menuValue_}
                        size={"sm"}
                        className={classes.bottomBar}
                        onChange={onRouteChangeHandler}
                        showLabels
                    >
                        {
                            routes.filter(it => {
                                return it.navigation
                            }).map(it => {
                                return <BottomNavigationAction key={it.name} value={it.path} label={it.name}
                                                               icon={it.icon}/>
                            })
                        }
                    </BottomNavigation>}
                </Container>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    className={classes.snackbar}
                    open={messageOpen}
                    autoHideDuration={3000}
                    onClose={() => setMessageOpen(false)}
                    message={message}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit"
                                        onClick={() => setMessageOpen(false)}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </ThemeProvider>
        </div>
    );
}

export default App;
