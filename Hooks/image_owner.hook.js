
export const useOwnerProfile = () => {
//   const { user } = useContext(AuthContext)

  const Owner_image = (owner) => {



    console.log('OWNE',owner)
    
    if((owner.toLowerCase()).includes('femsa')) {

        return 'https://api.brazof.space/api/storage/imagenes/1754767445_6897a05549652.jpeg';

    } else  if( (owner.toLowerCase()).includes('tecate') ){
                return 'https://api.brazof.space/api/storage/imagenes/1754767502_6897a08e9b4af.jpeg';


    } else if ( (owner.toLowerCase()).includes('corona')) {
                return 'https://api.brazof.space/api/storage/imagenes/1754767516_6897a09c5f697.jpeg';


    } else {
    return 'https://api.brazof.space/api/storage/imagenes/1754767576_6897a0d8d339d.jpg';
    }
   
  }

  return { Owner_image }
}
