import { useMemo, useCallback } from 'react';
import type { Course, LetterGrade } from '../types';
import { shouldRetake } from '../utils/gpaCalculator';

interface CourseRowProps {
  course: Course;
  onLetterGradeChange: (courseId: string, newGrade: LetterGrade) => void;
  onIncludeChange: (courseId: string, included: boolean) => void;
  onUndo: (courseId: string) => void;
  hasEdit: boolean;
  originalLetterGrade?: LetterGrade;
}

const LETTER_GRADES: LetterGrade[] = ['A', 'B', 'C', 'D', 'F'];

export default function CourseRow({
  course,
  onLetterGradeChange,
  onIncludeChange,
  onUndo,
  hasEdit,
  originalLetterGrade,
}: CourseRowProps) {
  const showRetakeBadge = useMemo(() => shouldRetake(course), [course]);
  
  const handleGradeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'original' && originalLetterGrade) {
      onUndo(course.id);
    } else {
      onLetterGradeChange(course.id, value as LetterGrade);
    }
  }, [course.id, onLetterGradeChange, onUndo, originalLetterGrade]);

  const handleIncludeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onIncludeChange(course.id, e.target.checked);
  }, [course.id, onIncludeChange]);

  // Determine row styling based on state
  const rowClassName = useMemo(() => {
    if (!course.hasGrade) {
      return 'opacity-60 bg-gray-50';
    }
    if (hasEdit) {
      return 'bg-primary/5 border-l-4 border-l-primary transition-colors';
    }
    if (!course.included) {
      return 'opacity-40 bg-gray-50/50 hover:bg-gray-50 transition-all';
    }
    if (showRetakeBadge) {
      return 'bg-red-50/30 hover:bg-red-50/50 transition-colors border-l-4 border-l-transparent';
    }
    return 'hover:bg-gray-50 transition-colors border-l-4 border-l-transparent';
  }, [course.hasGrade, hasEdit, showRetakeBadge, course.included]);

  return (
    <tr className={rowClassName}>
      {/* STT */}
      <td className="px-6 py-4 text-text-secondary">
        {course.index}
      </td>

      {/* Tên học phần */}
      <td className="px-6 py-4 font-medium text-text-main">
        <div className="flex flex-col gap-1">
          <span>{course.name}</span>
          {showRetakeBadge && course.hasGrade && (
            <span className="inline-flex w-fit items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
              Nên học lại
            </span>
          )}
          {!course.hasGrade && (
            <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Chưa có điểm
            </span>
          )}
        </div>
      </td>

      {/* Số tín chỉ */}
      <td className="px-6 py-4 text-text-secondary">
        {course.credits}
      </td>

      {/* Lần học */}
      <td className="px-6 py-4 text-text-secondary">
        {course.attempt}
      </td>

      {/* Điểm tổng */}
      <td className={`px-6 py-4 ${
        showRetakeBadge && course.hasGrade 
          ? 'text-red-600 font-medium' 
          : 'text-text-secondary'
      }`}>
        {course.numericScore?.toFixed(1) || '-'}
      </td>

      {/* Điểm chữ */}
      <td className="px-6 py-4">
        {course.hasGrade ? (
          <div className="font-bold">
            <span className={hasEdit ? 'text-primary' : showRetakeBadge ? 'text-red-600' : 'text-text-main'}>
              {course.letterGrade}
            </span>
            {hasEdit && originalLetterGrade && (
              <span className="text-xs text-text-secondary font-normal ml-1 line-through opacity-50">
                {originalLetterGrade}
              </span>
            )}
          </div>
        ) : (
          <span className="text-text-secondary text-sm">-</span>
        )}
      </td>

      {/* Checkbox: Tính vào GPA */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={course.included}
            onChange={handleIncludeChange}
            disabled={!course.hasGrade && !hasEdit}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label={`Tính ${course.name} vào GPA`}
          />
        </div>
      </td>

      {/* Thay đổi / Edit dropdown */}
      <td className="px-6 py-4">
        <div className="relative flex flex-col gap-1">
          <select
            value={hasEdit ? course.letterGrade : (course.hasGrade ? 'original' : '')}
            onChange={handleGradeChange}
            className={`block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 ${
              hasEdit 
                ? 'border-primary text-primary font-medium ring-primary focus:ring-primary' 
                : 'border-0 ring-gray-300 focus:ring-primary'
            }`}
            aria-label={`Thay đổi điểm cho ${course.name}`}
          >
            {course.hasGrade && (
              <option value="original">
                {hasEdit ? `Khôi phục (Điểm gốc: ${originalLetterGrade})` : 'Giữ nguyên'}
              </option>
            )}
            {!course.hasGrade && (
              <option value="">Chọn điểm để mô phỏng</option>
            )}
            {LETTER_GRADES.map(grade => (
              <option key={grade} value={grade}>
                Điểm {grade}
              </option>
            ))}
          </select>
          {hasEdit && (
            <span className="text-[11px] font-medium text-primary flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {course.hasGrade 
                  ? `Đã chỉnh: ${originalLetterGrade} → ${course.letterGrade}`
                  : `Mô phỏng: ${course.letterGrade}`
                }
              </span>
            )}
          </div>
        </td>
    </tr>
  );
}
