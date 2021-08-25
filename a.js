
//根据数值对应不同的颜色
let colors={2:"rgb(255,240,180)",4:"#ffe200",8:"#ceff00",16:"#ffaa00",32:"#ff7c00",64:"#ff4400",128:"#aaff00",256:"#0cff00",512:"#0049ff",1024:"#d300ff",2048:"#ff0068"}
//二维数组m存储地图的数字
let m=new Array(16)
//只有当moveBool为0时，按键才有效
let moveBool=0;
//初始化
let score=0;
let best=0;
let scoreDom=document.querySelectorAll('.score');
function init(){
  //初始化每一个位置的数字和颜色
  for(let i=0;i<16;i++){
    m[i]=0;
  }
  best=localStorage.getItem("best")
  if(!best)best=0;
  scoreDom[1].innerHTML=best.toString()
}
init()



//新建一个游戏
function newGame(){
  for(let i=0;i<16;i++){
    m[i]=0;
  }
  score=0;
  scoreDom[0].innerHTML=score.toString()
  newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
  newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
}

//当一个位置的数字改变时,改变数字
function newNum(pos,num){
  m[pos]=num;
  newNumAction(pos,num)
}
//随机新生成一个数字,返回一个随机位置（0-15）
function randomNumber(){
  //arr保存空位的位置
  let arr=[]
  //先检测有哪些空位，并把这些空位插入到arr中
  for(let i=0;i<16;i++){
    if(m[i]==0)arr.push(i);
  }
  //没有空位则游戏结束
  if(arr.length==0){
    alert("游戏结束，您的得分是"+score)
    best=Math.max(best,score)
    localStorage.setItem("best",best)
    scoreDom[1].innerHTML=best.toString()
    return -1;
  }
  return arr[parseInt(Math.random()*arr.length)]
}
//新的数值动画
function newNumAction(pos,num){
  if(pos==-1)return
  let nodeCss=`font-size: 40px;
  background-color:${colors[num]};
  position:absolute;
  height: 100px;
  width: 100px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  color: rgb(73, 73, 73);`
  let li = document.querySelectorAll("li")
  let cloli = li[0].cloneNode(true)
  cloli.style=nodeCss
  cloli.innerText=num
  let h=0,w=0,f=0;//分别代表高度，宽度，字体大小
  document.body.appendChild(cloli)
  let inte = setInterval(()=>{
    h+=10;
    w+=10;
    f+=4;
    cloli.style.top = li[pos].offsetTop+li[pos].offsetHeight/2-h/2+'px';
    cloli.style.left=li[pos].offsetLeft+li[pos].offsetWidth/2-w/2+'px';
    cloli.style.fontSize=f.toString()+'px';
    cloli.style.width=w.toString()+'px'
    cloli.style.height=h.toString()+'px'
    if(h==120){
      //循环完之后删除
      li[pos].innerText=num;
      li[pos].style.backgroundColor=colors[num];
      document.body.removeChild(cloli)
      for(let i=0;i<16;i++){
        if(m[i]==0){
          li[i].innerText=""
          li[i].style.backgroundColor="rgba(231, 222, 197, 0.89)"
        }
      }
      
      clearInterval(inte);
    }
  },10)
  
  
}

//增加分数
function addScore(num){
  score+=num;
  let score1=document.querySelectorAll('.score')
  score1[0].innerHTML=score.toString()
}


//移动的动画
function moveNumAction(pos,pos2,start,end,dire,mul=false)//分别代表位置，起点的行列号，终点的行列号，方向
{
  let nodeCss=`font-size: 40px;
  background-color:${colors[m[pos]]};
  position:absolute;
  height: 100px;
  width: 100px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  color: rgb(73, 73, 73);`
  if(start==end)return;
  //起点到终点的距离
  let sum = Math.abs(end-start)*110;
  let li = document.querySelectorAll("li")
  let cloli = li[pos].cloneNode(true)
  cloli.style=nodeCss
  cloli.innerText=m[pos]
  document.body.appendChild(cloli)
  cloli.style.top = li[pos].offsetTop+'px'
  cloli.style.left = li[pos].offsetLeft+'px'
  //规定无论多长的距离，都是200ms跑到终点
  li[pos].innerText=""
  li[pos].style.backgroundColor="rgba(231, 222, 197, 0.89)"
  let num=m[pos];m[pos]=0;
  moveBool++;
  let inte = setInterval(() => {
    sum-=10;
    if(dire==1){
      cloli.style.top=cloli.offsetTop-10+'px'
    }
    else if(dire==2){
      cloli.style.top=cloli.offsetTop+10+'px'
    }
    else if(dire==3){
      cloli.style.left=cloli.offsetLeft-10+'px'
    }
    else if(dire==4){
      cloli.style.left=cloli.offsetLeft+10+'px'
    }
    
    if(sum==0){
      li[pos2].innerText=num;
      li[pos2].style.backgroundColor=colors[num];
      m[pos2]=num;
      document.body.removeChild(cloli)
      if(mul){
        newNum(pos2,num*2)
        addScore(num*2)
      }
      moveBool--;
      clearInterval(inte)
    }
    }, 5);
  
    
  
}

