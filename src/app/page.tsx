import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function Home() {
  return (
    <AuthWrapper>
      <DashboardLayout />
    </AuthWrapper>
  );
}