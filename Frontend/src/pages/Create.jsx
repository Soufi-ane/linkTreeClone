import { useContext, useState } from "react";
import { LoginContext } from "../Context/LoginContext";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Loader from "../components/Loader";
import { SignUp, checkUsername, logIn } from "../api/usersApi";
import toast from "react-hot-toast";
import CreatePage from "../components/CreatePage";

function Create() {
    const { logedIn, setLogedIn } = useContext(LoginContext);
    const [isShown, setIsShown] = useState(false);
    const [isShownConfirm, setIsShownConfirm] = useState(false);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let data;
    const handleLogIn = async () => {
        if (username.length < 4) {
            toast.dismiss();
            return toast.error("The username is too short");
        }
        if (password == "") {
            toast.dismiss();
            return toast.error("Provide a password");
        }
        try {
            setIsLoading(true);
            data = await logIn({ username, password });
            setIsLoading(false);
            if (data?.token) {
                toast.dismiss();
                toast.success("Loged in");
                localStorage.setItem("webToken", String(data.token));
                setLogedIn(true);
                console.log(data.token);
            }
        } catch (err) {
            console.log(err.message);
            toast.dismiss();
            if (err.message == "Incorrect username or password") {
                return toast.error(err.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (name.length < 4) {
            toast.dismiss();
            return toast.error("The name is too short");
        }
        if (username.split(" ").length > 1) {
            toast.dismiss();
            return toast.error("Spaces are not allowed");
        }
        if (username.length < 4) {
            toast.dismiss();
            return toast.error("The username is too short");
        }
        if (password == "") {
            toast.dismiss();
            return toast.error("Provide a password");
        }
        if (password.length < 8) {
            toast.dismiss();
            return toast.error("The password is too short");
        }
        if (confirmPassword !== password) {
            toast.dismiss();
            return toast.error("The passwords don't match");
        } else {
            setIsLoading(true);
            try {
                const data = await checkUsername(username);
                console.log(data?.usersWithThisUsername?.USERS);
                if (!data?.usersWithThisUsername?.USERS) {
                    const res = await SignUp({ name, username, password });

                    if (res?.status === "created") {
                        toast.dismiss();
                        toast.success("Account created");

                        localStorage.setItem("webToken", String(res?.token));
                        setLogedIn(true);
                    }
                } else {
                    toast.dismiss();
                    return toast.error("Username taken");
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Failed to signup!");
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };
    if (isLoading) {
        toast.dismiss();
        toast.loading("Loading...");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {logedIn && <CreatePage />}

            {!logedIn && (
                <div className={`flex  flex-col items-center w-11/12 pt-10`}>
                    <h3 className={`text-xl text-center pb-5 font-medium`}>
                        Create one link for
                        <br />
                        All your links
                    </h3>
                    <h2 className={`font-medium pb-5 ${isSignUp ? "" : "pt-16 pb-5"}`}>{isSignUp ? "Create an Account" : "Log in"}</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="flex flex-col w-9/12 sm:w-6/12 md:w-4/12 max-w-[18.5rem] gap-2 ">
                        {isSignUp && (
                            <>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="your name"
                                    className="bg-stone-200 h-9 px-3"
                                />
                            </>
                        )}
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            placeholder="yourUserName"
                            className="bg-stone-200 h-9 px-3"
                        />
                        <label htmlFor="password">Password</label>
                        <span className="flex items-center gap-2">
                            <input
                                type={isShown ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="..........................."
                                className={`bg-stone-200  px-3 h-9 w-11/12 px-31 
                                ${isShown ? "" : "text-xl pt-1"}
                                  `}
                            />

                            <span
                                onClick={() => {
                                    setIsShown((curr) => !curr);
                                }}
                                className="text-xl cursor-pointer text-stone-500">
                                {!isShown ? <IoMdEye /> : <IoMdEyeOff />}
                            </span>
                        </span>
                        {isSignUp && (
                            <>
                                <label htmlFor="passwordConfirm">Confirm password</label>
                                <span className="flex items-center gap-2">
                                    <input
                                        type={isShownConfirm ? "text" : "password"}
                                        id="passwordConfirm"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                        }}
                                        placeholder="..........................."
                                        className={`bg-stone-200  px-3 h-9 w-11/12 px-31 
                                ${isShownConfirm ? "" : "text-xl pt-1"}
                                `}
                                    />

                                    <span
                                        onClick={() => {
                                            setIsShownConfirm((curr) => !curr);
                                        }}
                                        className="text-xl text-stone-500">
                                        {!isShownConfirm ? <IoMdEye /> : <IoMdEyeOff />}
                                    </span>
                                </span>
                            </>
                        )}
                        <button
                            onClick={() => {
                                if (isLoading) {
                                    return;
                                }
                                if (!isSignUp) {
                                    handleLogIn();
                                } else {
                                    handleSignUp();
                                }
                            }}
                            className="mt-5 h-9 font-medium text-stone-50 bg-blue-600 rounded-md">
                            {isSignUp ? "Sign up" : "Log in"}
                        </button>
                        <span className="text-sm pt-8 flex flex-col items-center">
                            <p>{isSignUp ? "Already have an Account ?" : "You don't have an account ?"}</p>

                            <span className="flex items-center gap-2">
                                <button
                                    className="text-blue-700"
                                    onClick={() => {
                                        setIsSignUp((curr) => !curr);
                                        setPassword("");
                                        setUsername("");
                                        setIsShown(false);
                                    }}>
                                    {isSignUp ? "Log in" : "Sign up"}
                                </button>
                            </span>
                        </span>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Create;
