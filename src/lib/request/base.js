import qs from "qs";
import eventBus from "vc-subscribe-publish";

let timeout = null;

function debounce(fn, wait) {

    return function () {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, wait);
    };
}

export const logoutHandle = ()=>{
    eventBus.public("onNavigate", "/login");
};
export const onResponseHandle = function (res, resolve, reject) {
    if (res.status === 401) {
        debounce(function () {
            onResponseError(res, reject);
            logoutHandle();
        }, 1000)();

    } else if (res.status === 412 || res.status === 400) {
        onResponseError(res, reject);
    } else if (res.status === 403) {
        reject(res.message);
    } else {
        if (!res.ok) {
            onResponseError(res, reject);
        } else if (res.status === 200) {
            res.json().then((x) => resolve(x)).catch(() => {
                reject(null);
            });
        } else onResponseError(res, reject);
    }
};

export const onResponseError = (res, reject) => {

    // eslint-disable-next-line no-unused-vars
    let message = "";
    try {
        res.json().then((result) => {
            message = result?.message;
            eventBus.public("onErrorMessage",  message || result?.message || result?.error);
            reject(result?.message);
        }).catch(function (e) {
            eventBus.public("onErrorMessage",  message || e?.message || e?.error);
        });
    } catch (e) {
        eventBus.public("onErrorMessage",  message || e?.message || e?.error);
    }
    // reject && reject(new Error("error"));
};


const BASE_URL = "/s/";
export const useFetch = function (data) {
    const {url} = data;

    return new Promise((resolve, reject) => {

        if (data.config?.method?.toUpperCase() === "GET" || data.config?.method === undefined) {
            const qsString = qs.stringify(data.data, {indices: true});

            fetch(`${BASE_URL}${url}?${qsString}`, {credentials: "include", mode: "cors"}).then((res) => {
                onResponseHandle(res, resolve, reject);
            }).catch((err) => {
                onResponseError(err, reject);

            });
        } else if(data.config?.method?.toUpperCase() === "FILE"){
            fetch(BASE_URL + url || "", {
                body: data.data,
                credentials: "include",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache",
                ...data.config,
                method: "POST"
            }).then((res) => {
                onResponseHandle(res, resolve, reject);
            }).catch((err) => {
                eventBus.public("onMessage", err?.message);
            });
        } else {
            fetch(BASE_URL + url || "", {
                body: JSON.stringify(data.data),
                headers: {"Content-Type": "application/json;charset=utf-8"},
                credentials: "include",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache",
                ...data.config
            }).then((res) => {
                onResponseHandle(res, resolve, reject);
            }).catch((err) => {
                eventBus.public("onErrorMessage", err?.message);
            });
        }
    }).catch((e) => {
        console.error(e?.message || e);
    });
};

