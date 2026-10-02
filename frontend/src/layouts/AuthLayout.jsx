function AuthLayout({ children }) {

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                overflow-hidden
                relative
                bg-[#08142b]
            "
        >

            <div
                className="
                    absolute
                    w-[600px]
                    h-[600px]
                    rounded-full
                    bg-pink-600/40
                    blur-[140px]
                    -left-48
                    top-20
                "
            />

            <div
                className="
                    absolute
                    w-[600px]
                    h-[600px]
                    rounded-full
                    bg-blue-700/40
                    blur-[140px]
                    -right-40
                    bottom-0
                "
            />

            <div className="relative z-10 w-full flex justify-center px-6">
                {children}
            </div>

        </div>

    );

}

export default AuthLayout;