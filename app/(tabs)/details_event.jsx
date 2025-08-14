import { useRoute } from "@react-navigation/native";
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { authConfig } from "../../Constants/authConfig";
import { useOwnerProfile } from "../../Hooks/image_owner.hook";
import { levels_host_hook } from "../../Hooks/levels_host_hook";


export default function HomeIndex(props) {


  const { Owner_image }  = useOwnerProfile();




  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const route = useRoute();
  const { item, rating } = route.params;

  console.log('Ratimg', rating.distribution)

  const { host_name, medal, opinion_1, opinion_2, opinion_3 } = levels_host_hook()


  return (
    <View style={styles.container}>

      <Text style={{color:'red'}}>
        {/* { Owner_image(item?.empresa_organizadora) } */}
      </Text>
      {/* div imageBackground */}
      <View style={{ backgroundColor: 'red', height: screenHeight / 2.8, width: screenWidth }}>
        <Image
          style={{ height: screenHeight / 2.8, width: screenWidth }}
          source={{ uri:  authConfig.url_picture+item?.imagenes?.[0]?.nombre_archivo}}
          // source={require('../../assets/images/pal_norte_background.jpg')}
           />
      </View>

      {/* View contain Information */}
      <View style={{ marginTop: '-30%', borderRadius: 50, alignItems: 'center', justifyContent: 'center', height: screenHeight / 2, width: '90%' }}>

        {/* View container heigh */}
        <View style={{ width: '95%', height: screenHeight/1.8}}>
          <View style={{ flex: 1.2 }}>
            <Text style={{ color: '#000' }}>
              <View style={{
                flexDirection: 'row', borderRadius: 50, height: screenHeight / 2, marginLeft: '50', marginRight: '50',
                width: '95%'
              }}>
                <View style={{
                  justifyContent: 'center', alignItems: 'center',
                  flex: 1
                }}>

                </View>

                <View style={{
                  backgroundColor: '#000',
                  borderRadius: 20,
                  flex: 4, paddingTop: 10, paddingLeft: 20
                }}>
                  <Text style={{ color: '#FFF', fontSize: 24 }}>{item?.nombre}</Text>

                  <Text style={{ color: '#FFF', fontSize: 24 }}> | Organizado por {item?.empresa_organizadora}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>




                    <View
                      key={'pressable_'}
                      style={{ width: '30%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                      <View key={'view_2_'}>
                        <Image
                          key={'image_'}
                          source={require('../../assets/images/star.png')
                          }
                          style={{
                            width: 18,
                            height: 18,
                            top: -1,
                            zIndex: 99
                          }}
                        />
                      </View>
                      <View key={'view_3_'}>
                        <Text style={{ color: '#FFFFFF' }}>
                          {rating.average_rating}
                        </Text>
                      </View>
                    </View>


                    <View style={{ width: '40%' }}>
                      <Text style={{ color: '#FFF' }}>{rating.total_ratings} reviews</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Image
                        style={{ height: 15, width: 15, }}
                        tintColor={medal(rating)}
                        source={require('../../assets/images/medal.png')} />
                      <Text style={{ fontSize: 12, color: '#FFF' }}>
                        {host_name(rating)}</Text>
                    </View>
                  </View>
                  {/* End div SPACE AROUND */}
                  <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      style={{ height: 30, width: 30, }}
                      tintColor='#676D75'
                      source={require('../../assets/images/ubication.png')} />
                    <Text style={{ color: '#FFF' }}>{item.ubicacion}</Text>
                  </View>



                </View>

              </View>
            </Text>
          </View>

          {/* Opinion 1 */}

          <View style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000000ff', flexDirection: 'column' }}>
            <ScrollView style={{ width: '100%', height: Dimensions.get('window').height / 3 }}>

              <View style={{ flexDirection: 'row', borderColor: '#FFF', borderWidth: 2, justifyContent: 'center', }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%', height: '25%' }} >
                    <ImageBackground
                      style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                      tintColor='#0F55E8'
                      source={require('../../assets/images/back_opinion.png')}
                    >
                      <Image
                        style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: 15, width: 15, }}
                        tintColor={medal(rating)}
                        source={require('../../assets/images/medal.png')} />
                    </ImageBackground>
                  </View>
                </View>
                <View style={{ flex: 2, padding: 10, alignItems: 'center', paddingRight: '15%' }} >
                  <Text style={{ paddingBottom: 10, fontWeight: 600, color: '#FFF' }}>{item.nombre} is a {host_name(rating)}</Text>
                  <Text style={{ color: '#FFF' }}>{opinion_1(host_name(rating))}</Text>

                </View>



                {/* Opinion 2  */}

              </View>
              <View style={{ flexDirection: 'row', borderColor: '#FFF', borderWidth: 2, justifyContent: 'center', }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%', height: '25%' }} >
                    <ImageBackground
                      style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                      tintColor='#0F55E8'
                      source={require('../../assets/images/back_opinion.png')}
                    >
                      <Image
                        style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: 15, width: 15, }}
                        tintColor={medal(rating)}
                        source={require('../../assets/images/medal.png')} />
                    </ImageBackground>
                  </View>
                </View>
                <View style={{ flex: 2, padding: 10, alignItems: 'center', paddingRight: '15%' }} >
                  <Text style={{ paddingBottom: 10, fontWeight: 600, color: '#FFF' }}>{item.nombre} is a {host_name(rating)}</Text>
                  <Text style={{ color: '#FFF' }}>{opinion_2(host_name(rating))}</Text>

                </View>





              </View>
              {/* Opinion 3  */}

              {/* <View style={{ flexDirection: 'row', borderColor: '#FFF', borderWidth: 2, justifyContent: 'center', }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%', height: '25%' }} >
                  <ImageBackground
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    tintColor='#0F55E8'
                    source={require('../../assets/images/back_opinion.png')}
                  >
                    <Image
                      style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: 15, width: 15, }}
                      tintColor={medal(rating)}
                      source={require('../../assets/images/medal.png')} />
                  </ImageBackground>
                </View>
              </View>
              <View style={{ flex: 2, padding: 10, alignItems: 'center', paddingRight: '15%' }} >
                <Text style={{ paddingBottom: 10, fontWeight: 600, color: '#FFF' }}>{host_name(rating)}</Text>
                <Text style={{ color: '#FFF' }}>{opinion_3(rating)}</Text>

              </View>




            </View>


           */}


            </ScrollView>
          </View>

        </View>
        <View style={{ backgroundColor: 'green', position: 'absolute', left: -0.5, top: -25, borderRadius: 50, height: 90, width: 90 }}>
          <Image
            style={{ height: 90, width: 90, borderRadius: 50 }}
               source={{ uri:  Owner_image(item?.empresa_organizadora) }}

            // source={require('../../assets/images/femsa.png')} 
            />
        </View>
      </View>
    </View>
  )




}


// Adding styles
const styles = StyleSheet.create({

  container: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    alignItems: 'center',

    // justifyContent:'center'
  }
})