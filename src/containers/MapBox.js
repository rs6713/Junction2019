import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
//import { Geocoder} from 'google-maps-react';
import Geocode from "react-geocode";
import CircularProgress from '@material-ui/core/CircularProgress';

//var threebox = require('../threebox.js');
//import '../threebox.js'
//let threebox = require('../threebox.js');
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

Geocode.setApiKey("AIzaSyDuyvBjBgRb95E1rryBZjP8p41hqaA3FlA");
Geocode.enableDebug();


mapboxgl.accessToken = 'pk.eyJ1IjoiYnM2NzEzIiwiYSI6ImNrMzFhYjBocjA2ajQzZXA5b3JoOWUweXkifQ.md0uDRWHT3ZkBvgko_EcOg';

const accommodations = [
  {
    'name': 'Residential Accommodation',
    'lat': 60.190044, 
    'lng': 24.836351,
    'icon': "college"
  },
  {
    'name': 'Aalto University',
    'lat': 60.186099, 
    'lng': 24.825976,
    'icon': "college"
  },
  {'info': 'Jämeräntaival 6',
  'lat': 60.188663, 'lng': 24.837004,
  },
  {'info': 'Otaranta 8',
  'lat': 60.186698, 'lng': 24.83587
  }
]
/*
var events={
  'lat':,'lng':, 
}*/

const accomPlaces =  {
  "type": "FeatureCollection",
  "features": accommodations.map(accom=>({
    "type": "Feature",
    "properties": {
    "place": accom.name || "",
    "info": accom.info || "",
    "icon": accom.icon
    },
    "geometry": {
    "type": "Point",
    "coordinates": [accom.lng, accom.lat]
    }
  }))};
  //console.log(accomPlaces)
 

class MapBox extends Component {
  constructor(props){
    super(props)
    this.state={
      currentAccommodation:0,
      lng: accommodations[0].lng,
      lat: accommodations[0].lat,
      zoom:15,
      pitch: 60,
      antialias: true,
      events:[],
      loading:true
    }
    this.getEvents = this.getEvents.bind(this);
   
  }

  // Make data call
  componentWillMount(){
    var self = this;
    /*
    fetch('/traffic:8000').then(function(res){
      console.log("Response:", res.body)
      if(res.status === 200){
        const reader = response.body.getReader();

      }
    
    }.bind(this)).catch(err=>{
      console.log("Error while fetching traffic")
      
    })
    */

   if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let minDistance = 9999999999;
      for(let i=0; i< accommodations.length; i++){
        console.log(i)
        if( (Math.abs(position.coords.latitude-accommodations[i].lat) + Math.abs(position.coords.longitude-accommodations[i].lng))<minDistance && accommodations[i].icon!=="college" ){
          self.setState({currentAccomodation:i, lng: accommodations[i].lng, lat:accommodations[i].lat })
          console.log(accommodations[i].icon)
        }
      }
     // position.coords.latitude, position.coords.longitude;
    });
  } else {
    /* geolocation IS NOT available */
  }

  }

