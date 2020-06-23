function isLegal(temp){
    var re=/[^\u4E00-\u9FA5a-zA-Z0-9]/;
    if (re.test(temp)) return false ;
    return true ;
}

var index = new Vue({
    el:"#main",
    data:{
        flag:true,
        switchButton:"注册",
        loginButton:"登录",
        url_1:"http://127.0.0.1:8080/login",
        url_2:"http://127.0.0.1:8080/register",
        tip_1:"使用已有账号登录",
        tip_2:"注册一个新账号",
        mobileRegister_1:"还没注册?",
        mobileRegister_2:"已有账号?",
        username:"",
        password:""
    },
    methods: {
        switchPanel:function(){
            this.flag = !this.flag;
            var tmp = this.switchButton;
            this.switchButton = this.loginButton;
            this.loginButton = tmp;
            tmp = this.tip_1;
            this.tip_1 = this.tip_2;
            this.tip_2 = tmp;
            tmp = this.url_1;
            this.url_1 = this.url_2;
            this.url_2 = tmp;
            tmp = this.mobileRegister_1;
            this.mobileRegister_1 = this.mobileRegister_2;
            this.mobileRegister_2 = tmp;
            this.timer = setTimeout(()=>{
            this.flag = !this.flag;
            },700);
        },
        login:function(){
            var that = this;
            if(!isLegal(that.username)){
                alert("用户名只能是长度10以内的中文大小写字母或数字！");
                return;
            }
            else if(that.username == "" || that.password == ""){
                alert("用户名密码不可为空");
                return;
            }
            axios.post(that.url_1,"username="+that.username+"&password="+ that.password)
            .then(res => {
                if(that.switchButton == "注册"){
                    if(res.data.code=="200"){
                        localStorage.setItem("token",res.data.data.token);
                        localStorage.setItem("identification",res.data.data.identification);
                        localStorage.setItem("username",res.data.data.username);
                        window.location.href="index.html";
                    }
                    else if(res.data.code=="409"){
                        alert("用户名只能是长度10以内的中文大小写字母或数字！");
                    }
                    else{
                        alert("用户名或密码错误");
                    }
                    console.log(res);
                    
                }
                else{
                    if(res.data.code!="200"){
                        console.log(res);
                        alert("注册失败");
                    }
                    else{
                        alert("注册成功");
                        location.reload();
                    }
                }
            })
            .catch(err => {
                if(that.switchButton == "注册"){
                    alert("登录失败");
                }
                else{
                    alert("注册失败");
                }
                console.error(err); 
            })
        }
    }
})