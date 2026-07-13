import { useRef, useEffect, useState } from 'react';
import { useRaceForm } from '../model/RaceContext';
import { uploadImage } from '../model/RaceService';

export const Step1BasicInfo = () => {
  const { raceData, updateRaceData } = useRaceForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Dọn dẹp object URL cũ khi component unmount, tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (raceData.coverUrl && raceData.coverUrl.startsWith('blob:')) {
        URL.revokeObjectURL(raceData.coverUrl);
      }
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn đúng định dạng file ảnh (jpg, png...)');
      return;
    }

    setUploadError('');

    if (raceData.coverUrl && raceData.coverUrl.startsWith('blob:')) {
      URL.revokeObjectURL(raceData.coverUrl);
    }

    // Hiện preview tạm ngay lập tức, để người dùng thấy phản hồi liền
    const localPreviewUrl = URL.createObjectURL(file);
    updateRaceData({ coverUrl: localPreviewUrl });

    // Upload thật lên Azure Blob (qua backend) chạy nền phía sau
    setUploading(true);
    const result = await uploadImage(file);
    setUploading(false);

    if (result.success && result.url) {
      // Thay preview tạm bằng URL thật đã upload xong
      URL.revokeObjectURL(localPreviewUrl);
      updateRaceData({ coverUrl: result.url });
    } else {
      setUploadError(result.message || 'Upload ảnh thất bại, vui lòng thử lại.');
      // Giữ nguyên preview tạm để người dùng vẫn thấy ảnh đã chọn,
    }
  };

  const handleRemoveImage = () => {
    if (raceData.coverUrl && raceData.coverUrl.startsWith('blob:')) {
      URL.revokeObjectURL(raceData.coverUrl);
    }
    updateRaceData({ coverUrl: '' });
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="text-lg font-bold text-gray-700">Bước 1: Thông tin cơ bản</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Ảnh bìa giải đua</label>

        {raceData.coverUrl ? (
          <div className="relative">
            <img
              src={raceData.coverUrl}
              alt="Ảnh bìa giải đua"
              className="w-full h-48 object-cover rounded-lg border"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                <span className="text-white text-sm font-medium">Đang tải ảnh lên...</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-700"
            >
              Xóa ảnh
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50">
            <span className="text-sm text-gray-500">Bấm để chọn ảnh bìa</span>
            <span className="text-xs text-gray-400 mt-1">(JPG, PNG, WEBP - tối đa 5MB)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        {uploadError && (
          <p className="text-xs text-red-600 mt-1">{uploadError}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Tên giải đua *</label>
        <input 
          type="text" 
          value={raceData.RaceName}
          onChange={(e) => updateRaceData({ RaceName: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="Nhập tên giải đua..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Thời gian bắt đầu *</label>
          <input 
            type="datetime-local" 
            value={raceData.TimeStart}
            onChange={(e) => updateRaceData({ TimeStart: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thời gian kết thúc *</label>
          <input 
            type="datetime-local" 
            value={raceData.TimeEnd}
            onChange={(e) => updateRaceData({ TimeEnd: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Địa điểm tổ chức *</label>
        <input 
          type="text" 
          value={raceData.Place}
          onChange={(e) => updateRaceData({ Place: e.target.value })}
          className="w-full p-2 border rounded-lg"
          placeholder="Ví dụ: Tòa B6, Đại học Bách Khoa..."
        />
      </div>
    </div>
  );
};