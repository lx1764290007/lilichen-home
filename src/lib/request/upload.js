import {useFetch as fetchHandle} from "./base";

export const fetchUploadProduct = async (data)=>{
    return await fetchHandle({
        url: "upload-product",
        config: {
            method: "FILE",
            // headers: {'Content-Type': 'multipart/form-data;'}
        },
        data
    });
};
export const fetchUploadGoods = async (data)=>{
    return await fetchHandle({
        url: "upload-goods",
        config: {
            method: "FILE",
            // headers: {'Content-Type': 'multipart/form-data;'}
        },
        data
    });
};
export const fetchFileRemove = async (data)=>{
    return await fetchHandle({
        url: "file-remove",
        config: {
            method: "POST",
            // headers: {'Content-Type': 'multipart/form-data;'}
        },
        data
    });
};
