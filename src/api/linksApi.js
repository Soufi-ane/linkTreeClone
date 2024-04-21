const URL = "https://crossorigin.me/https://link-tree-clone-api.vercel.app";

export async function addLink(token, userId, text, url, color, bg_color, radius) {
    try {
        const res = await fetch(`${URL}/addLink/${userId}`, {
            method: "POST",
            headers: {
                authorization: String(token),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                url,
                color,
                bg_color,
                radius: `${radius}px`,
            }),
        });

        return res;
    } catch (err) {
        console.log(err);
    }
}
export async function deleteLink(userID, linkID, token) {
    const res = await fetch(`${URL}/deleteLink/${userID}`, {
        method: "DELETE",

        headers: {
            authorization: String(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            linkId: Number(linkID),
        }),
    });
    return res;
}
export async function getLinkTree(userN) {
    const res = await fetch(`${URL}/${userN}`);
    const data = await res.json();
    return data;
}
