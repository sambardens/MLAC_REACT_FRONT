import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { nanoid } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
	container: {
		padding: 30,
		width: '100%',
	},
	header: {
		marginBottom: 18,
	},
	headerText: {
		fontSize: 24,
		fontWeight: 600,
		color: '#282727',
	},
	fieldBox: {
		flexDirection: 'row',
		width: '100%',
	},
	fieldLine: {
		paddingBottom: 12,
		borderBottom: '1px solid #D2D2D2',
	},
	fieldTitle: {
		fontSize: 13.5,
		fontWeight: 400,
		color: '#282727',
		width: 170,
	},
	fieldText: {
		fontSize: 13.5,
		fontWeight: 400,
		marginLeft: 18,
		color: '#909090',
		wordWrap: 'break-word',
		width: 'calc(100% - 150)',
	},
	infoBox: { flexDirection: 'column', gap: 12, marginBottom: 18 },
	list: { flexDirection: 'column', gap: 3, marginBottom: 18 },
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 18,
		alignItems: 'center',
		backgroundColor: '#F9FAFC',
		paddingLeft: 9,
		height: 42,
		borderRadius: '10px',
	},
	userTitle: {
		fontWeight: '400',
		color: '#909090',
		fontSize: 12,
		flexBasis: '50%',
		wordWrap: 'break-word',
	},
	tableHeadContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 18,
		alignItems: 'center',
		paddingLeft: 9,
		borderRadius: '10px',
		backgroundColor: 'transparent',
	},
	tableHeadTitle: {
		fontWeight: '500',
		color: '#282727',
		fontSize: 13.5,
		flexBasis: '50%',
	},

	lastTitle: {
		flexBasis: '100px',
	},

	totalBox: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	totalText: {
		fontWeight: '600',
		color: '#282727',
		fontSize: 13.5,
	},
	pageNumber: {
		position: 'absolute',
		fontSize: 10,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: 'gray',
	},
});

const Field = ({ title, text, line = false }) => (
	<View style={[styles.fieldBox, line && styles.fieldLine]}>
		<Text style={styles.fieldTitle}>{title}</Text>
		<Text style={styles.fieldText}>{text}</Text>
	</View>
);

const DetailsPdf = ({
	firstName,
	lastName,
	name = false,
	email = false,
	releaseName = false,
	ownership = false,
	price = false,
}) => {
	return (
		<View style={styles.userContainer}>
			<Text style={styles.userTitle}>{name ? name : `${firstName} ${lastName}`}</Text>
			<Text style={styles.userTitle}>{email || releaseName}</Text>
			<Text style={[styles.userTitle, styles.lastTitle]}>
				{(ownership && `${ownership}%`) || (price && `£${price}`)}
			</Text>
		</View>
	);
};

const IncomeDetailsPdf = ({ transaction, getUserTotalIncome }) => {
	// const userPayment = Math.floor((transaction.gross - transaction.fees * 0.25) * 100) / 100;
	return (
		<Document>
			<Page size='A4' style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Receipt of payment on Major Labl</Text>
				</View>

				<View style={styles.infoBox} wrap={false}>
					<Field title='Invoice  ID' text={transaction.invoiceId} />
					<Field title='Payment sent by' text={transaction.paymentEmail} />
					<Field title='Payment sent to' text={transaction.bapName} line={true} />
					<Field title='Date' text={transaction.date} />
					<Field title='Income' text={`£${transaction.gross}`} />
					<Field title='Major Labl fee' text='10%' />
					<Field title='PayPal fee' text='3.4% + £0.20' />
					<Field title='Tips' text={`£${transaction.tips}`} line={true} />
				</View>
				{transaction.tracks.map(track => {
					return (
						<View style={[styles.list, styles.fieldLine]} key={nanoid()} wrap={false}>
							<View style={styles.tableHeadContainer}>
								<Text style={styles.tableHeadTitle}>Track name</Text>
								<Text style={styles.tableHeadTitle}>Release</Text>
								<Text style={[styles.tableHeadTitle, styles.lastTitle]}>Track price</Text>
							</View>
							<DetailsPdf
								key={nanoid()}
								name={track.name}
								price={track.price}
								releaseName={track.releaseName}
							/>
							<View style={styles.tableHeadContainer}>
								<Text style={styles.tableHeadTitle}>Writer name</Text>
								<Text style={styles.tableHeadTitle}>Email</Text>
								<Text style={[styles.tableHeadTitle, styles.lastTitle]}>Ownership</Text>
							</View>
							{track.splitUsers?.map(user => (
								<DetailsPdf
									key={nanoid()}
									firstName={user.firstName}
									lastName={user.lastName}
									email={user.email}
									ownership={user.ownership}
								/>
							))}
						</View>
					);
				})}
				<View style={styles.totalBox}>
					<Text style={styles.totalText}>Your payment: £{getUserTotalIncome()}</Text>
				</View>
				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) => {
						if (totalPages > 1) {
							return `${pageNumber} / ${totalPages}`;
						}
					}}
					fixed
				/>
			</Page>
		</Document>
	);
};

export default IncomeDetailsPdf;
