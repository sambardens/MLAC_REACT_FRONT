import AuthLayout from '@/components/Layouts/AuthLayout';
import PassRecoverySection from '@/components/Auth/PassRecoverySection/PassRecoverySection';

export const PassRecoveryPage = () => {

    return (
      <AuthLayout title='Pass recovery'>
        <PassRecoverySection />
      </AuthLayout>
    );
};
export default PassRecoveryPage;
