
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
    filters: {
        unescape:function (html) {
            return html
              .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, "\"")
              .replace(/&#39;/g, "\'")
              .replace(/&#40;/g, "\'")
              .replace(/&#41;/g, "\'")
              .replace(/<br>/g, "\n");
          }
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
                    refreshToken(res);
                }
                else if(res.data.code=="401"){
                    alert(res.data.msg);
                    location.href = "login.html";
                }
                else{
                    alert(res.data.msg);
                }
            })
            .catch(err => {
                console.error(err); 
            })
        },
        updateData(){
            var outline = document.getElementById("outline").innerText.replace(/\n/g,'<br>');
            var material = document.getElementById("material").innerText.replace(/\n/g,'<br>');
            var characteristic = document.getElementById("characteristic").innerText.replace(/\n/g,'<br>');
            var condition = document.getElementById("condition").innerText.replace(/\n/g,'<br>');
            var environment = document.getElementById("environment").innerText.replace(/\n/g,'<br>');
            axios.post("http://127.0.0.1:8080/courseIntroduce","summary="+outline+"&materials="+material+"&characteristics="+characteristic + 
            "&conditions=" + condition +  "&environment=" + environment,{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    alert(res.data.msg);
                    refreshToken(res);
                }
                else if(res.data.code=="401"){
                    alert(res.data.msg);
                    location.href = "login.html";
                }
                else{
                    alert(res.data.msg);
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