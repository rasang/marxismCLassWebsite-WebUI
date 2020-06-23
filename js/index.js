function loadHTML(html){
    document.getElementById("showArea-container").innerHTML="";
    axios.get(html)
    .then(res => {
        $("#showArea-container").append(res.data);
    })
    .catch(err => {
        console.error(err); 
    })
}
