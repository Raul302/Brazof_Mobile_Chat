
export const levels_host_hook = () => {


    const medal = ( rating ) => {
        if( rating.total_ratings > 4.8 ){
        return '#E1225B'
    } else if ( rating.total_ratings < 4.8 || rating.total_ratings > 4.5) {
        return 'gold';
    } else if ( rating.total_ratings < 4.5|| rating.total_ratings > 4.0 ){
        return 'silver';
    } else {
        return 'bronze  ';
    }
    }
  const host_name = (rating) => {

  
    if( rating.total_ratings > 4.8 ){
        return 'SuperHost'
    } else if ( rating.total_ratings < 4.8 || rating.total_ratings > 4.5) {
        return 'Trusted Host';
    } else if ( rating.total_ratings < 4.5|| rating.total_ratings > 4.0 ){
        return 'Reliable Host';
    } else {
        return 'Starter Host';
    }

  }

  const opinion_1 = ( host_level ) => {

    switch(host_level){
        case 'SuperHost':
        return 'Superhost are experienced, highly rated hosts who are committed to providing great stays for guest.';
        case 'Trusted Host':
    return 'Trusted Hosts consistently provide positive guest experiences and maintain high ratings with minimal issues.';
              case 'Reliable Host':
    return 'Reliable Hosts meet essential hosting standards and offer satisfactory stays, with room to improve in consistency or communication.';
          case 'Starter Host':
    return 'Starter Hosts are new or developing hosts who are building experience and may still be refining their hosting quality.';
    }
    
    return ' rango ';
  }
  
  const opinion_2 = (host_level) => {

     switch(host_level){
       case 'SuperHost':
    return 'Top-tier host with outstanding reviews, zero cancellations, and consistently excellent guest experiences.';

case 'Trusted Host':
    return 'Dependable host with strong ratings and consistent service, offering smooth and reliable stays.';

case 'Reliable Host':
    return 'Steady host meeting basic expectations, with generally positive reviews and responsive communication.';

case 'Starter Host':
    return 'New or developing host with limited history; service quality may vary as they gain experience.';
    }
  

    
    return ' rango ';
  }

  const opinion_3 = (rating) => {

    const total = rating.total_ratings;

        // Calcular cuántos votos son de 4 o 5 estrellas
        let positiveVotes = 0;


        const { distribution } = rating;

        Object.entries(distribution).forEach(([key, value]) => {
            console.log(`Estrellas: ${key}, Votos: ${value}`);
            });


        rating.distribution.map(rat =>{
            console.log('RAT',rat);
        })
        // for (let star = 4; star <= 5; star++) {
        // positiveVotes += rating.distribution[star.toString()] || 0;
        // }

        const positivePercentage = ((positiveVotes / total) * 100).toFixed(1);

        let rank = '';

            if (positivePercentage >= 90 && average_rating >= 4.8) {
                rank = 'SuperHost';
            } else if (positivePercentage >= 75 && average_rating >= 4.5) {
                rank = 'Trusted Host';
            } else if (positivePercentage >= 60 && average_rating >= 4.0) {
                rank = 'Reliable Host';
            } else {
                rank = 'Starter Host';
            }

            switch (rank) {
    case 'SuperHost':
      return  `This host has received ${positivePercentage}% positive ratings (4 or 5 stars), with an average rating of ${average_rating}. A top-tier host offering exceptional and consistent guest experiences.`
      

    case 'Trusted Host':
      return `This host has received ${positivePercentage}% positive ratings, with an average rating of ${average_rating}. Known for dependable, high-quality stays and solid guest satisfaction.`
      

    case 'Reliable Host':
      return `This host has received ${positivePercentage}% positive ratings, with an average rating of ${average_rating}. Generally meets expectations with a steady hosting experience.`
    

    case 'Starter Host':
    default:`This host has received ${positivePercentage}% positive ratings (4 or 5 stars), with an average rating of ${average_rating}. Guest experiences have been mixed, suggesting early development or inconsistent service.`
            }
  }

  return { host_name , medal, opinion_1 , opinion_2 , opinion_3 }
}
