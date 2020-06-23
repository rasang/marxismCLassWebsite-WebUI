
function refreshToken(res){
    if(typeof(res.headers.refreshtoken) != "undefined"){
        localStorage.getItem("token",res.headers.refreshtoken)
    }
}
var intro = new Vue({
    el:"#userInfo",
    data:{
        school: "",
        clazz: "",
        realName: ""
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
            axios.get("http://127.0.0.1:8080/userInfo",{headers:{'token':localStorage.getItem('token')}})
            .then(res => {
                if(res.data.code=="200"){
                    that.school = res.data.data.school;
                    that.clazz = res.data.data.clazz;
                    that.realName = res.data.data.realName;
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
            var school = document.getElementById("school").innerText.replace(/\n/g,'<br>');
            var clazz = document.getElementById("clazz").innerText.replace(/\n/g,'<br>');
            var realName = document.getElementById("realName").innerText.replace(/\n/g,'<br>');
            axios.post("http://127.0.0.1:8080/userInfo","school="+school+"&clazz="+clazz+"&realName="+realName ,{headers:{'token':localStorage.getItem('token')}})
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