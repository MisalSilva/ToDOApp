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
  - Add new tasks with title and optional description.
  - Mark tasks as 'Completed' or 'Pending'.
  - Delete tasks with confirmation or smooth exit animation.
- **Filtering System**:
  - **All**: View every task.
  - **Pending**: Tasks yet to be done.
  - **Completed**: Successfully finished tasks.
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
    "completed": "boolean",
    "createdAt": "timestamp",
    "userId": "string (future-proofing for auth)"
  }
  ```

### Component Hierarchy
- `App.jsx`: State hub, ThemeProvider, and Main Layout.
- `Header.jsx`: Title and Theme Switcher.
- `TaskForm.jsx`: Input for new tasks.
- `FilterTabs.jsx`: Tab-based navigation for filtering.
- `TaskList.jsx`: Mapping logic for task items.
- `TaskItem.jsx`: Individual task card with toggle and delete buttons.

## 5. Implementation Roadmap
1. **Phase 1: Foundation**
   - Initialize Vite React project.
   - Install `firebase` and `lucide-react`.
   - Set up `src/firebase.config.js`.
2. **Phase 2: Design System**
   - Implement `index.css` with CSS variables for themes.
   - Create layout containers.
3. **Phase 3: Database Integration**
   - Implement Firestore CRUD operations (addDoc, updateDoc, deleteDoc).
   - Set up `onSnapshot` for real-time updates.
4. **Phase 4: Feature Implementation**
   - Build Filtering logic.
   - Implement Theme Toggling with local storage persistence.
5. **Phase 5: Polish**
   - Add micro-animations (hover effects, list transitions).
   - Responsive design testing.

## 6. Verification & Quality Assurance
- **Real-time Test**: Ensure adding a task in one window reflects in another.
- **Theme Persistence**: Check if the selected theme remains after a page refresh.
- **Accessibility**: Ensure buttons have proper ARIA labels and focus states.
