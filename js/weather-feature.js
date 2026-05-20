/**
 * Subtle Weather Feature
 * Displays a small weather indicator based on user's location
 */

(function() {
    // Wait for DOM to be fully loaded
    window.addEventListener('load', function() {
        // Create weather element
        const weatherElement = document.createElement('div');
        weatherElement.id = 'weather-widget';
        weatherElement.className = 'weather-widget';
        
        // Initial hidden state
        weatherElement.innerHTML = `
            <div class="weather-icon">
                <div class="weather-loading"></div>
            </div>
            <div class="weather-info">
                <span class="weather-temp"></span>
                <span class="weather-location"></span>
            </div>
        `;
        
        // Add to page - we'll add it to the header for subtle placement
        const header = document.querySelector('.s-header');
        if (header) {
            header.appendChild(weatherElement);
        }
        
        // Get user's location and weather
        getWeather();
    });
    
    // Function to get weather data
    function getWeather() {
        // First get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Call OpenWeatherMap API
                fetchWeatherData(lat, lon);
            }, handleLocationError);
        } else {
            // Fallback to a default location if geolocation is not available
            fetchWeatherData(19.0760, 72.8777); // Mumbai coordinates as fallback
        }
    }
    
    // Function to fetch weather data from API
    function fetchWeatherData(lat, lon) {
        // Using OpenWeatherMap API
        // Note: In a production environment, you would need to use your own API key
        // and handle this request server-side to protect your API key
        const apiKey = 'demo'; // Using demo mode for example purposes
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        // For demo purposes, we'll simulate a weather response
        // In a real implementation, you would use fetch() to call the API
        simulateWeatherResponse(lat, lon);
    }
    
    // Function to simulate weather response (for demo)
    function simulateWeatherResponse(lat, lon) {
        // Get current date to determine season
        const date = new Date();
        const month = date.getMonth();
        
        // Simulate different weather based on month
        let weather = {};
        
        // Simple season determination (Northern Hemisphere)
        if (month >= 2 && month <= 4) {
            // Spring
            weather = {
                temp: Math.floor(Math.random() * 10) + 15, // 15-25°C
                condition: 'Partly Cloudy',
                icon: 'cloud-sun'
            };
        } else if (month >= 5 && month <= 7) {
            // Summer
            weather = {
                temp: Math.floor(Math.random() * 10) + 25, // 25-35°C
                condition: 'Sunny',
                icon: 'sun'
            };
        } else if (month >= 8 && month <= 10) {
            // Fall
            weather = {
                temp: Math.floor(Math.random() * 10) + 10, // 10-20°C
                condition: 'Cloudy',
                icon: 'cloud'
            };
        } else {
            // Winter
            weather = {
                temp: Math.floor(Math.random() * 10) + 5, // 5-15°C
                condition: 'Cold',
                icon: 'snowflake'
            };
        }
        
        // Get city name based on coordinates (simplified for demo)
        // In a real implementation, you would use reverse geocoding
        let city = "Mumbai";
        
        // Update the weather widget
        updateWeatherWidget(weather, city);
    }
    
    // Function to update the weather widget with data
    function updateWeatherWidget(weather, city) {
        const weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) return;
        
        const weatherIcon = weatherWidget.querySelector('.weather-icon');
        const weatherTemp = weatherWidget.querySelector('.weather-temp');
        const weatherLocation = weatherWidget.querySelector('.weather-location');
        
        // Update icon
        weatherIcon.innerHTML = getWeatherIcon(weather.icon);
        
        // Update temperature and location
        weatherTemp.textContent = `${weather.temp}°C`;
        weatherLocation.textContent = city;
        
        // Show the widget with a fade-in effect
        setTimeout(() => {
            weatherWidget.classList.add('active');
        }, 1000);
    }
    
    // Function to get weather icon HTML
    function getWeatherIcon(iconName) {
        const icons = {
            'sun': '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
            'cloud': '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
            'cloud-sun': '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M10 16a4 4 0 1 1 8 0"></path><path d="M10 16H2"></path><path d="M22 16h-4"></path></svg>',
            'cloud-rain': '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M16 13v8"></path><path d="M8 13v8"></path><path d="M12 15v8"></path><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>',
            'snowflake': '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v20"></path><path d="M17.5 4.5 12 10l-5.5-5.5"></path><path d="M17.5 19.5 12 14l-5.5 5.5"></path><path d="M2 12h20"></path><path d="M4.5 6.5 10 12l-5.5 5.5"></path><path d="M19.5 6.5 14 12l5.5 5.5"></path></svg>'
        };
        
        return icons[iconName] || icons['cloud'];
    }
    
    // Handle location error
    function handleLocationError(error) {
        console.log("Error getting location:", error.message);
        
        // Fallback to default location
        fetchWeatherData(19.0760, 72.8777); // Mumbai coordinates
    }
})();
