import { useState, useCallback, useMemo } from 'react';
import type { ParsedData, CourseEdit, LetterGrade, Semester } from './types';
import { parseVkuHtml, validateVkuHtml } from './utils/vkuParser';
import { calculateOverallGpa } from './utils/gpaCalculator';
import UploadArea from './components/UploadArea';
import SemesterCard from './components/SemesterCard';
import GpaSummary from './components/GpaSummary';
import './App.css';

function App() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [edits, setEdits] = useState<Map<string, CourseEdit>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();

      // Validate the HTML
      if (!validateVkuHtml(text)) {
        throw new Error('File không đúng định dạng. Vui lòng chọn file HTML từ hệ thống đào tạo VKU.');
      }

      // Parse the HTML
      const data = parseVkuHtml(text);
      setParsedData(data);
      setEdits(new Map()); // Clear any previous edits
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể đọc file. Vui lòng kiểm tra định dạng.';
      setError(errorMessage);
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply edits to get modified semesters
  const modifiedSemesters = useMemo((): Semester[] => {
    if (!parsedData) return [];

    return parsedData.semesters.map(semester => ({
      ...semester,
      courses: semester.courses.map(course => {
        const edit = edits.get(course.id);
        if (!edit) return course;

        return {
          ...course,
          letterGrade: edit.newLetterGrade,
          included: edit.newIncluded,
        };
      }),
    }));
  }, [parsedData, edits]);

  // Calculate GPAs
  const currentGpa = useMemo(() => {
    if (!parsedData) return { gpa: 0, totalCredits: 0, totalCourses: 0 };
    return calculateOverallGpa(parsedData.semesters);
  }, [parsedData]);

  const editedGpa = useMemo(() => {
    if (!parsedData) return { gpa: 0, totalCredits: 0, totalCourses: 0 };
    return calculateOverallGpa(modifiedSemesters);
  }, [parsedData, modifiedSemesters]);

  const hasEdits = useMemo(() => edits.size > 0, [edits]);

  // Handle letter grade change for a course
  const handleLetterGradeChange = useCallback((courseId: string, newGrade: LetterGrade) => {
    setEdits(prevEdits => {
      const newEdits = new Map(prevEdits);
      const existingEdit = newEdits.get(courseId);

      if (existingEdit) {
        // Update existing edit
        newEdits.set(courseId, {
          ...existingEdit,
          newLetterGrade: newGrade,
        });
      } else {
        // Create new edit - find the original course
        const originalCourse = parsedData?.semesters
          .flatMap(s => s.courses)
          .find(c => c.id === courseId);

        if (originalCourse) {
          newEdits.set(courseId, {
            courseId,
            oldLetterGrade: originalCourse.letterGrade,
            newLetterGrade: newGrade,
            oldIncluded: originalCourse.included,
            newIncluded: originalCourse.included,
          });
        }
      }

      // If the new grade equals the original, remove the edit
      const edit = newEdits.get(courseId);
      if (edit && edit.newLetterGrade === edit.oldLetterGrade && edit.newIncluded === edit.oldIncluded) {
        newEdits.delete(courseId);
      }

      return newEdits;
    });
  }, [parsedData]);

  // Handle include/exclude change for a course
  const handleIncludeChange = useCallback((courseId: string, included: boolean) => {
    setEdits(prevEdits => {
      const newEdits = new Map(prevEdits);
      const existingEdit = newEdits.get(courseId);

      if (existingEdit) {
        // Update existing edit
        newEdits.set(courseId, {
          ...existingEdit,
          newIncluded: included,
        });
      } else {
        // Create new edit
        const originalCourse = parsedData?.semesters
          .flatMap(s => s.courses)
          .find(c => c.id === courseId);

        if (originalCourse) {
          newEdits.set(courseId, {
            courseId,
            oldLetterGrade: originalCourse.letterGrade,
            newLetterGrade: originalCourse.letterGrade,
            oldIncluded: originalCourse.included,
            newIncluded: included,
          });
        }
      }

      // If the new state equals the original, remove the edit
      const edit = newEdits.get(courseId);
      if (edit && edit.newLetterGrade === edit.oldLetterGrade && edit.newIncluded === edit.oldIncluded) {
        newEdits.delete(courseId);
      }

      return newEdits;
    });
  }, [parsedData]);

  // Handle undo for a specific course
  const handleUndo = useCallback((courseId: string) => {
    setEdits(prevEdits => {
      const newEdits = new Map(prevEdits);
      newEdits.delete(courseId);
      return newEdits;
    });
  }, []);

  // Handle select all courses in a semester
  const handleSelectAll = useCallback((semesterId: string, selected: boolean) => {
    const semester = parsedData?.semesters.find(s => s.id === semesterId);
    if (!semester) return;

    semester.courses.forEach(course => {
      handleIncludeChange(course.id, selected);
    });
  }, [parsedData, handleIncludeChange]);

  // Reset all edits
  const handleResetAll = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn thiết lập lại tất cả các chỉnh sửa?')) {
      setEdits(new Map());
    }
  }, []);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light font-display overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-white/80 backdrop-blur-md px-10 py-4 shadow-sm">
        <button 
          onClick={() => {
            setParsedData(null);
            setEdits(new Map());
            setError(null);
          }}
          className="flex items-center gap-4 text-text-main hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl">
            <img src="/vku.svg" alt="VKU Logo" className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-text-main">VKU GPA Helper</h2>
            <p className="text-xs font-medium text-text-secondary">Công cụ tính GPA</p>
          </div>
        </button>
        {parsedData && (
          <div className="flex flex-1 justify-end gap-6 items-center">
            <div className="hidden md:flex gap-3">
              {hasEdits && (
                <button 
                  onClick={handleResetAll}
                  className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-white border border-border-muted text-text-main text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="truncate">Đặt lại</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setParsedData(null);
                  setEdits(new Map());
                  setError(null);
                }}
                className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-primary text-surface-light text-sm font-semibold shadow-md hover:bg-primary-hover transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="truncate">Tải file mới</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-8 px-6 lg:px-20 xl:px-40">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8">{!parsedData && (
          <div className="space-y-6">
            <UploadArea onFileSelect={handleFileSelect} isLoading={isLoading} />
            
            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {parsedData && (
          <div className="space-y-6">
            {/* GPA Summary */}
            <GpaSummary
              currentGpa={currentGpa}
              editedGpa={editedGpa}
              hasEdits={hasEdits}
            />

            {/* Semesters */}
            <div className="flex flex-col gap-6">
              {modifiedSemesters.map((semester) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  edits={edits}
                  onLetterGradeChange={handleLetterGradeChange}
                  onIncludeChange={handleIncludeChange}
                  onUndo={handleUndo}
                  onSelectAll={handleSelectAll}
                />
              ))}
            </div>

            {/* Footer Info */}
            <div className="flex justify-center pb-12 pt-4">
              <p className="text-sm text-text-secondary text-center max-w-lg">
                Mô phỏng GPA của bạn bằng cách thay đổi điểm hoặc loại trừ các môn học. Các thay đổi chỉ mang tính chất tham khảo và không ảnh hưởng đến bảng điểm thực tế.
              </p>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

