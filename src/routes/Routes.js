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
        appBar: <HomePageAppBar title={"供应商"} icon={<OfflineBoltIcon />} />,
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
        component: <GoodsItem />,
        title: "进阶产品添加",
        appBar: <AppToolbar left={<Back />} title={"进阶产品添加"} right={<GoodsItemTopRightButton />} />,
        path: "/goods-add",
        name: "进阶产品添加",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <GoodsItem />,
        title: "进阶产品编辑",
        appBar: <AppToolbar left={<Back />} title={"进阶产品编辑"} right={<GoodsItemTopRightButton />} />,
        path: "/goods-update",
        name: "进阶产品编辑",
        navigation: false,
        bottomNavigationBarShow: false
    },
    {
        component: <AdvancedGoodsList />,
        title: "进阶产品",
        appBar: <HomePageAppBar placeholder={SEARCH_PLACEHOLDER} title={"进阶产品列表"} icon={<BookmarksIcon />} />,
        path: "/goods-list",
        name: "进阶产品",
        icon: <LibraryBooksIcon />,
        navigation: true,
        bottomNavigationBarShow: true
    },
    {
        component: <AdvancedGoodsList />,
        title: "进阶产品搜索结果",
        appBar: <AppToolbar left={<Back />} title={"搜索结果"} />,
        path: "/search-goods-list",
        name: "进阶产品",
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
