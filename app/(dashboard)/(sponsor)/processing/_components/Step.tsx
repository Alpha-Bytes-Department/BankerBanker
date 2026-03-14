import { Check } from "lucide-react";

type Step = {
  id: number;
  title: string;
};

type StepperProps = {
  steps: Step[];
  value: number;
  loading?: boolean;
  onChange: (stepId: number) => void;
};

export const Step = ({ steps, value, loading, onChange }: StepperProps) => {
  const currentStep = steps.find((s) => s.id === value);
  const currentIndex = steps.findIndex((s) => s.id === value);

  return (
    <div className="w-full my-5">
      {/* Mobile: compact progress header */}
      <div className="flex md:hidden flex-col gap-3 px-1">
        {/* Top row: step count + title */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {currentStep?.title}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between gap-1">
          {steps.map((step) => {
            const isActive = step.id === value;
            const isCompleted = step.id < value;

            return (
              <button
                key={step.id}
                disabled={loading}
                // onClick={() => onChange(step.id)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-all duration-200
                  ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div
                  className={`
                    h-6 w-6 rounded-full border flex items-center justify-center text-xs font-semibold
                    transition-all duration-300
                    ${isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? <Check size={12} /> : step.id + 1}
                </div>
                <span
                  className={`text-[10px] leading-tight text-center max-w-[56px] truncate transition-colors ${isActive
                    ? "text-primary font-semibold"
                    : isCompleted
                      ? "text-primary/70"
                      : "text-gray-400"
                    }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: full horizontal stepper */}
      <div className="hidden md:flex justify-center items-center">
        {steps.map((step, index) => {
          const isActive = step.id === value;
          const isCompleted = step.id < value;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              {/* Step circle */}
              <button
                disabled={loading}
                // onClick={() => onChange(step.id)}
                className={`
                  relative z-10 flex h-9 w-9 items-center justify-center rounded-full border
                  transition-all duration-300 shrink-0
                  ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <Check size={16} /> : step.id + 1}
              </button>

              {/* Title */}
              <span
                className={`w-20 text-center text-sm transition-colors ${isCompleted ? "text-primary font-medium" : "text-[#6A7282]"
                  }`}
              >
                {step.title}
              </span>

              {/* Separator */}
              {index < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 transition-colors duration-300 ${step.id < value ? "bg-primary" : "bg-gray-300"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};