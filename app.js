const chalk = require('chalk')
const axios = require("axios")
const yargs = require("yargs");
const apiKeys = require('./config');

const getTemp = (city, region) => {
    const formatCity = city.replace(' ', '%20');
    const URLForLocation = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formatCity}.json?access_token=${apiKeys.LocationKey}&limit=1&region=`
     const locationGetRequest = axios.get(URLForLocation)

    const returnLocationData = locationGetRequest.then(response => {
        
        const locationData = {
            lat: response.data.features[0].center[1],
            long: response.data.features[0].center[0],
            city: response.data.features[0].text
        }
        return locationData
    })
    Promise.all([returnLocationData]).then(locationData => {
        let latitude = locationData[0].lat
        let longitude = locationData[0].long
        let location = locationData[0].city
        const URLForWeather = `http://api.weatherstack.com/current?access_key=${apiKeys.WeatherKey}&query=${latitude},${longitude}&units=f`

        const getRequestForWeather = axios.get(URLForWeather)
        getRequestForWeather.then(response => {
            let forecast = response.data.current.weather_descriptions[0].toLowerCase()
            let temp = response.data.current.temperature
            let state = response.data.location.region
            console.log(chalk.bgBlue.bold(`It is ${temp} degress and ${forecast} in ${location}, ${state}.`))
    })
})
.catch(error => {
    if (error) console.log('Unable to run application. Double check your spelling and internet connection')
})
 }

yargs.command({
    command: 'locate',
    describe: 'returns current temp for city',
    builder: {
        city: {
            describe: 'city argument',
            demandOption: true,
            type: 'string'
        },

        region: {
            describe: 'region argument',
            type: 'string'
        },

    },
    handler: (argv) => {
        getTemp(argv.city, argv.region)
    } 
})
yargs.parse()
