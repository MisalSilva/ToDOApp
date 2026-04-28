# Comprehensive Implementation Plan: Modern To-Do App

This document outlines the full technical specification, design philosophy, and implementation roadmap for the To-Do application.

## 1. Technology Stack
- **Frontend Framework**: React (Vite-powered) for rapid development and optimized builds.
- **Backend/Database**: Firebase Firestore for real-time data persistence and synchronization.
- **Styling**: Vanilla CSS with CSS Variables for a robust design system and dynamic theming.
- **Icons**: Lucide React for modern, consistent iconography.
- **State Management**: React Context/Hooks for global theme and task state.

## 2. Core Features
- **Task Management**:
  - Add new tasks with title and detailed descriptions.
  - Mark tasks as 'Completed' or 'Pending'.
  - **Edit Functionality**: Modify existing tasks (title, description, priority, due date).
  - **Priority System**: Categorize tasks as High, Medium, or Low criticality.
  - **Deadline Tracking**: Assign due dates to tasks using a native calendar picker.
  - Delete tasks with confirmation or smooth exit animation.
- **Filtering System**:
  - **Status Filters**: All, Pending, and Completed tabs.
  - **Advanced Filters**: Filter tasks by **Priority** (High, Medium, Low) and **Due Date**. These filters apply across all status tabs.
- **Navigation**:
  - **Top Navigation Bar**: A dedicated panel at the top for the app title ("ToDo Mate") and the Theme Toggle button.
- **Theming**:
  - **Light Mode**: High contrast, clean, airy design.
  - **Dark Mode**: Sleek, deep-gray palette with vibrant accents to reduce eye strain.
- **Real-time Sync**: Automatic updates across all open tabs/devices via Firestore listeners.

## 3. UI/UX Design System
### Color Palette (CSS Variables)
| Token | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| `--bg-primary` | `#F8FAFC` | `#0F172A` |
| `--bg-secondary`| `#FFFFFF` | `#1E293B` |
| `--bg-card`     | `rgba(255, 255, 255, 0.8)` | `rgba(30, 41, 59, 0.7)` |
| `--text-primary`| `#1E293B` | `#F8FAFC` |
| `--text-muted`  | `#64748B` | `#94A3B8` |
| `--accent`      | `#6366F1` | `#818CF8` |
| `--danger`      | `#EF4444` | `#F87171` |
| `--success`     | `#10B981` | `#34D399` |

### Typography
- **Font**: 'Inter' or 'Outfit' (Google Fonts) for a modern, professional look.
- **Scales**: Responsive font sizes using `rem` units.

## 4. Technical Architecture
### Data Structure (Firestore)
- **Collection**: `tasks`
- **Document Schema**:
  ```json
  {
    "id": "string",
    "text": "string",
    "description": "string",
    "completed": "boolean",
    "criticality": "string (High | Medium | Low)",
    "dueDate": "string (ISO Date)",
    "createdAt": "timestamp",
    "userId": "string"
  }
  ```

### Component Hierarchy
- `App.jsx`: State hub, ThemeProvider, and Main Layout.
- `Navbar.jsx`: (Inside App) Fixed top bar with Title and Theme Switcher.
- `TaskForm.jsx`: (Inside App) Input for new tasks.
- `FilterSection.jsx`: (Inside App) Status tabs + Priority & Date filter controls.
- `TaskList.jsx`: (Inside App) Mapping logic for task items.
- `TaskItem.jsx`: (Inside App) Individual task card with toggle and delete buttons.

## 5. Implementation Roadmap
1. **Phase 1: Foundation**
   - Initialize Vite React project.
   - Install `firebase` and `lucide-react`.
   - Set up `src/firebase.js`.
2. **Phase 2: Design System**
   - Implement `index.css` with CSS variables for themes.
   - Create layout containers and Navigation Panel styling.
3. **Phase 3: Database Integration**
   - Implement Firestore CRUD operations (addDoc, updateDoc, deleteDoc).
   - Set up `onSnapshot` for real-time updates.
4. **Phase 4: Feature Implementation**
   - Build Status Filtering logic.
   - **New**: Implement Advanced Filters (Priority & Date).
   - Implement Theme Toggling with local storage persistence and move to Navbar.
5. **Phase 5: Polish**
   - Add micro-animations (hover effects, list transitions).
   - Responsive design testing.

## 6. Verification & Quality Assurance
- **Real-time Test**: Ensure adding a task in one window reflects in another.
- **Theme Persistence**: Check if the selected theme remains after a page refresh.
- **Filter Accuracy**: Verify that combinations of status, priority, and date filters work correctly.
- **Accessibility**: Ensure buttons have proper ARIA labels and focus states.
