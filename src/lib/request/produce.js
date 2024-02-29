import {useFetch as fetchHandle} from "./base";

export const fetchProductList = async (data)=>{
    return await fetchHandle({
        url: "product-list",
        config: {
            method: "GET"
        },
        data
    });
};

export const fetchProductAdd = async (data)=>{
    return await fetchHandle({
        url: "product-add",
        config: {
            method: "POST"
        },
        data
    });
};

export const fetchProductPics = async (data)=>{
    return await fetchHandle({
        url: "product-pics",
        config: {
            method: "GET"
        },
        data
    });
};
