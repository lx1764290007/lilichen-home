import {useFetch as fetchHandle} from "./base";

export const fetchUserList = async (data)=>{
    return await fetchHandle({
        url: "user-list",
        config: {
            method: "GET"
        },
        data
    });
};
export const fetchUserSearch = async (data)=>{
    return await fetchHandle({
        url: "user-search",
        config: {
            method: "GET"
        },
        data
    });
};
export const fetchUserAdd = async (data)=>{
    return await fetchHandle({
        url: "user-add",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchUserUpdate = async (data)=>{
    return await fetchHandle({
        url: "user-update",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchUserUpdatePwd = async (data)=>{
    return await fetchHandle({
        url: "user-update-pwd",
        config: {
            method: "POST"
        },
        data
    });
};
export const fetchUserRemove = async (data)=>{
    return await fetchHandle({
        url: "user-remove",
        config: {
            method: "POST"
        },
        data
    });
};

