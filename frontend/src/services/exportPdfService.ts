import html2pdf from 'html2pdf.js';

export const exportCVToPDF = async (elementId: string, fullName: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy phần tử DOM với id: ${elementId}`);
    return false;
  }

  // Tên file chuẩn đẹp, không dấu hoặc định dạng sạch
  const cleanName = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `CV_${cleanName || 'Profile'}.pdf`;

  // Cấu hình tối ưu xuất PDF A4 độ nét cao (2x DPI)
  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    enableLinks: true,
    html2canvas: {
      scale: 2, // Độ phân giải 2x sắc nét như in vector
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollY: 0,
      windowWidth: element.scrollWidth,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
  };

  try {
    await html2pdf().set(options).from(element).save();
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất PDF:', error);
    return false;
  }
};
