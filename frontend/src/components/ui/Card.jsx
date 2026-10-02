function Card({
    children,
    className = ""
}) {

    return (

        <div
            className={`
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/60
                backdrop-blur-md
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-zinc-700
                hover:shadow-lg
                ${className}
            `}
        >

            {children}

        </div>

    );

}

export default Card;