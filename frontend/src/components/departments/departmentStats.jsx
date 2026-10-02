import {
    Building2,
    CheckCircle,
    Archive
} from "lucide-react";

function DepartmentStats({
    departments = []
}) {

    const total = departments.length;

    const active = departments.filter(
        department => department.status === "ACTIVE"
    ).length;

    const inactive = departments.filter(
        department => department.status === "INACTIVE"
    ).length;

    const cards = [
        {
            title: "Total Departments",
            value: total,
            icon: Building2,
            iconClass: `
                bg-blue-600
                text-white
            `
        },
        {
            title: "Active",
            value: active,
            icon: CheckCircle,
            iconClass: `
                bg-emerald-600
                text-white
            `
        },
        {
            title: "Inactive",
            value: inactive,
            icon: Archive,
            iconClass: `
                bg-red-600
                text-white
            `
        }
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900
                            px-6
                            py-6
                            transition
                            duration-200
                            hover:border-slate-700
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-blue-300
                                    "
                                >
                                    {card.title}
                                </p>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-bold
                                        text-white
                                    "
                                >
                                    {card.value}
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
                                    ${card.iconClass}
                                `}
                            >

                                <Icon
                                    size={27}
                                    strokeWidth={2}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );
}

export default DepartmentStats;