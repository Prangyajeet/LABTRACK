function GlassCard({ children }) {

    return (

        <div
            className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/70
                backdrop-blur-xl
                shadow-xl
                p-10
                transition-all
                duration-300
                hover:border-zinc-700
            "
        >

            {children}

        </div>

    );

}

export default GlassCard;