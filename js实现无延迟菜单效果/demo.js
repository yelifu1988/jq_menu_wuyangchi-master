$(document).ready(function () {
    // alert("hello!");
    var sub = $('#sub');
    // console.log(sub);
    var activeRow;
    var activeMenu;
    var timer;
    var mouseInSub = false;//标识鼠标是否在菜单里
    sub.on("mouseenter", function (e) {
        mouseInSub = true;//在菜单里
    }).on('mouseleave', function (e) {
        mouseInSub = false;//不在菜单里
    })

    var mouseTrack = []	//追踪鼠标位置
    var moveHanlder = function (e) {	//获取鼠标相对于页面的坐标
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })
        //因为我们只需要当前的位置和上一次的位置 所以 多余的直接删除
        if (mouseTrack.length > 3) {
            mouseTrack.shift()	//mouseTrack数组里只留了上一次和最后一次的位置信息
        }
    }


    $("#test")
        .on('mouseenter', function (e) {
            sub.removeClass('none');
            $(document).bind('mousemove', moveHanlder)//记录鼠标位置

        })
        .on('mouseleave', function (e) {
            console.log('fire mouse leave')
            sub.addClass("none");
            if (activeRow) {

                //如果存在一级菜单激活
                activeRow.removeClass('active');
                //去除样式一级菜单的active样式
                activeRow = null;
            }
            if (activeMenu) {
                //如果存在二级菜单激活
                activeMenu.addClass('none')
                //给二级菜单添加none样式
                activeMenu = null
            }

            $(document).unbind('mousemove', moveHanlder)//解绑，以免影响其他组件

        })
        .on('mouseenter', 'li', function (e) {
            if (!activeRow) {
                activeRow = $(e.target)
                activeRow.addClass('active')
                activeMenu = $('#' + activeRow.data('id'))
                activeMenu.removeClass('none')
                return
            }

            //setTimeout设置延迟
            //debounce去抖技术
            if (timer) {//如果该元素定时器还没有执行就清除，不执行定时器里的内容
                clearTimeout(timer);
            }

            var currMousePos = mouseTrack[mouseTrack.length - 1]	//鼠标当前点的坐标  p点坐标（判断 p 是不是在三角形内）
            var leftCorner = mouseTrack[mouseTrack.length - 2]		//上一次的鼠标坐标
            var delay = needDelay(sub, leftCorner, currMousePos)

            if (delay) {	//如果在三角形内 ，需要延迟
                timer = setTimeout(function () {
                    if (mouseInSub) {//如果在菜单里，不处理直接返回
                        return
                    }
                    activeRow.removeClass('active')
                    activeMenu.addClass('none')

                    activeRow = $(e.target)
                    activeRow.addClass('active')
                    activeMenu = $('#' + activeRow.data('id'))
                    activeMenu.removeClass('none')
                    timer = null
                }, 300)
            } else {
                var prevActiveRow = activeRow;
                var prevActiveMenu = activeMenu;

                activeRow = $(e.target)
                activeMenu = $('#' + activeRow.data('id'))

                prevActiveRow.removeClass('active')
                prevActiveMenu.addClass('none')

                activeRow.addClass('active')
                activeMenu.removeClass('none')

            }


        })
})