// total, number, description, title, location, id, 
getEvents(){
  let self=this;
  console.log("Fetching events")

  fetch(global.backendURL+"events/", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    //console.log("What was returned: ", res)
    return res.json()
  
  })
    .then(data =>{
      if(data){
        console.log("List of events: ", data)
        self.setState({events: data.map(d=>(
          {
            description: d.description,
            title: d.title,
            members: d.members.split(','),
            location: d.location,
            id: d.id,
            total: d.required,
            time: new Date(d.creationDate)
          }
        ))});

        // 
        for(let i=0; i< self.state.events.length;i++){
          let u=i;

          Geocode.fromAddress(self.state.events[u].location).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log("Got ", lat, lng, " for event ",self.state.events[u].location)
              // Got lat and lng, can now place on map
              self.setState({
                events: [...self.state.events.slice(0,u),  {...self.state.events[u], lat:lat, lng:lng}  , ...self.state.events.slice(u+1)]
              })
            },
            error => {
              console.error(error);
            }
          );
/*
          Geocode.geocode( { 'address': self.state.events[u].location}, function(results, status) {
            if (status == 'OK') {
              console.log(results[0].geometry.location);

            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
          */

          
/*
          fetch(global.backendURL+"google/"+encodeURIComponent(self.state.events[u].location), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => {
            console.log("What was returned: ", res)
            return res.json()
          
          }).then(data=>{
            console.log("Got data:", data)
          }).catch(err=>{
            console.log("Errored: ", err)
          })
          */
        }
      }
    });
  }




  componentDidMount(){
    var self=this;
    //this.geoCoder = new Geocoder();
    


    
    self.map = new mapboxgl.Map({
      container: this.mapContainer, // id
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    /*

    // parameters to ensure the model is georeferenced correctly on the map
    var modelOrigin = [this.state.lng, this.state.lat];
    var modelAltitude = 0;
    var modelRotate = [Math.PI / 2, 0, 0];
    
    var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
    
    // transformation parameters to position, rotate and scale the 3D model onto the map
    var modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      //Since our 3D model is in real world meters, a scale transform needs to be applied since the CustomLayerInterface expects units in MercatorCoordinates.
    
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

  
    // configuration of the custom layer for a 3D model per the CustomLayerInterface
    var customLayer = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        
        // create two three.js lights to illuminate the model
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        
        var directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);
        
        // use the three.js GLTF loader to add the 3D model to the three.js scene
        var loader = new GLTFLoader();
        loader.load('https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf', (function (gltf) {
        this.scene.add(gltf.scene);
        }).bind(this));
        this.map = map;
        
        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true
        });
        
        this.renderer.autoClear = false;
      },
      render: function(gl, matrix) {
        var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
        var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
        var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);
        
        var m = new THREE.Matrix4().fromArray(matrix);
        var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
        .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);
        
        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
      }
    };
    map.on('style.load', function() {
      map.addLayer(customLayer, 'waterway-label');
    }); 
    */

    


    self.map.on('load', function() {
      // Add a GeoJSON source containing place coordinates and information.
      self.map.addSource("places", {
      "type": "geojson",
      "data": accomPlaces
      });





      fetch(global.backendURL+"events/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        //console.log("What was returned: ", res)
        return res.json()
      
      })
        .then(data =>{
          if(data){
            console.log("List of events: ", data)
            self.setState({events: data.map(d=>(
              {
                description: d.description,
                title: d.title,
                members: d.members.split(','),
                location: d.location,
                id: d.id,
                total: d.required,
                time: new Date(d.creationDate)
              }
            ))});

            // array of requests
            //
            var arr = self.state.events.map(e=> Geocode.fromAddress(e.location).then(function(v){ return {v:v, status: "fulfilled" }},function(e){ return {e:e, status: "rejected" }})) ;
            
            console.log(arr);
           
          
          

            Promise.all(arr).then(function(results){
              //[0].geometry.location .filter(x => x.status === "fulfilled")
              let found = results.map((res, r)=>({r, ...res})).filter(x => x.status === "fulfilled")
              console.log("Found ", found)
              found = found.map(f=> ({ title: self.state.events[f.r].title,date: (new Date(self.state.events[f.r].time)).toUTCString() , location:f.v.results[0].geometry.location  }))
              console.log(found)
              console.log( found.filter(f=> f.date > (new Date())))
              self.setState({
                found: found.filter(f=> (new Date(f.date)) > (new Date()))
              })
              

              self.map.addSource("currentevents", {
                "type": "geojson",
                "data": 
                  {
                    "type": "FeatureCollection",
                    "features": found.filter(f=> (new Date(f.date)) > (new Date())).map(f=>(
                      {
                      "type": "Feature",
                      "properties": {
                      "place": f.title || "",
                      "info": f.date || "",
                      "icon": "theatre"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [f.location.lng, f.location.lat]
                      }
                    }))
                  
                  }
                })

              self.map.addSource("events", {
                "type": "geojson",
                "data": 
                  {
                    "type": "FeatureCollection",
                    "features": found.map(f=>(
                      {
                      "type": "Feature",
                      "properties": {
                      "place": f.title || "",
                      "info": f.date || "",
                      "icon": "theatre"
                      },
                      "geometry": {
                      "type": "Point",
                      "coordinates": [f.location.lng, f.location.lat]
                      }
                    }))
                  
                  }
                })


                // Add thin lines
                for(let i=0; i<found.length;i++){
                  console.log([self.state.lat, self.state.lng],
                    [found[i].location.lat, found[i].location.lng])
                  self.map.addLayer({
                    "id": "route"+i,
                    "type": "line",
                    "source": {
                    "type": "geojson",
                    "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                    "type": "LineString",
                    "coordinates": [
                      [self.state.lng, self.state.lat],
                    [found[i].location.lng, found[i].location.lat]
                    
                    ]
                    }
                    }
                    },
                    "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                    },
                    "paint": {
                    "line-color": "#FF0000",
                    "line-width": 1,
                    "line-gap-width":2,
                    "line-opacity": 0.2
                    }
                    });
                }
                


                self.map.addLayer({
                  "id": "poievents",
                  "type": "symbol",
                  "source": "currentevents",
                  "layout": {
                   // "text-field": ["get", "description"],
                    //"text-variable-anchor": ["top", "bottom", "left", "right"],
                    //"text-radial-offset": 0.5,
                    //"text-justify": "auto",
                    "icon-image": ["concat", ["get", "icon"], "-15"],
                    "text-field": ['format',
                      ['upcase', ['get', 'place']], { 'font-scale': .8, "text-color": 'red' },
                      '\n', {},
                      ['downcase', ['get', 'info']], { 'font-scale': .6, "text-color": 'black' }],
                      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                      "text-offset": [0, 0.6],
                      "text-anchor": "top",
                      
                  }
                });

                self.setState({
                  loading:false
                })



                // Add heatmap layer
                self.map.addLayer({
                  "id": "earthquakes-heat",
                  "type": "heatmap",
                  "source": "events",
                  
                  "paint": {
                  // Increase the heatmap weight based on frequency and property magnitude
                  "heatmap-weight": 1,
                  // Increase the heatmap color weight weight by zoom level
                  // heatmap-intensity is a multiplier on top of heatmap-weight
                  "heatmap-intensity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0, 1,
                  15, 3
                  ],
                  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                  // Begin color ramp at 0-stop with a 0-transparancy color
                  // to create a blur-like effect.
                  "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0, "rgba(33,102,172,0)",
                  0.2, "rgb(103,169,207)",
                  0.4, "rgb(209,229,240)",
                  0.6, "rgb(253,219,199)",
                  0.8, "rgb(239,138,98)",
                  1, "rgb(178,24,43)"
                  ],
                  // Adjust the heatmap radius by zoom level
                  "heatmap-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0, 2,
                  15, 40
                  ],
                  // Transition from heatmap to circle layer by zoom level
                  "heatmap-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  7, 1,
                  16, 0.5
                  ],
                  }
                  }, 'waterway-label');







            });
          }});


    
            /* 
            for(let i=0; i< self.state.events.length;i++){
              let u=i;


              
    
              Geocode.fromAddress(self.state.events[u].location).then(
                response => {
                  const { lat, lng } = response.results[0].geometry.location;
                  console.log("Got ", lat, lng, " for event ",self.state.events[u].location)
                  // Got lat and lng, can now place on map

                
                  
                  map.addSource("events"+u, {
                    "type": "geojson",
                    "data": 
                      
                      
                      {
                        "type": "FeatureCollection",
                        "features": [{
                          "type": "Feature",
                          "properties": {
                          "place": self.state.events[u].title || "",
                          "info": self.state.events[u].date || "",
                          "icon": "theatre"
                          },
                          "geometry": {
                          "type": "Point",
                          "coordinates": [lng, lat]
                          }
                        }]}})



                        map.addLayer({
                          "id": "poievents"+u,
                          "type": "symbol",
                          "source": "events"+u,
                          "layout": {
                           // "text-field": ["get", "description"],
                            //"text-variable-anchor": ["top", "bottom", "left", "right"],
                            //"text-radial-offset": 0.5,
                            //"text-justify": "auto",
                            "icon-image": ["concat", ["get", "icon"], "-15"],
                            "text-field": ['format',
                              ['upcase', ['get', 'place']], { 'font-scale': .8, "text-color": 'red' },
                              //'\n', {},
                              ['downcase', ['get', 'info']], { 'font-scale': .6, "text-color": 'black' }],
                              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                              "text-offset": [0, 0.6],
                              "text-anchor": "top",
                              
                          }
                        });
                      
                      
                      
                      },
                      error => {
                        console.error(error);
                      });
                    }       


                  }
                
                });*/
            
  

