const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");



let currentTab=userTab;
currentTab.classList
.add("current-tab");
getfromSessionStorage();
getLocation();



function switchTab(clickedTab){
if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList 
    .add("current-tab");
   if(!searchForm.classList.contains("active")){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.add("active");


   }
   else{
    // searchForm active class contain karta hai
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    // aisa karke ham your weather tab me aa gaye hai so ab ham process shuru karte hai location se weather jannne ka process
    // agar location granted hogi to coordinates available honge aur agar nai honge to unhe process kia jayega
    getfromSessionStorage();
    
   }


}
}


userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});


// firstly ham getlocation Api ka use karnge 

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

}



// grantAcessButton par eventlistner ka use karke ise call karnge
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

// now we have to check if  coordinates are available or not in sessionStorage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // location permission ke liye 
        grantAccessContainer.classList.add(".active");

    }
    else{
        
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    console.log(lat);
    console.log(lon);


    grantAccessContainer.classList.remove("active");
    // make loader visible 
    loadingScreen.classList.add("active");
    // API call
    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`   
        );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        alert("Error in API fetching");

    }
   


}
function renderWeatherInfo(weatherInfo){
    // firstly ,we have to fetch the element 
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    // fetch values from weatherInfo
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.tolowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}





