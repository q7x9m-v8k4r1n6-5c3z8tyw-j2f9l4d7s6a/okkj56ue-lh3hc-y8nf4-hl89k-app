import { type RacePayload } from './type';
import { mapToBackendPayload } from './mapper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RaceListItem {
  id: string;
  raceName: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  status: string;
  coverUrl?: string | null;
}

export const submitCreateRace = async (payload: RacePayload): Promise<{ success: boolean; message?: string; raceId?: string }> => {
  try {
    const backendPayload = mapToBackendPayload(payload);

    const response = await fetch(`${API_BASE_URL}/api/v1/Race`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Token xác thực nếu có
      },
      body: JSON.stringify(backendPayload)
    });

    const data = await response.json();

    
    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
      throw new Error(data.message || `Lỗi từ hệ thống server: ${response.status}`);
    }

    return { success: true, message: data.message, raceId: data.data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Lỗi đường truyền API' };
  }
};

/**
 * Upload 1 file ảnh lên Azure Blob Storage (qua backend), trả về URL ảnh thật.
 */
export const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; message?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/Image/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
      throw new Error(data.message || `Lỗi upload ảnh: ${response.status}`);
    }

    return { success: true, url: data.data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Lỗi đường truyền khi upload ảnh' };
  }
};

/**
 * Lấy danh sách toàn bộ Race, dùng cho trang danh sách (RaceListPage).
 */
export const getAllRaces = async (): Promise<{ success: boolean; races?: RaceListItem[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/Race`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    const data = await response.json();

    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
      throw new Error(data.message || `Lỗi từ hệ thống server: ${response.status}`);
    }

    return { success: true, races: data.data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Lỗi đường truyền API' };
  }
};