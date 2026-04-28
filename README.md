# ToDo Mate
### A simple ToDo App fully build from AI, that brings a Unique Experience to Users by simplyfying Daytoday Task Management

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
  - **All**: View every task.
  - **Pending**: Tasks yet to be done.
  - **Completed**: Successfully finished tasks.
- **Theming**:
  - **Light Mode**: High contrast, clean, airy design.
  - **Dark Mode**: Sleek, deep-gray palette with vibrant accents to reduce eye strain.
- **Real-time Sync**: Automatic updates across all open tabs/devices via Firestore listeners.
