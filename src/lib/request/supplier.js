import {useFetch as fetchHandle} from "./base";

export const fetchSupplierList = async (data)=>{
    return await fetchHandle({
        url: "company-list",
        config: {
            method: "GET"
        },
        data
    });
};

export const fetchSupplierAdd = async (data)=>{
    return await fetchHandle({
        url: "company-add",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchSupplierUpdate = async (data)=>{
    return await fetchHandle({
        url: "company-update",
        config: {
            method: "POST"
        },
        data
    });
};
