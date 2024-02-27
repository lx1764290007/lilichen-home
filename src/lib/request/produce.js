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
