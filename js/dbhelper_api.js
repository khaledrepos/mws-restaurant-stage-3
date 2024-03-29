/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    

    // return `http://192.168.100.7:${port}/restaurants`;

    return `http://localhost:${port}/restaurants`;
    
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback){
    fetch(DBHelper.DATABASE_URL)
      .then(function(response){
        if (response.status === 200){
          return response.json().then(function(data){
            callback(null, data);
            return;
          });
        }
      }).catch(function(error){
        callback(error, null)
        return;
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          

          var promise_1 = DBHelper.fetchReviews(id, data => {
          	restaurant['reviews'] = data;
          	callback(null, restaurant)
          })

        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }




static submitReview(data, callback){
  const url = 'http://localhost:1337/reviews/';

  fetch(url, {
    method: 'POST',
    mode: 'cors', // no-cors
    headers: { 'Content-Type': 'application/json'},    
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok)
    	callback(true, null)
    else{
    	callback(false, null)
    }
  }).catch(error => {
  	callback(false, error)
  });

}




static deleteReview(id, callback){
	const url = "http://localhost:1337/reviews/"+ id;

	fetch(url, {
		method: 'DELETE',
		mode: 'cors',
	}).then(response => {
		if (response.ok)
			callback(true, null)
		else
			callback(false, null)
	}).catch(error => {
		callback(false, error)
	})
}



static fetchReviews(id, callback){
	const url = "http://localhost:1337/reviews/?restaurant_id="+id

	fetch(url, {
		mode: 'cors'
	}).then(response => {
		if (response.ok){
			return response.json().then(data => {
				callback(data)
			})
		}
	})
}



/* Favoriting */
static setFavorite(id, is_favorite, callback){
	const url = "http://localhost:1337/restaurants/"+id+"/?is_favorite="+is_favorite;

	console.log(url);

	fetch(url, {
		method: 'PUT',
		mode: 'cors'
	}).then(response => {
		if (response.ok){
			response.json().then(data => console.log(data))
			callback(true, null)
		}
		else{
			callback(false, null)
		}
	}).catch(error => {
		callback(false, error)
	})
}





  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 


}

