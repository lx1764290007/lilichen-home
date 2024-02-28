import {useFetch as fetchHandle} from "./base";

export const fetchLogin = async (data)=>{
    return await fetchHandle({
        url: "login",
        config: {
            method: "POST"
        },
        data
    });
};
