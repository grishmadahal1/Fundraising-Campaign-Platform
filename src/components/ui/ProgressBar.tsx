interface ProgressBarProps {
  current: number;
  goal: number;
}

export function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>${current.toLocaleString()} raised</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">of ${goal.toLocaleString()} goal</p>
    </div>
  );
}
