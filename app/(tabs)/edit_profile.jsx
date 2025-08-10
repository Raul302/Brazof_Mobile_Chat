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
          { user.email } 
         </Text>
       </View>

       <View style={{
        top:-50, width: Dimensions.get('window').width , justifyContent:'center',alignItems:'center', height:'15%'}}>
          <View style={{ padding:20 , flexDirection:'column', backgroundColor:'#000',alignItems:'left',width:'80%',height:'100%',borderRadius:10}}>
            <View style={{  flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
           <View style={{ flexDirection:'row',justifyContent:'space-evenly'}}>
                 <Image
         source={ require('../../assets/images/contact.png')}
         tintColor={'#FFF'}
         resizeMode="cover"
         style={{ marginRight:10,width:18 , height:18}}
         />
               <Text style={{color:'#FFF'}}>
                Edit profile information</Text>

           </View>
           <View>
                {/* <Text style={{color:'#FFF'}}>Another text</Text> */}
           </View>
            </View>

            {/* Another view  */}

                 <View style={{  flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
           <View style={{ marginTop:10,flexDirection:'row',justifyContent:'space-evenly'}}>
                 <Image
         source={ require('../../assets/images/notification.png')}
         tintColor={'#FFF'}
         resizeMode="cover"
         style={{ marginRight:10,width:18 , height:18}}
         />
               <Text style={{color:'#FFF'}}>
                Notifications</Text>

           </View>
           <View>
                <Text style={{color:'#438FFF'}}>ON</Text>
           </View>
            </View>


            {/* Another view */}

                 <View style={{  flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
           <View style={{ marginTop:10,flexDirection:'row',justifyContent:'space-evenly'}}>
                 <Image
         source={ require('../../assets/images/Vector.png')}
         resizeMode="cover"
         style={{ marginRight:10,width:18 , height:18}}
         />
               <Text style={{color:'#FFF'}}>
                Language</Text>

           </View>
           <View>
                <Text style={{color:'#438FFF'}}>English</Text>
           </View>
            </View>
            




          

          </View>

       </View>

         <View style={{ width: Dimensions.get('window').width , justifyContent:'center',alignItems:'center', height:60}}>
          <View style={{ padding:20 , flexDirection:'column', backgroundColor:'#000',alignItems:'left',width:'80%',height:'100%',borderRadius:10}}>
            <View style={{  flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
           <View style={{ flexDirection:'row',justifyContent:'space-evenly'}}>
                 <Image
         source={ require('../../assets/images/contact.png')}
         tintColor={'#FFF'}
         resizeMode="cover"
         style={{ marginRight:10,width:18 , height:18}}
         />
               <Text style={{color:'#FFF'}}>
                Electronic Tag</Text>

           </View>
           <View>
                <Text style={{color:'#438FFF'}}>Vinculated</Text>
           </View>
            </View>

           





          

          </View>

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