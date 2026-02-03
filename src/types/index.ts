// Core domain types for VKU GPA Helper

// VKU only uses A, B, C, D, F (no plus/minus grades)
// Empty string '' represents courses without grades yet
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F' | '';

export interface Course {
  id: string; // Unique identifier
  index: number; // STT (row number in semester)
  name: string; // Course name
  credits: number; // Number of credits
  attempt: number; // Attempt number (1, 2, 3...)
  componentScore?: number; // Component score
  midtermScore?: number; // Midterm score
  finalScore?: number; // Final score
  numericScore?: number; // Total numeric score (T10)
  letterGrade: LetterGrade; // Letter grade ('' = no grade yet)
  included: boolean; // Include in GPA calculation (auto false if no grade)
  hasGrade: boolean; // Has letter grade or not
  isRetakeDisabled: boolean; // Disabled because retaken with higher grade
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
  name: string; // e.g., "Semester 1 - 2023-2024"
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
