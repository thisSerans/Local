// ==UserScript==
// @name        Schema generator
// @namespace   C:\xampp2\htdocs\xampp\schema
// @description *
// @include     *
// @version     1
// @grant       GM_addStyle
// @grant       GM_openInTab
// ==/UserScript==
// Funkcja tworząca <style type="text/css" id="{id}">{cssString}</style> w head strony
function addCss(cssString, id) {
  var head = document.getElementsByTagName('head') [0];
  var newCss = document.createElement('style');
  newCss.setAttribute('id', id); //what ? id na style ? tak - bo potem trzeba wiedzieć co chcemy usunąć jak użytkownik zamknie 'apke'
  newCss.type = 'text/css';
  newCss.innerHTML = cssString;
  head.appendChild(newCss);
}
//Funkcja tworząca div wypełniony {htmlString} w {tag} DOM

function addHtml(htmlString, tag) {
  var head = document.getElementsByTagName(tag) [0];
  var newHtml = document.createElement('div');
  newHtml.innerHTML = htmlString;
  head.appendChild(newHtml);
};
//Anonimowa funkcja inicjalizująca działanie. 
(function () {
  //Dodaje menu do body
  document.body.setAttribute('contextmenu', 'imagemenu');
  document.body.setAttribute('id', 'noninteractive');
  addHtml('<menu type="context" id="imagemenu"><menuitem class="gen" label="Generuj schema" ></menuitem></menu>', 'body');
  //Sprawdzam czy kliknięto w przycisk menu kontekstowego
  document.querySelector('.gen').addEventListener('click', generate, false);
  //Sprawdzam czy tekst jest zaznaczony i ustawiam menu na disabled jeśli nie jest
  document.querySelector('#noninteractive').addEventListener('contextmenu', function (ev) {
    this.querySelector('.gen').disabled = document.getSelection().isCollapsed;
  }, false);
}) ();
function parseAdress() {
  //Jeśli nie dopasowano regexp ustaw klase uk-form-danger na <input type="text"
  function notFound(formSelector) {
    formSelector.placeholder = 'Nie znaleziono';
    formSelector.className = 'uk-form-danger';
  }
  var str = window.getSelection().toString();
  var re = /[0-9]{2}-[0-9]{3}/i;
  var pCode = str.match(re); //Kod pocztowy
  if (pCode != null) {
    document.querySelector('#pCode').value = pCode[0];
  } 
  else {
    notFound(document.querySelector('#pCode'));
  };
  var re = /[U,u,l,L,ulica,Ulica]+\.?[\s]([A-z,ó,ł,ś,ć,ą,ż,ż]*[\s][0-9]+)/;
  var streetName = str.match(re); //Ulica :D
  if (streetName != null) {
    document.querySelector('#streetName').value = streetName[1];
  } 
  else {
    notFound(document.querySelector('#streetName'));
  };
  var re = /.*[\s]/i;
  var companyName = str.match(re);
  if (companyName != null) { //Nazwa firmy :D
    document.querySelector('#companyName').value = companyName[0];
  } 
  else {
    notFound(document.querySelector('#companyName'));
  };
  var re = /[0-9]{2}[\s]?-[\s]?[0-9]{3}[\s]([a-pr-uwy-zA-PR-UWY-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*)/
  var cityName = str.match(re);
  if (cityName != null) { //Nazwa miasta :D
    document.querySelector('#cityName').value = cityName[1];
  } 
  else {
    notFound(document.querySelector('#cityName'));
  };
  var re = /tel([A-z]+)?[:]?[\s]*(\+?[0-9]+[\s]*[0-9]+[\s]*[0-9]+([\s][0-9]+)?)/
  var telephone = str.match(re);
  if (telephone != null) { //Telefon :D
    document.querySelector('#telephone').value = telephone[2];
  } 
  else {
    notFound(document.querySelector('#telephone'));
  };
  var re = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/
  var email = str.match(re);
  if (email != null) { //e-mail:D
    document.querySelector('#mail').value = email[0];
  } 
  else {
    notFound(document.querySelector('#mail'));
  };
  var re = /Polska/i
  var countryName = str.match(re);
  if (countryName != null) { //kraj :D
    document.querySelector('#countryName').value = countryName[0];
  } 
  else {
    notFound(document.querySelector('#countryName'));
  };
}
// Funkcja pobierająca wartości z formularza i generująca kod, wywoływana po funkcji parseAdress oraz po kliknięciu "Generuj ponownie"

function createSchema() {
  var companyName = document.querySelector('#companyName').value;
  var streetName = document.querySelector('#streetName').value;
  var pCode = document.querySelector('#pCode').value;
  var cityName = document.querySelector('#cityName').value;
  var telephone = document.querySelector('#telephone').value;
  var mail = document.querySelector('#mail').value;
  var countryName = document.querySelector('#countryName').value;

 
  if (streetName != '' || pCode != '' || cityName != '' || countryName != '') {
    var addAdressStart = '<div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">';
    var addAdressEnd = '</div>';
    var JaddAdressStart = '"address": {"@type": "PostalAddress",';
      if (telephone != '' || mail != '' || companyName != '' ) {
    var JaddAdressEnd = '},';
      }
    else{
    var JaddAdressEnd = '}';  
    }
  }
  if (companyName != '') {
    var JcompanyName = '"name": "' + companyName + '"';
    companyName = '<span itemprop="name">' + companyName + '</span>';
  }
  if (cityName != '') {
    var JcityName = '"addressLocality": "' + cityName + '"';
    cityName = '<span itemprop="addressLocality">' + cityName + '</span>';
  }
  if (streetName != '') {
    var JstreetName = '"streetAddress": "' + streetName + '"';
    streetName = '<span itemprop="streetAddress">' + streetName + '</span>';
  }
  if (pCode != '') {
    var JpCode = '"postalCode": "' + pCode + '"';
    pCode = '<span itemprop="postalCode">' + pCode + '</span>';
  }
  if (telephone != '') {
    var Jtelephone = '"telephone": "' + telephone + '"';
    telephone = '<span itemprop="telephone">' + telephone + '</span>';
  }
  if (mail != '') {
    var Jmail = '"email": "' + mail + '"';
    mail = '<span itemprop="email">' + mail + '</span>';
  }
  if (countryName != '') {
    var JcountryName = '"addressCountry": "' + countryName + '"';
    countryName = '<span itemprop="addressCountry">' + countryName + '</span>';
  }

   
   /* 
   Funkcja usuwająca przecinek na ostatnim elemencie danej grupy danych w JSON-LD
   Wytłumaczenie:
   JSON-LD ma notacje obiektową w związku z czym gdy zapisujemy dane np.
   
    "@type": "PostalAddress",
    "addressLocality": "Mexico Beach",
    "addressRegion": "FL",
    "streetAddress": "3102 Highway 98"
    
    To na ostatnim elemencie (tutaj streetAdress) nie możemy mieć przecinka. Funkcja sortArray właśnie to robi odpowiednio.
   
   */ 
  function sortArray(adresses){
     var sortedAdresses=[];
     adresses = adresses.filter(function(e){return e}); //usuwam puste rekordy z tablicy
   
     for (var z=0;z<adresses.length;z++){
       var adress;
       if (z!=adresses.length-1){
       adress= adresses[z]+','; //dodaje przecinek na wszystkich elementach oprócz ostatniego
       }
       else{
       adress= adresses[z];
       }
     sortedAdresses.push(adress);
       
     }
   return sortedAdresses=sortedAdresses.join('');
  }
  
  
   var contact = [JcityName,JstreetName,JpCode,JcountryName];
   var otherThings = [JcompanyName,Jmail,Jtelephone,];
   var json = [
    '<script type="application/ld+json">{',
    '"@context": "http://schema.org",',
    '"@type": "LocalBusiness",',
    JaddAdressStart,
    sortArray(contact),
    JaddAdressEnd,
    sortArray(otherThings),
    '}',
    '</script>'
  ].join('');
  
  var schema = [
    '<div itemscope itemtype="http://schema.org/LocalBusiness">',
    companyName,
    addAdressStart,
    streetName,
    pCode,
    cityName,
    countryName,
    addAdressEnd,
    telephone,
    mail,
    '</div>'
  ].join('');
  document.querySelector('#generatedSchema').innerHTML = schema;
  document.querySelector('#generatedJson').innerHTML = json;
}

//Gdy ktoś kliknie "Zamknij" nie chcemy zostawiać naszego syfu w kodzie w związku z tym trzeba usunąć z DOMa wygenerowane przez nas node
function close() {
  document.querySelector('#addedCss').parentNode.removeChild(document.querySelector('#addedCss')); // Wywalam dodany element style do head
  document.querySelector('#my-id').parentNode.parentNode.removeChild(document.querySelector('#my-id').parentNode); // Wywalam rodzica #my-id (pusty div utworzony w funkcji addHtml) - gdyby ktoś się zastanawiał dlaczego ludzie używaja jQuery to ta linia kodu to wyjaśnia
//Zostaje nam tylko id i atrybut context menu na body oraz div>#imagemenu - wszystko odpowiedzialne za menu kontekstowe, chcemy to zostawić.
}

// Łatwe kopiowanie tekstu z textarea
function selectAll()
{
 this.select();//to było trudne ;)
}

function generate() {
  addCss('abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;font-size:15px;color:#000;font-family:calibri,arial,helvetica,clean;outline:0}#my-id{display:block;overflow-y:scroll}.uk-modal.uk-open{opacity:1}.uk-open .uk-modal-dialog{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}.uk-modal-dialog{position:relative;-moz-box-sizing:border-box;box-sizing:border-box;margin:50px auto;padding:20px;width:800px;max-width:100%;max-width:calc(100% - 20px);background:#fff;opacity:0;-webkit-transform:translateY(-100px);transform:translateY(-100px);-webkit-transition:opacity .3s linear,-webkit-transform .3s ease-out;transition:opacity .3s linear,transform .3s ease-out;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,.3)}.uk-modal{display:none;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1010;overflow-y:auto;-webkit-overflow-scrolling:touch;background:rgba(0,0,0,.6);opacity:0;-webkit-transition:opacity .15s linear;transition:opacity .15s linear;touch-action:cross-slide-y pinch-zoom double-tap-zoom;-webkit-transform:translateZ(0);transform:translateZ(0)}.uk-grid{display:-ms-flexbox;display:-webkit-flex;display:flex;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap;margin:0;padding:0;list-style:none}.uk-grid:after{clear:both}.uk-grid:after,.uk-grid:before{content:"";display:block;overflow:hidden}.uk-width-1-2,.uk-width-2-4,.uk-width-3-6,.uk-width-5-10{width:50%}.uk-grid>*{padding-left:35px;-ms-flex:none;-webkit-flex:none;flex:none;margin:0;float:left}.uk-grid>*>:last-child{margin-bottom:0}#my-id form{display:block;margin-top:0}#my-id legend:after{content:"";display:block;border-bottom:1px solid #e5e5e5;width:100%}#my-id legend{width:100%;padding:0 0 15px;font-size:18px;line-height:30px;display:block;-webkit-padding-start:2px;-webkit-padding-end:2px;border:none;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial}.uk-form fieldset{border:none;margin:0;padding:0}.uk-form>:last-child{margin-bottom:0}#my-id fieldset{display:block}#my-id .uk-form-row{padding-bottom:10px}#my-id textarea{width:100%;min-height:180px}#my-id .uk-form-row:after{clear:both}#my-id .uk-form-row:after,#my-id .uk-form-row:before{content:"";display:table}.uk-form-horizontal .uk-form-label{width:141px;margin-top:5px;float:left}#my-id label{cursor:default}[class*=uk-width]{-moz-box-sizing:border-box;box-sizing:border-box;width:50%}.uk-form-horizontal .uk-form-controls{margin-left:156px}.uk-form input:not([type=radio]):not([type=checkbox]),.uk-form select{vertical-align:middle}.uk-form input:not([type]),.uk-form input[type=color],.uk-form input[type=date],.uk-form input[type=datetime-local],.uk-form input[type=datetime],.uk-form input[type=email],.uk-form input[type=month],.uk-form input[type=number],.uk-form input[type=password],.uk-form input[type=search],.uk-form input[type=tel],.uk-form input[type=text],.uk-form input[type=time],.uk-form input[type=url],.uk-form input[type=week],.uk-form select,.uk-form textarea{height:30px;max-width:100%;padding:4px 6px;border:1px solid #e5e5e5;background:#fff;color:#666;-webkit-transition:all linear .2s;transition:all linear .2s;border-radius:4px}.uk-form input:not([type]),.uk-form input[type=datetime],.uk-form input[type=email],.uk-form input[type=number],.uk-form input[type=password],.uk-form input[type=search],.uk-form input[type=tel],.uk-form input[type=text],.uk-form input[type=url],.uk-form textarea{-webkit-appearance:none}.uk-form-controls>:last-child{margin-bottom:0}.uk-form-controls>:first-child{margin-top:0}.uk-form input,.uk-form select,.uk-form textarea{-moz-box-sizing:border-box;box-sizing:border-box;margin:0;border-radius:0}.uk-form-success{border-color:#8ec73b!important;background:#fafff2!important;color:#659f13!important}#my-id input:not([type]),#my-id input[type=emaili],#my-id input[type=numberi],#my-id input[type=passwordi],#my-id input[type=teli],#my-id input[type=texti],#my-id input[type=urli]{padding:1px 0}#my-id button,#my-id input,#my-id keygen,#my-id select,#my-id textarea{margin:5px;font:normal normal normal 13.33px/normal Arial;text-rendering:auto;color:initial;letter-spacing:normal;word-spacing:normal;text-transform:none;text-indent:0;text-shadow:none;display:inline-block;text-align:start}#my-id button,#my-id input,#my-id keygen,#my-id meter,#my-id progress,#my-id select,#my-id textarea{-webkit-writing-mode:horizontal-tb}.uk-form-danger{border-color:#dc8d99!important;background:#fff7f8!important;color:#d85030!important}.uk-button:not(:disabled){cursor:pointer}.uk-button-generate{background-color:#61B462}.uk-button-success{background-color:#FF6E6E;color:#fff;border-color:rgba(0,0,0,.2) rgba(0,0,0,.2) rgba(0,0,0,.4);text-shadow:0 -1px 0 rgba(0,0,0,.2)}.uk-button{-webkit-appearance:none;margin:7px;border:none;overflow:visible;text-transform:none;display:inline-block;-moz-box-sizing:border-box;box-sizing:border-box;padding:0 12px;vertical-align:middle;line-height:28px;min-height:30px;font-size:1rem;text-decoration:none;text-align:center;border:1px solid rgba(0,0,0,.2);border-bottom-color:rgba(0,0,0,.3);background-origin:border-box;border-radius:4px}', 'addedCss'
  ); //Dodaje style css do head
  addHtml('<div id="my-id" class="uk-modal uk-open" aria-hidden="false" style="display: block; overflow-y: scroll;"> <div class="uk-modal-dialog"> <a class="uk-modal-close uk-close"></a> <div class="uk-grid"> <div class="uk-width-1-2"><form class="uk-form uk-form-horizontal"><legend >Pobrany tekst</legend><p style="" id="copiedText"></p> <legend>Pobrane dane</legend> <fieldset> <div class="uk-form-row"> <label class="uk-form-label" for="companyName">Nazwa</label><div class="uk-form-controls"><input type="text" id="companyName" class="uk-form-success"></div></div><div class="uk-form-row"><label class="uk-form-label" for="streetName">Ulica</label><div class="uk-form-controls"><input type="text" id="streetName" class="uk-form-success"></div></div><div class="uk-form-row"> <label class="uk-form-label" for="pCode">Kod-pocztowy</label><div class="uk-form-controls"><input type="text" id="pCode" class="uk-form-success"></div></div><div class="uk-form-row"> <label class="uk-form-label" for="pCode">Miasto</label><div class="uk-form-controls"><input type="text" id="cityName" class="uk-form-success"></div></div><div class="uk-form-row"> <label class="uk-form-label" for="telephone">Telefon</label> <div class="uk-form-controls"> <input type="text" id="telephone" class="uk-form-success"></div></div><div class="uk-form-row"> <label class="uk-form-label" for="mail">E-mail</label> <div class="uk-form-controls"> <input type="text" id="mail" class="uk-form-success"></div></div><div class="uk-form-row"> <label class="uk-form-label" for="countryName">Kraj</label> <div class="uk-form-controls"> <input type="text" id="countryName" class="uk-form-success"></div></div></fieldset> </form></div><div class="uk-width-1-2"> <form class="uk-form"> <fieldset> <legend>Wygenerowany kod Microdata</legend> <textarea  id="generatedSchema" class="uk-form-width-medium"></textarea><legend>Wygenerowany kod JSON-LD</legend> <textarea id="generatedJson" class="uk-form-width-medium"></textarea><button class="uk-button uk-button-generate" type="button">Generuj ponownie</button><button class="uk-button uk-button-success" type="button">Zamknij</button> </fieldset> </form></div></div><div class="uk-grid"></div></div></div>', 'body'
  ); //Dodaje kod html do body
  parseAdress(); //Wywołuje funkcje która harata dane kontaktowe z zaznaczonego tekstu
  document.querySelector('#copiedText').innerHTML = window.getSelection().toString(); //Wyświetlam pobrany tekst
  
  //Funkcja nasłuchująca zdarzenia
  (function(){
  document.querySelector('.uk-button-generate').addEventListener('click', createSchema, false); //Nasłuchuje czy ktoś prosi o ponowne wygenerowanie kodu
  document.querySelector('.uk-button-success').addEventListener('click', close, false); //Nasłuchuje czy ktoś prosi o zamknięcie okna
  document.querySelector('#generatedSchema').addEventListener('click', selectAll, false); //Nasłuchuje czy ktoś prosi o zaznaczenie wszystkiego w textarea
  document.querySelector('#generatedJson').addEventListener('click', selectAll, false); //Nasłuchuje czy ktoś prosi o zaznaczenie wszystkiego w textarea
    })();
  createSchema();
};
