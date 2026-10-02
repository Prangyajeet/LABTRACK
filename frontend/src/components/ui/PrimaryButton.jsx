function PrimaryButton({
    children,
    ...props
}) {

    return (

        <button
            className="
                w-full
                inline-flex
                items-center
                justify-center
                rounded-lg
                border
                border-blue-500/30
                bg-blue-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                shadow-blue-500/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-blue-500
                hover:border-blue-400/40
                hover:shadow-md
                hover:shadow-blue-500/20
                active:translate-y-0
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
            {...props}
        >
            {children}
        </button>

    );

}

export default PrimaryButton;