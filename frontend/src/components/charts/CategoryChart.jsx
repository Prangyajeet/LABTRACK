import {

    ResponsiveContainer,

    PieChart,

    Pie,

    Cell,

    Tooltip

} from "recharts";

import {

    categoryData

} from "../../data/dashboardData";

const COLORS = [

    "#2563EB",

    "#22C55E",

    "#8B5CF6",

    "#F59E0B"

];

function CategoryChart() {

    return (

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <PieChart>

                <Pie

                    data={categoryData}

                    dataKey="value"

                    outerRadius={100}

                >

                    {

                        categoryData.map((entry,index)=>(

                            <Cell

                                key={index}

                                fill={COLORS[index]}

                            />

                        ))

                    }

                </Pie>

                <Tooltip/>

            </PieChart>

        </ResponsiveContainer>

    );

}

export default CategoryChart;