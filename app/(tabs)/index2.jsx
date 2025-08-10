import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const screenWidth = Dimensions.get('window').width;
	const screenHeight = Dimensions.get('window').height;

	return (
		<View style={styles.container}>
			{/* Background principal */}
			<View
				style={{
					backgroundColor: 'red',
					height: screenHeight / 2.8,
					width: screenWidth,
				}}
			>
				<Image
					style={{ height: screenHeight / 2.8, width: screenWidth }}
					source={require('../../assets/images/pal_norte_background.jpg')}
				/>
			</View>

			{/* Contenido sobrepuesto */}
			<View
				style={{
					marginTop: '-30%',
					borderRadius: 50,
					alignItems: 'center',
					justifyContent: 'center',
					height: screenHeight / 2,
					width: '90%',
				}}
			>
				<View style={{ width: '95%', height: '100%' }}>
					<View style={{ flex: 1.2 }}>
						<Text style={{ color: '#000' }}>
							<View
								style={{
									flexDirection: 'row',
									borderRadius: 50,
									height: screenHeight / 2,
									marginLeft: 50,
									marginRight: 50,
									width: '95%',
								}}
							>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										flex: 1,
									}}
								></View>

								<View
									style={{
										backgroundColor: '#000',
										borderRadius: 20,
										flex: 4,
										paddingTop: 10,
										paddingLeft: 20,
									}}
								>
									<Text
										style={{ color: '#FFF', fontSize: 24 }}
									>
										Organizado por grupo FEMSA
									</Text>

									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-around',
										}}
									>
										<Text style={{ color: '#FFF' }}>
											4.1
										</Text>
										<Text style={{ color: '#FFF' }}>
											(25,300)
										</Text>
										<Text style={{ color: '#FFF' }}>
											SuperHost
										</Text>
									</View>

									<View
										style={{
											marginTop: 25,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Text style={{ color: '#FFF' }}>
											Dirección: Av. Guadalupe
										</Text>
									</View>
								</View>
							</View>
						</Text>
					</View>

					<View
						style={{
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: '#000',
							flex: 1.5,
							flexDirection: 'column',
						}}
					>
						{['Row 1', 'Row 2', 'Row 3'].map((row, idx) => (
							<View
								key={idx}
								style={{
									width: '100%',
									borderColor: '#FFF',
									borderWidth: 2,
									alignItems: 'center',
									justifyContent: 'center',
									height: '33%',
								}}
							>
								<Text style={{ color: '#FFF' }}>{row}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Logo FEMSA sobrepuesto */}
				<View
					style={{
						backgroundColor: 'green',
						position: 'absolute',
						left: -0.5,
						top: -25,
						borderRadius: 50,
						height: 90,
						width: 90,
					}}
				>
					<Image
						style={{ height: 90, width: 90, borderRadius: 50 }}
						source={require('../../assets/images/react-logo.png')}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#000',
		width: '100%',
		height: '100%',
		alignItems: 'center',
	},
});
