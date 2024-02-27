import {HomePageAppBar} from "../views/home/app-header/AppHeader";
import {HomePage} from "../views/home/Home";
import {AppToolbar} from "../components/AppBar/Toobar";
import {Login} from "../views/login/Login";
import HomeIcon from '@material-ui/icons/HomeWork';
import UserIcon from '@material-ui/icons/AccountBox';
import SettingIcon from '@material-ui/icons/Settings';
import RedditIcon from '@material-ui/icons/Reddit';
export const routes = [
    {
        component: <HomePage />,
        title: "hello world",
        appBar: <HomePageAppBar />,
        path: "/",
        name: "产品",
        navigation: true,
        icon: <HomeIcon />,
        bottomNavigationBarShow: true
    },
    {
        component: <div>page1</div>,
        title: "page1",
        path: "/page1",
        name: "供应商",
        appBar: <AppToolbar />,
        navigation: true,
        icon: <RedditIcon />,
        bottomNavigationBarShow: true
    },
    {
        component: <div>page2</div>,
        title: "page2",
        path: "/page2",
        name: "用户",
        appBar: <AppToolbar />,
        navigation: true,
        bottomNavigationBarShow: true,
        icon: <UserIcon />
    },
    {
        component: <Login />,
        title: "login",
        path: "/login",
        name: "登录",
        appBar: <AppToolbar />,
        navigation: false,
        icon: null,
        bottomNavigationBarShow: false
    },
    {
        component: <div>page3</div>,
        title: "page3",
        path: "/page3",
        name: "系统",
        appBar: <AppToolbar />,
        navigation: true,
        icon: <SettingIcon />,
        bottomNavigationBarShow: true
    }
];
