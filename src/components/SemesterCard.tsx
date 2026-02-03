import { useState, useMemo, useCallback } from 'react';
import type { Semester, LetterGrade, CourseEdit } from '../types';
import { calculateSemesterGpa } from '../utils/gpaCalculator';
import CourseRow from './CourseRow';

interface SemesterCardProps {
  semester: Semester;
  edits: Map<string, CourseEdit>;
  onLetterGradeChange: (courseId: string, newGrade: LetterGrade) => void;
  onIncludeChange: (courseId: string, included: boolean) => void;
  onUndo: (courseId: string) => void;
  onSelectAll: (semesterId: string, selected: boolean) => void;
}

export default function SemesterCard({
  semester,
  edits,
  onLetterGradeChange,
  onIncludeChange,
  onUndo,
  onSelectAll,
}: SemesterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Apply edits to courses for display
  const displayCourses = useMemo(() => {
    return semester.courses.map(course => {
      const edit = edits.get(course.id);
      if (!edit) return course;
      
      return {
        ...course,
        letterGrade: edit.newLetterGrade,
        included: edit.newIncluded,
      };
    });
  }, [semester.courses, edits]);

  // Check if all courses with grades are selected
  const allSelected = useMemo(() => {
    const coursesWithGrades = displayCourses.filter(c => c.hasGrade);
    return coursesWithGrades.length > 0 && coursesWithGrades.every(c => c.included);
  }, [displayCourses]);

  // Check if some (but not all) courses are selected
  const someSelected = useMemo(() => {
    const coursesWithGrades = displayCourses.filter(c => c.hasGrade);
    const selectedCount = coursesWithGrades.filter(c => c.included).length;
    return selectedCount > 0 && selectedCount < coursesWithGrades.length;
  }, [displayCourses]);

  const handleSelectAllChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(semester.id, e.target.checked);
  }, [semester.id, onSelectAll]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const totalCredits = useMemo(() => {
    return displayCourses.reduce((sum, course) => sum + course.credits, 0);
  }, [displayCourses]);

  // Calculate semester GPA based on current display courses
  const semesterGpa = useMemo(() => {
    const semesterWithDisplayCourses = {
      ...semester,
      courses: displayCourses,
    };
    return calculateSemesterGpa(semesterWithDisplayCourses);
  }, [semester, displayCourses]);

  const containerClassName = useMemo(() => {
    if (allSelected) {
      return 'group flex flex-col rounded-xl border-2 border-primary/30 bg-white shadow-sm overflow-hidden ring-2 ring-primary/5';
    }
    if (someSelected) {
      return 'group flex flex-col rounded-xl border-2 border-primary/20 bg-white shadow-sm overflow-hidden';
    }
    return 'group flex flex-col rounded-xl border border-border-muted bg-white shadow-sm overflow-hidden';
  }, [allSelected, someSelected]);

  return (
    <details className={containerClassName} open={isExpanded}>
      <summary 
        className={`flex cursor-pointer items-center justify-between gap-6 px-6 py-4 transition-colors border-b border-border-light ${
          allSelected 
            ? 'bg-primary/5 hover:bg-primary/10' 
            : someSelected 
            ? 'bg-primary/3 hover:bg-gray-50' 
            : 'bg-gray-50/50 hover:bg-gray-50'
        }`}
        onClick={(e) => {
          e.preventDefault();
          toggleExpand();
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={handleSelectAllChange}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                title="Select all courses in this semester"
              />
            </div>
            <h3 className="text-text-main text-lg font-bold leading-normal">
              {semester.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              allSelected 
                ? 'bg-primary/10 text-primary ring-primary/20' 
                : someSelected
                ? 'bg-primary/5 text-primary/80 ring-primary/10'
                : 'bg-gray-100 text-gray-600 ring-gray-500/10'
            }`}>
              {totalCredits} Tín chỉ
            </span>
            {semesterGpa.totalCourses > 0 && (
              <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                GPA: {semesterGpa.gpa.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="text-sm font-medium">
            {isExpanded ? 'Ẩn chi tiết' : 'Hiển chi tiết'}
          </span>
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? '-rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>

      {/* Body - Course Table */}
      {isExpanded && (
        <div className="overflow-x-auto p-0 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-text-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">STT</th>
                <th className="px-6 py-4 font-semibold min-w-[200px]">Tên học phần</th>
                <th className="px-6 py-4 font-semibold w-24">Tín chỉ</th>
                <th className="px-6 py-4 font-semibold w-24">Lần</th>
                <th className="px-6 py-4 font-semibold w-28">Điểm tổng</th>
                <th className="px-6 py-4 font-semibold w-24">Điểm chữ</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">Tính vào GPA</th>
                <th className="px-6 py-4 font-semibold w-48">Thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayCourses.map((course) => {
                const edit = edits.get(course.id);
                return (
                  <CourseRow
                    key={course.id}
                    course={course}
                    onLetterGradeChange={onLetterGradeChange}
                    onIncludeChange={onIncludeChange}
                    onUndo={onUndo}
                    hasEdit={!!edit}
                    originalLetterGrade={edit?.oldLetterGrade}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}
