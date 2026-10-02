function Avatar({

    name = "Administrator"

}) {

    return (

        <div
            className="
                w-11
                h-11
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                flex
                items-center
                justify-center
                text-white
                font-bold
            "
        >

            {name.charAt(0)}

        </div>

    );

}

export default Avatar;