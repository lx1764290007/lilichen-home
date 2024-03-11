/**
 * @typedef IMG_ITEM 图片列表项
 * @property {string} img 文件路径
 * @property {string} title 标题
 * @property {string} description 描述
 */

/**
 * 图片列表智能排版
 * @param {IMG_ITEM[]} params
 * @return {IMG_ITEM[]}
 */
export const autoCol = (params = []) => {
    return params.map((it, index) => {
        if(index === 0) {
            it.featured = true;
        } else it.featured = index % 2 === 0 ? Math.random() > 0.65 : params[index - 1].featured;
        return it;
    });
}

export const BONUS = 30;

export const requestFullscreen = ()=> {
    const element = document.documentElement; // 获取要全屏显示的元素，通常使用整个文档元素
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // 兼容Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // 兼容Chrome和Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // 兼容IE
        element.msRequestFullscreen();
    }
}
export const exitFullscreen = ()=> {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}