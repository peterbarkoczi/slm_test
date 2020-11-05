export const hasRole = (roles) => {
    if (localStorage.getItem("user") !== null) {
        let user = JSON.parse(localStorage.getItem("user"));
        return roles.some(role => user.roles.includes(role));
    }
    return false;
}

export const isAllowed = (currentId) => {
    if (localStorage.getItem("user") !== null) {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user.roles.includes("admin")) return true;
        return user.roles.includes("coach") && user["teamId"] === currentId;
    }
}

export const authHeader = () => {
    if (localStorage.getItem("user") !== null) {
        let user = JSON.parse(localStorage.getItem("user"));
        return {Authorization: "Bearer " + user.token}
    }
    return {}
}