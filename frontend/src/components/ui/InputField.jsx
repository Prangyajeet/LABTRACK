import { forwardRef } from "react";

const InputField = forwardRef(
    (
        {
            icon: Icon,
            type = "text",
            placeholder,
            error,
            ...props
        },
        ref
    ) => {

        return (

            <div className="space-y-2">

                <div
                    className="
                        flex
                        items-center
                        rounded-lg
                        border
                        border-zinc-800
                        bg-zinc-900/60
                        px-3
                        transition-all
                        duration-200
                        focus-within:border-blue-500/60
                        focus-within:bg-zinc-900
                        focus-within:ring-2
                        focus-within:ring-blue-500/10
                    "
                >

                    {Icon && (
                        <Icon
                            className="
                                mr-3
                                shrink-0
                                text-zinc-500
                            "
                            size={18}
                        />
                    )}

                    <input
                        ref={ref}
                        type={type}
                        placeholder={placeholder}
                        className="
                            w-full
                            bg-transparent
                            py-3
                            text-sm
                            text-zinc-100
                            outline-none
                            placeholder:text-zinc-500
                        "
                        {...props}
                    />

                </div>

                {error && (
                    <p className="
                        px-1
                        text-sm
                        text-red-400
                    ">
                        {error}
                    </p>
                )}

            </div>

        );

    }
);

InputField.displayName = "InputField";

export default InputField;