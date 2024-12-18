import { useToast } from '@chakra-ui/react';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';

const PaypalCheckoutButton = ({ product, setPaymentInfo, fbPixel }) => {
	const toast = useToast();
	const [paidFor, setPaidFor] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (error) {
			toast({
				position: 'top',
				title: 'Error',
				description: error,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
		if (paidFor) {
			toast({
				position: 'top',
				title: 'Payment successful',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		}
	}, [error, paidFor, toast]);

	const handleApprove = order => {
		setPaidFor(true);
		setPaymentInfo({
			success: true,
			paymentEmail: order?.payer?.email_address,
			invoiceId: order.id,
		});
	};

	return (
		<PayPalButtons
			style={{
				color: 'silver',
				layout: 'horizontal',
				height: 55,
				tagline: 'false',
				// shape: 'pill',
			}}
			onClick={(data, actions) => {
				// Validate on button click, client or server side
				// Example

				const hasAlreadyPayment = false;
				if (hasAlreadyPayment) {
					setError('You already payment for this release');
					return actions.reject;
				}
				return actions.resolve;
			}}
			createOrder={(data, actions) => {
				return actions.order.create({
					purchase_units: [
						{
							descriptions: product.description,
							amount: { value: product.price },
						},
					],
				});
			}}
			onApprove={async (data, actions) => {
				const order = await actions.order.capture();
				if (order?.status === 'COMPLETED') {
					if (fbPixel && typeof window !== 'undefined' && typeof window?.fbq === 'function') {
						window.fbq('track', 'Purchase', { currency: 'GBP', value: product.price });
					}

					handleApprove(order);
				} else {
					setError(
						'Your payment was processed successfully. However, we are unable to fulfill your purchase. Please contact us at support@majorLabl.io for assistance.',
					);
				}
			}}
			onCancel={() => {
				setPaymentInfo({ success: false });
				// Display cancel message
			}}
			onError={err => {
				setPaymentInfo({ success: false });
				setError(err);
				console.error('PayPal Checkout onError', err);
			}}
		/>
	);
};

export default PaypalCheckoutButton;
