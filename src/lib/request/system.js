import {useFetch as fetchHandle} from "./base";

export const fetchSystemRestart = async ()=>{
    return await fetchHandle({
        url: "system-restart",
        config: {
            method: "post"
        }
    });
};
export const fetchSystemStop = async ()=>{
    return await fetchHandle({
        url: "system-stop",
        config: {
            method: "post"
        }
    });
};
export const fetchSystemOpenDir = async ()=>{
    return await fetchHandle({
        url: "system-log",
        config: {
            method: "post"
        }
    });
};
export const fetchSystemOpenSourceDir = async ()=>{
    return await fetchHandle({
        url: "system-public",
        config: {
            method: "post"
        }
    });
};
