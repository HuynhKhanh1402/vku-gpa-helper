import type { Semester, Course, ParsedData, LetterGrade } from '../types';

/**
 * Parse VKU grade HTML file and extract semester data
 * The VKU HTML contains multiple tables, each representing a semester
 */
export function parseVkuHtml(htmlContent: string): ParsedData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Find all semester sections (identified by specific td elements with semester headers)
  const semesters: Semester[] = [];
  
  // Look for rows with semester headers (colspan="13" with semester name)
  const allRows = doc.querySelectorAll('tr');
  let currentSemester: Semester | null = null;
  let courseIndex = 0;

  allRows.forEach((row) => {
    // Check if this row is a semester header
    const semesterHeader = row.querySelector('td[colspan="13"]');
    
    if (semesterHeader) {
      const semesterText = semesterHeader.textContent?.trim() || '';
      
      // Filter out "Học kỳ riêng - Quy đổi" (transferred/recognized courses)
      if (semesterText.includes('Quy đổi') || semesterText.includes('riêng')) {
        currentSemester = null;
        return;
      }
      
      // Check if it's a valid semester header
      if (semesterText.includes('Học kỳ')) {
        // Save previous semester if exists  
        if (currentSemester) {
          semesters.push(currentSemester);
        }
        
        // Start new semester
        currentSemester = {
          id: `semester-${semesters.length + 1}`,
          name: semesterText,
          courses: [],
        };
        courseIndex = 0;
      }
      return;
    }

    // If we're in a semester and this is a course row
    const semester = currentSemester;
    if (semester) {
      const cells = row.querySelectorAll('td');
      
      // A valid course row should have at least 10 cells
      if (cells.length >= 10) {
        const indexCell = cells[0]?.textContent?.trim();
        
        // Check if first cell is a number (course index)
        if (indexCell && /^\d+$/.test(indexCell)) {
          try {
            const course = parseCourseRow(cells, semester.id, courseIndex++);
            if (course) {
              semester.courses.push(course);
            }
          } catch (error) {
            console.warn('Failed to parse course row:', error);
          }
        }
      }
    }
  });

  // Don't forget to add the last semester
  if (currentSemester) {
    semesters.push(currentSemester);
  }

  if (semesters.length === 0) {
    throw new Error('Không tìm thấy bảng điểm trong tập tin. Vui lòng kiểm tra định dạng file.');
  }

  return { semesters };
}

/**
 * Parse a single course row from the HTML table
 */
function parseCourseRow(cells: NodeListOf<Element>, semesterId: string, courseIndex: number): Course | null {
  try {
    const index = parseInt(cells[0]?.textContent?.trim() || '0');
    
    // Extract course name (remove icons/badges)
    const nameElement = cells[1];
    const nameText = nameElement?.textContent?.trim() || '';
    const name = cleanCourseName(nameText);
    
    const credits = parseInt(cells[2]?.textContent?.trim() || '0');
    const attempt = parseInt(cells[3]?.textContent?.trim() || '1');
    
    // Optional scores
    const componentScore = parseFloat(cells[4]?.textContent?.trim() || '') || undefined;
    const midtermScore = parseFloat(cells[6]?.textContent?.trim() || '') || undefined;
    const finalScore = parseFloat(cells[7]?.textContent?.trim() || '') || undefined;
    const numericScore = parseFloat(cells[8]?.textContent?.trim() || '') || undefined;
    
    // Letter grade - extract from the last column with grade
    const letterGradeElement = cells[9];
    const letterGradeText = letterGradeElement?.textContent?.trim() || '';
    const letterGrade = normalizeLetterGrade(letterGradeText);
    
    // Determine if course has a valid grade
    const hasGrade = letterGrade !== '';
    
    // Include all courses, even those without grades
    const course: Course = {
      id: `${semesterId}-course-${courseIndex}`,
      index,
      name,
      credits,
      attempt,
      componentScore,
      midtermScore,
      finalScore,
      numericScore,
      letterGrade,
      included: hasGrade, // Only include in GPA if has grade
      hasGrade, // Track if course has grade
    };
    
    return course;
  } catch (error) {
    console.error('Error parsing course row:', error);
    return null;
  }
}

/**
 * Clean course name by removing icons and extra whitespace
 */
function cleanCourseName(rawName: string): string {
  return rawName
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize letter grade to our supported types (A, B, C, D, F)
 * VKU HTML may have different formats/colors
 */
function normalizeLetterGrade(gradeText: string): LetterGrade {
  const grade = gradeText.trim().toUpperCase();
  
  // Map to our supported grades
  if (grade === 'A') return 'A';
  if (grade === 'B') return 'B';
  if (grade === 'C') return 'C';
  if (grade === 'D') return 'D';
  if (grade === 'F') return 'F';
  
  // Ignore special grades like R (recognized/transferred)
  if (grade === 'R' || grade === 'P') return '';
  
  return '';
}

/**
 * Validate if the uploaded file looks like a VKU grade HTML
 */
export function validateVkuHtml(htmlContent: string): boolean {
  // Check for VKU-specific markers
  const hasVkuMarker = htmlContent.includes('daotao.vku.udn.vn') || 
                        htmlContent.includes('Trường Đại học CNTT&TT Việt - Hàn');
  const hasSemesterMarker = htmlContent.includes('Học kỳ');
  
  return hasVkuMarker || hasSemesterMarker;
}
