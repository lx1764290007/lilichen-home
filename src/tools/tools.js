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
