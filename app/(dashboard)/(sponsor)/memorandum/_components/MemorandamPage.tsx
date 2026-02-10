import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import { link } from "fs";

const MemorandamPage = () => {
  const dataArray = [
    {
      url: "/images/SponsorDashboard.png",
      title: "Downtown Office Complex",
      status: "active",
      location: "123 Business Ave, Chicago, IL 60601",
      loan_requested: "500,000",
      loan_type: "Commercial",
      units: "10",
      quotes: "5",
      link: "/memorandum/1",
      link2: "/loan",
    },
    {
      url: "/images/SponsorDashboard.png",
      title: "Lakeside Apartments",
      status: "pending",
      location: "456 Lake St, Seattle, WA 98101",
      loan_requested: "750,000",
      loan_type: "Multifamily",
      units: "20",
      quotes: "8",
      link: "/memorandum/2",
      link2: "/loan",
    },
    {
      url: "/images/SponsorDashboard.png",
      title: "Suburban Retail Center",
      status: "approved",
      location: "789 Market Rd, Austin, TX 78701",
      loan_requested: "1,000,000",
      loan_type: "Retail",
      units: "15",
      quotes: "10",
      link: "/memorandum/3",
      link2: "/loan",
    },
    {
      url: "/images/SponsorDashboard.png",
      title: "Industrial Park",
      status: "active",
      location: "321 Industrial Blvd, Denver, CO 80201",
      loan_requested: "2,500,000",
      loan_type: "Industrial",
      units: "25",
      quotes: "12",
      link: "/memorandum/4",
      link2: "/loan",
    },
  ];
  return (
    <div className="">
      <h1 className=" text-start text-lg md:text-2xl font-semibold py-2">
        Memorandams
      </h1>
      <p className=" text-base text-start lg:text-lg md:text-lg">
        Monitor your memorandams and related details below.
      </p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-10 my-10">
        <StatusCard type="Properties" data={{ value: 3, status: 2 }} />
        <StatusCard type="quotes" data={{ value: 20, status: 12 }} />
        <StatusCard type="documents" data={{ value: 156 }} />
        <StatusCard type="value" data={{ value: 3 }} />
      </div>

      <div className="mb-10">
        {dataArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-3 gap-5 place-items-center">
            {dataArray.map((data, index) => (
              <PropertyCard key={index} data={data} size="small" />
            ))}
          </div>
        ) : (
          <p className="text-center">No memorandams available.</p>
        )}
      </div>
    </div>
  );
};

export default MemorandamPage;
