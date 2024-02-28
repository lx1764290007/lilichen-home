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
