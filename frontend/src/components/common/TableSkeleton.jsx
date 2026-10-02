function TableSkeleton() {

    return (

        <div
            className="
                animate-pulse
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/70
                p-6
                shadow-md
                backdrop-blur-md
            "
        >

            <div className="
                mb-6
                h-10
                rounded-lg
                bg-zinc-800/80
            " />

            {[...Array(6)].map((_, index) => (

                <div
                    key={index}
                    className="
                        mb-3
                        h-14
                        rounded-lg
                        border
                        border-zinc-800/60
                        bg-zinc-800/50
                        last:mb-0
                    "
                />

            ))}

        </div>

    );

}

export default TableSkeleton;