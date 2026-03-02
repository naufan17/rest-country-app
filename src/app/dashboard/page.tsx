import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/analytics');
};

export default DashboardPage;
