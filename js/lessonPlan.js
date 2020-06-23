function refreshToken(res){
    if(typeof(res.headers.refreshtoken) != "undefined"){
        localStorage.getItem("token",res.headers.refreshtoken)
    }
}
new Vue({
    el: "#plan-container",
    data:{
        files:{},
        flag: localStorage.getItem("identification")=="T"?true:false
    },
    methods: {
        getPlanData(){
            that = this;
            axios.get("http://127.0.0.1:8080/LearnFile",{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    that.files = res.data.data;
                    refreshToken(res)
                }
                else if(res.data.code=="401"){
                    alert(res.data.msg);
                    location.href = "login.html";
                }
            })
            .catch(err => {
                console.error(err); 
            })
        },
        loadPdf(fileName) {
            document.getElementById("current-file").innerHTML=fileName;
            document.getElementById("showArea-container").innerHTML="";
            axios.get("pdf.html")
            .then(res => {
                $("#showArea-container").append(res.data);//
                $(function () {
                    $("#myPDF").pdf({
                        source: "http://127.0.0.1:8080/download/learnFile/"+fileName,
                        tabs: [
                        ]
                    });
                });
            })
            .catch(err => {
                console.error(err);
            })
        },
        upload() {
            var file = document.getElementById("fileUpload").files[0];
            var formData = new FormData();
            formData.append("fileName", file);
            axios({
                    method: 'post',
                    url: "http://127.0.0.1:8080/LearnFile",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': localStorage.getItem('token')
                    }
            }).then(res => {
                console.log(res);
                if(res.data.code == "200"){
                    alert("教案上传成功");
                    loadHTML('lessonPlan.html');
                    refreshToken(res);
                }
                else if(res.data.code=="401"){
                    alert(res.data.msg);
                    location.href = "login.html";
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        deleteFile(){
            var that = this;
            var fileName = document.getElementsByClassName("select")[0].getAttribute("url");
            axios.get("http://127.0.0.1:8080/delete/learnFile/"+fileName,{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    alert("删除成功");
                    var parent = document.getElementsByClassName("select")[0].parentElement;
                    var grandParent = parent.parentElement;
                    for(var i = 0; i < grandParent.childElementCount; i++){
                        if(grandParent.children[i] == parent){
                            that.files.splice(i,1);
                        }
                    }
                }
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
    mounted(){
        window.getPlanData = this.getPlanData;
    }
})

function select(elem){
    var now = document.getElementsByClassName("select");
    for(var i = 0; i < now.length; i++){
        now[i].className = "";
    }
    elem.className = "select";
    var bt = document.getElementById("delete");
    bt.className="login-botton delete-botton";
    bt.removeAttribute("disabled");
}