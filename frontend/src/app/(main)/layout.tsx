import { AppShell } from '@/components/layout/AppShell';

/**
 * Layout for all authenticated pages (dashboard, map, diseases, analytics, lidar, missions).
 * The (main) route group excludes the /login page from this wrapper.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
