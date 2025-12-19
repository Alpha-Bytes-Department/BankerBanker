"use client"
import { useState } from 'react';
import LoanCard from './_components/LoanCard';
import StatusCard from '@/components/StatusCard';


export type Loan = {
  id: number;
  name: string;
  rating: number;
  amount: string;
  interest: string;
  fee: string;
  ltv: string;
  term: string;
  dscr: string;
  document: string;
  expiresIn: string;
  active: boolean;
  highlighted: boolean;
};


const loans: Loan[] = [
  {
    id: 1,
    name: "Argentic Capital",
    rating: 4.5,
    amount: "$12,000,000",
    interest: "SOFR + 3.95%",
    fee: "1.00%",
    ltv: "75.0%",
    term: "3 years + 2 ext",
    dscr: "1.25x",
    document: "Financial_Statements_Q3_2024.pdf",
    expiresIn: "336 days",
    active: true,
    highlighted: true,
  },
  {
    id: 2,
    name: "BlueRock Finance",
    rating: 4.2,
    amount: "$8,500,000",
    interest: "SOFR + 4.10%",
    fee: "0.90%",
    ltv: "70.0%",
    term: "5 years",
    dscr: "1.30x",
    document: "Financials_2024.pdf",
    expiresIn: "120 days",
    active: true,
    highlighted: false,
  },
  {
    id: 3,
    name: "Summit Lending",
    rating: 4.7,
    amount: "$15,250,000",
    interest: "SOFR + 3.75%",
    fee: "1.10%",
    ltv: "78.0%",
    term: "10 years",
    dscr: "1.40x",
    document: "Summit_Report_2024.pdf",
    expiresIn: "210 days",
    active: true,
    highlighted: true,
  },
  {
    id: 4,
    name: "Atlas Credit",
    rating: 4.1,
    amount: "$6,750,000",
    interest: "SOFR + 4.35%",
    fee: "0.85%",
    ltv: "68.5%",
    term: "3 years",
    dscr: "1.20x",
    document: "Atlas_Financials.pdf",
    expiresIn: "95 days",
    active: false,
    highlighted: false,
  },
  {
    id: 5,
    name: "NorthPeak Financial",
    rating: 4.6,
    amount: "$10,000,000",
    interest: "SOFR + 3.90%",
    fee: "1.00%",
    ltv: "72.0%",
    term: "7 years",
    dscr: "1.35x",
    document: "NorthPeak_Q2_2024.pdf",
    expiresIn: "180 days",
    active: true,
    highlighted: false,
  },
  {
    id: 6,
    name: "IronGate Capital",
    rating: 4.3,
    amount: "$9,200,000",
    interest: "SOFR + 4.00%",
    fee: "0.95%",
    ltv: "71.0%",
    term: "5 years + 1 ext",
    dscr: "1.28x",
    document: "IronGate_Statements.pdf",
    expiresIn: "260 days",
    active: true,
    highlighted: true,
  },
];



const Page = () => {
  const [view, setView] = useState<"Card View" | "Comparison">("Card View")
  return (
    <div>
      {/* status card  */}
      <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
        <StatusCard type="Properties" data={{ value: 3, status: 2 }} />
        <StatusCard type="quotes" data={{ value: 20, status: 12 }} />
        <StatusCard type="documents" data={{ value: 156 }} />
        <StatusCard type="value" data={{ value: 3, }} />
      </div>
      {/* viwe selection  */}
      <div className="relative inline-flex rounded-full bg-[#ECECF0] p-1 mb-5">
        <span className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-all duration-300 ease-in-out ${view === "Card View" ? "left-1" : "left-1/2"}`} />
        <button
          onClick={() => setView("Card View")}
          className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${view === "Card View" ? "text-white" : "text-gray-600"}`}>
          Card View
        </button>
        <button
          onClick={() => setView("Comparison")} className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${view === "Comparison" ? "text-white" : "text-gray-600"}`}>
          Comparison
        </button>
      </div>
      {/* view randaring  */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
};

export default Page;