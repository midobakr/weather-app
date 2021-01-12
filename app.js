const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='
const API_key = '&appid=8ef7fdb8192c9132fe2e4fe63bc3d796';

let key = '563492ad6f91700001000001cb76baf916f64c86a34d7d31eb2b39d4'

const button = document.querySelector('#generate');
const zipCode = document.querySelector('#zip');
const content = document.querySelector('#feelings');
const warning_message = document.querySelector('#warning');


button.addEventListener('click', async () => {
    if (!zipCode.value) { //check zip code value
        zipCode.classList.add('warning_input')
        return; // do not accept an empty value
    } else {
        zipCode.classList.remove('warning_input')
    }
    document.querySelector('#content').innerHTML = ''
    document.querySelector('#temp').innerHTML = ''
    document.querySelector('#name').innerHTML = ''
    document.querySelector('.loader').style.display = 'block'
    document.querySelector('#background').style.display = 'none'


    let data = await getData(baseUrl, zipCode.value, {
        // credentials: 'omit'
    })
    check_errors(data.msg)
    if (data.cod === '404') {
        return;
    }
    await fetch(`https://api.pexels.com/v1/search?query=${zipCode.value}&per_page=1`, {
        method: 'GET',
        headers: {
            Authorization: key
        },
        // credentials: 'omit'
    }).then(res => res.json()).then((res) => {
        console.log(res.photos[0])
        document.querySelector('.loader').style.display = 'none'
        document.querySelector('#background').src = res.photos[0].src.landscape
        document.querySelector('#background').style.display = 'block'

    })

    console.log(data)

    await updateUI({
        temperature: data.main.temp,
        date: today_date.toLocaleString(),
        weather: data.weather[0],
        name:data.name
    })

})

async function getData(baseUrl, zip) {
    let data = await fetch(baseUrl + zip + API_key).then(res => res.json())
    return data
}


async function updateUI(data) {
    document.querySelector('#temp').innerHTML = `<h1><span class='api_data1'> ${data.temperature}&#8451</span></h1>`;
    document.querySelector('#content').innerHTML = `<h3><span class='api_data2'>${data.weather.description.toUpperCase()}</span></h3>`;
    document.querySelector('#name').innerHTML = `<h3><span class='api_data3'>${data.name}</span></h3>`;
}

function check_errors(msg) {
    if (msg === "city not found") {
        warning_message.innerHTML = 'please enter a valid Zip code';
        warning_message.classList.add('warning');
        return false;
    } else {
        warning_message.classList.remove('warning');
        warning_message.innerHTML = '';
        return true;
    }

}