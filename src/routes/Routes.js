import {HomePageAppBar} from "../components/AppHeader/AppHeader";
import {HomePage} from "../views/home/Home";
import {AppToolbar} from "../components/AppBar/Toobar";
import {Login, LoginAppBarLeft, LoginAppBarRight} from "../views/login/Login";
import HomeIcon from '@material-ui/icons/HomeWork';
import SettingIcon from '@material-ui/icons/Settings';
import RedditIcon from '@material-ui/icons/Reddit';
import {ProductItem, Back, TopRightButton} from "../views/home/item/Product";
import {Supplier} from "../views/supplier/Supplier";
import DeckIcon from '@material-ui/icons/Deck';
import {SupplierItem} from "../views/supplier/SupplierItem";
import {GoodsItem, GoodsItemTopRightButton} from "../views/goods/GoodsItem";
import {AdvancedGoodsList, SEARCH_PLACEHOLDER} from "../views/goods/GoodsList";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import {NotFound} from "../views/404/NotFound";
import {Profile, ProfileEditor} from "../views/user/Profile";
import {Unauthorized} from "../views/404/Unauthorized";
import {UpdatePassword} from "../views/password/Password";
import {UserList} from "../views/user/UserList";
import {SettingPage} from "../views/setting/Setting";
import AndroidIcon from '@material-ui/icons/Android';
export const routes = [
    {
        component: <HomePage />,
        title: "产品",
        appBar: <HomePageAppBar title={"产品"} icon={<DeckIcon />} />,
        path: "/",
        name: "产品",
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
        appBar: <HomePageAppBar title={"供应商"} icon={<OfflineBoltIcon />} />,
        navigation: true,
        icon: <RedditIcon />,
        bottomNavigationBarShow: true,
        adminOnly: true
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
        component: <GoodsItem />,
        title: "面料添加",
        appBar: <AppToolbar left={<Back />} title={"面料添加"} right={<GoodsItemTopRightButton />} />,
        path: "/goods-add",
        name: "面料添加",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <GoodsItem />,
        title: "面料编辑",
        appBar: <AppToolbar left={<Back />} title={"面料编辑"} right={<GoodsItemTopRightButton />} />,
        path: "/goods-update",
        name: "面料编辑",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <AdvancedGoodsList />,
        title: "面料",
        appBar: <HomePageAppBar placeholder={SEARCH_PLACEHOLDER} title={"面料列表"} icon={<BookmarksIcon />} />,
        path: "/goods-list",
        name: "面料",
        icon: <LibraryBooksIcon />,
        navigation: true,
        bottomNavigationBarShow: true
    },
    {
        component: <AdvancedGoodsList />,
        title: "面料搜索结果",
        appBar: <AppToolbar left={<Back />} title={"面料搜索结果"} />,
        path: "/search-goods-list",
        name: "面料类型",
        icon: <LibraryBooksIcon />,
        navigation: false,
        bottomNavigationBarShow: false
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
        component: <SettingPage />,
        title: "设置",
        path: "/setting",
        name: "设置",
        appBar: <AppToolbar title={"设置"} left={<AndroidIcon />} />,
        navigation: true,
        icon: <SettingIcon />,
        bottomNavigationBarShow: true,
        adminOnly: true
    },
    {
        component: <Profile />,
        title: "用户",
        path: "/profile",
        name: "用户",
        appBar: <AppToolbar left={<Back />} title={"个人信息"} right={<ProfileEditor />} />,
        navigation: false,
        icon: <SettingIcon />,
        bottomNavigationBarShow: false
    },
    {
        component: <Profile editState />,
        title: "添加用户",
        path: "/profile-add",
        name: "添加用户",
        appBar: <AppToolbar left={<Back />} title={"添加用户"} />,
        navigation: false,
        icon: <SettingIcon />,
        bottomNavigationBarShow: false
    },
    {
        component: <UserList />,
        title: "用户",
        appBar: <HomePageAppBar title={"用户列表"} icon={<Back />} />,
        path: "/user-list",
        name: "用户",
        icon: <LibraryBooksIcon />,
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <UpdatePassword />,
        title: "密码修改",
        path: "/password",
        name: "用户",
        appBar: <AppToolbar left={<Back />} title={"修改密码"} />,
        navigation: false,
        icon: <SettingIcon />,
        bottomNavigationBarShow: false
    },

    {
        component: <Unauthorized />,
        title: "403",
        path: "/unauthorized",
        name: "403",
        navigation: false,
        bottomNavigationBarShow: false
    },

    {
        component: <NotFound />,
        title: "404",
        path: "/*",
        name: "404",
        navigation: false,
        bottomNavigationBarShow: false
    }
];
