import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLinkTree } from "../api/linksApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

function LinkTree() {
    const [isLoading, setIsLoading] = useState(false);
    const [mainData, setMainData] = useState("");
    const { username } = useParams();
    const navigate = useNavigate();

    const Func = async () => {
        try {
            setIsLoading(true);
            const data = await getLinkTree(username);
            setMainData(data?.data);
            console.log(data?.data?.pageData);
        } catch {
            toast.dismiss();
            toast.error("Something went wrong");
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
    if (!mainData?.pageData || !mainData?.links?.length > 0) {
        return <NoLinkTree username={username} />;
    }

    const linksWitdth = `85vw`;
    const linksHeight = `45px`;
    return (
        <div
            className="h-[100dvh] pt-12"
            style={{
                backgroundColor: mainData?.pageData?.background || "white",
                fontFamily: mainData?.pageData?.font || "Poppins",
            }}>
            <div className="h-[90dvh]  font-medium overflow-y-scroll  w-[100vw] flex flex-col items-center gap-10">
                <span className={` ${mainData?.pageData?.background == "#fafaf9" ? "text-stone-900" : "text-stone-50"}  text-center w-[80vw]`}>
                    <h2 className="font-medium">{mainData?.pageData?.name}</h2>
                    <h4 className="text-sm">{`@${mainData?.pageData?.username}`}</h4>
                    <p className="mt-5">{mainData?.pageData?.bio}</p>
                </span>
                <div className="flex items-center flex-col gap-5 justify-center">
                    {!mainData?.links?.length > 0 && <div className="text-stone-600 pt-56">No links yet</div>}
                    {mainData?.links &&
                        mainData?.links?.length > 0 &&
                        mainData?.links.map((link, index) => (
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    let correctLink = link.url;
                                    if (!/^https?:\/\//i.test(link.url)) {
                                        correctLink = `https://${link.url}`;
                                    }
                                    window.location.href = correctLink;
                                }}
                                className="text-center pt-9 font-medium"
                                href="#"
                                style={{
                                    color: link.color,
                                    backgroundColor: link.bg_color,
                                    borderRadius: link.radius,
                                    padding: "10px",
                                    width: linksWitdth,
                                    height: linksHeight,
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

export default LinkTree;

function NoLinkTree({ username }) {
    let userN = username;
    if (username.length > 20) {
        userN = username.split("").slice(0, 20).join("");
        userN += " ...";
    }
    return (
        <div
            style={{
                fontFamily: "Poppins",
            }}
            className="flex px-10 text-center flex-col gap-10  items-center justify-center font-medium h-[90dvh]">
            <span>
                There is no linkTree <br />
                for <span>{`@${userN}`}</span>
            </span>
            <Link className="text-blue-700 bg-blue-200 py-2 rounded-md px-10" to="/">
                Back home
            </Link>
        </div>
    );
}
