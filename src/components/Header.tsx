import { getTodayString } from '@/utils/helpers';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dhyan</h1>
          <p className="text-sm text-gray-500 mt-1">{getTodayString()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Today's Focus</p>
            <p className="text-xs text-gray-500">Stay productive</p>
          </div>
        </div>
      </div>
    </header>
  );
}