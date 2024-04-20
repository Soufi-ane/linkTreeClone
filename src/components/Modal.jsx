import { useRef } from "react";
import { useClickOutside } from "../useClickOutside";

function Modal({ children, text, onCancel, onConfirm }) {
    const { ref } = useClickOutside(onCancel);
    return (
        <div className=" backdrop-blur-sm font-medium h-[100dvh] w-screen absolute top-0 flex items-center justify-center">
            <div ref={ref} className="bg-stone-100 shadow-xl shadow-slate-500 w-[90vw] h-52 py-10 justify-center flex flex-col gap-12 items-center rounded-md ">
                <div className="text-center text-stone-900">{children}</div>
                <span className="flex items-center gap-10">
                    <button onClick={onCancel} className="h-14 w-28 bg-white rounded-lg text-stone-800 ">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-500 h-14 rounded-md text-stone-50 w-28">
                        {text || Confirm}
                    </button>
                </span>
            </div>
        </div>
    );
}

export default Modal;
