(function(win, doc){
    win.lsl = win.lsl || {}


    lsl.Plugins = function(){
        self.params = {
            'title' : '标题',
            'desc' : '描述',
            'btnSure' : '确定'
        }
    }

    lsl.Plugins.prototype={
        constructor : lsl.Plugins,

        createEle : function(opt){
            var el = document.createElement('div')
            el.className = opt.classname || ''
            el.innerHTML = opt.html || ''

            return el
        },

        createMask : function(opt){
            return this.createEle({
                classname : 'm-plugin-mask'
            })
        },

        alert : function(opt){

            var params = null;
            if(typeof(opt) == 'string'){
                self.params.desc = opt
            }
            else if(typeof(opt) == 'object'){
               for(i in opt){
                    self.params[i] = opt[i]
                } 
            }
                
            var el = this.createEle({
                classname : 'm-plugin m-alert',
                html : '<div class="title">' + self.params.title + '</div>'
                        +'<div class="desc">' + self.params.desc +'</div>'
                        +'<button class="btn">' + self.params.btnSure+ '</button>'
            })

            var mask = this.createMask();

            doc.body.append(mask)
            doc.body.append(el)

            el.addEventListener('click', handler, false)


            function handler(e){
                var target = e.target
                if(target.classList.contains('btn')){
                    el.classList.add('z-disable')
                    el.addEventListener('animationend', destroy, false)
                }
            }

            function destroy(){
                doc.body.removeChild(mask)
                doc.body.removeChild(el)
                el.removeEventListener('click', handler, false)
                el.removeEventListener('animationend', destroy, false)
                if(self.params.callback) self.params.callback()
            }
        },

        toast : function(opt){
            var params = null;
            if(typeof(opt) == 'string'){
                self.params.desc = opt
            }
            else if(typeof(opt) == 'object'){
               for(i in opt){
                    self.params[i] = opt[i]
                } 
            }
                
            var el = this.createEle({
                classname : 'm-plugin m-toast',
                html : '<div class="title">' + self.params.title + '</div>'
                        +'<div class="desc">' + self.params.desc +'</div>'
            })

            var mask = this.createMask();

            doc.body.append(mask)
            doc.body.append(el)


            setTimeout(handler, 1000 * 0.8)

            function handler(){
                el.classList.add('z-disable')
                el.addEventListener('animationend', destroy, false)
            }

            function destroy(){
                doc.body.removeChild(mask)
                doc.body.removeChild(el)
                el.removeEventListener('click', handler, false)
                el.removeEventListener('animationend', destroy, false)
                if(self.params.callback) self.params.callback()
            }

        }
    }

})(window, document);