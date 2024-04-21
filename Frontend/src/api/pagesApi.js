const URL = "/api";
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
