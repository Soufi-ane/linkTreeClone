const URL = "https://corsproxy.io/?https://link-tree-clone-eh7zyx8gt-soufianes-projects-8dbc43da.vercel.app";
export async function editPage(id, font, bg, token) {
    const res = await fetch(`${URL}/editPage/${id}`, {
        method: "POST",
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
