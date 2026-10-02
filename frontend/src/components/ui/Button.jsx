function Button({
    children,
    className = "",
    ...props
}) {

    return (

        <button

            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-blue-500
                hover:-translate-y-0.5
                hover:shadow-lg
                active:translate-y-0
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${className}
            `}

            {...props}

        >

            {children}

        </button>

    );

}

export default Button;