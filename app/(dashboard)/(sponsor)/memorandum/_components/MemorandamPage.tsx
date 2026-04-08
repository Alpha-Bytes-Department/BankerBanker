"use client";
import { useState, useEffect } from "react";

import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import api from "@/Provider/api";

// Define an interface for your API data for better Type Safety
interface Memorandum {
  id: number;
  title: string;
  property_name: string;
  property_image_url: string;
  status: string;
  mode: string;
}

const MemorandamPage = () => {
  const [memorandums, setMemorandums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemorandums = async () => {
      try {
        // Using your existing api.ts instance
        const response = await api.get("/api/memorandums/");

        // Accessing the 'data' array from your JSON structure
        const apiData = response.data.data;

        // Map the API response to the format PropertyCard expects
        const formattedData = apiData.map((item: Memorandum) => ({
          url: item.property_image_url,
          title: item.property_name,
          status: item.status.toLowerCase(),
          location: "Location data unavailable", // Placeholder as API doesn't provide this yet
          loan_requested: "N/A",
          loan_type: item.mode,
          units: "N/A",
          quotes: "0",
          link: `/memorandum/${item.id}`,
          link2: "/loan",
        }));

        setMemorandums(formattedData);
      } catch (error) {
        console.error("Error fetching memorandums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemorandums();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading your memorandums...
      </div>
    );
  }
  console.log(memorandums);
  return (
    <div className="">
      <h1 className="text-start text-lg md:text-2xl font-semibold py-2">
        Memorandums
      </h1>
      <p className="text-base text-start lg:text-lg md:text-lg">
        Monitor your memorandums and related details below.
      </p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-10 my-10">
        <StatusCard
          type="Properties"
          data={{ value: memorandums.length, status: 2 }}
        />
        <StatusCard type="quotes" data={{ value: 20, status: 12 }} />
        <StatusCard type="documents" data={{ value: 156 }} />
        <StatusCard type="value" data={{ value: 3 }} />
      </div>

      <div className="mb-10">
        {memorandums.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 place-items-center">
            {memorandums.map((data, index) => (
              <PropertyCard key={index} data={data} size="small" />
            ))}
          </div>
        : <p className="text-center text-gray-500">No memorandums available.</p>
        }
      </div>
    </div>
  );
};

export default MemorandamPage;
