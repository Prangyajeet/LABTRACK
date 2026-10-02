import { useState, forwardRef } from "react";
import { FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = forwardRef(
    (
        {
            placeholder,
            error,
            ...props
        },
        ref
    ) => {

        const [show, setShow] = useState(false);

        return (

            <div className="space-y-2">

                <div
                    className="
                        flex
                        items-center
                        border-b
                        border-white/50
                        py-3
                    "
                >

                    <FaLock
                        className="
                            text-white
                            mr-4
                        "
                    />

                    <input
                        ref={ref}
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        className="
                            flex-1
                            bg-transparent
                            outline-none
                            text-white
                            placeholder:text-white/70
                        "
                        {...props}
                    />

                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="text-white"
                    >
                        {show ? <FiEyeOff /> : <FiEye />}
                    </button>

                </div>

                {error && (
                    <p className="text-red-300 text-sm">
                        {error}
                    </p>
                )}

            </div>

        );

    }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;