import type { LetterGrade, Course, Semester, GpaStats } from '../types';

// Letter grade to GPA point conversion (scale 4.0)
// VKU uses: A=4, B=3, C=2, D=1, F=0 (no plus/minus grades)
export const LETTER_GRADE_POINTS: Record<LetterGrade, number> = {
  'A': 4.0,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
  '': 0.0,
};

/**
 * Check if a grade counts toward GPA calculation
 */
export function shouldCountInGpa(letterGrade: LetterGrade): boolean {
  // Empty grades don't count (courses without grades yet)
  return letterGrade !== '';
}

/**
 * Calculate GPA for a list of courses
 * Formula: GPA = Σ(credit × point) / Σ(credit)
 */
export function calculateGpa(courses: Course[]): GpaStats {
  let totalPoints = 0;
  let totalCredits = 0;
  let totalCourses = 0;

  for (const course of courses) {
    // Only include courses that:
    // 1. Are marked as included
    // 2. Have valid grades (hasGrade is true)
    if (course.included && course.hasGrade && shouldCountInGpa(course.letterGrade)) {
      const points = LETTER_GRADE_POINTS[course.letterGrade];
      totalPoints += course.credits * points;
      totalCredits += course.credits;
      totalCourses++;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return {
    gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
    totalCredits,
    totalCourses,
  };
}

/**
 * Calculate GPA for a specific semester
 */
export function calculateSemesterGpa(semester: Semester): GpaStats {
  return calculateGpa(semester.courses);
}

/**
 * Calculate overall GPA across all semesters
 */
export function calculateOverallGpa(semesters: Semester[]): GpaStats {
  const allCourses = semesters.flatMap(s => s.courses);
  return calculateGpa(allCourses);
}

/**
 * Check if a course should show "Nên học lại" (should retake) badge
 */
export function shouldRetake(course: Course): boolean {
  return course.letterGrade === 'D' || course.letterGrade === 'F';
}

/**
 * Apply edits to courses and return modified courses
 */
export function applyEdits(
  courses: Course[],
  edits: Map<string, { newLetterGrade: LetterGrade; newIncluded: boolean }>
): Course[] {
  return courses.map(course => {
    const edit = edits.get(course.id);
    if (!edit) return course;

    return {
      ...course,
      letterGrade: edit.newLetterGrade,
      included: edit.newIncluded,
    };
  });
}
