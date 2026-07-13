import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllRaces, type RaceListItem } from '../../features/create-race/model/RaceService';

export const RaceListPage = () => {
  const location = useLocation();
  const [races, setRaces] = useState<RaceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Thông tin race vừa tạo, sau khi ấn Create thì navigate về
  const newRaceId = (location.state as { newRaceId?: string; newRaceName?: string } | null)?.newRaceId;
  const newRaceName = (location.state as { newRaceId?: string; newRaceName?: string } | null)?.newRaceName;
  const [showToast, setShowToast] = useState(!!newRaceName);

  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      const result = await getAllRaces();
      setLoading(false);

      if (result.success && result.races) {
        setRaces(result.races);
      } else {
        setError(result.message || 'Không tải được danh sách giải đua.');
      }
    };

    fetchRaces();
  }, []);

  // Tự ẩn toast sau vài giây
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      {showToast && newRaceName && (
        <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          <span>✅ Đã tạo giải đua "<strong>{newRaceName}</strong>" thành công!</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-green-700 hover:text-green-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách giải đua</h1>
        <Link
          to="/create-race"
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-all"
        >
          + Tạo Race mới
        </Link>
      </div>

      {loading && <p className="text-gray-500">Đang tải danh sách...</p>}

      {!loading && error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && races.length === 0 && (
        <p className="text-gray-400 italic">Chưa có giải đua nào được tạo.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => {
          const isNew = race.id === newRaceId;
          return (
            <div
              key={race.id}
              className={`border rounded-xl overflow-hidden shadow-sm bg-white transition-all ${
                isNew ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {race.coverUrl ? (
                <img
                  src={race.coverUrl}
                  alt={race.raceName}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Không có ảnh bìa
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-800">{race.raceName}</h3>
                  {isNew && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Mới tạo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Địa điểm: {race.place || 'Chưa cập nhật'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(race.timeStart).toLocaleString('vi-VN')} — {new Date(race.timeEnd).toLocaleString('vi-VN')}
                </p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {race.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
