const request = require('request');

var req = {
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  method: 'POST',
  headers: { "Content-Type": "application/graphql" },
  body: `
  {
    nearest(lat: 60.186802, lon: 24.827631, maxResults: 8, maxDistance: 1500, filterByPlaceTypes: [DEPARTURE_ROW, BIKE_PARK]) {
      edges {
        node {
          distance
          place {
            ... on DepartureRow {
              stop {
                name
              }
              stoptimes {
                realtime
                realtimeState
                realtimeDeparture
                trip {
                  route {
                    shortName
                    longName
                  }
                }
                headsign
              }
            }
            ... on BikePark {
              name
              bikeParkId
              realtime
              spacesAvailable
            }
          }
        }
      }
    }
  }        
  `
};




const getRealtrafficTimes = (reqg, resg) => {
    request(req, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            json = json["data"]["nearest"]["edges"]
            var trainData = []
            json.forEach(edges => {
                var stop = {};
                for (const key in edges) {
                    if (edges.hasOwnProperty(key)) {

                        try {
                            const node = edges[key];                           
                            
                            if(node["place"]["stop"]) stop.name = node["place"]["stop"]["name"];
                            
                            stop.distance = node.distance;
                            stop.stoptimes = node["place"]["stoptimes"];

                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

                trainData.push(stop);
                
            });

            //Formulate it to the need of the frontend

            //ToDO:Fix bike Data
            var bike = {occupancy: Math.floor( Math.random() * ( 1 + 19 - 2 ) ) + 2, total: 20};
            
            //var train= [{name: "SMI", destination:"Matinkyla - Vusaari" , when:8 }, {name: "F2" , destination:"Matinkyla - Vusaari", when:4 }]
            
            var filteredTrainData = [] //top 3
            //easy and nasty solution
            var selectedNames = []
            trainData.forEach(route => {
                if(route && route.name && route.stoptimes && route.stoptimes.length >0 && selectedNames.indexOf(route.name) == -1) {
                    filteredTrainData.push({
                        name: route.name,
                        destination: route.stoptimes[0].headsign,
                        when: Math.floor( Math.random() * ( 1 + 25 - 2 ) ) + 2
                         // TODO: fix date stuff
                          //Date.now() - parseInt(route.stoptimes[0].realtimeDeparture)
                    });
                    selectedNames.push(route.name);
                }
            });

            var trafficData = {bike:bike, train: filteredTrainData}

            resg.status(200).json(trafficData);
        }
        else {
            resg.sendStatus(500);
        }
    });
}

module.exports={
    getRealtrafficTimes
};