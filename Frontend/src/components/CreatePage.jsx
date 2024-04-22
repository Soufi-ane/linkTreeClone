import { getUserInfo } from "../api/usersApi";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addLink, deleteLink } from "../api/linksApi";
import Modal from "../components/Modal";
import { useClickOutside } from "../useClickOutside";
import { LoginContext } from "../Context/LoginContext";
let webToken;
import Loader from "../components/Loader";
function CreatePage() {
    webToken = localStorage.getItem("webToken");
    const [isLoading, setIsLoading] = useState(false);

    const [myData, setMyData] = useState(null);
    let data;
    const { logedIn, setLogedIn } = useContext(LoginContext);

    if (!webToken) {
        setLogedIn(false);
    }

    const Func = async () => {
        setIsLoading(true);
        try {
            data = await getUserInfo(webToken);
            setMyData(data);
        } catch (err) {
            console.log(err.message);
            toast.dismiss();
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        Func();
    }, []);
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="h-[90dvh]">
            <AddLink rerender={Func} ID={myData?.data?.pageData?.id} />
            <div className="text-stone-50 overflow-y-scroll">{!isLoading && <Page rerender={Func} data={myData} />}</div>
        </div>
    );
}

export default CreatePage;

function Page({ rerender, data }) {
    const [isModal, setIsModal] = useState(false);
    const [currentLink, setCurrentLink] = useState("");
    const [loading, setLoading] = useState(false);
    const pageData = data?.data?.pageData;

    const HandleDeleteLink = async () => {
        setLoading(true);
        try {
            setIsModal(false);
            const res = await deleteLink(pageData?.id, currentLink, webToken);
            if (res?.status === 204) {
                toast.dismiss();
                toast.success("Deleted");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);

            rerender();
        }
    };
    if (loading) {
        toast.dismiss();
        toast.loading("Loading...");
    }

    return (
        <div className="flex flex-col h-[100dvh] ">
            {isModal && (
                <Modal
                    text="Delete"
                    onCancel={() => {
                        setIsModal(false);
                    }}
                    onConfirm={HandleDeleteLink}>
                    <p>
                        Are you sure you want to
                        <br />
                        delete this link ?
                    </p>
                </Modal>
            )}
            <div
                style={{
                    backgroundColor: pageData?.background || "white",
                    fontFamily: pageData?.font || "Poppins",
                }}
                className="  py-10 overflow-y-scroll  w-[99vw] flex flex-col items-center gap-10">
                <span className={` ${pageData?.background == "#fafaf9" ? "text-stone-600" : "text-stone-50"} text-center pt-5 w-[80vw]`}>
                    <h2 className="font-medium">{pageData?.name}</h2>
                    <h4 className="text-sm">{`@${pageData?.username}`}</h4>
                    <p className="pt-5">{pageData?.bio}</p>
                </span>
                <div className="flex  items-center flex-col gap-5 justify-center">
                    {!data?.data?.links?.length > 0 && <div className={` ${pageData?.background == "#fafaf9" ? "text-stone-600" : "text-stone-50"} pt-56`}>No links yet</div>}
                    {data &&
                        data?.data?.links?.length > 0 &&
                        data?.data?.links.map((link, index) => (
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsModal(true);
                                    setCurrentLink(link.id);
                                }}
                                className="text-center w-72 sm:w-[23rem] lg:w-[35rem] 2xl:w-[40rem] max-w-[36rem] pt-9 font-medium"
                                href="#"
                                style={{
                                    color: link.color,
                                    backgroundColor: link.bg_color,
                                    borderRadius: link.radius,
                                    padding: "10px",
                                }}
                                key={index}>
                                {link.text}
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
}

function AddLink({ rerender, ID }) {
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("#FFFFFF");
    const [bgColor, setBgColor] = useState("#000000");
    const [url, setUrl] = useState("");
    const [radius, setRadius] = useState(10);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { logedIn, setLogedIn } = useContext(LoginContext);
    webToken = localStorage.getItem("webToken");
    if (!webToken) {
        setLogedIn(false);
    }
    const HandleCreateLink = async () => {
        if (url.length < 5) {
            toast.dismiss();
            return toast.error("The url is too short");
        }
        if (url == "") {
            toast.dismiss();
            return toast.error("Provide a url");
        }
        if (text == "") {
            toast.dismiss();
            return toast.error("Provide a text to show");
        }
        setIsLoading(true);
        try {
            const res = await addLink(webToken, ID, text, url, color, bgColor, radius);
            if (res?.status === 201 && logedIn) {
                toast.dismiss();
                toast.success("Created");
                rerender();
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };
    if (isLoading) {
        toast.dismiss();
        toast.loading("Loading...");
    }
    const { ref } = useClickOutside(() => setIsOpen(false));
    return (
        <div ref={ref} className=" absolute bottom-0 right-0">
            {isOpen || (
                <button
                    onClick={() => {
                        setIsOpen((curr) => !curr);
                    }}
                    className="bg-blue-700 bottom-8 right-4 absolute font-medium h-14 w-28 rounded-md text-stone-50">
                    Add +
                </button>
            )}
            {isOpen && (
                <>
                    <button
                        onClick={() => {
                            setIsOpen((curr) => !curr);
                            setBgColor("#8847FF");
                            setColor("#FFFFFF");
                            setText("Example");
                            setRadius(10);
                            setUrl("");
                        }}
                        className="bg-stone-200 bottom-8 left-5 absolute font-medium h-14 w-28 rounded-md text-stone-800">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (isLoading) return;
                            else HandleCreateLink();
                        }}
                        className="bg-blue-700 bottom-8 right-4 absolute font-medium h-14 w-28 rounded-md text-stone-50">
                        {isLoading ? "Loading.." : "Create"}
                    </button>
                    <div className="bg-stone-100 h-[30rem] w-[100vw]">
                        <form
                            className="py-5 flex gap-3 justify-center flex-col items-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}>
                            <a
                                className="text-center w-11/12 h-12 p-3 font-medium"
                                style={{
                                    backgroundColor: bgColor,
                                    color: color,
                                    borderRadius: `${radius}px`,
                                }}
                                onClick={() => false}
                                href="#">
                                {text}
                            </a>
                            <label className="px-5 mr-auto" htmlFor="url">
                                URL
                            </label>
                            <input
                                value={url}
                                maxLength={100}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                }}
                                className=" h-14 px-5 w-11/12   rounded-md"
                                type="text"
                                id="url"
                                placeholder="www.google.com"
                            />

                            <span className="flex items-center gap-5 px-2">
                                <span className="flex items-center flex-col">
                                    <label className="px-3  mr-auto" htmlFor="text">
                                        Text
                                    </label>
                                    <input
                                        maxLength={20}
                                        value={text}
                                        onChange={(e) => {
                                            setText(e.target.value);
                                        }}
                                        className=" h-14 px-5 w-11/12   rounded-md"
                                        type="text"
                                        id="text"
                                        placeholder="Google"
                                    />
                                </span>
                                <span className="flex flex-col items-center">
                                    <label className="mr-6 text-center" htmlFor="radius">
                                        Radius
                                        <br />
                                        {`(${radius} px)`}
                                    </label>
                                    <input
                                        value={radius}
                                        onChange={(e) => {
                                            setRadius(e.target.value);
                                        }}
                                        className="h-6 mr-6 w-4/4"
                                        type="range"
                                        max={30}
                                        min={0}
                                        id="radius"
                                    />
                                </span>
                            </span>

                            <span className="flex px-8 gap-10 justify-between">
                                <span className="flex items-center flex-col">
                                    <label htmlFor="color">Text color</label>
                                    <input
                                        value={color}
                                        onChange={(e) => {
                                            setColor(e.target.value);
                                            console.log(color);
                                        }}
                                        className="w-28 h-10 cursor-pointer"
                                        type="color"
                                        id="color"
                                    />
                                </span>
                                <span className="flex items-center flex-col">
                                    <label htmlFor="bg-color">background</label>
                                    <input
                                        value={bgColor}
                                        onChange={(e) => {
                                            setBgColor(e.target.value);
                                        }}
                                        className="  w-28 h-10 cursor-pointer"
                                        type="color"
                                        id="bg-color"
                                    />
                                </span>
                            </span>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
