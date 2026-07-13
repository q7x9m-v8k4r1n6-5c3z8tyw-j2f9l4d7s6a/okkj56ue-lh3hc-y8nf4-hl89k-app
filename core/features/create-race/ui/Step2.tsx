import { useState } from 'react';
import { useRaceForm } from '../model/RaceContext';
import { type BoothData } from '../model/type';

export const Step2Booths = () => {
  const { raceData, updateRaceData } = useRaceForm();
  
  
  const [newBooth, setNewBooth] = useState<BoothData>({
    Name: '', Place: '', BoothOrganizerID: '', DefaultPoints: 10
  });

  const handleAddBooth = () => {
    if (!newBooth.Name || !newBooth.Place) return alert("Vui lòng nhập tên và địa điểm trạm!");
    
    
    updateRaceData({ booths: [...raceData.booths, newBooth] });
    
    
    setNewBooth({ Name: '', Place: '', BoothOrganizerID: '', DefaultPoints: 10 });
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="text-lg font-bold text-gray-700">Bước 2: Cài đặt trạm (Booths)</h3>
      
      
      <div className="grid grid-cols-2 gap-2 p-3 bg-white border rounded-lg shadow-sm">
        <input 
          type="text" placeholder="Tên trạm (Ví dụ: Trạm 1)" value={newBooth.Name}
          onChange={(e) => setNewBooth({...newBooth, Name: e.target.value})}
          className="p-2 border rounded"
        />
        <input 
          type="text" placeholder="Vị trí (Ví dụ: Sân B4)" value={newBooth.Place}
          onChange={(e) => setNewBooth({...newBooth, Place: e.target.value})}
          className="p-2 border rounded"
        />
        <input 
          type="text" placeholder="ID Quản trạm" value={newBooth.BoothOrganizerID}
          onChange={(e) => setNewBooth({...newBooth, BoothOrganizerID: e.target.value})}
          className="p-2 border rounded"
        />
        <input 
          type="number" placeholder="Điểm mặc định" value={newBooth.DefaultPoints}
          onChange={(e) => setNewBooth({...newBooth, DefaultPoints: Number(e.target.value)})}
          className="p-2 border rounded"
        />
        <button onClick={handleAddBooth} type="button" className="col-span-2 py-2 bg-green-600 text-white rounded font-medium">
          + Thêm trạm vào danh sách
        </button>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-sm text-gray-600">Danh sách trạm hiện tại ({raceData.booths.length}):</p>
        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
          {raceData.booths.map((b, idx) => (
            <li key={idx}>{b.Name} - {b.Place} ({b.DefaultPoints}đ)</li>
          ))}
        </ul>
      </div>
    </div>
  );
};