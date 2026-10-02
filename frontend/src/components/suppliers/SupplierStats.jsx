import {
    Users,
    UserCheck,
    UserX,
    ShieldCheck
} from "lucide-react";

function SupplierStats({
    suppliers = []
}) {

    const totalSuppliers = suppliers.length;

    const activeSuppliers = suppliers.filter(
        supplier => supplier.status === "ACTIVE"
    ).length;

    const inactiveSuppliers = suppliers.filter(
        supplier => supplier.status === "INACTIVE"
    ).length;

    const gstRegistered = suppliers.filter(
        supplier =>
            supplier.gstNumber &&
            supplier.gstNumber.trim() !== ""
    ).length;

    const stats = [
        {
            title: "Total Suppliers",
            value: totalSuppliers,
            icon: Users,
            titleColor: "text-cyan-400",
            iconBg: "bg-cyan-500",
            iconColor: "text-white",
            borderColor: "border-cyan-900/50"
        },
        {
            title: "Active Suppliers",
            value: activeSuppliers,
            icon: UserCheck,
            titleColor: "text-emerald-400",
            iconBg: "bg-emerald-500",
            iconColor: "text-white",
            borderColor: "border-emerald-900/50"
        },
        {
            title: "Inactive Suppliers",
            value: inactiveSuppliers,
            icon: UserX,
            titleColor: "text-red-400",
            iconBg: "bg-red-500",
            iconColor: "text-white",
            borderColor: "border-red-900/50"
        },
        {
            title: "GST Registered",
            value: gstRegistered,
            icon: ShieldCheck,
            titleColor: "text-amber-400",
            iconBg: "bg-amber-500",
            iconColor: "text-white",
            borderColor: "border-amber-900/50"
        }
    ];

    return (

        <div className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
        ">

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (

                    <div
                        key={stat.title}
                        className={`
                            rounded-xl
                            border
                            ${stat.borderColor}
                            bg-[#111827]
                            p-6
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                        `}
                    >

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p
                                    className={`
                                        text-sm
                                        font-medium
                                        ${stat.titleColor}
                                    `}
                                >
                                    {stat.title}
                                </p>

                                <h2 className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-[#e6edf3]
                                ">
                                    {stat.value}
                                </h2>

                            </div>

                            <div
                                className={`
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${stat.iconBg}
                                    shadow-lg
                                `}
                            >

                                <Icon
                                    size={28}
                                    strokeWidth={2}
                                    className={stat.iconColor}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );
}

export default SupplierStats;