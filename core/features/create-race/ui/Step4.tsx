import { useState, useEffect } from 'react';
import { useRaceForm } from '../model/RaceContext';
import { type OrganizerData } from '../model/type';

export const Step4Organizers = () => {
  const { raceData, updateRaceData } = useRaceForm();
  
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState<OrganizerData[]>([]); 
  const [loading, setLoading] = useState(false);

  const handleSearchOrganizers = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
     
      // Endpoint tìm organizer 
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/Organizer/search?query=${keyword}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        // Backend bọc kết quả trong { statusCode, message, data }, và trả field
        // camelCase (id, displayName, email) -> chuyển lại đúng format OrganizerData
        const mapped: OrganizerData[] = (result.data || []).map((o: any) => ({
          OrganizerID: o.id,
          DisplayName: o.displayName,
          email: o.email,
        }));
        setSearchResults(mapped);
      }
    } catch (error) {
      console.error("Lỗi nghẽn mạch API tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };
// Debounce là chờ 500ms sau khi người dùng ngừng gõ mới kêu API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchOrganizers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  
  const handleSelectOrganizer = (organizer: OrganizerData) => {
    const isExisted = raceData.organizers.some(o => o.OrganizerID === organizer.OrganizerID);
    if (isExisted) {
      alert("Người tổ chức này đã được thêm vào giải đấu rồi!");
      return;
    }
       
    updateRaceData({ organizers: [...raceData.organizers, organizer] });
    setSearchQuery(''); 
    setSearchResults([]); 
  };

  const handleRemoveOrganizer = (organizerId: string) => {
    const filteredOrganizers = raceData.organizers.filter(o => o.OrganizerID !== organizerId);
    updateRaceData({ organizers: filteredOrganizers });
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="text-lg font-bold text-gray-700">Bước 4: Danh sách BTC (Organizers)</h3>
      
      {/* Khung Tìm Kiếm */}
      <div className="relative">
        <label className="block text-sm font-medium mb-1">Tìm kiếm BTC (Nhập tên hoặc Mã BTC) *</label>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
          placeholder="Gõ để tìm kiếm BTC..."
        />
        
        {/* Hiển thị danh sách gợi ý khi người dùng đang gõ */}
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading && <div className="p-2 text-sm text-gray-500"> Đang quét dữ liệu...</div>}
            {!loading && searchResults.length === 0 && <div className="p-2 text-sm text-gray-500">❌ Không tìm thấy đội nào</div>}
            
            {searchResults.map((organizer) => (
              <div 
                key={organizer.OrganizerID}
                onClick={() => handleSelectOrganizer(organizer)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-none flex justify-between"
              >
                <span className="font-semibold">{organizer.DisplayName}</span>
                <span className="text-gray-400">ID: {organizer.OrganizerID}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hiển thị danh sách các đội đã chọn */}
      <div className="mt-6 bg-white p-4 rounded-xl border">
        <p className="text-sm font-bold text-gray-500 uppercase mb-2">BTC đã tham gia ({raceData.organizers.length}):</p>
        
        {raceData.organizers.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có BTC nào được chọn.</p>}
        
        <div className="space-y-2">
          {raceData.organizers.map((organizer) => (
            <div key={organizer.OrganizerID} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border text-sm">
              <div>
                <span className="font-medium text-gray-800">{organizer.DisplayName}</span>
                <span className="text-xs text-gray-400 ml-2">({organizer.OrganizerID})</span>
              </div>
              <button 
                onClick={() => handleRemoveOrganizer(organizer.OrganizerID)}
                className="text-red-500 hover:text-red-700 font-bold px-2"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};