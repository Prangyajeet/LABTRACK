import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip
} from "recharts";

import { inventoryChart } from "../../data/dashboardData";

function InventoryChart() {

    return (

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <AreaChart data={inventoryChart}>

                <defs>

                    <linearGradient
                        id="color"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="5%"
                            stopColor="#2563EB"
                            stopOpacity={0.8}
                        />

                        <stop
                            offset="95%"
                            stopColor="#2563EB"
                            stopOpacity={0}
                        />

                    </linearGradient>

                </defs>

                <XAxis
                    dataKey="month"
                    stroke="#94A3B8"
                />

                <Tooltip/>

                <Area

                    type="monotone"

                    dataKey="stock"

                    stroke="#2563EB"

                    fillOpacity={1}

                    fill="url(#color)"

                />

            </AreaChart>

        </ResponsiveContainer>

    );

}

export default InventoryChart;