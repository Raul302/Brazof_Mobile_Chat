import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomHeader() {
	const { profile, pulseras, loading } = useAuth();

	const nombre = !loading ? profile?.nombre_completo : 'Cargando...';
	const tag = !loading
		? pulseras?.length === 1
			? `TAG ${pulseras[0]?.uuid}`
			: 'Sin TAG asociado'
		: 'Cargando...';

	return (
		<View style={styles.custom_header}>
			<View style={styles.box_column}>
				<Text style={styles.text}>{nombre}</Text>
				<Text style={styles.text}>{tag}</Text>
			</View>

			<Image
				source={require('../../assets/images/profile_image.png')}
				resizeMode="contain"
				style={{
					width: 50,
					height: 50,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: '#ffffff',
	},
	box_column: {
		marginRight: 20,
		//    backgroundColor:'#ffffff'
		// shadowColor: "#1FFF62",
	},
	custom_header: {
		borderBottomEndRadius: 10,
		borderStartEndRadius: 10,
		flexDirection: 'row',
		height: '7%',
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center',
		//   borderColor: '#1FFF62',
		borderBottomColor: '#1FFF62',
		backgroundColor: '#2E2E2F',
		borderBottomWidth: 5,
		// shadowColor: "#1FFF62",
	},
});
