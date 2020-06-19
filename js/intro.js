
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
        outline: "",
        material: "",
        characteristic: "",
        condition: "",
        environment: ""
    },
    methods: {
        getData(){
            that = this;
            axios.get("http://127.0.0.1:8080/courseIntroduce",{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    that.outline = res.data.data.course_summary;
                    that.material = res.data.data.course_materials;
                    that.characteristic = res.data.data.teaching_characteristics;
                    that.condition = res.data.data.teaching_conditions;
                    that.environment = res.data.data.teaching_environment;
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
            var outline = document.getElementById("outline").innerText;
            var material = document.getElementById("material").innerText;
            var characteristic = document.getElementById("characteristic").innerText;
            var condition = document.getElementById("condition").innerText;
            var environment = document.getElementById("environment").innerText;
            axios.post("http://127.0.0.1:8080/courseIntroduce","summary="+outline+"&materials="+material+"&characteristics="+characteristic + 
            "&conditions=" + condition +  "&environment=" + environment,{headers:{'token':localStorage.getItem('token')}})
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