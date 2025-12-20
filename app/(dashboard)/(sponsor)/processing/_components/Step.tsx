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
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === value;
          const isCompleted = step.id < value;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              {/* Step */}
              <button
                disabled={loading}
                onClick={() => onChange(step.id)}
                className={`
                  relative z-10 flex h-9 w-9 items-center justify-center rounded-full border
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </button>

              {/* Separator */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-2 h-[2px] flex-1 transition-colors duration-300
                    ${step.id < value ? "bg-primary" : "bg-gray-300"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Titles */}
      <div className="mt-3 flex justify-between text-xs">
        {steps.map((step) => (
          <span
            key={step.id}
            className={`
              w-20 text-center transition-colors
              ${step.id === value ? "text-primary font-medium" : "text-muted-foreground"}
            `}
          >
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
};
