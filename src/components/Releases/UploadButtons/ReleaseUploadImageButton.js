import { Button, useToast } from '@chakra-ui/react';

const ReleaseUploadButton = ({ children, setImageFormData, setImageSrc }) => {
	const toast = useToast();
	const handleFileSelect = e => {
		const { files } = e.target;
		const formData = new FormData();
		if (files && files[0]) {
			if (files.length === 0) return;
			const logo = files[0];
			if (!['image/jpeg', 'image/jpg', 'image/png'].includes(logo.type)) {
				toast({
					position: 'top',
					title: 'Wrong format',
					description: 'Accepted formats: jpg, jpeg, png',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			formData.append('logo', logo);
			setImageFormData(formData);

			const imageSrc = URL.createObjectURL(logo);
			setImageSrc(imageSrc);
		}
	};

	const handleButtonClick = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/jpeg,image/jpg,image/png';
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	// useEffect(() => {
	//   if (selectedImageFile) {
	//     setImageUrl(URL.createObjectURL(selectedImageFile));
	//   }
	// }, [selectedImageFile]);

	return (
		<Button
			onClick={handleButtonClick}
			w={'120px'}
			h='110px'
			// mr='20px'
			bg='#fff'
			boxShadow={'1px 1px 3px gray'}
		>
			{children}
		</Button>
	);
};

export default ReleaseUploadButton;
