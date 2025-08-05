import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {

    const router = useRouter();


  const handleApiSigIn = () => {

    // axios.post( url_api ),

    // Logic to log-in with the api and login like google 

    // after that redirect if all went succesfully

   router.replace('/(tabs)')
    
    console.log( ' New Login ');

  }
  return (

    // View container
    <View
      style={styles.container}
    >

{/* Image */}
      <Image
        style={styles.logo}
        source={require('../../assets/images/logowithouthbrackground.png')}
      />
      {/* End Image */}

      {/* Text */}
      <Text style={styles.textHeader}>Login</Text>
            <Text style={styles.normalText}>Discover an amazing experience with Us</Text>

    {/* End Texts */}


{/* View container content */}
      <View style={styles.container_content}>


{/* View separator */}
        <View style={styles.view_separator}>

           {/* <Shadow distance={10} startColor={'#1FFF62'} endColor={'#ff00ff10'} offset={[0, 2]}> */}
              <TouchableOpacity 
              onPress={handleApiSigIn}
              activeOpacity={0.4}
            style={{backgroundColor:'#000000', width:300,height:50,justifyContent:'center',alignItems:'center', borderRadius: 15}}>
            <Text style={{color:'#FFFFFF',fontWeight:600}}>Login</Text>
          </TouchableOpacity>


          {/* </Shadow>  */}

          </View>

          {/* End View separator */}





        

        </View>
        {/* End View content container */}




    </View>

    // End view Container
  );
}


// Styles 

const styles = StyleSheet.create({
 
  container_content: {
    // backgroundColor: '#4b3ccfff',
    width: '77%',
    marginTop:'5%'

  },
  text_with_shadow: {
    color: '#FFFFFF',
    marginTop: '5%',
    marginLeft: 'auto',
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,

  },
  view_separator: {
    marginTop: '30%',
    width: '100%',
    alignItems: 'center',
     backgroundColor: ' #1FFF62',
    boxShadow: '0px 0px 10px 10px #1FFF62',
    borderRadius:20,
    // height:'5%'
  },
  input: {
    width: 300,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,

    // // Shadows properties
    // shadowColor:'#1FFF62',
    //  shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // elevation: 16, // Android

    // // end shadow Properties


  },
  normalText: {
    marginTop: '20%',
    width: '70%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
      textShadowColor: "#1FFF62",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  textHeader: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold'
  },

  logo: {
    width: 200,
    height: 200,
    marginTop: '10%'
  },

  container: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  }
})
