import { useContext } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileIndex() {


    const { logout , user  } = useContext(AuthContext);
    console.log( ' USER ', user);
return(

      <View style={styles.container}>
      
      <View style={styles.parent}>
     <View style={styles.child}>
     </View>
</View>
       <View style={{top:-90,borderRadius:300, width : Dimensions.get('window').width  , justifyContent:'center',alignItems:'center'}}>
       <View style={{borderRadius:200}}>
           <Image
         source={ require('../../assets/images/Avatar.png')}
         resizeMode="cover"
         style={{borderRadius:200, margin:10, width:150 , height:150}}
         />
       </View>
         <Text style={{fontSize:24, fontWeight:600, justifyContent:'center',alignItems:'center', color : '#FFF'}}>
          { user.name }
         </Text>
           <Text style={{ justifyContent:'center',alignItems:'center', color : '#FFF'}}>
          { user.email } | { user.phone }
         </Text>
       </View>
      
      </View>

  //   <View>
  //     <Text>
      
  //   <View style={{ padding: 20 }}>
  //     <Button title="Limpiar datos" onPress={logout} color="red" />
  //   </View>
  // </Text>



    
  // </View>
)
}

const styles = StyleSheet.create({

   container_two: {
    overflow: 'hidden', // Crucial for clipping the image to the circular shape
    alignSelf: 'center', // Center the circular image horizontally if needed
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the circular area
  },

  container:{
    backgroundColor:'#2E2E2F',
    height:'100%'
  },
    parent : {
    height: '25%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 300,
    borderBottomEndRadius: 300,
    overflow: 'hidden',
    borderTopColor:'#000000',
    borderRightColor:'#000000',
    borderLeftColor:'#000000',
    borderRightWidth:0.1,
    borderBottomWidth: 6,
    borderTopWidth:0,
    borderLeftWidth:0,
    borderBottomColor: '#1FFF62',
    },
    child : {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],

        backgroundColor : '#000',
        alignItems : 'center',
        justifyContent : 'center',
    
    }
})