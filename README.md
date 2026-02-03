# VKU GPA Helper

A responsive, single-page React application for VKU (Vietnam-Korea University of Information and Communication Technology) students to calculate and manage their GPA. The app runs entirely client-side, parsing exported grade HTML files from the VKU training management system.

## Features

- **Client-side HTML parsing**: Upload your VKU grade HTML file and parse it directly in the browser
- **Semester-based organization**: View courses grouped by semester with expandable/collapsible cards
- **Interactive GPA calculation**: 
  - Edit letter grades (A/B/C/D/F)
  - Toggle courses in/out of GPA calculation
  - See real-time GPA updates
- **Change tracking**: 
  - Visual indicators for modified courses
  - Per-course undo functionality
  - Reset all changes button
- **Live statistics**: Current GPA vs. Edited GPA with delta calculation
- **Accessible**: Keyboard navigation and screen reader friendly

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Client-side only** - no backend required

## Getting Started

## Usage

1. **Export your grades**: 
   - Go to VKU's training management system (daotao.vku.udn.vn)
   - Navigate to your grade results page
   - Save the page as HTML (Ctrl+S / Cmd+S)

2. **Upload the HTML file**:
   - Drag and drop the file into the upload area, or click to select

3. **Review and edit**:
   - View your courses organized by semester
   - Edit letter grades using the dropdown
   - Check/uncheck courses to include/exclude from GPA calculation
   - Use "Chọn tất cả" to select/deselect all courses in a semester

4. **Monitor your GPA**:
   - See current GPA, edited GPA, and the difference
   - Changes are highlighted with visual indicators

5. **Undo changes**:
   - Click "Hoàn tác" on individual courses
   - Click "Thiết lập lại tất cả" to reset everything

## GPA Calculation

The app uses the standard 4.0 scale:
- A = 4.0
- B = 3.0
- C = 2.0
- D = 1.0
- F = 0.0

Formula: `GPA = Σ(credits × grade_points) / Σ(credits)`

Only courses marked as "included" are counted in the calculation.

## Notes
- **Privacy**: All processing happens in your browser - no data sent to servers
- **VKU format specific**: Parser is designed for VKU's specific HTML structure
## License

MIT
