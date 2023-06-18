if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker is registered', registration);
    }, function(err) {
      console.error('Registration failed:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

    // Exibir a latitude e longitude na tela
    var latitudeElement = document.getElementById('latitude');
    var longitudeElement = document.getElementById('longitude');
    latitudeElement.textContent = 'Latitude: ' + latitude;
    longitudeElement.textContent = 'Longitude: ' + longitude;

    // Obter o nome da cidade e o estado
    getLocationName(latitude, longitude);

      getWeatherByCoordinates(latitude, longitude);
    }, function(error) {
      console.log('Erro ao obter a localização:', error.message);
      displayError('Erro ao obter a localização: ' + error.message);
    });
  } else {
    console.log('Geolocalização não suportada pelo navegador');
    displayError('Geolocalização não suportada pelo navegador');
  }
});

async function getLocationName(latitude, longitude) {
    // Chamar a API de geocodificação reversa para obter o nome da cidade e o estado
    var geocodingUrl = 'https://api.opencagedata.com/geocode/v1/json?key=53dd67d2f78e45e3963a56846518768d&q=' + latitude + '+' + longitude;
    
    try {
        var response = await fetch(geocodingUrl);
        var data = await response.json();

        if (response.ok && data.results.length > 0) {
        var city = data.results[0].components.city;
        var state = data.results[0].components.state;
        console.log('Cidade:', city);
        console.log('Estado:', state);

        // Exibir o nome da cidade e o estado na tela
        var cityElement = document.getElementById('city');
        var stateElement = document.getElementById('state');
        cityElement.textContent = 'Cidade: ' + city;
        stateElement.textContent = 'Estado: ' + state;
        } else {
        console.log('Não foi possível obter o nome da cidade e do estado');
        }
    } catch (error) {
        console.log('Erro na chamada à API de geocodificação reversa:', error.message);
    }
}

async function getWeatherByCoordinates(latitude, longitude) {
  // Exibir div de carregamento e ocultar div dos dados do tempo
  document.getElementById('loading').style.display = 'block';
  document.getElementById('weatherData').style.display = 'none';

  var url = "https://api.tomorrow.io/v4/weather/realtime";
  var api_key = "224OCHPoQiFTNm3FMzyTMMTWg2gbpfhS";
  var headers = { "accept": "application/json" };

  var params = {
    "location": latitude + "," + longitude,
    "apikey": api_key
  };

  try {
    var response = await fetch(url + '?' + new URLSearchParams(params), { headers });
    var data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      displayError('Erro na chamada à API');
    }
  } catch (error) {
    displayError('Erro na chamada à API: ' + error.message);
  }
}

// Função para exibir os dados do clima na tela
function displayWeather(data) {
  var location = data.location;
  var weatherValues = data.data.values;

  var weatherDataDiv = document.getElementById('weatherData');
  weatherDataDiv.innerHTML = '';

  var locationHeading = document.createElement('h3');
  locationHeading.textContent = location.name;
  weatherDataDiv.appendChild(locationHeading);

  var translations = {
    cloudBase: 'Base de Nuvens',
    cloudCeiling: 'Teto de Nuvens',
    cloudCover: 'Cobertura de Nuvens',
    dewPoint: 'Ponto de Orvalho',
    freezingRainIntensity: 'Intensidade de Chuva Congelante',
    humidity: 'Umidade',
    precipitationProbability: 'Probabilidade de Precipitação',
    pressureSurfaceLevel: 'Pressão ao Nível do Solo',
    rainIntensity: 'Intensidade de Chuva',
    sleetIntensity: 'Intensidade de Chuva com Neve',
    snowIntensity: 'Intensidade de Neve',
    temperature: 'Temperatura',
    temperatureApparent: 'Temperatura Aparente',
    uvHealthConcern: 'Preocupação com a Saúde (UV)',
    uvIndex: 'Índice UV',
    visibility: 'Visibilidade',
    weatherCode: 'Código do Tempo',
    windDirection: 'Direção do Vento',
    windGust: 'Rajada de Vento',
    windSpeed: 'Velocidade do Vento'
  };

  Object.keys(weatherValues).forEach(function(key) {
    var value = weatherValues[key];
    var translatedKey = translations[key] || key;
    var displayValue = value !== null ? value : 'Não disponível';

    var weatherInfo = document.createElement('p');
    weatherInfo.innerHTML = '<strong>' + translatedKey + ':</strong> ' + displayValue;
    weatherDataDiv.appendChild(weatherInfo);
  });

  var errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = '';
  // Ocultar div de carregamento e exibir div dos dados do tempo
  document.getElementById('loading').style.display = 'none';
  document.getElementById('weatherData').style.display = 'block';
}

// Função para exibir mensagem de erro
function displayError(message) {
  var errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = '<div class="alert alert-danger">' + message + '</div>';

  var weatherDataDiv = document.getElementById('weatherData');
  weatherDataDiv.innerHTML = '';
}