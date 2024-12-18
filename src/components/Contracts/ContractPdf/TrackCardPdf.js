import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { nanoid } from '@reduxjs/toolkit';
import getUserName from 'src/functions/utils/getUserName';

const styles = StyleSheet.create({
	card: {
		padding: 12,
		backgroundColor: '#F9FAFC',
		borderRadius: 10,
	},
	fieldTitle: {
		marginBottom: 12,
	},
	title: {
		fontSize: 12,
		fontWeight: 400,
		color: '#282727',
		wordWrap: 'break-word',
	},
	list: {
		flexDirection: 'column',
		gap: 8,
	},
	field: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	fieldName: {
		marginRight: 6,
	},
	name: {
		fontSize: 12,
		fontWeight: 500,
		color: '#282727',
	},
	credits: {
		fontWeight: 400,
		fontSize: 12,
		color: '#909090',
	},
});

export const TrackCardPdf = ({ number, track }) => {
	return (
		<View style={styles.card} wrap={false}>
			<Text style={styles.title}>
				{number}.{track.name}
			</Text>

			{/* <View style={styles.list}>
				{track?.splitUsers.map(user => (
					<View style={styles.field} key={nanoid()}>
						<View style={styles.fieldName}>
							<Text style={styles.name}>{getUserName(user)}</Text>
						</View>
						<View>
							<Text style={styles.credits}>
								{user.credits.length === 0 ? 'No credit' : user.credits.map(el => el.value).join(', ')}
							</Text>
						</View>
					</View>
				))}
			</View> */}
		</View>
	);
};
