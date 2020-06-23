function refreshToken(res){
    if(typeof(res.headers.refreshtoken) != "undefined"){
        localStorage.getItem("token",res.headers.refreshtoken)
    }
}
new Vue({
    el: "#material-container",
    data:{
        files:{},
        flag: localStorage.getItem("identification")=="T"?true:false
    },
    methods: {
        getMaterialData(){
            that = this;
            axios.get("http://127.0.0.1:8080/TeachFile",{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    that.files = res.data.data;
                    refreshToken(res);
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
        loadMaterial(fileName){
            document.getElementById("current-file").innerHTML=fileName;
            document.getElementById("showArea-container").innerHTML="";
            axios.get("office.html")
            .then(res => {
                $("#showArea-container").append(res.data.replace("example.file","teachFile/"+fileName));//
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
                    url: "http://127.0.0.1:8080/TeachFile",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': localStorage.getItem('token')
                    }
            }).then(res => {
                if(res.data.code == "200"){
                    alert("教案上传成功");
                    loadHTML('material.html');
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
        getLogoNameByType(fileName){
            type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
            if(type.lastIndexOf("ppt")!=-1){
                return "img/PPT.svg"
            }
            else{
                return "img/DOC.svg";
            }
        },
        deleteFile(){
            var that = this;
            var fileName = document.getElementsByClassName("select")[0].getAttribute("url");
            axios.get("http://127.0.0.1:8080/delete/teachFile/"+fileName,{headers:{'token':localStorage.getItem('token')}})
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
                else{
                    alert(res.data.msg);
                }
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
    mounted(){
        window.getMaterialData = this.getMaterialData;
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