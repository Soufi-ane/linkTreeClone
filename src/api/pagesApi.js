const URL = "https://cors-anywhere.herokuapp.com/https://link-tree-clone-1kn77ibwn-soufianes-projects-8dbc43da.vercel.app";
export async function editPage(id, font, bg, token) {
    const res = await fetch(`${URL}/editPage/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: String(token),
        },
        body: JSON.stringify({
            font: font || "Poppins",
            background: bg || "Light",
        }),
    });
    return res;
}
