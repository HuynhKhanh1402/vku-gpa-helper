// Core domain types for VKU GPA Helper

// VKU only uses A, B, C, D, F (no plus/minus grades)
// Empty string '' represents courses without grades yet
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F' | '';

export interface Course {
  id: string; // Unique identifier
  index: number; // STT (row number in semester)
  name: string; // Tên học phần
  credits: number; // Số tín chỉ
  attempt: number; // Lần học (1, 2, 3...)
  componentScore?: number; // Điểm thành phần
  midtermScore?: number; // Điểm giữa kỳ
  finalScore?: number; // Điểm cuối kỳ
  numericScore?: number; // Điểm tổng (T10)
  letterGrade: LetterGrade; // Điểm chữ ('' = chưa có điểm)
  included: boolean; // Tính vào GPA hay không (auto false if no grade)
  hasGrade: boolean; // Có điểm chữ hay chưa
}

export interface CourseEdit {
  courseId: string;
  oldLetterGrade: LetterGrade;
  newLetterGrade: LetterGrade;
  oldIncluded: boolean;
  newIncluded: boolean;
}

export interface Semester {
  id: string;
  name: string; // e.g., "Học kỳ 1 - 2023-2024"
  courses: Course[];
}

export interface ParsedData {
  semesters: Semester[];
}

export interface GpaStats {
  gpa: number;
  totalCredits: number;
  totalCourses: number;
}

export interface AppState {
  parsedData: ParsedData | null;
  edits: Map<string, CourseEdit>; // courseId -> edit
  isLoading: boolean;
  error: string | null;
}
