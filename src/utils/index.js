// import { Message, Notice } from 'iview'

const util = {
  title (title) {
    // title = title ? title + ' - PDMI NewMedia' : 'PDMI NewMedia'
    title = title ? title + ' - PDMI Live' : 'PDMI Live'
    window.document.title = title
  },
  // showMessage (res) {
  //   res.data.status == 1 ? Message.success(res.data.message) : Message.error(res.data.message)
  // },
  // showSuccess (msg) {
  //   Message.success(msg)
  // },
  // showError (msg) {
  //   Message.error(msg)
  // },
  // showNotification (res) {
  //   res.data.status == 1 ? Notice.success({
  //     title: '操作成功',
  //     duration: 2000,
  //     desc: res.message
  //   }) : Notice.error({
  //     title: '操作失败',
  //     duration: 2000,
  //     desc: res.message
  //   })
  // },
  // 获取树的指定属性的值节点
  findTreeNode (tree, key, val, childName) {
    var result = null

    for (var i = 0; i < tree.length; i++) {
      if (tree[i][key] === val) {
        result = tree[i]
        break
      }

      if (tree[i][childName] && tree[i][childName].length) {
        var tmp = this.findTreeNode(tree[i][childName], key, val, childName)

        if (tmp) {
          result = tmp
          break
        }
      }
    }

    return result
  },
  // 获取树的指定属性的值节点的父节点
  findTreeParentNode (tree, key, val, childName) {
    let result = null

    for (var i = 0; i < tree.length; i++) {
      if (tree[i][key] === val) {
        result = tree[i]
        break
      }

      if (tree[i][childName] && tree[i][childName].length) {
        var tmp = this.findTreeParentNode(tree[i][childName], key, val, childName)

        if (tmp) {
          if (tmp[key] === val) {
            result = tree[i]
            console.log(result)
          } else {
            result = tmp
          }
          break
        }
      }
    }

    return result
  },
  // 树节点的数量
  treeNodeSize (tree, childName) {
    let result, child = []

    for (var i = 0; i < tree.length; i++) {
      if (tree[i][childName] && tree[i][childName].length) {
        let tmp = this.treeNodeSize(tree[i][childName], childName)

        child.push(tmp)
      }
    }

    let childTotal = child.reduce(function (sum, value) {
      return sum + value
    }, 0)

    result = i + childTotal

    return result
  },
  validateForm (formRef) {
    return new Promise((resolve, reject) => {
      formRef.validate((valid) => {
        if (valid) {
          return resolve(true)
        }
        return reject(false)
      })
    })
  },
   // 计算图片宽高比
  autoSize(imgSrc,maxW,maxH){
    let imgStyle = {
      width:maxW,
      height:maxH
    }
    let image  = new Image();
    image.src = imgSrc
    if(image.width < maxW && image.height < maxH){
      imgStyle.width = image.width
      imgStyle.height = image.height
    }else {
      if (maxW / maxH <= image.width / image.height) {
        imgStyle.width = maxW;
        imgStyle.height = maxW*(image.height / image.width)
      }else{
        imgStyle.width = maxH*(image.width/image.height);
        imgStyle.height = maxH
      }
    }
    return imgStyle
  },
  urlJoin (baseURL, path) {
    baseURL = baseURL.startsWith('http://') ? baseURL : `http://${baseURL}`
    baseURL = baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL
    path = path.startsWith('/') ? path : `/${path}`

    return `${baseURL}${path}`
  },
  loadCSS (url, insertBefore) {
    var l = document.createElement('link')
    l.setAttribute('rel', 'stylesheet')
    l.setAttribute('type', 'text/css')
    l.setAttribute('href', url)
    if (insertBefore) {
      if (insertBefore.nodeName && insertBefore.nodeType === 1) {
        return document.head.insertBefore(l, insertBefore)
      }
      document.head.insertBefore(l, document.head.firstElementChild)
    } else {
      document.head.appendChild(l)
    }
  },
  loadJS (url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script')
      s.setAttribute('src', url)
      document.head.appendChild(s)
      s.onload = resolve
      s.onerror = reject
    })
  },
  // 简单的深度克隆，skip为要跳过的属性名
  assign (object, sources, skip) {
    // debugger;
    for (let p in sources) {
      if (sources.hasOwnProperty(p) && p !== skip) {
        let o = sources[p]
        if (o && Array.isArray(o)) {
          object[p] = util.assign([], o, skip)
        } else if (o && typeof o === 'object' && o.constructor === Object) {
          object[p] = util.assign({}, o, skip)
        } else {
          object[p] = sources[p]
        }
      }
    }
    return object
  },
  getAqqtabs(){
    let path ='';
    if(this.$route.path.lastIndexOf('/')>0){
      path = this.$route.path.substring(0,this.$route.path.lastIndexOf('/'));
    }else{
      path = this.$route.path;
    }
    this.$http.get('api/user/menu/son?path='+path).then(res=>{
      if(res.data.status == 1 && res.data.menu && res.data.menu.length){
        let arr = res.data.menu;
        let obj = {};
        let currentPath = arr[0].path;
        let flag = false;
        let matchArr = []
        for(let i=0;i<arr.length;i++){
          arr[i].match = arr[i].match.split(',');
          if(arr[i].name == 'fanslist'){
            arr[i].match.push('/fans/addfans')
          }
          arr[i].disabled = false;
          obj[arr[i].name] = arr[i];
          matchArr = matchArr.concat(arr[i].match);
        }
        this.appTabs = obj;
        this.$router.push({
          path: matchArr.indexOf(this.$route.path) >= 0 ? this.$route.path : currentPath,
          query:this.$route.query
        })
      }
    })
  },
  // 获取网页地址中的参数
  getParamURL(paramName){
    let paramValue = "";
    let isFound = false;
    let url = window.location.href
    let _start = url.indexOf("?")
    // console.log('url: '+url)
    if (url.indexOf("?") > 0 && url.indexOf("=") > 1) {
      // var arrSource = decodeURI(url).substring(1, url.length).split("&");
      let arrSource = decodeURI(url).substring(_start+1, url.length).split("&");
      let i = 0;
      while (i < arrSource.length && !isFound) {
          if (arrSource[i].indexOf("=") > 0) {
              if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                  paramValue = arrSource[i].split("=")[1];
                  isFound = true;
              }
          }
          i++;
      }
    }
    return paramValue;
  },
  getNowtime(){
      let now = new Date;
      let h = now.getHours();
      let mm = now.getMinutes();
      let str;
      if(h>12) {
          h -= 12;
          str = " PM";
      }else{
          str = " AM";
      }
      // h = h < 10 ? "0" + h : h;
      mm = mm < 10 ? "0" + mm : mm;
      var xy =  h + ":" + mm ;
      xy += str;

      return xy
    },
    // 时间戳转换为时间,使用formatTime(1545903266795, 'Y年M月D日 h:m:s')或者formatTime(1545903266795, 'Y-M-D h:m:s')即可
    formatNumber (n) {
        n = n.toString()
        return n[1] ? n : '0' + n;
    },
    formatTime (number, format) {
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(this.formatNumber(time.getMonth() + 1))
    newArr.push(this.formatNumber(time.getDate()))

    newArr.push(this.formatNumber(time.getHours()))
    newArr.push(this.formatNumber(time.getMinutes()))
    newArr.push(this.formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
}
}

export default util
