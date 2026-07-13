import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaceForm } from '../model/RaceContext';
import { submitCreateRace } from '../model/RaceService';

export const Step5Settings = () => {
  const { raceData, resetRaceForm, updateRaceData } = useRaceForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinalSubmit = async () => {
    
    if (!raceData.RaceName || !raceData.Place) {
      return alert("Thiếu tín hiệu! Vui lòng quay lại Tab 1 điền đầy đủ Tên và Địa điểm giải đua.");
    }

    if (raceData.coverUrl && raceData.coverUrl.startsWith('blob:')) {
      return alert("Ảnh bìa chưa upload xong, vui lòng quay lại Bước 1 và thử chọn lại ảnh.");
    }

    setLoading(true);
    const result = await submitCreateRace(raceData); //Truyền dữ liệu xuống Backend
    setLoading(false);

    if (result.success) {
      const createdRaceName = raceData.RaceName;
      resetRaceForm(); //Dọn dẹp dữ liệu Form sau khi tạo thành công

      // Quay về trang danh sách, kèm thông tin race vừa tạo để trang đó
      // có thể hiển thị/hightlight (ví dụ toast "Đã tạo giải X thành công")
      navigate('/race-list', {
        state: {
          newRaceId: result.raceId,
          newRaceName: createdRaceName,
        },
      });
    } else {
      alert(` Lỗi hệ thống: ${result.message}`);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="text-lg font-bold text-gray-700">Bước 5: Cài đặt hiển thị & Đóng hộp</h3>
      
      <div className="space-y-2 bg-white p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Bật bảng xếp hạng đối với Đội chơi</span>
          <input 
            type="checkbox" 
            checked={raceData.IsToggledLeaderboard}
            onChange={(e) => updateRaceData({ IsToggledLeaderboard: e.target.checked })}
            className="w-5 h-5 accent-red-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between border-t pt-2 mt-2">
          <span className="text-sm font-medium text-gray-600">Ẩn điểm số chi tiết trên BXH</span>
          <input 
            type="checkbox" 
            checked={raceData.IsHiddenPoint}
            onChange={(e) => updateRaceData({ IsHiddenPoint: e.target.checked })}
            className="w-5 h-5 accent-red-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={handleFinalSubmit}
          disabled={loading}
          className="px-8 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg shadow-md disabled:opacity-50 transition-all"
        >
          {loading ? ' Đang truyền dữ liệu...' : ' Khởi tạo giải đua'}
        </button>
      </div>
    </div>
  );
};