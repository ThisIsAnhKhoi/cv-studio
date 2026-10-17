/**
 * Tiện ích xử lý ảnh đại diện (Avatar) cho CV Studio
 * Tự động xác thực, crop vuông tâm 1:1, nén chất lượng cao (WebP/JPEG)
 * Giúp kích thước ảnh chỉ ~25-35 kB, siêu nhẹ, không tràn Firestore quota
 */

export interface ImageProcessingOptions {
  targetSize?: number; // Kích thước vuông cạnh (mặc định 400px)
  quality?: number; // Chất lượng nén 0.1 - 1.0 (mặc định 0.88)
  format?: 'image/jpeg' | 'image/webp';
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_UPLOAD_FILE_SIZE_MB = 8;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Kiểm tra tính hợp lệ của tệp ảnh trước khi xử lý
 */
export function validateImageFile(file: File, maxMb = MAX_UPLOAD_FILE_SIZE_MB): ValidationResult {
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn một tệp ảnh.' };
  }

  // 1. Kiểm tra định dạng MIME hoặc extension
  const isValidType =
    ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp|gif)$/i.test(file.name);

  if (!isValidType) {
    return {
      valid: false,
      error: 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG hoặc WebP.',
    };
  }

  // 2. Kiểm tra dung lượng
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Dung lượng ảnh vượt quá giới hạn ${maxMb}MB. Vui lòng chọn ảnh nhỏ hơn.`,
    };
  }

  return { valid: true };
}

/**
 * Xử lý ảnh: Đọc tệp, crop vuông 1:1 chính giữa và nén thành Data URL
 */
export async function processAvatarFile(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<string> {
  const { targetSize = 400, quality = 0.88, format = 'image/jpeg' } = options;

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Không thể đọc dữ liệu tệp ảnh. Vui lòng thử lại.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Tệp tải lên không phải là định dạng ảnh hợp lệ hoặc bị lỗi dữ liệu.'));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Trình duyệt không hỗ trợ xử lý đồ họa Canvas.'));
            return;
          }

          // Kỹ thuật Center Crop 1:1
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          // Cải thiện chất lượng render khi thu nhỏ ảnh
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Vẽ ảnh vuông vào canvas
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

          // Xuất Data URL nén nhẹ
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Lỗi trong quá trình tối ưu hóa ảnh.'));
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Bộ sưu tập ảnh mẫu chân dung chuyên nghiệp (Preset Avatars)
 * Dành cho người dùng muốn chọn nhanh mẫu đại diện chuyên nghiệp
 */
export interface PresetAvatar {
  id: string;
  label: string;
  gender: 'female' | 'male';
  url: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'avatar-female-1',
    label: 'Nữ Doanh Nhân / Quản Lý',
    gender: 'female',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-male-1',
    label: 'Nam Kỹ Sư Phần Mềm',
    gender: 'male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-female-2',
    label: 'Nữ Chuyên Gia Dữ Liệu',
    gender: 'female',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-male-2',
    label: 'Nam Thiết Kế / Sáng Tạo',
    gender: 'male',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-female-3',
    label: 'Nữ Marketing & Truyền Thông',
    gender: 'female',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-male-3',
    label: 'Nam Giám Đốc Kinh Doanh',
    gender: 'male',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
];
