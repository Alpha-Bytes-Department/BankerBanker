

type StatType = "primary" | "success" | "warning" | "info";

type StatCardProps = {
  title: string;
  value: string;
  type: StatType;
};

const STAT_STYLE_MAP: Record<
  StatType,
  { bg: string; text: string }
> = {
  primary: {
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-600",
  },
  info: {
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  warning: {
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
};

const StatCard = ({ title, value, type }: StatCardProps) => {
  const styles = STAT_STYLE_MAP[type];

  return (
    <div className={`rounded-lg border p-4 ${styles.bg}`}>
      <p className={`text-xs ${styles.text}`}>{title}</p>
      <p className={`text-lg font-semibold ${styles.text}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;