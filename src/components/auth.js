export const getUserToken = () => {
    return(window.localStorage.getItem('fri_token'))
};
export const removeAuth = () => {
    window.localStorage.setItem('fri_token', '')
    window.localStorage.setItem('fri_userName', '')
    window.localStorage.setItem('fri_roles', '')
    return true
};
export const getAuth = () => {
    return(window.localStorage.getItem('fri_token'))
};
export const getUserName = () => {
    return(window.localStorage.getItem('fri_userName'))
};