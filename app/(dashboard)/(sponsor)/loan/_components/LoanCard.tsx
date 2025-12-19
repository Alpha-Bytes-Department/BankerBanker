

const LoanCard = ({ loan }: any) => {
  return (
    <div className="w-full max-w-xl rounded-xl border border-blue-300  p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            AR
          </div>
          <div>
            <h3 className="font-semibold">{loan.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>⭐ {loan.rating}</span>
              {loan.active && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-600">
                  Active
                </span>
              )}
              {loan.highlighted && (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-700">
                  Highlighted
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-yellow-500">★</span>
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
          <button className="flex-1 rounded-full bg-blue-600 py-2 text-sm text-white">
            Accept
          </button>
          <button className="flex-1 rounded-full border py-2 text-sm">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
