function Loader() {

    return (

        <div
            className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-zinc-700
                border-t-blue-500
            "
            role="status"
            aria-label="Loading"
        />

    );

}

export default Loader;