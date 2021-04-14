import{o as t,c as n,t as e,d as o,h as r,a,b as u,e as l,w as c,v as s,F as i,r as g,f as h,g as p}from"./vendor.7fb938c0.js";!function(t=".",n="__import__"){try{self[n]=new Function("u","return import(u)")}catch(e){const o=new URL(t,location),r=t=>{URL.revokeObjectURL(t.src),t.remove()};self[n]=t=>new Promise(((e,a)=>{const u=new URL(t,o);if(self[n].moduleMap[u])return e(self[n].moduleMap[u]);const l=new Blob([`import * as m from '${u}';`,`${n}.moduleMap['${u}']=m;`],{type:"text/javascript"}),c=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){a(new Error(`Failed to import: ${t}`)),r(c)},onload(){e(self[n].moduleMap[u]),r(c)}});document.head.appendChild(c)})),self[n].moduleMap={}}}("/bookkeeping-datev/assets/");const d={expose:[],props:{msg:String},setup:o=>(r,a)=>(t(),n("h1",null,e(o.msg),1))};d.__scopeId="data-v-f0bbe81e";var m=o({name:"App",data:()=>({currentCSV:null,bookings:[],months:[],currentMonth:null,accounts:[""],currentAccount:null,textSearch:null}),methods:{formatMonth:t=>r(t).format("MMM"),formatDate:t=>r(t).format("DD.MM."),monthsFor(t){var n=[];for(var e in t){var o=t[e];0==n.filter((t=>o.datum.getMonth()==t.getMonth())).length&&n.push(o.datum)}return n},calcSaldo(t){var n=0;for(var e in t){var o=t[e];o.konto==this.currentAccount?n+=o.betrag:n-=o.betrag}return n},currentBookings(){var t=[],n=0;for(var e in this.bookings){var o=this.bookings[e];this.currentMonth&&o.datum.getMonth()!=this.currentMonth-1||(this.currentAccount&&o.konto!=this.currentAccount&&o.gegenKonto!=this.currentAccount||this.textSearch&&-1==o.text.toUpperCase().indexOf(this.textSearch.toUpperCase())||(o.konto==this.currentAccount?n+=o.betrag:n-=o.betrag,o.saldo=n,t.push(o)))}return t},parseCSV(t){var n=this,e=new FileReader;e.onload=function(){for(var t in n.currentCSV=function(t,n){n=n||",";for(var e=new RegExp("(\\"+n+'|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\'+n+"\\r\\n]*))","gi"),o=[[]],r=null;r=e.exec(t);){var a,u=r[1];u.length&&u!==n&&o.push([]),a=r[2]?r[2].replace(new RegExp('""',"g"),'"'):r[3],o[o.length-1].push(a)}return o}(e.result,";"),n.currentCSV){if(t>2){var o,r=n.currentCSV[t];o=3==r[9].length?new Date(2019,parseInt(r[9].substring(1),10)-1,parseInt(r[9].substring(0,1),10)):new Date(2019,parseInt(r[9].substring(2),10)-1,parseInt(r[9].substring(0,2),10));var a={betrag:"H"==r[1]?parseFloat(r[0].replace(",",".")):-parseFloat(r[0].replace(",",".")),konto:r[6],gegenKonto:r[7],bu:r[8],datum:o,text:r[13]};-1==n.accounts.indexOf(a.konto)&&n.accounts.push(a.konto),-1==n.accounts.indexOf(a.gegenKonto)&&n.accounts.push(a.gegenKonto),n.bookings.push(a)}n.accounts.sort()}},e.readAsBinaryString(t.target.files[0])}},components:{HelloWorld:d}});const f={key:0},k={key:1},b={class:"tabs"},v={key:0},x=a("th",null," # ",-1),M=a("th",null," Datum ",-1),S=a("th",null," Betrag ",-1),C=a("th",null," Haben ",-1),y=a("th",null," Soll ",-1),A=a("th",null," Buchungstext ",-1),w={key:0},F={style:{"text-align":"right"}},V={key:0},B={key:0},U=a("tfoot",null,null,-1);m.render=function(o,r,p,d,m,R){return t(),n(i,null,[o.currentCSV?u("",!0):(t(),n("div",f,[a("input",{id:"csv",type:"file",onChange:r[1]||(r[1]=(...t)=>o.parseCSV&&o.parseCSV(...t))},null,32)])),o.currentCSV?(t(),n("div",k,[l(e(o.bookings.length)+" Buchungen ",1),a("p",null,[c(a("select",{"onUpdate:modelValue":r[2]||(r[2]=t=>o.currentAccount=t)},[(t(!0),n(i,null,g(o.accounts,(o=>(t(),n("option",{key:o},e(o),1)))),128))],512),[[s,o.currentAccount]]),c(a("input",{type:"text","onUpdate:modelValue":r[3]||(r[3]=t=>o.textSearch=t)},null,512),[[h,o.textSearch]])]),a("ul",b,[(t(!0),n(i,null,g(o.monthsFor(o.bookings),(r=>(t(),n("li",{key:r,onClick:t=>o.currentMonth=r.getMonth()+1,class:{active:o.currentMonth==r.getMonth()+1}},e(o.formatMonth(r)),11,["onClick"])))),128))]),a("p",null,e(o.currentBookings().length)+" Buchungen ",1),o.currentAccount?(t(),n("p",v," Saldo: "+e(o.calcSaldo(o.currentBookings()).toFixed(2)),1)):u("",!0),a("table",null,[a("tr",null,[x,M,S,C,y,A,o.currentAccount?(t(),n("th",w," Saldo ")):u("",!0)]),(t(!0),n(i,null,g(o.currentBookings(),((r,l)=>(t(),n("tr",null,[a("td",null,[a("small",null,e(l+1),1)]),a("td",null,e(o.formatDate(r.datum)),1),a("td",F,[r.betrag>0?(t(),n("b",V,e(r.betrag.toFixed(2)),1)):u("",!0)]),a("td",{onClick:t=>o.currentAccount=r.konto},e(r.konto),9,["onClick"]),a("td",{onClick:t=>o.currentAccount=r.gegenKonto},e(r.gegenKonto),9,["onClick"]),a("td",null,e(r.text),1),o.currentAccount?(t(),n("td",B,e(r.saldo.toFixed(2)),1)):u("",!0)])))),256)),U])])):u("",!0)],64)},p(m).mount("#app");
