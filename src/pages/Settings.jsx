import { useContext, useEffect, useState } from "react";
import { changeDetail, checkUsername, getUserInfo } from "../api/usersApi";
import { LoginContext } from "../Context/LoginContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Settings({ data }) {
    let webToken;
    webToken = localStorage.getItem("webToken");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const [myData, setMyData] = useState(null);

    const { logedIn, setLogedIn } = useContext(LoginContext);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [font, setFont] = useState("Poppins");
    const [theme, setTheme] = useState("");
    if (!webToken) {
        setLogedIn(false);
    }
    const [mainData, setMainData] = useState("");
    const Func = async () => {
        setIsLoading(true);
        try {
            const data = await getUserInfo(webToken);
            // setMyData(data);
            setMainData(data?.data?.pageData);
            setName(data?.data?.pageData?.name);
            setUsername(data?.data?.pageData?.username);
            setBio(data?.data?.pageData?.bio);
            setFont(data?.data?.pageData?.font);
            setTheme(data?.data?.pageData?.background);
        } catch (err) {
            console.log(err.message);
            toast.dismiss();
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const HandleChangeDetails = async (field, value) => {
        try {
            let isTaken;
            const data = await checkUsername(username);
            isTaken = Boolean(data?.usersWithThisUsername?.USERS);

            if (value == mainData[field]) {
                return;
            }
            if (field == "username" && isTaken) {
                toast.dismiss();
                return toast.error("Username taken");
            }
            const res = await changeDetail(mainData?.id, field, value, webToken);
            console.log(res?.status);
            if (res?.status === 204) {
                toast.dismiss();
                toast.success(`Saved ${field}`);
            }
        } catch (err) {
            toast.dismiss();
            toast.error(`Failed to save ${field}`);
        } finally {
            Func();
        }
    };
    const EditPageDesc = useEffect(() => {
        Func();
        if (!logedIn) {
            navigate("/linkTreeClone/");
        }
    }, []);
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div className="flex items-center py-20 px-7">
            <div>
                <span>
                    <Form
                        text="Name"
                        buttonAction={() => {
                            HandleChangeDetails("name", name);
                        }}
                        value={name}
                        update={setName}
                        type="text"
                    />
                    <Form
                        text="Username"
                        buttonAction={() => {
                            if (username.length > 3) {
                                HandleChangeDetails("username", username);
                            } else {
                                toast.dismiss();
                                return toast.error("Username is too short");
                            }
                        }}
                        value={`@${username}`}
                        update={setUsername}
                        type="text"
                    />

                    <div className="my-3">
                        <label className="text-sm">Bio</label>
                        <span className="flex items-center gap-3  justify-center">
                            <textarea
                                className="w-56 h-28 rounded-sm py-2 px-3 bg-stone-300 resize-y max-h-44"
                                value={bio}
                                maxLength={150}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                }}
                            />
                            <button
                                onClick={() => {
                                    HandleChangeDetails("bio", bio);
                                }}
                                className="rounded-md bg-stone-300 h-10 w-16">
                                Save
                            </button>
                        </span>
                    </div>

                    <div className="flex flex-col  gap-2">
                        <label className="text-sm">Font</label>
                        <span className="flex items-center gap-3  justify-center">
                            <select
                                style={{
                                    fontFamily: font,
                                }}
                                className="h-10 text-sm  rounded-sm bg-stone-300 px-3 w-56"
                                value={font}
                                onChange={(e) => {
                                    setFont(e.target.value);
                                }}
                                name="font">
                                <option
                                    style={{
                                        fontFamily: "Poppins",
                                    }}
                                    value="Poppins">
                                    Try this font
                                </option>
                                <option
                                    style={{
                                        fontFamily: "Roboto Mono",
                                    }}
                                    value="Roboto Mono">
                                    Try this font
                                </option>
                                <option
                                    style={{
                                        fontFamily: "Oswald",
                                    }}
                                    value="Oswald">
                                    Try this font
                                </option>
                                <option
                                    style={{
                                        fontFamily: "Ubuntu",
                                    }}
                                    value="Ubuntu">
                                    Try this font
                                </option>
                                <option
                                    style={{
                                        fontFamily: "Fuzzy Bubbles",
                                    }}
                                    value="Fuzzy Bubbles">
                                    Try this font
                                </option>
                                <option
                                    style={{
                                        fontFamily: "Arial",
                                    }}
                                    value="Arial">
                                    Try this font
                                </option>
                            </select>
                            <button
                                onClick={() => {
                                    HandleChangeDetails("font", font);
                                }}
                                className="rounded-md bg-stone-300 h-10 w-16">
                                Save
                            </button>
                        </span>
                    </div>
                    <div className="flex mt-4 flex-col  gap-2">
                        <label className="text-sm">LinkTree theme</label>
                        <span className="flex items-center gap-3  justify-center">
                            <select
                                className="h-10  text-sm rounded-sm bg-stone-300 px-3 w-56"
                                value={theme}
                                onChange={(e) => {
                                    setTheme(e.target.value);
                                }}
                                name="theme">
                                <option value="#fafaf9">Light</option>
                                <option value="#09090b">Dark</option>
                            </select>
                            <button
                                onClick={() => {
                                    HandleChangeDetails("background", theme);
                                }}
                                className="rounded-md bg-stone-300 h-10 w-16">
                                Save
                            </button>
                        </span>
                    </div>
                </span>
            </div>
        </div>
    );
}

function Form({ text, buttonAction, value, update, type }) {
    return (
        <div className="flex flex-col item-center gap-2 mt-2">
            <label className="text-sm mt-2">{text}</label>
            <span className="flex items-center gap-3  justify-center">
                <input
                    className="w-56 h-10 rounded-sm px-3 bg-stone-300"
                    type={type}
                    maxLength={text == "Username" || text == "Name" ? 20 : 100}
                    value={value}
                    onChange={(e) => {
                        if (text == "Username") {
                            return update(e.target.value.replace("@", ""));
                        }
                        update(e.target.value);
                    }}
                />
                <button onClick={buttonAction} className="rounded-md bg-stone-300 h-10 w-16">
                    Save
                </button>
            </span>
        </div>
    );
}

export default Settings;
