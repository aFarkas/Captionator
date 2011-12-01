
/*
	Captionator 0.6 [CaptionPlanet]
	Christopher Giffard, 2011
	Share and enjoy

	https://github.com/cgiffard/Captionator
*/
/*global HTMLVideoElement: true, NodeList: true, Audio: true, HTMLElement: true, document:true, window:true, XMLHttpRequest:true, navigator:true, VirtualMediaContainer:true */
/*jshint strict:true */
/*Tab indented, tab = 4 spaces*/



(function(){"use strict";var a=10,b=16,c=4.5,d=1.5,e=[0,0,0,.5],f=!1,g={};window.captionator=g,g.CaptionatorCueStructure=function(a,b){var c=this;this.isTimeDependent=!1,this.cueSource=a,this.options=b,this.processedCue=null,this.toString=function d(d){if(b.processCueHTML!==!1){var e=function(a,b){if(c.processedCue===null){var f="",g,h;for(g in a)if(g.match(/^\d+$/)&&a.hasOwnProperty(g)){h=a[g];if(h instanceof Object&&h.children&&h.children.length)h.token==="v"?f+='<q data-voice="'+h.voice.replace(/[\"]/g,"")+"\" class='voice "+"speaker-"+h.voice.replace(/[^a-z0-9]+/ig,"-").toLowerCase()+" webvtt-span' "+'title="'+h.voice.replace(/[\"]/g,"")+'">'+e(h.children,b+1)+"</q>":h.token==="c"?f+="<span class='webvtt-span webvtt-class-span "+h.classes.join(" ")+"'>"+e(h.children,b+1)+"</span>":h.timeIn>0?d===null||d===undefined||d>0&&d>=h.timeIn?f+="<span class='webvtt-span webvtt-timestamp-span' data-timestamp='"+h.token+"' data-timestamp-seconds='"+h.timeIn+"'>"+e(h.children,b+1)+"</span>":d<h.timeIn&&(f+="<span class='webvtt-span webvtt-timestamp-span webvtt-cue-future' style='opacity: 0;' data-timestamp='"+h.token+"' data-timestamp-seconds='"+h.timeIn+"'>"+e(h.children,b+1)+"</span>"):f+=h.rawToken+e(h.children,b+1)+"</"+h.token+">";else if(h instanceof String||typeof h=="string"||typeof h=="number")f+=h}return!c.isTimeDependent&&b===0&&(c.processedCue=f),f}return c.processedCue};return e(this,0)}return a}},g.CaptionatorCueStructure.prototype=[],g.TextTrack=function(a,b,c,d,e,f){this.onload=function(){},this.onerror=function(){},this.oncuechange=function(){},this.id=a||"",this.internalMode=g.TextTrack.OFF,this.cues=new g.TextTrackCueList(this),this.activeCues=new g.ActiveTextTrackCueList(this.cues,this),this.kind=b||"subtitles",this.label=c||"",this.language=d||"",this.src=e||"",this.readyState=g.TextTrack.NONE,this.internalDefault=f||!1,this.getMode=function(){return this.internalMode},this.setMode=function(a){var b=[g.TextTrack.OFF,g.TextTrack.HIDDEN,g.TextTrack.SHOWING],c,d;if(b.indexOf(a)!==-1)a!==this.internalMode&&(this.internalMode=a,this.readyState===g.TextTrack.NONE&&this.src.length>0&&a>g.TextTrack.OFF&&this.loadTrack(this.src,null),this.videoNode._captionator_dirtyBit=!0,g.rebuildCaptions(this.videoNode),a===g.TextTrack.OFF&&(this.cues.length=0,this.readyState=g.TextTrack.NONE));else throw new Error("Illegal mode value for track: "+a)},this.getDefault=function(){return this.internalDefault},Object.prototype.__defineGetter__?(this.__defineGetter__("mode",this.getMode),this.__defineSetter__("mode",this.setMode),this.__defineGetter__("default",this.getDefault)):Object.defineProperty&&(Object.defineProperty(this,"mode",{get:this.getMode,set:this.setMode}),Object.defineProperty(this,"default",{get:this.getDefault})),this.loadTrack=function(a,b){var c,d=new XMLHttpRequest;if(this.readyState===g.TextTrack.LOADED)b instanceof Function&&b(c);else{this.src=a,this.readyState=g.TextTrack.LOADING;var e=this;d.open("GET",a,!0),d.onreadystatechange=function(a){if(d.readyState===4)if(d.status===200){var f=e.videoNode._captionatorOptions||{};e.kind==="metadata"&&(f.processCueHTML=!1,f.sanitiseCueHTML=!1),c=g.parseCaptions(d.responseText,f),e.readyState=g.TextTrack.LOADED,e.cues.loadCues(c),e.activeCues.refreshCues.apply(e.activeCues),e.videoNode._captionator_dirtyBit=!0,g.rebuildCaptions(e.videoNode),e.onload.call(this),b instanceof Function&&b.call(e,c)}else e.readyState=g.TextTrack.ERROR,e.onerror()};try{d.send(null)}catch(f){e.readyState=g.TextTrack.ERROR,e.onerror(f)}}},this.addCue=function(a){if(a&&a instanceof g.TextTrackCue)this.cues.addCue(a);else throw new Error("The argument is null or not an instance of TextTrackCue.")},this.removeCue=function(){}},g.TextTrack.NONE=0,g.TextTrack.LOADING=1,g.TextTrack.LOADED=2,g.TextTrack.ERROR=3,g.TextTrack.OFF=0,g.TextTrack.HIDDEN=1,g.TextTrack.SHOWING=2,g.TextTrackCue=function(a,b,c,d,e,f,h){this.id=a,this.track=h instanceof g.TextTrack?h:null,this.startTime=parseFloat(b),this.endTime=parseFloat(c)>=this.startTime?parseFloat(c):this.startTime,this.text=typeof d=="string"||d instanceof g.CaptionatorCueStructure?d:"",this.settings=typeof e=="string"?e:"",this.intSettings={},this.pauseOnExit=!!f,this.wasActive=!1,this.direction="horizontal",this.snapToLines=!0,this.linePosition="auto",this.textPosition=50,this.size=0,this.alignment="middle";if(this.settings.length){var i=this.intSettings,j=this;e=e.split(/\s+/).filter(function(a){return a.length>0}),e instanceof Array&&e.forEach(function(a){var b={D:"direction",L:"linePosition",T:"textPosition",A:"alignment",S:"size"};a=a.split(":"),b[a[0]]&&(i[b[a[0]]]=a[1]),b[a[0]]in j&&(j[b[a[0]]]=a[1])})}this.linePosition.match(/\%/)&&(this.snapToLines=!1),this.getCueAsSource=function(){return String(this.text)},this.getCueAsHTML=function(){var a=document.createDocumentFragment(),b=document.createElement("div");return b.innerHTML=String(this.text),Array.prototype.forEach.call(b.childNodes,function(b){a.appendChild(b.cloneNode(!0))}),a},this.isActive=function(){var a=0;if(this.track instanceof g.TextTrack&&(this.track.mode===g.TextTrack.SHOWING||this.track.mode===g.TextTrack.HIDDEN)&&this.track.readyState===g.TextTrack.LOADED)try{a=this.track.videoNode.currentTime;if(this.startTime<=a&&this.endTime>=a)return this.wasActive||(this.wasActive=!0,this.onenter()),!0}catch(b){return!1}return this.wasActive&&(this.wasActive=!1,this.onexit()),!1},Object.prototype.__defineGetter__?this.__defineGetter__("active",this.isActive):Object.defineProperty&&Object.defineProperty(this,"active",{get:this.isActive}),this.toString=function(){return"TextTrackCue:"+this.id+"\n"+String(this.text)},this.onenter=function(){},this.onexit=function(){}},g.TextTrackCueList=function(a){this.track=a instanceof g.TextTrack?a:null,this.getCueById=function(a){return this.filter(function(b){return b.id===a})[0]},this.loadCues=function(a){for(var b=0;b<a.length;b++)a[b].track=this.track,Array.prototype.push.call(this,a[b])},this.addCue=function(a){if(!(a&&a instanceof g.TextTrackCue))throw new Error("The argument is null or not an instance of TextTrackCue.");if(a.track===this.track||!a.track)Array.prototype.push.call(this,a);else throw new Error("This cue is associated with a different track!")},this.toString=function(){return"[TextTrackCueList]"}},g.TextTrackCueList.prototype=[],g.ActiveTextTrackCueList=function(a,b){this.refreshCues=function(){if(a.length){var c=this,d=!1,e=[].slice.call(this,0);this.length=0,a.forEach(function(a){a.active&&(c.push(a),c[c.length-1]!==e[c.length-1]&&(d=!0))});if(d)try{b.oncuechange()}catch(f){}}},this.toString=function(){return"[ActiveTextTrackCueList]"},this.refreshCues()},g.ActiveTextTrackCueList.prototype=new g.TextTrackCueList(null);var h=function(a){this.targetObject=a,this.currentTime=0;var b=function(){};this.addEventListener=function(a,b,c){a==="timeupdate"&&b instanceof Function&&(this.timeupdateEventHandler=b)},this.attachEvent=function(a,b){a==="timeupdate"&&b instanceof Function&&(this.timeupdateEventHandler=b)},this.updateTime=function(a){isNaN(a)||(this.currentTime=a,b())}};g.rebuildCaptions=function(a){var b=a.textTracks||[],c=a._captionatorOptions instanceof Object?a._captionatorOptions:{},d=a.currentTime,e=[],f=!1,h=[],i=[];b.forEach(function(a,b){a.mode===g.TextTrack.SHOWING&&a.readyState===g.TextTrack.LOADED&&(i=[].slice.call(a.activeCues,0),i=i.sort(function(a,b){return a.startTime>b.startTime?-1:1}),e=e.concat(i))}),h=e.map(function(a){return a.track.id+"."+a.id+":"+a.text.toString(d).length}),f=!g.compareArray(h,a._captionator_previousActiveCues);if(f||a._captionator_dirtyBit)a._captionator_dirtyBit=!1,a._captionator_availableCueArea=null,a._captionator_previousActiveCues=h,g.styleCueCanvas(a),a._containerObject.innerHTML="",e.forEach(function(b){var c=document.createElement("div"),e=document.createElement("span");e.className="captionator-cue-inner",c.id=String(b.id).length?b.id:g.generateID(),c.className="captionator-cue",c.appendChild(e),e.innerHTML=b.text.toString(d),a._containerObject.appendChild(c),g.styleCue(c,b,a)})},g.captionify=function(i,j,k){var l=[],m=0;k=k instanceof Object?k:{},k.minimumFontSize&&typeof k.minimumFontSize=="number"&&(a=k.minimumFontSize),k.minimumLineHeight&&typeof k.minimumLineHeight=="number"&&(b=k.minimumLineHeight),k.fontSizeVerticalPercentage&&typeof k.fontSizeVerticalPercentage=="number"&&(c=k.fontSizeVerticalPercentage),k.lineHeightRatio&&typeof k.lineHeightRatio!="number"&&(d=k.lineHeightRatio),k.cueBackgroundColour&&k.cueBackgroundColour instanceof Array&&(e=k.cueBackgroundColour);if(!!HTMLVideoElement||i instanceof h){if(typeof document.createElement("video").addTextTrack=="function")return!1;!f&&k.exportObjects&&(window.TextTrack=g.TextTrack,window.TextTrackCueList=g.TextTrackCueList,window.ActiveTextTrackCueList=g.ActiveTextTrackCueList,window.TextTrackCue=g.TextTrackCue,f=!0);if(!i||i===!1||i===undefined||i===null)l=[].slice.call(document.getElementsByTagName("video"),0);else if(i instanceof Array)for(m=0;m<i.length;m++)typeof i[m]=="string"?l=l.concat([].slice.call(document.querySelectorAll(i[m]),0)):i[m].constructor===HTMLVideoElement&&l.push(i[m]);else typeof i=="string"?l=[].slice.call(document.querySelectorAll(i),0):i.constructor===HTMLVideoElement&&l.push(i);return l.length?(l.forEach(function(a){a.addTextTrack=function(b,c,d,e,f,h,i){var j=["subtitles","captions","descriptions","captions","metadata","chapters"],k=j.slice(0,7),l;b=typeof b=="string"?b:"",d=typeof d=="string"?d:"",e=typeof e=="string"?e:"",i=typeof i=="boolean"?i:!1;if(!j.filter(function(a){return c===a?!0:!1}).length)throw g.createDOMException(12,"DOMException 12: SYNTAX_ERR: You must use a valid kind when creating a TimedTextTrack.","SYNTAX_ERR");return l=new g.TextTrack(b,c,d,e,f,null),l?(a.textTracks instanceof Array||(a.textTracks=[]),a.textTracks.push(l),l):!1},g.processVideoElement(l[m],j,k)}),!0):!1}return!1},g.parseCaptions=function(a,b){b=b instanceof Object?b:{};var c="",d=[],e="",f=[],h=/^(\d{2})?:?(\d{2}):(\d{2})\.(\d+)\,(\d{2})?:?(\d{2}):(\d{2})\.(\d+)\s*(.*)/,i=/^(\d+)?:?(\d{2}):(\d{2})\.(\d+)\,(\d+)?:?(\d{2}):(\d{2})\.(\d+)\s*(.*)/,j=/^(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)\s+\-\-\>\s+(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)\s*(.*)/,k=/(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)/,l=/^([\d\.]+)\s+\+([\d\.]+)\s*(.*)/,m=/^\[(\d{2})?:?(\d{2})\:(\d{2})\.(\d{2})\]\s*(.*?)$/i,n=/^(DEFAULTS|DEFAULT)\s+\-\-\>\s+(.*)/g,o=/^(STYLE|STYLES)\s+\-\-\>\s*\n([\s\S]*)/g,p=/^(COMMENT|COMMENTS)\s+\-\-\>\s+(.*)/g,q=/<tt\s+xml/ig,r=/^(\d{2})?:?(\d{2}):(\d{2})\.(\d+)/,s=/^([\d\.]+)[smhdwy]/ig;if(a){var t=function(a){var c=new g.CaptionatorCueStructure(a,b),d=[],e,f,h,i=[],j=0,l,m,n=function(a){return!!a.replace(/[^a-z0-9]+/ig,"").length};d=a.split(/(<\/?[^>]+>)/ig).filter(function(a){return!!a.replace(/\s*/ig,"")}),h=c;for(e in d)if(d.hasOwnProperty(e)){f=d[e];if(f.substr(0,1)==="<"){if(f.substr(1,1)==="/"){var o=f.substr(2).split(/[\s>]+/g)[0];if(i.length>0){var p=0;for(j=i.length-1;j>=0;j--){var q=i[j][i[j].length-1];p=j;if(q.token===o)break}h=i[p],i=i.slice(0,p)}}else if(f.substr(1).match(k)||f.match(/^<v\s+[^>]+>/i)||f.match(/^<c[a-z0-9\-\_\.]+>/)||f.match(/^<(b|i|u|ruby|rt)>/)||b.sanitiseCueHTML!==!1){var r={token:f.replace(/[<\/>]+/ig,"").split(/[\s\.]+/)[0],rawToken:f,children:[]};r.token==="v"?r.voice=f.match(/^<v\s*([^>]+)>/i)[1]:r.token==="c"?r.classes=f.replace(/[<\/>\s]+/ig,"").split(/[\.]+/ig).slice(1).filter(n):!(l=r.rawToken.match(k))||(c.isTimeDependent=!0,m=l.slice(1),r.timeIn=parseInt((m[0]||0)*60*60,10)+parseInt((m[1]||0)*60,10)+parseInt(m[2]||0,10)+parseFloat("0."+(m[3]||0))),h.push(r),i.push(h),h=r.children}}else b.sanitiseCueHTML!==!1&&(f=f.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\&/g,"&amp;"),b.ignoreWhitespace||(f=f.replace(/\n+/g,"<br />"))),h.push(f)}return c},u=function B(a,d){var k,m,q,r,s,u,v="",w,x,y,z;if(x=n.exec(a))return f=x.slice(2).join(""),f=f.split(/\s+/g).filter(function(a){return a&&!!a.length}),null;if(x=o.exec(a))return e+=x[x.length-1],null;if(x=p.exec(a))return null;c==="LRC"?k=[a.substr(0,a.indexOf("]")),a.substr(a.indexOf("]")+1)]:k=a.split(/\n/g);while(!k[0].replace(/\s+/ig,"").length&&k.length>0)k.shift();k[0].match(/^\s*[a-z0-9]+\s*$/ig)?w=String(k.shift().replace(/\s*/ig,"")):w=d;for(u=0;u<k.length;u++){var A=k[u];(y=j.exec(A))||(y=h.exec(A))||(y=i.exec(A))?(s=y.slice(1),m=parseInt((s[0]||0)*60*60,10)+parseInt((s[1]||0)*60,10)+parseInt(s[2]||0,10)+parseFloat("0."+(s[3]||0)),q=parseInt((s[4]||0)*60*60,10)+parseInt((s[5]||0)*60,10)+parseInt(s[6]||0,10)+parseFloat("0."+(s[7]||0)),s[8]&&(v=s[8])):!(y=l.exec(A))||(s=y.slice(1),m=parseFloat(s[0]),q=m+parseFloat(s[1]),s[2]&&(v=s[2])),k=k.slice(0,u).concat(k.slice(u+1));break}if(!m&&!q)return null;var B=f.reduce(function(a,b,c,d){return a[b.split(":")[0]]=b.split(":")[1],a},{});B=v.split(/\s+/g).filter(function(a){return a&&!!a.length}).reduce(function(a,b,c,d){return a[b.split(":")[0]]=b.split(":")[1],a},B),v="";for(var C in B)B.hasOwnProperty(C)&&(v+=v.length?" ":"",v+=C+":"+B[C]);return r=b.processCueHTML===!1?k.join("\n"):t(k.join("\n")),z=new g.TextTrackCue(w,m,q,r,v,!1,null),z.styleData=e,z},v=function(a){var b,c=0;if(typeof a!="string")return 0;if(b=r.exec(a))b=b.slice(1),c=parseInt((b[0]||0)*60*60,10)+parseInt((b[1]||0)*60,10)+parseInt(b[2]||0,10)+parseFloat("0."+(b[3]||0));return c},w=function(a,c){var d,e,f,h,i=0,j=0,k=String(a.getAttribute("begin")),l=String(a.getAttribute("end")),m=a.getAttribute("id")||c;return i=v(k),j=v(l),f=b.processCueHTML===!1?a.innerHTML:t(a.innerHTML),new g.TextTrackCue(m,i,j,f,{},!1,null)};d=a.replace(/\r\n/g,"\n").replace(/\r/g,"\n");if(q.exec(a)){var x=document.createElement("ttml");x.innerHTML=a;var y=[].slice.call(x.querySelectorAll("[begin],[end]"),0),z=y.map(w);return z}return m.exec(a)?(d=d.split(/\n+/g),c="LRC"):d=d.split(/\n\n+/g),d=d.filter(function(a){return a.match(/^WEBVTT(\s*FILE)?/ig)?(c="WebVTT",!1):a.replace(/\s*/ig,"").length?!0:!1}).map(u).filter(function(a){return a!==null?!0:!1}),d}throw new Error("Required parameter captionData not supplied.")},g.processVideoElement=function(a,b,c){var d=[],e=navigator.language||navigator.userLanguage,f=b||e.split("-")[0];c=c instanceof Object?c:{};if(!a.captioned){a._captionatorOptions=c,a.className+=(a.className.length?" ":"")+"captioned",a.captioned=!0,a.id.length===0&&(a.id=g.generateID());var h=!1;[].slice.call(a.querySelectorAll("track"),0).forEach(function(e){var f=null;e.querySelectorAll("source").length>0?f=e.querySelectorAll("source"):f=e.getAttribute("src");var h=a.addTextTrack(e.getAttribute("id")||g.generateID(),e.getAttribute("kind"),e.getAttribute("label"),e.getAttribute("srclang").split("-")[0],f,e.getAttribute("type"),e.hasAttribute("default"));e.track=h,h.trackNode=e,h.videoNode=a,d.push(h);var i=!1;(h.kind==="subtitles"||h.kind==="captions")&&b===h.language&&c.enableCaptionsByDefault&&(d.filter(function(a){return a.kind!=="captions"&&a.kind!=="subtitles"||b!==a.language||a.mode!==g.TextTrack.SHOWING?!1:!0}).length||(i=!0)),h.kind==="chapters"&&b===h.language&&(d.filter(function(a){return a.kind==="chapters"&&a.mode===g.TextTrack.SHOWING?!0:!1}).length||(i=!0)),h.kind==="descriptions"&&c.enableDescriptionsByDefault===!0&&b===h.language&&(d.filter(function(a){return a.kind==="descriptions"&&a.mode===g.TextTrack.SHOWING?!0:!1}).length||(i=!0)),i===!0&&d.forEach(function(a){a.trackNode.hasAttribute("default")&&a.mode===g.TextTrack.SHOWING&&(a.mode=g.TextTrack.HIDDEN)}),e.hasAttribute("default")&&(d.filter(function(a){return a.trackNode.hasAttribute("default")&&a.trackNode!==e?!0:!1}).length||(i=!0,h.internalDefault=!0)),i===!0&&(h.mode=g.TextTrack.SHOWING)}),a.addEventListener("timeupdate",function(a){var b=a.target;try{b.textTracks.forEach(function(a){a.activeCues.refreshCues.apply(a.activeCues)})}catch(d){}c.renderer instanceof Function?c.renderer.call(g,b):g.rebuildCaptions(b)},!1),window.addEventListener("resize",function(b){a._captionator_dirtyBit=!0,g.rebuildCaptions(a)},!1),c.enableHighResolution===!0&&window.setInterval(function(){try{a.textTracks.forEach(function(a){a.activeCues.refreshCues.apply(a.activeCues)})}catch(b){}c.renderer instanceof Function?c.renderer.call(g,a):g.rebuildCaptions(a)},20)}return a},g.getNodeMetrics=function(a){var b=window.getComputedStyle(a,null),c=a,d=a.offsetTop,e=a.offsetLeft,f=a,g=0,h=0;f=parseInt(b.getPropertyValue("width"),10),g=parseInt(b.getPropertyValue("height"),10);while(!!(c=c.offsetParent))d+=c.offsetTop,e+=c.offsetLeft;if(a.hasAttribute("controls")){var i=navigator.userAgent.toLowerCase();i.indexOf("chrome")!==-1?h=32:i.indexOf("opera")!==-1?h=25:i.indexOf("firefox")!==-1?h=28:i.indexOf("ie 9")!==-1||i.indexOf("ipad")!==-1?h=44:i.indexOf("safari")!==-1&&(h=25)}else if(a._captionatorOptions){var j=a._captionatorOptions;j.controlHeight&&(h=parseInt(j.controlHeight,10))}return{left:e,top:d,width:f,height:g,controlHeight:h}},g.applyStyles=function(a,b){for(var c in b)(({})).hasOwnProperty.call(b,c)&&(a.style[c]=b[c])},g.checkDirection=function(a){var b="A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿Ⰰ-﬜﷾-﹯﻽-￿",c="֑-߿יִ-﷽ﹰ-ﻼ",d=new RegExp("^[^"+c+"]*["+b+"]"),e=new RegExp("^[^"+b+"]*["+c+"]");return e.test(a)?"rtl":d.test(a)?"ltr":""},g.styleCue=function(f,h,i){var j=0,k=0,l=0,m=0,n,o,p=0,q=0,r,s,t,u,v,w,x,y,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G,H,I=0,J=i._captionatorOptions||{},K,L=100,M=50,N=0,O=0,P=!0,Q=function(a){var b=function(a){return!!a.length},c="<span class='captionator-cue-character'>",d,e,f,h,i=0,j=function(a){i++,g.applyStyles(a,{display:"block",lineHeight:"auto",height:s+"px",width:y+"px",textAlign:"center"})};for(d in a.childNodes)a.childNodes.hasOwnProperty(d)&&(e=a.childNodes[d],e.nodeType===3?(h=document.createDocumentFragment(),f=e.nodeValue,h.appendChild(document.createElement("span")),h.childNodes[0].innerHTML=c+f.split(/(.)/).filter(b).join("</span>"+c)+"</span>",[].slice.call(h.querySelectorAll("span.captionator-cue-character"),0).forEach(j),e.parentNode.replaceChild(h,e)):a.childNodes[d].nodeType===1&&(i+=Q(a.childNodes[d])));return i};K=g.getNodeMetrics(i),i._captionator_availableCueArea||(i._captionator_availableCueArea={bottom:K.height-K.controlHeight,right:K.width,top:0,left:0,height:K.height-K.controlHeight,width:K.width}),h.direction==="horizontal"&&(g.applyStyles(f,{width:"auto",position:"static",display:"inline-block",padding:"1em"}),N=parseInt(f.offsetWidth,10),O=Math.floor(N/i._captionator_availableCueArea.width*100),O=O<=100?O:100),r=K.height*(c/100)/96*72,r=r>=a?r:a,s=Math.floor(r/72*96),t=Math.floor(r*d),t=t>b?t:b,x=Math.ceil(t/72*96),y=x,x*Math.floor(K.height/x)<K.height&&(x=Math.floor(K.height/Math.floor(K.height/x)),t=Math.ceil(x/96*72)),x*Math.floor(K.width/x)<K.width&&(y=Math.ceil(K.width/Math.floor(K.width/x))),v=Math.floor(i._captionator_availableCueArea.height/x),w=Math.floor(i._captionator_availableCueArea.width/y),parseFloat(String(h.size).replace(/[^\d\.]/ig,""))===0?J.sizeCuesByTextBoundingBox===!0?n=O:(n=100,P=!1):(P=!1,n=parseFloat(String(h.size).replace(/[^\d\.]/ig,"")),n=n<=100?n:100),p=h.direction==="horizontal"?Math.floor(K.width*.01):0,q=h.direction==="horizontal"?0:Math.floor(K.height*.01),h.linePosition==="auto"?h.linePosition=h.direction==="horizontal"?v:w:String(h.linePosition).match(/\%/)&&(h.snapToLines=!1,h.linePosition=parseFloat(String(h.linePosition).replace(/\%/ig,"")));if(h.direction==="horizontal")m=x,h.textPosition!=="auto"&&P&&(M=parseFloat(String(h.textPosition).replace(/[^\d\.]/ig,"")),n-M>O?n-=M:n=O),h.snapToLines===!0?l=i._captionator_availableCueArea.width*(n/100):l=K.width*(n/100),h.textPosition==="auto"?j=(i._captionator_availableCueArea.right-l)/2+i._captionator_availableCueArea.left:(M=parseFloat(String(h.textPosition).replace(/[^\d\.]/ig,"")),j=(i._captionator_availableCueArea.right-l)*(M/100)+i._captionator_availableCueArea.left),h.snapToLines===!0?k=(v-1)*x+i._captionator_availableCueArea.top:(u=K.controlHeight+x+q*2,k=(K.height-u)*(h.linePosition/100));else{k=i._captionator_availableCueArea.top,j=i._captionator_availableCueArea.right-y,l=y,m=i._captionator_availableCueArea.height*(n/100),A=Q(f),B=[].slice.call(f.querySelectorAll("span.captionator-cue-character"),0),z=Math.floor((m-q*2)/s),l=Math.ceil(A/z)*y,C=Math.ceil(A/z),D=A-z*(C-1),E=D*s;if(h.snapToLines===!0)j=h.direction==="vertical-lr"?i._captionator_availableCueArea.left:i._captionator_availableCueArea.right-l;else{var R=l+p*2;h.direction==="vertical-lr"?j=(K.width-R)*(h.linePosition/100):j=K.width-R-(K.width-R)*(h.linePosition/100)}h.textPosition==="auto"?k=(i._captionator_availableCueArea.bottom-m)/2+i._captionator_availableCueArea.top:(h.textPosition=parseFloat(String(h.textPosition).replace(/[^\d\.]/ig,"")),k=(i._captionator_availableCueArea.bottom-m)*(h.textPosition/100)+i._captionator_availableCueArea.top),F=0,I=0,G=0,H=0,B.forEach(function(a,b){h.direction==="vertical-lr"?G=y*F:G=l-y*(F+1),h.alignment==="start"||h.alignment!=="start"&&F<C-1?H=I*s+q:h.alignment==="end"?H=I*s-s+(m+q*2-E):h.alignment==="middle"&&(H=(m-q*2-E)/2+I*s),a.setAttribute("aria-hidden","true"),g.applyStyles(a,{position:"absolute",top:H+"px",left:G+"px"}),I>=z-1?(I=0,F++):I++})}h.direction==="horizontal"&&(g.checkDirection(String(h.text))==="rtl"?o={start:"right",middle:"center",end:"left"}[h.alignment]:o={start:"left",middle:"center",end:"right"}[h.alignment]),g.applyStyles(f,{position:"absolute",overflow:"hidden",width:l+"px",height:m+"px",top:k+"px",left:j+"px",padding:q+"px "+p+"px",textAlign:o,backgroundColor:"rgba("+e.join(",")+")",direction:g.checkDirection(String(h.text)),lineHeight:t+"pt",boxSizing:"border-box"});if(h.direction==="vertical"||h.direction==="vertical-lr")j-i._captionator_availableCueArea.left-i._captionator_availableCueArea.left>=i._captionator_availableCueArea.right-(j+l)?i._captionator_availableCueArea.right=j:i._captionator_availableCueArea.left=j+l,i._captionator_availableCueArea.width=i._captionator_availableCueArea.right-i._captionator_availableCueArea.left;else{if(f.scrollHeight>f.offsetHeight*1.2)if(h.snapToLines){var S=0;while(f.scrollHeight>f.offsetHeight*1.2)m+=x,f.style.height=m+"px",S++;k-=S*x,f.style.top=k+"px"}else{var T=f.scrollHeight-m;m=f.scrollHeight+q,u=K.controlHeight+m+q*2,k=(K.height-u)*(h.linePosition/100),f.style.height=m+"px",f.style.top=k+"px"}k-i._captionator_availableCueArea.top-i._captionator_availableCueArea.top>=i._captionator_availableCueArea.bottom-(k+m)&&i._captionator_availableCueArea.bottom>k?i._captionator_availableCueArea.bottom=k:i._captionator_availableCueArea.top<k+m&&(i._captionator_availableCueArea.top=k+m),i._captionator_availableCueArea.height=i._captionator_availableCueArea.bottom-i._captionator_availableCueArea.top}if(J.debugMode){var U,V,W=function(){U||(i._captionatorDebugCanvas?(U=i._captionatorDebugCanvas,V=i._captionatorDebugContext):(U=document.createElement("canvas"),U.setAttribute("width",K.width),U.setAttribute("height",K.height-K.controlHeight),document.body.appendChild(U),g.applyStyles(U,{position:"absolute",top:K.top+"px",left:K.left+"px",width:K.width+"px",height:K.height-K.controlHeight+"px",zIndex:3e3}),V=U.getContext("2d"),i._captionatorDebugCanvas=U,i._captionatorDebugContext=V))},X=function(){W(),U.setAttribute("width",K.width)},Y=function(){var a;W(),V.strokeStyle="rgba(255,0,0,0.5)",V.lineWidth=1,V.beginPath();for(a=0;a<v;a++)V.moveTo(.5,a*x+.5),V.lineTo(K.width,a*x+.5);V.closePath(),V.stroke(),V.beginPath(),V.strokeStyle="rgba(0,255,0,0.5)";for(a=w;a>=0;a--)V.moveTo(K.width-a*y-.5,-0.5),V.lineTo(K.width-a*y-.5,K.height);V.closePath(),V.stroke(),V.beginPath(),V.strokeStyle="rgba(255,255,0,0.5)";for(a=0;a<=w;a++)V.moveTo(a*y+.5,-0.5),V.lineTo(a*y+.5,K.height);V.stroke(),i.linesDrawn=!0},Z=function(){W(),V.fillStyle="rgba(100,100,255,0.5)",V.fillRect(i._captionator_availableCueArea.left,i._captionator_availableCueArea.top,i._captionator_availableCueArea.right,i._captionator_availableCueArea.bottom),V.stroke()};X(),Z(),Y()}},g.styleCueCanvas=function(e){var f,h,i,j,k=e._captionatorOptions instanceof Object?e._captionatorOptions:{};if(!(e instanceof HTMLVideoElement))throw new Error("Cannot style a cue canvas for a non-video node!");e._containerObject&&(i=e._containerObject,j=i.id);if(!i){i=document.createElement("div"),i.className="captionator-cue-canvas",j=g.generateID(),i.id=j;if(k.appendCueCanvasTo){var l=null;if(k.appendCueCanvasTo instanceof HTMLElement)l=k.appendCueCanvasTo;else if(typeof k.appendCueCanvasTo=="string")try{var m=document.querySelectorAll(k.appendCueCanvasTo);if(m.length>0)l=m[0];else throw null}catch(n){l=document.body,k.appendCueCanvasTo=!1}else l=document.body,k.appendCueCanvasTo=!1;l.appendChild(i)}else document.body.appendChild(i);e._containerObject=i,i.setAttribute("aria-live","polite"),i.setAttribute("aria-atomic","true"),i.setAttribute("aria-relevant","text")}else i.parentNode||document.body.appendChild(i);if(String(e.getAttribute("aria-describedby")).indexOf(j)===-1){var o=e.hasAttribute("aria-describedby")?e.getAttribute("aria-describedby")+" ":"";e.setAttribute("aria-describedby",o+j)}var p=g.getNodeMetrics(e);f=p.height*(c/100)/96*72,f=f>=a?f:a,h=Math.floor(f*d),h=h>b?h:b,g.applyStyles(i,{position:"absolute",overflow:"hidden",zIndex:100,height:p.height-p.controlHeight+"px",width:p.width+"px",top:(k.appendCueCanvasTo?0:p.top)+"px",left:(k.appendCueCanvasTo?0:p.left)+"px",color:"white",fontFamily:"Verdana, Helvetica, Arial, sans-serif",fontSize:f+"pt",lineHeight:h+"pt",boxSizing:"border-box"})},g.createDOMException=function(a,b,c){try{document.querySelectorAll("div/[]")}catch(d){var e=function(a,b,c){this.code=a,this.message=b,this.name=c};return e.prototype=d,new e(a,b,c)}},g.compareArray=function(a,b){if(a instanceof Array&&b instanceof Array){if(a.length!==b.length)return!1;for(var c in a)if(a.hasOwnProperty(c)&&a[c]!==b[c])return!1;return!0}return!1},g.generateID=function(a){var b="";a=a?a:10;while(b.length<a)b+=String.fromCharCode(65+Math.floor(Math.random()*26));return"captionator"+b}})()