interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-indigo-600 h-2 rounded-full progress-bar"
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );
}