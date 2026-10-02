function Badge({

    children,

    color = "blue"

}) {

    const colors = {

        blue:
            "border-blue-500/20 bg-blue-500/10 text-blue-400",

        green:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

        red:
            "border-red-500/20 bg-red-500/10 text-red-400",

        yellow:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",

        purple:
            "border-violet-500/20 bg-violet-500/10 text-violet-400",

        gray:
            "border-zinc-700 bg-zinc-800/60 text-zinc-400"

    };

    return (

        <span
            className={`
                inline-flex
                items-center
                rounded-full
                border
                px-2.5
                py-1
                text-xs
                font-medium
                tracking-wide
                whitespace-nowrap
                ${colors[color] || colors.blue}
            `}
        >

            {children}

        </span>

    );

}

export default Badge;