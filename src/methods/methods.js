export const getLastPathPart = (str) => {
    return str.substring(str.lastIndexOf("/") + 1)
}