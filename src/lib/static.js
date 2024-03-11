/**
 * 此文件是用于记录静态数据的
 */
export const LOCAL_STORAGE_USER = "info";
export const PAGE_SIZE = 10;

export const IMAGE_TYPE = {
    PRODUCT: "p",
    GOODS: "g"
}
//密码需要包含特殊字符，字母，数字，至少包含两种且长度是6-20
export const PASSWORD_REGEX = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/
