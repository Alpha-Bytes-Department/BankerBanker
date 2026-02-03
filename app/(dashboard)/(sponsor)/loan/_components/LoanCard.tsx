"use client"
import { useState } from "react";
import { motion } from 'framer-motion';
import { Loan } from "../page";
import Button from "@/components/Button";
import { FaStar } from "react-icons/fa6";
import { CircleCheckBig, CircleX, Eye } from "lucide-react";

type LoanCardProps = {
  loan: Loan;
};

const LoanCard = ({ loan }: LoanCardProps) => {
  const [status, setStatus] = useState<"Active" | "Pending" | "Accepted" | "Decline">("Pending")
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className="max-w-[400px] mx-auto w-full rounded-xl border border-blue-300 p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            AR
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{loan.name}</h3>
            <div className="flex items-center gap-1 text-gray-600"><FaStar className="text-yellow-500"/><span>{loan.rating}</span></div>
            <div className="flex items-center gap-2 text-xs ">
              {status && (
                <span className={`rounded-full px-2 py-0.5 ${status === 'Pending' && "bg-yellow-100 text-yellow-600"} ${status === "Active" && "bg-blue-100 text-blue-600 "} ${status === "Accepted" && "bg-green-100 text-green-600"} ${status === "Decline" && "bg-red-100 text-red-600"}`}>
                  {status}
                </span>
              )}
              {loan.highlighted && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-600">
                  Highlighted
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-yellow-500"><FaStar /></span>
      </div>

      {/* Info grid */}
      <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
        <p><span className="text-gray-500">Loan Amount</span><br />{loan.amount}</p>
        <p><span className="text-gray-500">LTV</span><br />{loan.ltv}</p>
        <p><span className="text-gray-500">Interest Rate</span><br />{loan.interest}</p>
        <p><span className="text-gray-500">Term</span><br />{loan.term}</p>
        <p><span className="text-gray-500">Origination Fee</span><br />{loan.fee}</p>
        <p><span className="text-gray-500">DSCR</span><br />{loan.dscr}</p>
      </div>

      {/* Document */}
      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="text-gray-500">Based on document</p>
        <p className="font-medium">{loan.document}</p>
        <button className="text-blue-600 text-xs mt-1">View Document →</button>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Quote expires in: <span className="font-medium">{loan.expiresIn}</span>
        </p>
        <div className="mt-3 flex gap-3">
          <Button icon={<CircleCheckBig size={16}/>} onClick={()=>setStatus("Accepted")} size="medium"  text="Accept" className="button-primary flex-1" />
          <Button icon={<CircleX size={16}/>} onClick={()=>setStatus("Decline")} size="medium"  text="Decline" className="button-outline flex-1" />
          <Button icon={<Eye size={16}/>}  text="View" size="medium" className="button-outline flex-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default LoanCard;
