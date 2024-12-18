import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import getUserName from 'src/functions/utils/getUserName';

const styles = StyleSheet.create({
	field: {
		marginBottom: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	fieldTitle: {
		fontSize: 13,
		fontWeight: 400,
		marginRight: 18,
		color: '#282727',
	},
	fieldText: {
		fontWeight: 400,
		fontSize: 12,
		color: '#909090',
		wordWrap: 'break-word',
	},
	card: {
		padding: 12,
		backgroundColor: '#F9FAFC',
		borderRadius: 10,
		// width: 200
	},
	box: {
		flexDirection: 'column',
	},
	imageBox: {
		paddingHorizontal: 18,
	},
});

const Field = ({ title, text }) => (
	<View style={styles.field}>
		<Text style={styles.fieldTitle}>{title}</Text>
		<Text style={styles.fieldText}>{text}</Text>
	</View>
);

export const SplitCardPdf = ({ user }) => {
	// const writers =
	// 	user?.credits?.length > 0 ? user?.credits.map(el => el.value).join(', ') : 'No credit';
	return (
		<View style={styles.card} wrap={false}>
			<View style={styles.box}>
				<Field title='Writer' text={getUserName(user)} />
				{/* <Field title='Credit' text={writers} /> */}
				<Field title='Ownership' text={`${user?.ownership}%`} />
				{user?.signatureSrc && (
					<View style={styles.imageBox}>
						<Image src={user.signatureSrc} alt={`${user.name} signature`} />
					</View>
				)}
			</View>
		</View>
	);
};
