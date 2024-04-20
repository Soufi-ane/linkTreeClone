const URL = "https://cors-anywhere.herokuapp.com/https://link-tree-clone-1kn77ibwn-soufianes-projects-8dbc43da.vercel.app";
// const URL = "https://link-tree-clone-ju1ha5y98-soufianes-projects-8dbc43da.vercel.app";

export async function logIn({ username, password }) {
    try {
        const res = await fetch(`${URL}/login`, {
            method: "POST",
            // credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.status == "fail") throw new Error("Incorrect username or password");
        // console.log(res);
        // console.log(data);
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

    return data;
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
export async function getLoginState(Token) {
    let result = {
        logedIn: false,
        id: null,
    };
    if (!Token) return result;

    const data = await fetch(`${URL}/is/logedIn`, {
        method: "GET",
        headers: {
            authorization: String(Token),
        },
    });
    const state = await data.json();

    return state;
}

export async function checkUsername(username) {
    const res = await fetch(`${URL}/getUsername/${username}`);
    const data = await res.json();
    return data;
}

export async function changeDetail(id, field, value, token) {
    const res = await fetch(`${URL}/changeDetails/${id}/${field}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: String(token),
        },
        body: JSON.stringify({
            newValue: value,
        }),
    });
    return res;
}

export async function DeleteAccount(ID, token) {
    const res = await fetch(`${URL}/deleteAccount/${ID}`, {
        method: "DELETE",
        headers: {
            authorization: String(token),
        },
    });
    return res;
}