//判断移动位置
function movePos(dire){
  //arr存储新的地图
  let arr=new Array(4);
  //arr2存储某个位置是否已经做过相加
  let arr2=new Array(4);
  for(let i=0;i<4;i++){
    arr[i]=[0,0,0,0]
    arr2[i]=[0,0,0,0];
  }
  let x,y;
  //上
  if(dire==1)
  {
    for(let i=0;i<16;i++){
      if(m[i]!=0){
        x=parseInt(i/4);y=i%4;
        let p=-1;
        //先找到距离这个点最近的有值的点,p记录下标
        for(let j=0;j<4;j++){
          if(arr[j][y]!=0)p=j;
          else break;
        }
        //没找到数
        if(p==-1){
          arr[p+1][y]=m[i];
          moveNumAction(i,(p+1)*4+y,x,p+1,1)
        }
        //找到数
        else{
          //可以合成
          if(arr[p][y]==m[i]&&arr2[p][y]==0){
            arr2[p][y]==1;
            arr[p][y]*=2;
            moveNumAction(i,p*4+y,x,p,1,true)
            
          }
          //无法合成
          else{
            arr[p+1][y]=m[i];
            moveNumAction(i,(p+1)*4+y,x,p+1,1)
          }
        }
  
      }
    }
  }
  //下
  else if(dire==2){
    for(let i=15;i>=0;i--){
      if(m[i]!=0){
        x=parseInt(i/4);y=i%4;
        let p=-1;
        //先找到距离这个点最近的有值的点,p记录下标
        for(let j=3;j>=0;j--){
          if(arr[j][y]!=0)p=j;
          else break;
        }
        //没找到数
        if(p==-1){
          arr[3][y]=m[i];
          moveNumAction(i,3*4+y,x,3,2)
        }
        //找到数
        else{
          //可以合成
          if(arr[p][y]==m[i]&&arr2[p][y]==0){
            arr2[p][y]==1;
            arr[p][y]*=2;
            moveNumAction(i,p*4+y,x,p,2,true)
            
          }
          //无法合成
          else{
            arr[p-1][y]=m[i];
            moveNumAction(i,(p-1)*4+y,x,p-1,2)
          }
        }
  
      }
    }
  }
  //左
  else if(dire==3){
    for(let i=0;i<16;i++){
      if(m[i]!=0){
        x=parseInt(i/4);y=i%4;
        let p=-1;
        //先找到距离这个点最近的有值的点,p记录下标
        for(let j=0;j<=3;j++){
          if(arr[x][j]!=0)p=j;
        }
        //没找到数
        if(p==-1){
          arr[x][0]=m[i];
          moveNumAction(i,x*4,y,0,3)
        }
        //找到数
        else{
          //可以合成
          if(arr[x][p]==m[i]&&arr2[x][p]==0){
            arr2[x][p]==1;
            arr[x][p]*=2;
            moveNumAction(i,x*4+p,y,p,3,true)
            
          }
          //无法合成
          else{
            arr[x][p+1]=m[i];
            moveNumAction(i,x*4+p+1,y,p+1,3)
          }
        }
  
      }
    }
  }
  //右
  else {
    for(let i=15;i>=0;i--){
      if(m[i]!=0){
        x=parseInt(i/4);y=i%4;
        let p=-1;
        //先找到距离这个点最近的有值的点,p记录下标
        for(let j=3;j>=0;j--){
          if(arr[x][j]!=0)p=j;
        }
        //没找到数
        if(p==-1){
          arr[x][3]=m[i];
          moveNumAction(i,x*4+3,y,3,4)
        }
        //找到数
        else{
          //可以合成
          if(arr[x][p]==m[i]&&arr2[x][p]==0){
            arr2[x][p]==1;
            arr[x][p]*=2;
            moveNumAction(i,x*4+p,y,p,4,true)
            
          }
          //无法合成
          else{
            arr[x][p-1]=m[i];
            moveNumAction(i,x*4+p-1,y,p-1,4)
          }
        }
  
      }
    }
  }
}

document.onkeydown = function(event){
  let e = event || window.event || arguments.callee.caller.arguments[0];
  //上
  if(moveBool!=0)return;
  if(e && e.keyCode==38){
    movePos(1)
    setTimeout(() => {
      newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
    }, 200);
  }
  //下
  else if(e && e.keyCode==40){
    movePos(2)
    setTimeout(() => {
      newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
    }, 200);
  }
  //左
  else if(e && e.keyCode==37){
    movePos(3)
    setTimeout(() => {
      newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
    }, 200);
  }
  //右
  else if(e && e.keyCode==39){
    movePos(4)
    setTimeout(() => {
      newNum(randomNumber(),parseInt(Math.random()*2)==0?2:4)
    }, 200);
  }
}