import * as geolib from 'geolib';

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2, unit) => {
    return(
        geolib.getDistance(
            {latitude:lat1, longitude: lon1}, 
            {latitude: lat2, longitude: lon2}
       )
    )
}