/*
            map.addSource("events", {
              "type": "geojson",
              "data": self.state.events.filter(e=> e.lat).map(e=>
                
                
                ({
                  "type": "FeatureCollection",
                  "features": accommodations.map(accom=>({
                    "type": "Feature",
                    "properties": {
                    "place": e.title || "",
                    "info": e.date || "",
                    "icon": "theatre"
                    },
                    "geometry": {
                    "type": "Point",
                    "coordinates": [e.lng, e.lat]
                    }
                  }))})
                
                
                )
              });
       */


      self.map.addLayer({
        "id": "poi-labels",
        "type": "symbol",
        "source": "places",
        "layout": {
         // "text-field": ["get", "description"],
          //"text-variable-anchor": ["top", "bottom", "left", "right"],
          //"text-radial-offset": 0.5,
          //"text-justify": "auto",
          "icon-image": ["concat", ["get", "icon"], "-15"],
          "text-field": ['format',
            ['upcase', ['get', 'place']], { 'font-scale': .8, "text-color": 'black' },
            //'\n', {},
            ['downcase', ['get', 'info']], { 'font-scale': .6, "text-color": 'blue' }],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top",
            
        }
      });

      for(let i=0; i< accommodations.length;i++){

        if(!accommodations[i].icon){
          let r=Math.random()
          self.map.addLayer({
            'id': 'health'+i,
            'type': 'fill',
            'source': {
            'type': 'geojson',
            'data': {
            'type': 'Feature',
            'geometry': {
            'type': 'Polygon',
            'coordinates': [[[accommodations[i].lng, accommodations[i].lat],
            [accommodations[i].lng+0.0003, accommodations[i].lat],
            [accommodations[i].lng+0.0003, accommodations[i].lat+0.0005*r],
            [accommodations[i].lng, accommodations[i].lat+0.0005*r]]]
            }
            }
            },
            'layout': {},
            'paint': {
            'fill-color': '#0F0',
            'fill-opacity': 0.8
            }
            });
          }
        }





      var layers = self.map.getStyle().layers;
 
      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
      }
      }
       
      self.map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
      'fill-extrusion-color': '#aaa',
       
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
      "interpolate", ["linear"], ["zoom"],
      15, 0,
      15.05, ["get", "height"]
      ],
      'fill-extrusion-base': [
      "interpolate", ["linear"], ["zoom"],
      15, 0,
      15.05, ["get", "min_height"]
      ],
      'fill-extrusion-opacity': .6
      }
      }, labelLayerId);






       
        self.map.flyTo({center: {lat: self.state.lat, lng:self.state.lng}});
    });
   
    
  }

  render(){

   
    return(
      <div className ="mapbox-container">
        {this.state.loading &&  <CircularProgress className="circular"/>}
        <div ref={el => this.mapContainer = el} className='mapbox' />

        
      </div>
    )
  }

}

