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
            var trafficData = []
            json.forEach(edges => {
                var stop = {};
                for (const key in edges) {
                    if (edges.hasOwnProperty(key)) {

                        try {
                            const node = edges[key];

                            stop.distance = node.distance;
                            stop.name = node["place"]["stop"]["name"];
                            stop.stoptimes = node["place"]["stoptimes"];

                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

                trafficData.push(stop);
                
            });

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