# AI Rules for Project Development

This document outlines the core technologies used in this project and provides guidelines for their appropriate usage. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React**: A JavaScript library for building user interfaces. All UI components are built using React.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript. Used for all application code to enhance code quality and developer experience.
*   **Vite**: A fast build tool that provides an instant development server and bundles code for production.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs. All styling should be done using Tailwind CSS classes.
*   **shadcn/ui**: A collection of reusable components built with Radix UI and styled with Tailwind CSS. These components form the foundation of the application's UI.
*   **React Router**: A standard library for routing in React applications. Used for managing client-side navigation and defining application routes.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and storage. Used for all backend services.
*   **Lucide React**: A library of beautiful and customizable open-source icons.
*   **React Hook Form & Zod**: React Hook Form is used for efficient form management and validation, paired with Zod for schema-based data validation.
*   **Mapbox GL JS**: A JavaScript library for interactive maps. Used for displaying and interacting with geographical data.
*   **React Google reCAPTCHA**: A component for integrating Google reCAPTCHA into forms to prevent spam and abuse.
*   **Tanstack Query (React Query)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Sonner / shadcn/ui Toast**: For displaying user notifications and feedback.

## Library Usage Rules

To maintain a consistent and efficient codebase, please follow these guidelines when choosing and implementing libraries:

*   **Core UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a specific component is not available in `shadcn/ui` or requires significant deviation from its default behavior, create a new custom component using plain React and Tailwind CSS. **Do not modify `shadcn/ui` source files directly.**
*   **Styling**: All styling must be implemented using **Tailwind CSS** utility classes. Avoid writing custom CSS or using other styling solutions.
*   **Routing**: Use **React Router** for all client-side navigation. Define routes clearly in `src/App.tsx`.
*   **Backend Interactions**: All database operations, authentication, and file storage should be handled via **Supabase**.
*   **Icons**: Use icons from **Lucide React**.
*   **Form Handling & Validation**: For forms, use **React Hook Form** for state management and **Zod** for defining validation schemas.
*   **Maps**: For any map-related features, use **Mapbox GL JS**.
*   **Captcha**: Implement spam protection using **React Google reCAPTCHA**.
*   **Data Fetching & Caching**: For managing server-side data (fetching, updating, caching), use **Tanstack Query (React Query)**.
*   **Notifications**: Use the `useToast` hook (from `src/hooks/use-toast.ts` which wraps `shadcn/ui`'s `Toast`) for general, transient notifications. For more prominent or interactive notifications, `Sonner` (imported as `Sonner` from `@/components/ui/sonner`) can be used.
*   **New Components/Hooks**: Always create new files for new components or hooks, even if they are small. Aim for small, focused files (ideally under 100 lines of code for components).
*   **File Structure**:
    *   Pages go into `src/pages/`.
    *   Reusable components go into `src/components/`.
    *   Admin-specific components go into `src/components/admin/`.
    *   UI components from shadcn/ui are in `src/components/ui/`.
    *   Hooks go into `src/hooks/`.
    *   Supabase integration files are in `src/integrations/supabase/`.
*   **Responsiveness**: All designs must be responsive and adapt well to different screen sizes using Tailwind's responsive utilities.
*   **Error Handling**: Do not implement `try/catch` blocks for API calls unless specifically requested. Errors should bubble up to be handled globally or by the calling component.