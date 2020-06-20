window.addEventListener("load",init)
function init(){
    let submit_btn=document.querySelector(".form__submit-btn")
    let form=document.querySelector(".form");
    let restart=document.querySelector(".btn-restart");
    restart.addEventListener("click",function(){
        let loader=document.querySelector(".loader")
        loader.classList.remove("active");
        let results=document.querySelector(".results")
        results.classList.remove("active");
        let survey=document.querySelector(".survey-container")
        survey.classList.add("active");

        let tableBody=document.querySelector(".table-neighbors__body");
        tableBody.innerHTML=""
    });
    submit_btn.addEventListener("click",onsubmit)
}
function onsubmit(e){
    e.preventDefault();
    let loader=document.querySelector(".loader")
    loader.classList.add("active");
    let survey=document.querySelector(".survey-container")
    survey.classList.remove("active");
    loadDoc()
}
function loadDoc() {
    let inputs=document.querySelectorAll(".form div>div>input");
    if(inputs.length>9){
      alert("ERROR:",inputs.length);
    }
    let data={
      pregnancies:parseInt(inputs[0].value),
      glucose:parseFloat(inputs[1].value),
      bloodPressure:parseFloat(inputs[2].value),
      skinThinkness:parseFloat(inputs[3].value),
      insulin:parseFloat(inputs[4].value),
      bmi:parseFloat(inputs[5].value),
      dpf:parseFloat(inputs[6].value),
      age:parseInt(inputs[7].value),
      kValue:parseInt(inputs[8].value)
    }
    let jsonData=JSON.stringify(data);
    console.log(jsonData);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let loader=document.querySelector(".loader")
        loader.classList.remove("active");
        let results=document.querySelector(".results")
        results.classList.add("active");
        let survey=document.querySelector(".survey-container")
        survey.classList.remove("active");

        let jsonResponse=JSON.parse(this.response);
        let prediction=document.querySelector(".results-prediction-text");
        let neighborsTitle=document.querySelector(".neighbors__title");
        let tableBody=document.querySelector(".table-neighbors__body");

        prediction.innerHTML=jsonResponse.Prediction
        neighborsTitle.innerHTML=data.kValue + " vecinos mas cercanos"
        for(var i=0;i<jsonResponse.Neighbors.length;i++){
          let row=document.createElement("tr");
            for(var j=0;j<jsonResponse.Neighbors[i].length;j++){
              let col=document.createElement("td")
              col.innerHTML=Math.round((jsonResponse.Neighbors[i][j] + Number.EPSILON) * 100) / 100;
              row.append(col)
            }
          tableBody.append(row);
        }
      }
    };
    xhttp.open("POST", "/data", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonData);
  }