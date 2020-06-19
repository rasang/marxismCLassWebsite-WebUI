
function refreshToken(res){
    if(typeof(res.headers.refreshtoken) != "undefined"){
        localStorage.getItem("token",res.headers.refreshtoken)
    }
}
var intro = new Vue({
    el:"#intro",
    data:{
        frameClass: localStorage.getItem("identification")=="T"?"frame-teacher":"frame-student",
        editable: localStorage.getItem("identification")=="T"?true:false,
        content: "",
        objective: "",
        arrangement: "",
        assessment: ""
    },
    methods: {
        getData(){
            that = this;
            axios.get("http://127.0.0.1:8080/teachPlan",{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    console.log(res);
                    that.content = res.data.data.content;
                    that.objective = res.data.data.objective;
                    that.arrangement = res.data.data.arrangement;
                    that.assessment = res.data.data.assessment;
                }
                else{
                    alert(res.data.msg);
                    location.href="login.html";
                }
                refreshToken(res);
            })
            .catch(err => {
                console.error(err); 
            })
        },
        updateData(){
            var content = document.getElementById("content").innerText;
            var objective = document.getElementById("objective").innerText;
            var arrangement = document.getElementById("arrangement").innerText;
            var assessment = document.getElementById("assessment").innerText;
            axios.post("http://127.0.0.1:8080/teachPlan","content="+content+"&objective="+objective+"&arrangement="+arrangement + 
            "&assessment=" + assessment ,{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    alert(res.data.msg);
                }
                else{
                    alert(res.data.msg);
                    location.href="login.html";
                }

            })
            .catch(err => {
                alert("修改失败");
                console.log(err);
            })
        }
    },
    mounted () {
        window.getData = this.getData();
    }
})