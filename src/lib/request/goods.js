import {useFetch as fetchHandle} from "./base";

export const fetchGoodsList = async (data)=>{
    return await fetchHandle({
        url: "goods-list",
        config: {
            method: "GET"
        },
        data
    });
};
export const fetchGoodsSearch = async (data)=>{
    return await fetchHandle({
        url: "goods-search",
        config: {
            method: "GET"
        },
        data
    });
};
export const fetchGoodsAdd = async (data)=>{
    return await fetchHandle({
        url: "goods-add",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchGoodsUpdate = async (data)=>{
    return await fetchHandle({
        url: "goods-update",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchGoodsRemove = async (data)=>{
    return await fetchHandle({
        url: "goods-remove",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchGoodsPics = async (data)=>{
    return await fetchHandle({
        url: "goods-pics",
        config: {
            method: "GET"
        },
        data
    });
};
