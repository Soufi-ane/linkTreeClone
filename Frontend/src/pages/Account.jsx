import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { DeleteAccount, getUserInfo } from "../api/usersApi";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { MdOutlineContentCopy } from "react-icons/md";

function Account() {
    let webToken;
    webToken = localStorage.getItem("webToken");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { logedIn, setLogedIn } = useContext(LoginContext);
    const [mainData, setMainData] = useState("");
    const [isModal, setIsModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const Func = async () => {
        setIsLoading(true);
        try {
            const data = await getUserInfo(webToken);
            setIsLoading(false);
            setMainData(data?.data?.pageData);
        } catch (err) {
            console.log(err.message);
            toast.dismiss();
            toast.error("Something went wrong!");
        }
    };
    const HandleLogOut = async () => {
        try {
            setIsLoading(true);
            localStorage.removeItem("webToken");
            navigate("/linkTreeClone/");
            setLogedIn(false);
        } catch (err) {
            toast.dismiss();
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };
    const HandleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            const res = await DeleteAccount(mainData?.id, webToken);

            if (res?.status == 204) {
                setLogedIn(false);
                toast.dismiss();
                toast.success("Account deleted");
                localStorage.removeItem("webToken");
                navigate("/");
            } else {
                toast.dismiss();
                return toast.error("Failed to delete the account");
            }
        } catch {
            toast.dismiss();
            return toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    const HandleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`https://link-tree-clone-api.vercel.app/${mainData?.username}`);
            toast.dismiss();
            toast.success("Copied");
        } catch {
            toast.dismiss();
            toast.error("Permission denied");
        }
    };
    useEffect(() => {
        Func();
        if (!logedIn) {
            navigate("/");
        }
    }, []);
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div className="">
            {isDeleting && (
                <Modal text="Delete" onCancel={() => setIsDeleting(false)} onConfirm={HandleDeleteAccount}>
                    <p>
                        Are you sure you want to
                        <br />
                        delete your account
                    </p>
                </Modal>
            )}
            {isModal && (
                <Modal
                    onConfirm={() => {
                        HandleLogOut();
                        setIsModal(false);
                    }}
                    onCancel={() => {
                        setIsModal(false);
                    }}
                    text="Log out">
                    <p>
                        Are you sure you want
                        <br />
                        to log out
                    </p>
                </Modal>
            )}
            <div className="flex flex-col items-center gap-5 py-28">
                <span className="">
                    <p className="mb-2 text-sm">LinkTree URL</p>
                    <span className="flex items-center gap-5">
                        <p className="bg-stone-200 w-60 rounded-sm overflow-x-scroll py-2 px-2 ">{`link-tree-clone-api.vercel.app/${mainData?.username}`}</p>
                        <button onClick={HandleCopy} className="bg-stone-200 text-lg p-3 rounded-sm">
                            <MdOutlineContentCopy />
                        </button>
                    </span>
                </span>

                <span className="flex items-center gap-3">
                    <p className="bg-stone-200 rounded-sm py-2 w-48 px-2">{`@${mainData?.username}`}</p>
                    <button
                        onClick={() => {
                            setIsModal(true);
                        }}
                        className="bg-stone-200 font-medium text-red-700 rounded-sm py-2 px-4">
                        Log out
                    </button>
                </span>
                <button
                    onClick={() => {
                        setIsDeleting(true);
                    }}
                    className="text-red-900 font-medium bg-red-300 py-3 rounded-md w-[85vw]">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Account;
