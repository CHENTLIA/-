;(function (window, document) {
    var defaultOptions = {
    
    }  
    function addZero(num) {  
        if(num>0&&num<10){
            num="0"+num
        }
        return num
    }
    var datePicker = function (targetDom, options) {  
        if(!this instanceof datePicker) {
            return new datePicker(targetDom, options)
        }
        // console.log(options)
        var self = this;
        self = Object.assign(self, options, defaultOptions)
        // console.log(self)
        if((typeof targetDom) === 'string') {
            self.targetDom = document.querySelector(targetDom)
        } else {
            self.targetDom = targetDom
        }
        // console.log(self)
        // self.callback = function () { };
        // self.callback = 
        // if(options.callback)
        self.cb = function () { };
        if(self.callback && typeof self.callback === 'function'){
            self.cb = self.callback
        }
        self.targetDom.value = new Date(self.time).getFullYear()+'-'+addZero((new Date(self.time).getMonth()+1))+'-'+addZero(new Date(self.time).getDate())
        self.cb({year:new Date(self.time).getFullYear(), month:addZero((new Date(self.time).getMonth()+1)), date:addZero(new Date(self.time).getDate())})
        var dateBox = document.createElement('div')
        var oHead = document.createElement('div')
        var dateBoxW = document.createElement('div')
        var oWeek = document.createElement('div')
        // 输入
        var oInput = document.createElement('div')
        // var oSubmit = document.createElement('div')
        self.oHead = oHead
        self.oHead.className = 'ohead'
        self.dateBoxW = dateBoxW
        self.dateBox = dateBox
        self.oInput = oInput
        self.oInput.className = 'date-now'
        self.oInput.innerHTML = '<button class="current-date">当前</button><button class="date-submit">确定</button>'
        self.dateBoxW.className = 'dateBoxW'
        self.dateBox.className = 'dateBox'
        //weekday
        self.oWeek = oWeek;
        self.oWeek.className = 'oweek'
        //submit保存
        // self.oSubmit = oSubmit;
        // self.oSubmit.className = 'oSubmit'
        // self.oSubmit.innerHTML = '<input class="submit" type="submit" value="保存"><input class="reset" type="reset" value="清除">';
        self.dateBoxW.appendChild(self.oHead)
        self.dateBoxW.appendChild(self.oWeek)
        self.dateBoxW.appendChild(self.dateBox)
        self.dateBoxW.appendChild(self.oInput)
        // self.dateBoxW.appendChild(self.oSubmit)
        self.targetDom.parentNode.appendChild(self.dateBoxW)  
          
        //方向切换月份
        var oPrev = document.createElement('span')
        oPrev.innerHTML = '<i class="iconfont icon-previous"></i>'
        self.oPrev = oPrev
        var oNext = document.createElement('span')
        oNext.innerHTML = '<i class="iconfont icon-next"></i>'
        self.oNext = oNext
        self.oNext.className = 'tabM tabNext'
        self.oPrev.className = 'tabM tabPrev'
        
        self.c_year = self.year = new Date().getFullYear()
        self.c_month = self.month = new Date().getMonth()
        // console.log(self.c_month)
        self.date = new Date().getDate()
        self.targetDom.addEventListener('click', function (e) {  
            // if(document.)
            self.dateBoxW.style.display = 'block'
            e.stopPropagation()
           
            self.init()
            self.dateBoxW.onclick = function (e) {  
                e.stopPropagation()
            }
            document.body.onclick = function (e) {  
                e.stopPropagation()
                if(self.getId('year-all')){
                    self.getId('year-all').remove()
                }
                if(self.getId('month-all')) {
                    self.getId('month-all').remove()
                }
                self.baseShow()
                self.dateBoxW.style.display = 'none'
            }
        })
    }
    datePicker.prototype = {
        init(){
            var self = this;
            self.allWays(self.year, self.month)
            self.getClass('current-date')[0].addEventListener('click', function(e) {
                self.date = new Date().getDate()
                self.targetDom.value = self.c_year + '-' + addZero(self.c_month+1) +'-'+ addZero(self.date)
                // console.log('aaa')
                self.fillDate(self.c_year, self.c_month)
                self.year = self.c_year
                self.month = self.c_month
            })
            self.next()
            self.prev()
            self.submit()
        },
        fillDate: function (year, month) {
            var self = this;
            self.oWeek.innerHTML = '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>'; 
            // console.log(year+'-'+month+1+'-'+self.date)
            // 获取本月第一天是周几
            var firstDay = new Date(year, month, 1).getDay()
            // 如果是周日，在上面再加一行
            firstDay = firstDay == 0? firstDay=7:firstDay;
            var finalDay = new Date(year, month+1, 0).getDate()
            var lastDate = new Date(year, month, 0).getDate()
            surplus = 42 - firstDay - finalDay
            if(firstDay >= 7) {
                firstDay = firstDay - 7
            }
            if(surplus >= 7) {
                surplus = surplus - 7
            }
            self.oHead.innerHTML = '<span class="year">'+year+'</span>年<span class="month">'+(month+1)+'</span>月'
            if(self.oNext&&self.oPrev) {
                self.oHead.appendChild(self.oPrev)
                self.oHead.appendChild(self.oNext)
            }
            var html = ''
            for(var i = 0; i< firstDay; i++) {
                html+= '<span class="gray">'+(lastDate-(firstDay-1)+i)+'</span>'
            }
            //本月
            for(var j = 0; j< finalDay;j++) {
                if(j+1 === self.date) {
                    html+='<span class="date-on">'+(j+1)+'</span>'
                }else {
                    html+='<span>'+(j+1)+'</span>'
                }
            }
            
            //下月
            for(var k = 0; k < surplus; k++){
                html+='<span class="gray">'+(k+1)+'</span>'
            }
            // 当前
            self.dateBox.innerHTML = html;
        },
        // 选择时间
        checkDate: function () {  
            var self = this;
            var arr = self.getClass('dateBox')[0].getElementsByTagName('span');
            var str;
            for(let i = 0; i < arr.length; i++) {
                arr[i].onclick = function () { 
                    for(var j = 0; j < arr.length; j++) {
                        arr[j].classList.remove('date-on')     
                    } 
                    if(i == new Date(self.year, self.month, 1).getDay()+self.date-1) {
                        self.date = parseInt(arr[i].innerText)
                        self.targetDom.value = self.year + '-' + addZero(self.month+1) +'-'+ addZero(arr[i].innerText)
                    }else if( i < new Date(self.year, self.month, 1).getDay()){

                    } else if(i >= new Date(self.year, self.month+1, 0).getDate()+new Date(self.year, self.month, 1).getDay()){

                    }
                    else{
                        arr[i].classList += 'date-on'
                        
                        str = arr[i].innerText;   
                        self.date = parseInt(arr[i].innerText)
                        self.targetDom.value = self.year + '-' + addZero(self.month+1) +'-'+ addZero(arr[i].innerText)
                    }
                }
                arr[i].ondblclick = function () { 
                    for(var j = 0; j < arr.length; j++) {
                        arr[j].classList.remove('date-on')
                    } 
                    if(i == new Date(self.year, self.month, 1).getDay()+self.date-1) {
                        self.date = parseInt(arr[i].innerText)
                        self.targetDom.value = self.year + '-' + addZero(self.month+1) +'-'+ addZero(arr[i].innerText)
                        self.cb({year:self.year, month:addZero(self.month+1), date:addZero(self.date)})
                    }else if( i < new Date(self.year, self.month, 1).getDay()){

                    } else if(i >= new Date(self.year, self.month+1, 0).getDate()+new Date(self.year, self.month, 1).getDay()){

                    }
                    else{
                        arr[i].classList += 'date-on'
                        str = arr[i].innerText;   
                        self.date = parseInt(str)
                        // console.log(self.date)
                        self.targetDom.value = self.year + '-' + addZero(self.month+1) +'-'+ addZero(arr[i].innerText)
                        self.cb({year:self.year, month:addZero(self.month+1), date:addZero(self.date)})
                    }
                    
                    self.dateBoxW.style.display = 'none'
                }
                
            }
            // console.log(str)
            return str
            
        },
        // 下月
        next: function () {  
            var self = this
            self.oNext.onclick = function () {  
                self.month++;
                if(self.month >11) {
                    self.month = 0;
                    self.year++
                }
                self.allWays(self.year, self.month)
            }
        },
        // 上月
        prev: function () {  
            var self = this
            self.oPrev.onclick = function () {  
                self.month--;
                if(self.month < 0) {
                    self.month = 11;
                    self.year--
                }
                self.allWays(self.year, self.month)
            }
        },
        // 年份点击并选择
        yearClick: function (data,direction) {  
            var self = this;
            if(data) {
                self.year = data
            } else{
                
            }
            var str = ''
            var yearArr = []
            // console.log(self.year)
            for(var i = 0; i < 5; i++){
                yearArr.unshift(self.year - i);
            }
            for(var j = 1; j < 5; j++){
                yearArr.push(self.year + j);
            }
            // console.log(yearArr)
            for(var i = 0; i < yearArr.length; i++) {
               
                if(self.year === yearArr[i]){
                    str+="<li class='currentYear'>" + yearArr[i] + "</li>"
                }else {
                    str+="<li class='commonYear'>"+yearArr[i]+"</li>"
                }
                
            } 
            // console.log(yearArr)
            if(self.getId('month-all') && self.getId('month-all').style.display == 'block'){   
                self.getId('month-all').style.display = 'none'
            }
            self.addYearOrMonth('year', str)
            self.baseHide()
            // console.log(yearArr[0])
            self.tabYear(yearArr[Math.ceil(yearArr.length/2)])
            self.selectYear()
        },
        selectYear: function () {  
            var self = this;
            var oLi = self.getClass('year-list')[0].getElementsByTagName('li')
            var len = oLi.length
            // console.log(len)
            for(var i = 0; i < len; i++) {
                var k = i;
                (function(k){
                    oLi[k].onclick = function () {  
                        self.year = parseInt(oLi[k].innerHTML)
                        self.allWays(self.year, self.month)
                        self.getId('year-all').remove()
                        self.baseShow()
                    }
                })(k)
            }
        },
        tabYear(data,direction) {
            var self = this;
            self.getClass('prev-year')[0].addEventListener('click', function () {  
                self.getId('year-all').remove()
                self.yearClick(data-5)
            })
            self.getClass('next-year')[0].addEventListener('click', function () {  
                self.getId('year-all').remove()
                self.yearClick(data+3)
            })
        },
        // 月份点击并选择
        monthClick: function () {  
            var self = this;
            var str = ''
            for(var i = 1; i <= 12; i++) {
                str+="<li>"+i+"</li>"
            } 
            self.addYearOrMonth('month', str)
            self.baseHide()
            self.selectMonth()
        },
        selectMonth: function () {  
            var self = this;
            var oLi = self.getClass('month-all')[0].getElementsByTagName('li')
            var len = oLi.length
            for(var i = 0; i < len; i++) {
                var k = i;
                (function(k){
                    oLi[k].onclick = function () {  
                        self.month = k
                        self.allWays(self.year, self.month)
                        self.getId('month-all').style.display = 'none'
                        self.baseShow()
                    }
                })(k)
            }
        },
        submit: function () {  
            var self = this;
            self.getClass('date-submit')[0].addEventListener('click', function () {  
                self.targetDom.value = self.year + '-' + addZero(self.month+1) +'-'+ addZero(self.date)
                self.dateBoxW.style.display = 'none'
                self.cb({year:self.year, month:addZero(self.month+1), date:addZero(self.date)})
                // console.log(self.cb)
            })
        },
        // 某些共同的方法
        allWays: function (year, month) {  
            var self = this
            self.fillDate(year, month)
            self.checkDate()
            self.year_month_clickLive()
        },
        // 获取class
        getClass: function (name) {  
            return document.getElementsByClassName(name)
        },
        // 获取ID
        getId: function (name) {  
            return document.getElementById(name)
        },
        // 共同的显示与隐藏
        baseShow: function () { 
            var self = this 
            self.oHead.style.display = 'block'
            self.oWeek.style.display = 'block'
            self.dateBox.style.display = 'block'
            self.oInput.style.display = 'block'
        },
        baseHide: function () {  
            var self = this;
            self.oHead.style.display = 'none'
            self.oWeek.style.display = 'none'
            self.dateBox.style.display = 'none'
        },
        // 添加年月
        addYearOrMonth: function (yOrM,str) {  
            var self = this;
            self.yOrMAll = document.createElement('div')
            self.yOrMHead = document.createElement('p')
            self.yOrMList = document.createElement('ul')
            self.yOrMHead.className = 'select-head'
            self.yOrMList.innerHTML = str
           
            if(yOrM == 'month'){
                self.yOrMHead.innerHTML = '选择月份'
                self.yOrMAll.className = 'month-all'
                self.yOrMAll.id = 'month-all'
                self.yOrMList.className = 'month-list'
            }  
            if(yOrM == 'year'){
                self.yOrMHead.innerHTML = '选择年份'
                self.yOrMAll.className = 'year-all'
                self.yOrMAll.id = 'year-all'
                self.yOrMList.className = 'year-list'
                self.tabOther = '<div class="prev-year tab-year"><i class="iconfont icon-previous"></i></div><div class="next-year tab-year"><i class="iconfont icon-next"></i></div>'
                self.yOrMList.innerHTML+=self.tabOther
            }
            self.yOrMAll.appendChild(self.yOrMHead)
            self.yOrMAll.appendChild(self.yOrMList)
            self.dateBoxW.appendChild(self.yOrMAll)
        },
        // 年份月份激活
        year_month_clickLive() {
            var self = this
            self.getClass('year')[0].addEventListener('click', function() {
                self.yearClick()
                self.tabYear()
                self.oInput.style.display = 'none'
                self.selectYear()
            })
            self.getClass('month')[0].addEventListener('click', function() {
                self.monthClick()
                self.oInput.style.display = 'none'
                self.selectMonth()
            })
        }
    }
    window.datePicker = datePicker
}(window, document))