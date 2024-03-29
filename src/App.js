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
import StyleGlobal from "./global.module.css";
import {LOCAL_STORAGE_USER} from "./lib/static";


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
export const Context = React.createContext(null);

function App() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin =  window.localStorage.getItem(LOCAL_STORAGE_USER)? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_USER))?.root === 1:false;
    const appBar = useMemo(() => routes.find(it => it.path === location.pathname)?.appBar, [location]);
    const menuValue_ = useMemo(() => routes.find(it => it.path === location.pathname)?.path, [location]);
    const bottomNavigationBarShow = useMemo(() => routes.find(it => it.path === location.pathname)?.bottomNavigationBarShow, [location]);
    const [messageOpen, setMessageOpen] = useState(false);
    const [message, setMessage] = useState("UNKNOWN_MESSAGE");
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("UNKNOWN_ERROR_MESSAGE");
    const childStyle = useMemo(() => routes.find(it => it.path === location.pathname)?.bottomNavigationBarShow ? StyleGlobal.rc_container_with_navigation : StyleGlobal.rc_container_without_navigation, [location]);
    const initHeight =  useMemo(() => routes.find(it => it.path === location.pathname)?.bottomNavigationBarShow ? window.innerHeight - 64 - 64 : window.innerHeight - 64, [location]);//`calc(${window.innerHeight} )`
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
            setErrorMessageOpen(false);
            setErrorMessage(args[0]);
            setErrorMessageOpen(true);
        });

        vcSubscribePublish.subscribe("onNavigate", (args) => {
            if(args && args[0] && args[0] !== window.location.pathname){
                navigate(args[0]);
            }

        })

        return () => {
            vcSubscribePublish.unsubscribe("onMessage");
            vcSubscribePublish.unsubscribe("onErrorMessage");
            vcSubscribePublish.unsubscribe("onNavigate");

        }

    })
    const mobileHook = /Mobi|Android|iPhone/i.test(navigator.userAgent)? {height:initHeight + 'px'}:{};
    return (
        <div className="App" style={{height: window.innerHeight}}>
            <ThemeProvider theme={outerTheme}>
                <Context.Provider value={{mStyle: childStyle, mobileHook}}>
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
                                    return it.navigation && (!it.adminOnly || isAdmin)
                                }).map(it => {
                                    return <BottomNavigationAction key={it.name} value={it.path} label={it.name}
                                                                   icon={it.icon}/>
                                })
                            }
                        </BottomNavigation>}
                    </Container>
                </Context.Provider>
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
                    open={errorMessageOpen} autoHideDuration={3000} onClose={() => setErrorMessageOpen(false)}>
                    <div className={classes.errorContent}>
                        <ErrorOutline className={classes.errorIcon}/><Typography>{errorMessage}</Typography>
                    </div>
                </Snackbar>
            </ThemeProvider>
        </div>
    );
}

export default App;
