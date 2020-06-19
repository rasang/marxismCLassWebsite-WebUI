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

function loadPdf() {
    document.getElementById("showArea-container").innerHTML="";
    axios.get("pdf.html")
    .then(res => {
        $("#showArea-container").append(res.data);//
        $(function () {
            $("#myPDF").pdf({
                source: "http://127.0.0.1:5500/test.pdf",
                tabs: [
                ]
            });
        });
    })
    .catch(err => {
        console.error(err);
    })
}