export default MapBox;


/*


      var map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/dark-v9',
        zoom: 2,
        pitch:45
      });
      // randomly generate some line arcs (not essential for understanding this demo)
      
      var lines = new Array();
      var arcSegments = 25;
      var lineQuantity = 50;
      for (var i = 0; i < lineQuantity; i++){
        var line = new Array();
        var destination = [300*(Math.random()-0.5), 140*(Math.random()-0.5)];
        var maxElevation = Math.pow(Math.abs(destination[0]*destination[1]), 0.5) * 80000;
        var increment = destination.map(function(direction){
          return direction/arcSegments;
        })
        for (var l = 0; l<=arcSegments; l++){
          var waypoint = increment.map(function(direction){
            return direction * l
          })
          var waypointElevation = Math.sin(Math.PI*l/arcSegments) * maxElevation;
          waypoint.push(waypointElevation);
          line.push(waypoint);
        }
        lines.push(line)
      }
      console.log('lineGeometries of the lines: ', lines);
      // instantiate threebox
      map.on('style.load', function() {
        map.addLayer({
          id: 'custom_layer',
          type: 'custom',
          onAdd: function(map, mbxContext){

            tb = new Threebox(
              map, 
              mbxContext,
              {defaultLights: true}
            );
            for (line of lines) {
              var lineOptions = {
                geometry: line,
                color: (line[1][1]/180) * 0xffffff, // color based on latitude of endpoint
                width: Math.random() + 1 // random width between 1 and 2
              }
              lineMesh = tb.line(lineOptions);
              tb.add(lineMesh)
            }
          },
          
          render: function(gl, matrix){
              tb.update();
          }
        });
      });
  

*/