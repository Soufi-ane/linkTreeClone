import { useContext, useState } from "react";
import { LoginContext } from "../Context/LoginContext";
import { IoSettingsOutline } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";

import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

function Header() {
    const { logedIn } = useContext(LoginContext);
    const [inSettings, setInSettings] = useState(false);
    const [inAccount, setInAccount] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="flex w-screen h-12 items-center fixed px-3 sm:px-5 py-2 justify-between  md:justify-start">
            {logedIn ? (
                <div className="">
                    <IoSettingsOutline
                        className={`text-3xl ${(inSettings || inAccount) && "hidden"} text-stone-700`}
                        onClick={() => {
                            setInSettings((curr) => !curr);
                            navigate("/settings");
                        }}
                    />

                    <IoArrowBack
                        onClick={() => {
                            setInSettings(false);
                            setInAccount(false);
                            navigate("/");
                        }}
                        className={`text-3xl ${!inSettings && !inAccount && "hidden"} text-stone-700`}
                    />
                </div>
            ) : (
                <div className="text-red-500"></div>
            )}
            {logedIn && <div className="pr-6 md:pr-4 pt-1 md:pt-0 font-medium">{inSettings ? "Settings" : inAccount ? "Account" : ""}</div>}

            {
                <div>
                    {logedIn && !inAccount && !inSettings && (
                        <VscAccount
                            onClick={() => {
                                setInAccount(true);
                                navigate("/account");
                            }}
                            className="text-[1.7rem] text-stone-700"
                        />
                    )}
                </div>
            }
        </div>
    );
}

export default Header;
