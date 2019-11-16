import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
//import { Geocoder} from 'google-maps-react';
import Geocode from "react-geocode";

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
      events:[]
    }
    this.getEvents = this.getEvents.bind(this);
   
  }

  // Make data call
  componentWillMount(){
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
    

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let minDistance = 9999999999;
        for(let i=0; i< accommodations.length; i++){
          if( (Math.abs(position.coords.latitude-accommodations[i].lat) + Math.abs(position.coords.longitude-accommodations[i].lng))<minDistance ){
            self.setState({currentAccomodation:i, lng: accommodations[i].lng, lat:accommodations[i].lat })
          }
        }
       // position.coords.latitude, position.coords.longitude;
      });
    } else {
      /* geolocation IS NOT available */
    }
    
    const map = new mapboxgl.Map({
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

    


    map.on('load', function() {
      // Add a GeoJSON source containing place coordinates and information.
      map.addSource("places", {
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
              found = found.map(f=> ({ title: self.state.events[f.r].title,date: self.state.events[f.r].date, location:f.v.results[0].geometry.location  }))
              console.log(found)

              map.addSource("events", {
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

                map.addLayer({
                  "id": "poievents",
                  "type": "symbol",
                  "source": "events",
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


      map.addLayer({
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
       

    });
  }

  render(){
    
    return(
      <div className ="mapbox-container">
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