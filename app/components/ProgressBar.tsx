interface ProgressBarProps {
    progress: number;
  }
  
  export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
      <div className="w-full bg-gray-200 rounded h-4 mt-2 text-black">
        <div
          className="bg-blue-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  }