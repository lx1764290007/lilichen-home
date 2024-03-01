import {HomePageAppBar} from "../views/home/app-header/AppHeader";
import {HomePage} from "../views/home/Home";
import {AppToolbar} from "../components/AppBar/Toobar";
import {Login, LoginAppBarLeft, LoginAppBarRight} from "../views/login/Login";
import HomeIcon from '@material-ui/icons/HomeWork';
import UserIcon from '@material-ui/icons/AccountBox';
import SettingIcon from '@material-ui/icons/Settings';
import RedditIcon from '@material-ui/icons/Reddit';
import {ProductItem, Back, TopRightButton} from "../views/home/item/Product";
import {Supplier} from "../views/supplier/Supplier";
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import DeckIcon from '@material-ui/icons/Deck';
import {SupplierItem} from "../views/supplier/SupplierItem";
export const routes = [
    {
        component: <HomePage />,
        title: "基础产品",
        appBar: <HomePageAppBar title={"基础产品"} icon={<DeckIcon />} />,
        path: "/",
        name: "基础产品",
        navigation: true,
        icon: <HomeIcon />,
        bottomNavigationBarShow: true
    },
    {
        component: <ProductItem />,
        title: "产品添加",
        appBar: <AppToolbar left={<Back />} title={"产品添加"} right={<TopRightButton />} />,
        path: "/product-add",
        name: "产品添加",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <ProductItem />,
        title: "产品编辑",
        appBar: <AppToolbar left={<Back />} title={"产品编辑"} right={<TopRightButton />} />,
        path: "/product",
        name: "产品编辑",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <Supplier />,
        title: "供应商",
        path: "/supplier",
        name: "供应商",
        appBar: <HomePageAppBar title={"供应商"} icon={<ContactPhoneIcon />} />,
        navigation: true,
        icon: <RedditIcon />,
        bottomNavigationBarShow: true
    },
    {
        component: <SupplierItem />,
        title: "供应商编辑",
        path: "/supplier-update",
        name: "供应商编辑",
        appBar: <AppToolbar left={<Back />} title={"供应商编辑"} />,
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <SupplierItem />,
        title: "供应商添加",
        path: "/supplier-add",
        name: "供应商添加",
        appBar: <AppToolbar left={<Back />} title={"供应商添加"} />,
        navigation: false,
        bottomNavigationBarShow: false
    },
    //SupplierItem
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
        appBar: <AppToolbar left={<LoginAppBarLeft />} title={"登 录"} right={<LoginAppBarRight />} />,
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
