import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {HomePage} from "./views/home/Home";
import {BottomNavigation, createTheme, ThemeProvider} from "@material-ui/core";
import {indigo} from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/HomeWork';
import UserIcon from '@material-ui/icons/AccountBox';
import SettingIcon from '@material-ui/icons/Settings';
import {useNavigate} from "react-router-dom";
import RedditIcon from '@material-ui/icons/Reddit';

const useStyles = makeStyles({
    root: {
        height: 64,
        backgroundColor: indigo[100]
    },
});
const outerTheme = createTheme({
    palette: {
        primary: {
            main: indigo[300]
        },
    },
});

function App() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    return (
        <div className="App">
            <ThemeProvider theme={outerTheme}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/page1" element={<div>page1</div>} />
                <Route path="/page2" element={<div>page2</div>} />
            </Routes>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        navigate(newValue === 0? "/":newValue===1? "/page1":"/page2");
                    }}
                    size={"sm"}
                    showLabels
                    className={classes.root}
                >
                    <BottomNavigationAction label="产品" icon={<HomeIcon />} />
                    <BottomNavigationAction label="供应商" icon={<RedditIcon />} />
                    <BottomNavigationAction label="用户" icon={<UserIcon />} />
                    <BottomNavigationAction label="系统" icon={<SettingIcon />} />

                </BottomNavigation>
            </ThemeProvider>
        </div>
    );
}

export default App;
