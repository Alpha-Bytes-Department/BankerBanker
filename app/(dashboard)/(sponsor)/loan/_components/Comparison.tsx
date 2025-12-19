import StatCard from "./StatCard";


type StatType = "primary" | "success" | "warning" | "info";

type QuoteStat = {
    id: number;
    title: string;
    value: string;
    type: StatType;
};



const quoteStats: QuoteStat[] = [
    {
        id: 1,
        title: "Total Quotes",
        value: "5",
        type: "primary",
    },
    {
        id: 2,
        title: "Best Rate",
        value: "SOFR + 3.85%",
        type: "success",
    },
    {
        id: 3,
        title: "Highest LTV",
        value: "76.0%",
        type: "info",
    },
    {
        id: 4,
        title: "Avg Amount",
        value: "$11.80M",
        type: "warning",
    },
];



const Comparison = () => {
    return (
        <div className='p-5 border border-[#0000001A] rounded-lg'>
            <h1 className='text-lg my-5'>Quote Comparison Summary</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quoteStats.map((stat) => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        type={stat.type}
                    />
                ))}
            </div>
            <div className="mt-10 mb-5">
                <h1>Top Recommendations</h1>
            </div>
        </div>
    );
};

export default Comparison;