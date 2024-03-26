import {useFetch as fetchHandle} from "./base";
import {LOCAL_STORAGE_USER} from "../static";

export const fetchSupplierList = async (data)=>{
    const isAdmin =  window.localStorage.getItem(LOCAL_STORAGE_USER)? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_USER))?.root === 1:false;
    if(!isAdmin){
        return {data:[]};
    }
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
export const fetchSupplierRemove = async (data)=>{
    return await fetchHandle({
        url: "company-remove",
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
