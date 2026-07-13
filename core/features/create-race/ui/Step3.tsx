import { useState, useEffect } from 'react';
import { useRaceForm } from '../model/RaceContext';
import { type TeamData } from '../model/type';

export const Step3Teams = () => {
  const { raceData, updateRaceData } = useRaceForm();
  
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState<TeamData[]>([]); 
  const [loading, setLoading] = useState(false);

  const handleSearchTeams = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/Team/search?query=${keyword}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        // Backend bọc kết quả trong { statusCode, message, data }, và trả field
        // camelCase (id, name, leaderEmail) -> chuyển lại đúng format TeamData
        const mapped: TeamData[] = (result.data || []).map((t: any) => ({
          TeamID: t.id,
          Name: t.name,
          leaderEmail: t.leaderEmail,
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
      handleSearchTeams(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  
  const handleSelectTeam = (team: TeamData) => {
    const isExisted = raceData.teams.some(t => t.TeamID === team.TeamID);
    if (isExisted) {
      alert("Đội này đã được thêm vào giải đấu rồi!");
      return;
    }
       
    updateRaceData({ teams: [...raceData.teams, team] });
    setSearchQuery(''); 
    setSearchResults([]); 
  };

  const handleRemoveTeam = (teamId: string) => {
    const filteredTeams = raceData.teams.filter(t => t.TeamID !== teamId);
    updateRaceData({ teams: filteredTeams });
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="text-lg font-bold text-gray-700">Bước 3: Danh sách đội chơi (Teams)</h3>
      
      {/* Khung Tìm Kiếm */}
      <div className="relative">
        <label className="block text-sm font-medium mb-1">Tìm kiếm đội chơi (Nhập tên hoặc Mã đội) *</label>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
          placeholder="Gõ để tìm kiếm đội..."
        />
        
        {/* Hiển thị danh sách gợi ý khi người dùng đang gõ */}
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading && <div className="p-2 text-sm text-gray-500">⚡ Đang quét dữ liệu...</div>}
            {!loading && searchResults.length === 0 && <div className="p-2 text-sm text-gray-500">❌ Không tìm thấy đội nào</div>}
            
            {searchResults.map((team) => (
              <div 
                key={team.TeamID}
                onClick={() => handleSelectTeam(team)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-none flex justify-between"
              >
                <span className="font-semibold">{team.Name}</span>
                <span className="text-gray-400">ID: {team.TeamID}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hiển thị danh sách các đội đã chọn */}
      <div className="mt-6 bg-white p-4 rounded-xl border">
        <p className="text-sm font-bold text-gray-500 uppercase mb-2">Đội chơi đã tham gia ({raceData.teams.length}):</p>
        
        {raceData.teams.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có đội nào được chọn.</p>}
        
        <div className="space-y-2">
          {raceData.teams.map((team) => (
            <div key={team.TeamID} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border text-sm">
              <div>
                <span className="font-medium text-gray-800">{team.Name}</span>
                <span className="text-xs text-gray-400 ml-2">({team.leaderEmail})</span>
              </div>
              <button 
                onClick={() => handleRemoveTeam(team.TeamID)}
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
