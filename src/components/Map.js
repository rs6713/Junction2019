
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");

const Map = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={18} 
    defaultCenter={{ lat: 60.188663, lng: 24.837004 }}
    defaultOptions={ {mapTypeControlOptions:{
      mapTypeIds: []
    },

    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl:false,
    rotateControl: false,
    fullscreenControl: false
    }}
  >
   {props.markers.map(marker =>

      <MarkerWithLabel
        position = {{lat:marker.lat, lng:marker.lng}}
        labelStyle={{backgroundColor: "yellow", fontSize: "10px", padding: "16px"}}
      >
        <div>{ marker.name}
          <FontAwesomeIcon icon={faCoffee}/>
        </div>
      </MarkerWithLabel>
   )}



  </GoogleMap>
))

export default Map;

/*



     
      
      </MarkerWithLabel>
    )

*/

