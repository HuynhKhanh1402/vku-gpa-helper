import { useMemo } from 'react';
import type { GpaStats } from '../types';

interface GpaSummaryProps {
  currentGpa: GpaStats;
  editedGpa: GpaStats;
  hasEdits: boolean;
}

export default function GpaSummary({ currentGpa, editedGpa, hasEdits }: GpaSummaryProps) {
  const delta = useMemo(() => {
    return editedGpa.gpa - currentGpa.gpa;
  }, [editedGpa.gpa, currentGpa.gpa]);

  const deltaFormatted = useMemo(() => {
    const sign = delta >= 0 ? '+' : '';
    return `${sign}${delta.toFixed(2)}`;
  }, [delta]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cumulative GPA */}
      <div className="flex flex-col gap-3 rounded-xl p-6 bg-white border border-border shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
            GPA Tích lũy
          </p>
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-text-main text-4xl font-bold leading-none">
            {currentGpa.gpa.toFixed(2)}
          </p>
          <p className="text-text-secondary text-lg font-medium pb-1">/ 4.0</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-text-secondary">
            {currentGpa.totalCourses} môn học • {currentGpa.totalCredits} tín chỉ
          </p>
        </div>
      </div>

      {/* Total Credits */}
      <div className="flex flex-col gap-3 rounded-xl p-6 bg-white border border-border shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
            Tổng tín chỉ
          </p>
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </span>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-text-main text-4xl font-bold leading-none">
            {currentGpa.totalCredits}
          </p>
        </div>
      </div>

      {/* Simulated GPA */}
      <div className={`flex flex-col gap-3 rounded-xl p-6 shadow-sm ${
        hasEdits 
          ? 'bg-white border border-primary/20 ring-2 ring-primary/5' 
          : 'bg-white border border-border'
      }`}>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium uppercase tracking-wider ${
            hasEdits ? 'text-primary' : 'text-text-secondary'
          }`}>
            GPA Mô phỏng
          </p>
          <span className={`flex items-center justify-center w-8 h-8 rounded-md ${
            hasEdits ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
        </div>
        <div className="flex items-end gap-3">
          <p className={`text-4xl font-bold leading-none ${
            hasEdits ? 'text-primary' : 'text-text-main'
          }`}>
            {editedGpa.gpa.toFixed(2)}
          </p>
          <p className={`text-lg font-medium pb-1 ${
            hasEdits ? 'text-primary/60' : 'text-text-secondary'
          }`}>
            / 4.0
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {hasEdits && delta !== 0 && (
            <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              delta > 0 
                ? 'text-success bg-success/10' 
                : 'text-error bg-error/10'
            }`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {delta > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              {deltaFormatted}
            </span>
          )}
          <p className="text-xs text-text-secondary">
            {hasEdits ? `Dựa trên ${editedGpa.totalCourses} môn học` : 'Chưa có thay đổi'}
          </p>
        </div>
      </div>
    </div>
  );
}
