const URL = "https://link-tree-clone-8yt9u6mjt-soufianes-projects-8dbc43da.vercel.app";
export async function getLoginState(WebToken) {
    if (!WebToken) return false;
    const data = await fetch(`${URL}/is/logedIn`, {
        method: "GET",
        headers: {
            authorization: String(WebToken),
        },
    });
    return data?.logedIn === true;
}

export async function logIn({ username, password }) {
    try {
        const res = await fetch(`${URL}/login`, {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.status == "fail") throw new Error("Incorrect username or password");
        console.log(res);
        console.log(data);
        if (data?.status == "success") {
            return data || "meow";
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function SignUp({ name, username, password }) {
    const res = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
            bio: "",
        }),
    });
    const data = await res.json();
    console.log(res);
    console.log(data);
    return res;
}
export async function getUserInfo(Token) {
    try {
        const info = await fetch(`${URL}/getUserInfo/byId`, {
            method: "GET",
            headers: {
                authorization: String(Token),
            },
        });

        const data = await info.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
