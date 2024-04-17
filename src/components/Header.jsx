import { useContext } from "react";
import { LoginContext } from "../Context/LoginContext";
import { IoSettingsOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";

function Header() {
    const { logedIn } = useContext(LoginContext);
    return (
        <div className="flex w-screen h-12 items-center fixed px-3 py-2 justify-between">
            {logedIn ? (
                <div>
                    <IoSettingsOutline className="text-3xl text-stone-700" />
                </div>
            ) : (
                <div></div>
            )}
            <div></div>
            <div>
                <VscAccount className="text-[1.7rem] text-stone-700" />
            </div>
        </div>
    );
}

export default Header;
