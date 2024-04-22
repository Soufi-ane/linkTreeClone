import { useRef } from "react";
import { useClickOutside } from "../useClickOutside";

function Modal({ children, text, onCancel, onConfirm }) {
    const { ref } = useClickOutside(onCancel);
    return (
        <div className=" backdrop-blur-sm font-medium h-[100dvh] w-screen absolute top-0 flex items-center justify-center">
            <div
                ref={ref}
                className="bg-stone-100 shadow-xl shadow-slate-500 w-[18rem] sm:w-[20rem] lg:h-44 lg:gap-8 lg:py-0 lg:w-[22rem] h-44 py-2 justify-center flex flex-col gap-10 items-center rounded-md ">
                <div className="text-center text-stone-900">{children}</div>
                <span className="flex items-center gap-10 lg:gap-20">
                    <button onClick={onCancel} className="h-10 w-28 bg-white rounded-lg text-stone-800 ">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-500 h-10 rounded-md text-stone-50 w-28">
                        {text || Confirm}
                    </button>
                </span>
            </div>
        </div>
    );
}

export default Modal;
