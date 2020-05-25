/// <reference path="/script/lion.js"/>


function Topo(div) {
    var alllines = {}
    var stage = new lion.Stage(div);
    stage.enableContextMenu(false);
    var scene = stage.currentScene;
    this.callback = {
        onContextmenu:null,
        onLinkCreated:null,
        onDoubleClick:null,

    }
    let topo = this
    

    // Topo.prototype.addNode = function (node, x, y) {
    //     return buildElement(node, x, y);
    // }

    Topo.prototype.addNode = function (node) {
        return buildElement(node);
    }

    Topo.prototype.addLink = function (ele1, ele2,linkdata,color) {
        let link = new lion.LinkElement;
        link.data = linkdata
        link.setStartAndEnd(ele1, ele2,true);
        link.state=false;
        // link.arrowDirection = lion.ArrowDirection.Right;
        // link.arrowSize = 10;
        // link.setStartAndEnd(ele1, ele2, true);
        // link.backgroundColor = color!=null?color:"#000000";

        // link.backgroundColor = color!=null?color:"#000000";
        // highlightColor
        scene.addElement(link);

        // let ele = new lion.CircleElement();
        // ele.shadow = 'rgb(0,0,0)';
        // ele.backgroundColor = 'green';
        // ele.radius = 3;
        // ele.setAnimation(new lion.Animations.PathAnimation(link));
        // scene.addElement(ele);
        alllines[link.id] = link
        return link;
    }
    Topo.prototype.updateLinksState = function (link,istrue) {
        link.state =istrue;
        // console.log(link);
    }

    Topo.prototype.addLinkCircle = function (link) {
        //link上面的动画
      var ele = new lion.CircleElement;
      ele.shadow = 'rgb(0,0,0)';
      ele.backgroundColor = 'red';
      ele.radius = 3;
      ele.state = false;
       //绑定路径
      ele.setAnimation(new lion.Animations.PathAnimation(link));
      scene.addElement(ele);
      return  ele;
    }
    Topo.prototype.setLinkCircleState = function (ele,istrue) {
        ele.state = istrue;
    }
    Topo.prototype.removeLinkCircle = function (ele) {
        scene.remove(ele);
    }

    Topo.prototype.updateElement = function (ele,cfg) {
        for(let i in cfg){
            ele[i] = cfg[i];
        }
    }

    Topo.prototype.center = function(){
        lion.Layout.center(scene.layers.action.elements,scene.layers.action.drawBounds);
    }

    Topo.prototype.onMessage = function(fn){
        this.callback.onMessage = fn
    }
    Topo.prototype.onContextmenu = function(fn){
        this.callback.onContextmenu = fn
    }

    Topo.prototype.onLinkCreated = function(fn){
        this.callback.onLinkCreated = fn
    }

    Topo.prototype.onDoubleClick = function(fn){
        this.callback.onDoubleClick = fn
    }

    //创建元素
    // function buildElement(data, x, y) {

    //     var rect = new lion.RectElement();
    //     rect.eleid = data.id;
    //     rect.backgroundColor = "blue";
    //     rect.foreColor = "#333333";
    //     rect.borderSize = 0;
    //     rect.width = 60;
    //     rect.height = 60;
    //     rect.allowMultiline = true;
    //     rect.data = data;
    //     rect.x = x;
    //     rect.y = y;
    //     rect.align = lion.Align.BottomMiddle;
    //     rect.text = data.caption;
    //     rect.backgroundImageUrl = data.image;
    //     scene.addElement(rect, lion.LayerMode.Action);
    //     rect.initNodes();
    //     return rect;
    // }

    function buildElement(node) {

        var rect = new lion.RectElement();
        rect.eleid =  node.data.id;
        // rect.backgroundColor = "blue";
        //sl
        rect.foreColor = "#333333";
        if( node.data.category=='in'){
           
            // rect.backgroundColor = "#0099cc";//#0099cc  blue
            rect.backgroundColor = "rgba(0,153,204,0.6)";
            rect.highlightColor = "rgba(0,153,204,1)";
        }else if( node.data.category=='out') {
            // rect.backgroundColor = "#66cc66";//#66cc66 green
            rect.backgroundColor = "rgba(102,204,102,0.6)";
            rect.highlightColor = "rgba(102,204,102,1)";
        }else if( node.data.category=="process"){
            // rect.backgroundColor = "#ffcc33";//#ffcc33  yellow
            rect.backgroundColor = "rgba(255,204,51,0.6)";
            rect.highlightColor = "rgba(255,204,51,1)";
        }else{
            rect.backgroundColor = "rgba(0,153,204,0.6)";
            rect.highlightColor = "rgba(0,153,204,1)";
        }
        //sl
      

        rect.borderSize = 0;
        rect.width = 60;
        rect.height = 60;
        rect.allowMultiline = true;
        rect.data = node.data;
        rect.x = node.x;
        rect.y = node.y;
        rect.radius = 5;//圆角
        rect.align = lion.Align.BottomMiddle;
        rect.text =  node.data.caption;
        rect.backgroundImageUrl =  node.data.image;
        scene.addElement(rect, lion.LayerMode.Action);
        rect.initNodes();
        return rect;
    }

    

    scene.onMouseDown(function (e, tscene, target, layout) {
        //clearMenu("contextmenu");
        if (e.button == 2) {
            //点击右键
            //topo.callback.onContextmenu(e,target)

        } else {
            //左键
            if (line.visible) {

            }
        }

        if(topo.callback.onContextmenu){
            topo.callback.onContextmenu(e,target)
        }

    });

    scene.onMouseMove(function (e, target) {
        if (line.visible) {
            line.lineTo(e.offsetX, e.offsetY);

        }

    });

    scene.onMouseUp(function (e, ele, layer) {
        //鼠标弹起
        if (ele) {
            if (line.visible) {
                line.visible = false;

                // if(ele.data.category == 'in'){
                //     topo.callback.onMessage('通道只能建立在输入和输出之间','warn')
                //     return
                // }

                var link = null
                if (beginRALink) {
                    link = new lion.RAngleLinkElement;
                    link.setStartAndEnd(startEle, ele,true);
                } else {
                    link = new lion.LinkElement;
                    link.arrowDirection = lion.ArrowDirection.Right;
                    link.arrowSize = 10;
                    if(startEle.eleid==ele.eleid){
                        console.log("自身禁止形成link连线");
                        return;
                    }
                    link.setStartAndEnd(startEle, ele, true);
                }

                link.backgroundColor = "#000000";
                scene.addElement(link);
                beginRALink = false;
                alllines[link.id] = link
                topo.callback.onLinkCreated(link)
            }

            ele.setEditMode(lion.EditMode.Select);
            ele.hideNodes();
        }

    });

    function clearMenu(contextmenu) {
        let cm = document.getElementById(contextmenu);
        while (cm.children.length > 0)
            cm.children[0].remove();
    }
    //创建菜单
    function buildMenu(contextmenu, target, menus) {
        let cm = document.getElementById(contextmenu);
        for (let i = 0; i < menus.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("actType", menus[i].id);
            li.innerText = menus[i].name;
            li.addEventListener("click", function () {
                fireEvent(target, menus[i]);

                clearMenu(contextmenu);
            });
            cm.appendChild(li);
        }

    }

    var beginRALink = false;
    var startEle;
    var line = new lion.LineElement();
    line.backgroundColor = "#ff0000";
    line.canEvent = false;
    line.visible = false;

    Topo.prototype.fireEvent = function(target, action) {
        if (action == "setting") {
            target.setEditMode(lion.EditMode.Scale);
        } else if (action == "link") {
            scene.addElement(line, lion.LayerMode.Virtual);
            line.visible = true;
            line.setPoint(target.drawBounds.center.x, target.drawBounds.center.y, 100, 100);
            startEle = target;
            
        } else if (action == "rlink") {
            beginRALink = true;
            scene.addElement(line, lion.LayerMode.Virtual);
            line.visible = true;
            line.setPoint(target.drawBounds.center.x, target.drawBounds.center.y, 100, 100);
            startEle = target;
 
        } else if(action =="delComponent"){
            
            for(let i in alllines)
            {
                if( alllines[i].startElement.id == target.id || alllines[i].endElement.id == target.id){
                    scene.remove(alllines[i],lion.LayerMode.Action)
                }
            }

            scene.remove(target,lion.LayerMode.Action)
            
        } else if(action =="delChannel"){
            scene.remove(target,lion.LayerMode.Action)
        } else if(action =="delChannelById"){
            let line = scene.find(lion.LayerMode.Action,function(e){
                return e.data == target
            })
            scene.remove(line,lion.LayerMode.Action)
        }

    }

    

    //设置组件的文本
    Topo.prototype.setText = function(eledataid,text){
        let ele = scene.find(lion.LayerMode.Action,function(e){
            if(e.data.id == eledataid)
                return true
        })
        if(ele){
            ele.text = text
        }
    }

    Topo.prototype.resize = function(){
        stage.resize()
    }
    //获取绘制信息的json
    Topo.prototype.getGraph = function(){
        let graphjson = {
            elements:[],
            links:[]
        }
        scene.foreach(lion.LayerMode.Action,function(ele){
            if(ele instanceof lion.LinkElement){
                let data = {
                    start:ele.startElement.eleid,
                    end:ele.endElement.eleid,
                    channelid:ele.data.id
                }
                graphjson.links.push(data)
            }
            else if(ele instanceof lion.RectElement){
                let data = {
                    x : ele.x,
                    y : ele.y,
                    id:ele.id,
                    category:ele.data.category,
                    dataid:ele.data.id
                }
                graphjson.elements.push(data)
            }
        });

        return graphjson;
    }
    //清空action
    Topo.prototype.clearAll = function(){
        
        scene.clear(lion.LayerMode.Action)
        
    }

    //从绘制信息中加载图形
    Topo.prototype.loadGraph = function(graphjson,callback){
        
        scene.clear(lion.LayerMode.Action)
        if(graphjson == null){
            console.log(scene)    
            return
        }
        let eleMap = {}

        for(let i in graphjson.elements){
            let ele = graphjson.elements[i]
            //通过回调函数从工程文件中找到对应的组件数据
            let data = callback(ele.category,ele.dataid)
            if(data!=null)
                // eleMap[ele.dataid] = this.addNode(data,ele.x,ele.y)
                eleMap[ele.dataid] = this.addNode({'data':data,'x':ele.x,'y':ele.y})
        }

        for(let i in graphjson.links){
            let link = graphjson.links[i]
            let linkdata = callback('channel',link.channelid)
            //if(linkdata!=null)
                this.addLink(eleMap[link.start],eleMap[link.end],linkdata)
        }
    }
    Topo.prototype.updateLink = function(linkid,text){
        //alllines[linkid].setTextBlock("数据："+text,lion.Align.Center);
        alllines[linkid].text = "数据："+text
    }

    Topo.prototype.getLinks = function(){
        return alllines;
    }

};