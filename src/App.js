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
import Typography from "@material-ui/core/Typography";
import {ErrorOutline} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    bottomBar: {
        height: 64,
        backgroundColor: indigo[100],
        position: 'relative'
    },
    snackbar: {
        [theme.breakpoints.down('xs')]: {
             top: 60,
        }
    },
    snackbarError: {
        [theme.breakpoints.down('xs')]: {
            top: 80
        }
    },
    errorContent: {
        backgroundColor: '#ea2222',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: 8,
        textAlign: 'center',
        minWidth: 300,
        overflow: 'hidden',
        wordWrap: 'wrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    errorIcon: {
        fontSize: 'large',
        marginRight: theme.spacing(2),
        fontWeight: 700
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
    const [message, setMessage] = useState("UNKNOWN_MESSAGE");
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("UNKNOWN_ERROR_MESSAGE");
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
        vcSubscribePublish.subscribe("onErrorMessage", (args) => {
            console.log(1)
            setErrorMessageOpen(false);
            setErrorMessage(args[0]);
            setErrorMessageOpen(true);
        });
        vcSubscribePublish.subscribe("onNavigate", (args) => {
            navigate(args[0]);
        })
        return ()=> {
            vcSubscribePublish.unsubscribe("onMessage");
            vcSubscribePublish.unsubscribe("onErrorMessage");
            vcSubscribePublish.unsubscribe("onNavigate");
        }
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
                        vertical: 'top',
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
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    className={classes.snackbarError}
                    open={errorMessageOpen} autoHideDuration={3000} onClose={()=> setErrorMessageOpen(false)}>
                     <div className={classes.errorContent}>
                         <ErrorOutline className={classes.errorIcon} /><Typography>{errorMessage}</Typography>
                     </div>
                </Snackbar>
            </ThemeProvider>
        </div>
    );
}

export default App;
