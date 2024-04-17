import { useMutation } from "react-query";
import { getUserInfo } from "../api/usersApi";
import { useEffect } from "react";

function CreatePage() {
    const webToken = localStorage.getItem("webToken");
    const getUserDataFunc = useMutation(getUserInfo);
    useEffect(() => {
        getUserDataFunc.mutate(webToken);
    }, []);
    let pageData;
    let links;
    if (!getUserDataFunc.isLoading && getUserDataFunc.isSuccess) {
        // console.log(getUserDataFunc?.data?.data);
        pageData = getUserDataFunc.data.data.pageData;
        links = getUserDataFunc.data.data.links;
        console.log(pageData);
        // links = getUserDataFunc.data.data.links;
    }

    return <div className=" overflow-y-scroll">{pageData && <Page />}</div>;
}

export default CreatePage;

function Page() {
    return (
        <div className="h-[90dvh] mt-12 overflow-y-scroll bg-black w-[100vw]">
            {links && links.map((link, index) => <Link key={index} url={link.url} color={link.color} background={link.background} radius={link.radius} text={link.text} />)}
        </div>
    );
}

function Link({ url, color, background, radius, text }) {
    return (
        <a className={`bg-[${background}] rounded-[${radius}] text-[${color}]`} href={url}>
            {text}
        </a>
    );
}
