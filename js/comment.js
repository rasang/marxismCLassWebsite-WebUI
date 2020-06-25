new Vue({
    el: "#comments",
    data: {
        flag: localStorage.getItem("identification")=="T"?true:false,
        comments: [],
        page: 1
    },
    filters: {
        unescape: function (html) {
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
        getCommentsData() {
            that = this;
            var fileName = document.getElementById("current-file").innerText;
            axios.get("http://plumk.site:8080/comment?filename=" + fileName + "&index=" + that.page + "&size=5", { headers: { 'token': localStorage.getItem('token') } })
                .then(res => {
                    if (res.data.code == "200") {
                        for(var i=0;i<res.data.data.list.length;i++){
                            if(res.data.data.list[i].username==localStorage.getItem("username")){
                                res.data.data.list[i]["mine"] = true;
                            }
                            else{
                                res.data.data.list[i]["mine"] = false;
                            }
                        }
                        that.comments = that.comments.concat(res.data.data.list);
                        that.page = that.page + 1;
                        console.log(that.comments);
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        },
        addSentComment(username, comment) {
            re = { "username": username, "content": comment }
            this.comments.unshift(re);
        },
        ifNotComments() {
            return this.comments.length == 0;
        },
        deleteComment(id){
            that = this;
            var fileName = document.getElementById("current-file").innerText;
            axios.delete("http://plumk.site:8080/comment?"+"filename="+fileName+"&id="+id,{ headers: { 'token': localStorage.getItem('token') } })
            .then(res => {
                alert(res.data.msg);
                if(res.data.code=="200"){
                    for(var i = 0; i < that.comments.length; i++){
                        if(that.comments[i].id == id){
                            that.comments.splice(i,1);
                        }
                    }
                }
            })
            .catch(err => {
                alert(err.msg);
                console.error(err); 
            })
        }
    },
    mounted() {
        window.getCommentsData = this.getCommentsData;
        window.addSentComment = this.addSentComment;
        window.ifNotComments = this.ifNotComments;
    }
})

new Vue({
    el: "#comment-editor",
    data: {
        commentEditorDisplay: false,
        chooseButtonDisplay: false,
        comments: {}
    },
    methods: {
        submit: function () {
            var comment = document.getElementById("user-comment").innerText;
            var fileName = document.getElementById("current-file").innerText;
            comment = comment.replace(/\n/g, '<br>');
            axios.post("http://plumk.site:8080/comment", "filename=" + fileName + "&content=" + comment, { headers: { 'token': localStorage.getItem('token') } })
                .then(res => {
                    if (res.data.code == "200") {
                        alert("评论成功");
                        this.chooseButtonDisplay = false;
                        this.commentEditorDisplay = false;
                        if (!ifNotComments()) {
                            addSentComment(localStorage.getItem("username"), comment);
                        }
                    }
                })
                .catch(err => {
                    alert("评论失败");
                    console.log(err);
                })
        },
        cancle: function () {
            this.chooseButtonDisplay = false;
            this.commentEditorDisplay = false;
        },
        showEditor: function () {
            this.chooseButtonDisplay = true;
            this.commentEditorDisplay = true;
        }
    }
})


//文档高度
function getDocumentTop() {
    var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}
//可视窗口高度
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
    var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

//下面我们需要一个监听滚动条的事件
window.onscroll = function () {
    //当滚动条移动马上就出发我们上面定义的事件触发函数,但是我们要求的是滚动条到底后才触发,所以自然这个触发事件里面需要逻辑控制一下.
    if (getScrollHeight() < getWindowHeight() + getDocumentTop() + 30) {
        getCommentsData();
    }
}

getCommentsData();