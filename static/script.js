const categories = ['business', 'entertainment', 'health', 'politics', 'top','science','environment'];
const countries = ['us', 'ca', 'au', 'gb','nz'];
let data;
let apiResults = [];
let recentElement


let category, country;


const randomBtn = document.querySelector('.random');
const analyzeBtn = document.querySelector('.analyze');


const title = document.getElementById('title');
const text = document.getElementById('text');
const link = document.getElementById('link');

const generateRandomNumber = function(n){
    return Math.floor(Math.random()*n) 
}
const display = function(apiResults){
    if(apiResults[0].content!==null){
        // console.log(apiResults[0])
        recentElement = apiResults.shift();
        title.innerHTML = `${recentElement.title}`;
        text.innerHTML =  `${recentElement.content}`;
        link.innerHTML = `${recentElement.link}`;
        link.setAttribute('href', `${recentElement.link}`);
        console.log(`Remaining elements:  ${apiResults.length}`)
    }else{
        apiResults.shift();
        console.log(`Remaining elements:  ${apiResults.length}`)
        display(apiResults);
    }

}

const search = function (score, phrase) {
	let searched = phrase;
    if (searched !== "") {
        let text = document.getElementById("text").innerHTML;
        try{
            let re = new RegExp(searched,"ig"); // search for all instances
            let newText = text.replace(re, `<mark class="show" title="relevancy score: ${score}">${searched}</mark>`);
            document.getElementById("text").innerHTML = newText;    
        }catch(err){
            console.log(err)
        }
        
    }
}

const toggleAnalyze = function (){
    if(analyzeBtn.innerHTML=="Remove"){
        const markAll = document.querySelectorAll('mark');
        markAll.forEach(function(m){
            m.classList.remove('show');
            m.classList.add('hidden');
        })
        analyzeBtn.innerHTML = "Analyze"
        return
    }
    if(analyzeBtn.innerHTML=="Analyze") {
        analyzeBtn.innerHTML = "Remove"
    }
}


randomBtn.addEventListener('click', function(){
    analyzeBtn.innerHTML = "Remove"
    toggleAnalyze();
    if(apiResults.length > 0){
        console.log("---------Calling from Cache---------");
        display(apiResults);
    }else{
        console.log("----------API call-----------");
        fetch('/handleAPIcalls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            })
        .then(response => response.json())
        .then(data => {
            // // Do something with the data
            // console.log(data.results);
            apiResults = data;
            display(apiResults);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
})

analyzeBtn.addEventListener('click', function(){
    //toggling analyze and remove
    toggleAnalyze();
    if(analyzeBtn.innerHTML == "Analyze") return

    // data to be processed
    const data = { content: recentElement.content};
    // console.log(data);

    //post request to the server
    fetch('/process-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
        res.forEach(e => {
            search(e[0], e[1])
        });
    })  // show the response from the server
    .catch(error => console.error(error));
})