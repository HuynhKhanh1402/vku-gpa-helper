import { useCallback, useState } from 'react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function UploadArea({ onFileSelect, isLoading }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-2 text-center sm:text-left sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Tính điểm GPA & <span className="text-primary">Mô phỏng</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Công cụ hỗ trợ sinh viên VKU phân tích bảng điểm, tính toán GPA tích lũy và dự đoán kết quả cải thiện học tập.
          </p>
        </div>
      </div>

      {/* Hướng dẫn lấy file HTML - Show first on mobile */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm order-2 lg:order-3">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="rounded-lg bg-cyan-50 p-2 sm:p-3 text-cyan-600">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
              Hướng dẫn lấy file HTML điểm của bạn
            </h4>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex-shrink-0">1</span>
                <p>Truy cập trang xem điểm: <a href="https://daotao.vku.udn.vn/sv/diem" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">https://daotao.vku.udn.vn/sv/diem</a></p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex-shrink-0">2</span>
                <p>Đăng nhập bằng tài khoản sinh viên VKU của bạn</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex-shrink-0">3</span>
                <p>Sau khi trang điểm hiển thị đầy đủ, nhấn <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl + S</kbd> (Windows) hoặc <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Cmd + S</kbd> (Mac) để lưu trang</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex-shrink-0">4</span>
                <p>Chọn định dạng <strong className="font-semibold text-slate-700">Webpage, HTML Only</strong> và lưu file về máy</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex-shrink-0">5</span>
                <p>Kéo thả hoặc chọn file HTML vừa lưu vào khu vực tải lên bên dưới</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs sm:text-sm text-cyan-800">
              <strong className="font-semibold">Lưu ý:</strong> Dữ liệu của bạn được xử lý hoàn toàn trên trình duyệt, không được gửi lên server. File HTML chỉ chứa thông tin điểm số công khai.
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section - Show after instructions on mobile */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-slate-200 overflow-hidden order-3 lg:order-2">
        <div className="p-4 sm:p-8 lg:p-12">
          <div
            className={`relative group cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 px-4 sm:px-6 py-8 sm:py-12 lg:py-16 text-center ${
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.02]'
                : 'border-slate-300 hover:border-primary bg-slate-50 hover:bg-primary/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isLoading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".html,.htm"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            
            <div className="flex size-12 sm:size-16 items-center justify-center rounded-full bg-white shadow-sm mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
              Kéo & thả file HTML điểm VKU ở đây
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
              Đăng nhập trang đào tạo, lưu bảng điểm dưới dạng .html và tải lên hệ thống.
            </p>
            
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button 
                type="button"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-surface-light px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  !isLoading && document.getElementById('file-input')?.click();
                }}
              >
                {isLoading ? 'Đang xử lý...' : 'Chọn file từ máy'}
              </button>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                hoặc kéo thả
              </span>
            </div>

            {isLoading && (
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-primary">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-primary"></div>
                <span className="text-xs sm:text-sm font-medium">Đang phân tích file...</span>
              </div>
            )}

            {/* Decorative background */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl opacity-50 pointer-events-none">
              <svg 
                aria-hidden="true" 
                className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-slate-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              >
                <defs>
                  <pattern 
                    height="200" 
                    id="upload-pattern" 
                    patternUnits="userSpaceOnUse" 
                    width="200" 
                    x="50%" 
                    y="-1"
                  >
                    <path d="M100 200V.5M.5 .5H200" fill="none"></path>
                  </pattern>
                </defs>
                <svg className="overflow-visible fill-slate-50" x="50%" y="-1">
                  <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0"></path>
                </svg>
                <rect fill="url(#upload-pattern)" height="100%" strokeWidth="0" width="100%"></rect>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
