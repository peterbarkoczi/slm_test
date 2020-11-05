export const showMatches = (id) => {
    const matches = document.getElementById(id)
    if (matches.style.display === "none") {
        matches.style.display = "block";
    } else {
        matches.style.display = "none";
    }
}