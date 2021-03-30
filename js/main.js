//app is for general control over the application
//and connections between the other components
const APP = {
  init: () => {
    //this function runs when the page loads
  //SEARCH.searchpeople();
  document.addEventListener('DOMContentLoaded', APP.addlistener);
  },
  addlistener(){
    let sections = document.querySelectorAll('section');
    let instruction = document.getElementById('instructions');
    //instruction.innerHTML = '';
    window.scrollTo(0,0);
    sections.forEach((section) => {
      section.classList.remove('active');
      let instruction = document.getElementById('instructions');
      instruction.classList.add('active');
    });
    let btn = document.getElementById('btnSearch');
    btn.addEventListener('click',SEARCH.rmsubmit);
    let h1 = document.querySelector('h1');
    h1.addEventListener('click', APP.addlistener);
    let input = document.getElementById('search');
    input.value = '';
    history.pushState({},null,'#');
    console.log('add history from init');
    APP.hidesortLabel();
    //console.log(location.href);
    window.addEventListener('hashchange', SWITCH.switchpage);
    //console.log({history});
  },
  showsortLabel(){
    let headerdiv = document.querySelector('header div');
    headerdiv.classList.remove('hide');
  },
  hidesortLabel(){
    let headerdiv = document.querySelector('header div');
    headerdiv.classList.add('hide');
  }
};
const SWITCH = {
  switchpage(){
    let url = new URL(location.href).hash;
    let hash = url.replace('#','');
    let decode = decodeURIComponent(hash);
    let hasharray = decode.split('/');
    //console.log(decode);
    if(hash){
      if(hasharray.length === 1){
      //console.log('pass');
      input = document.getElementById('search');
      input.value = decode;
      SEARCH.searchpeople();
      }else{
        let name = hasharray[0];
        let input = document.getElementById('search');
        input.value = name;
        let nameupper = name.charAt(0).toUpperCase() + name.slice(1);
        let id = parseInt(hasharray[1]);
        //~.addEventListener('click', scacascasc());
        let storage = JSON.parse(localStorage.getItem(`Chunyen-assign4-${nameupper}`));
        //console.log(storage);
        let obj = storage.find((person) => {
          if(person.id === id){
            APP.hidesortLabel();
            let instructions = document.getElementById('instructions');
            let actors = document.getElementById('actors');
            let media = document.getElementById('media');
            media.innerHTML = '';
            instructions.classList.remove('active');
            actors.classList.remove('active');
            actors.classList.remove('on');
            media.classList.add('active');
            media.classList.add('on');
            window.scrollTo(0,0);
            let df_media = document.createDocumentFragment();
            let div_label_media = document.createElement('div');
            let div_label_media1 = document.createElement('div');
            let div_label_media2 = document.createElement('div');
            div_label_media.className = 'label_media';
            div_label_media1.innerHTML = 'Actors';
            div_label_media1.className = 'media1';
            div_label_media2.innerHTML = 'Media';
            div_label_media2.className = 'media2';
            div_label_media.append(div_label_media1);
            div_label_media.append(div_label_media2);
            media.append(div_label_media);
            person.known_for.forEach((item) => {
            let div1_media = document.createElement('div');
            let div1_img = document.createElement('div');
            let div1_p = document.createElement('div');
            let p1_media = document.createElement('p');
            let p2_media = document.createElement('p');
            let p3_media = document.createElement('p');
            let p4_media = document.createElement('p');
            let img_media = document.createElement('img');
            p1_media.innerHTML = item.title || item.name;
            p2_media.innerHTML = item.media_type;
            let date = item.first_air_date || item.release_date;
            //console.log(date);
            if(date){
              let year = date.split('-')[0];
              p3_media.innerHTML = year;
            };
            let integer = Math.round(item.vote_average);
            let count = 0;
            while(count<integer){
              p4_media.innerHTML = p4_media.innerHTML + '&#x2663';
              count++;
            }
            if(!item.poster_path){
              img_media.src = './img/default-placeholder-image-768x768.png';
            }else{
            img_media.src = `https://image.tmdb.org/t/p/w185${item.poster_path}`;
            }
            img_media.alt = `Poster of ${item.title || item.name}`;
            //console.log(item.title);
            div1_media.setAttribute('data-id', person.id);
            div1_media.className = 'list';
            div1_media.append(div1_img);
            div1_media.append(div1_p);
            div1_img.append(img_media);
            div1_p.append(p1_media);
            div1_p.append(p4_media);
            div1_p.append(p2_media);
            div1_p.append(p3_media);
            df_media.append(div1_media);
            });
            media.append(df_media);
            let back = document.querySelector('.media1');
            back.addEventListener('click',function(){
              SEARCH.searchedName = input.value;
              SEARCH.searchpeople();
              window.scrollTo(0,0);
            });
            history.pushState({},null,`#${name}/${id}`);
            console.log('add history from switchpage');
          }
        })
        //console.log(obj);
      }
    }else if(!hash){

      let sections = document.querySelectorAll('section');
      window.scrollTo(0,0);
    sections.forEach((section) => {
      section.classList.remove('active');
      let instruction = document.getElementById('instructions');
      instruction.classList.add('active');
    });
    APP.hidesortLabel();
      //history.go(-1);
    };
  }
};
//search is for anything to do with the fetch api
const SEARCH = {
  KEY:'',
  results:[],
  searchedName:'',
  rmsubmit(ev){
    ev.preventDefault();
    SEARCH.searchpeople();
  },
  searchpeople() {
    window.scrollTo(0,0);
    let instructions = document.getElementById('instructions');
    let actors = document.getElementById('actors');
    let media = document.getElementById('media');
    let input = document.getElementById('search');
    let searchPeople = input.value.trim();
    SEARCH.searchedName = searchPeople;
    let searchPeople_formal = searchPeople.charAt(0).toUpperCase() + searchPeople.slice(1); //normalize name
    //console.log(SEARCH.searchedName);
    if(searchPeople){
      let api_key = '8553e144eda4f4a6bd14577ca052a863';
      let url = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${searchPeople}&page=1&include_adult=false`;
      //console.log(searchPeople);
      instructions.classList.remove('active');
      actors.classList.add('active');
      media.classList.remove('active');
      actors.classList.remove('on2');
      actors.classList.add('on');
      media.innerHTML = '';
      let storageData = localStorage.getItem(`Chunyen-assign4-${searchPeople_formal}`);
      //console.log(storageData);
      if(storageData){
        SEARCH.results = JSON.parse(storageData);
        //history.replaceState({},null,`http://127.0.0.1:5500/#${SEARCH.searchedName}`);
        //SEARCH.showoverlay();
        ACTORS.showinfo();
        //history.go(-1);
      }else{
        fetch(url)
          .then(function (response) {
            if (response.ok){
              return response.json();
            }else{
              throw new Error('Bad response');
            }
          })
          .then(function (data) {
            SEARCH.results = data.results;
            SEARCH.showoverlay();
            ACTORS.showinfo();
            SEARCH.searchedName = searchPeople;
            input.value = SEARCH.searchedName;
            localStorage.setItem(`Chunyen-assign4-${searchPeople_formal}`, JSON.stringify(SEARCH.results));
            //history.pushState({},null,`http://127.0.0.1:5500/#${SEARCH.searchedName}`);
            //console.log(SEARCH.results);
          })
          .catch(function (err) {
            console.error(err);
            document.querySelector('main').innerHTML += '<p>Unable to fetch data</p>'
          });
      };
    }else{};
    let sortname = document.querySelector('.sortname');
    let sortpopularity = document.querySelector('.sortpopularity');
    sortname.addEventListener('click', SORT.sortName);
    sortpopularity.addEventListener('click', SORT.sortPopularity);
  },
  showoverlay(){
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('hide');
    let parray = document.querySelectorAll('.shape p');
    parray.forEach((p) => {
      p.classList.remove('hide');
    });
    SEARCH.hideoverlay();
  },
  hideoverlay(){
    window.setTimeout(function(){
      let overlay = document.querySelector('.overlay');
    overlay.classList.add('hide');
    let parray = document.querySelectorAll('.shape p');
    parray.forEach((p) => {
      p.classList.add('hide');
    });
    },2000);
  }
};

//actors is for changes connected to content in the actors section
const ACTORS = {
  showinfo(){
    APP.showsortLabel();
    let actors = document.getElementById('actors');
    actors.innerHTML ='';
    let df = document.createDocumentFragment();
    let div_label_actor = document.createElement('div');
    let div_label_actor1 = document.createElement('div');
    let div_label_actor2 = document.createElement('div');
    div_label_actor.className = 'label_actor';
    div_label_actor1.innerHTML = 'Actors';
    div_label_actor1.className = 'actor1';
    // div_label_actor2.innerHTML = 'Media';
    // div_label_actor2.className = 'actor2';
    div_label_actor.append(div_label_actor1);
    //div_label_actor.append(div_label_actor2);
    actors.append(div_label_actor);
    let div_label_media = document.createElement('div');
    let div_label_media1 = document.createElement('div');
    let div_label_media2 = document.createElement('div');
    div_label_media.className = 'label_media';
    div_label_media1.innerHTML = 'Actors';
    div_label_media1.className = 'media1';
    div_label_media2.innerHTML = 'Media';
    div_label_media2.className = 'media2';
    div_label_media.append(div_label_media1);
    div_label_media.append(div_label_media2);
    media.append(div_label_media);
    //console.log(SEARCH.results);
    SEARCH.results.forEach((person) => {
      let div1 = document.createElement('div');
      let div2 = document.createElement('div');
      let div3 = document.createElement('div');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      let p3 = document.createElement('p');
      let img = document.createElement('img');
      if(!person.profile_path){
        img.src='./img/avatar-1577909_640.png';
      }else{
      img.src=`https://image.tmdb.org/t/p/w185${person.profile_path}`;
      }
      img.alt = `Photo of ${person.name}`; 
      p1.innerHTML = person.name;
      p1.setAttribute('data-id', person.id);
      let root = Math.sqrt(person.popularity);
      let integer = Math.round(root);
      //console.log(integer);
      let count = 0;
      while(count<integer){
        p2.innerHTML = p2.innerHTML + '&#x2660';
        count++;
      };
      //p2.innerHTML = integer;
      p3.innerHTML = person.known_for_department;
      let media = document.getElementById('media');
      let listarr = document.querySelectorAll('.list');
      let df_media = document.createDocumentFragment();
      person.known_for.forEach((item) => {
        let div1_media = document.createElement('div');
        let div1_img = document.createElement('div');
        let div1_p = document.createElement('div');
        let p1_media = document.createElement('p');
        let p2_media = document.createElement('p');
        let p3_media = document.createElement('p');
        let p4_media = document.createElement('p');
        let img_media = document.createElement('img');
        p1_media.innerHTML = item.title || item.name;
        p2_media.innerHTML = item.media_type;
        let date = item.first_air_date || item.release_date;
        //console.log(date);
        if(date){
          let year = date.split('-')[0];
          p3_media.innerHTML = year;
        };
        let integer = Math.round(item.vote_average);
        let count = 0;
        while(count<integer){
          p4_media.innerHTML = p4_media.innerHTML + '&#x2663';
          count++;
        }
        if(!item.poster_path){
          img_media.src = './img/default-placeholder-image-768x768.png';
        }else{
        img_media.src = `https://image.tmdb.org/t/p/w185${item.poster_path}`;
        }
        img_media.alt = `Poster of ${item.title || item.name}`;
        //console.log(item.title);
        div1_media.setAttribute('data-id', person.id);
        div1_media.className = 'list';
        div1_media.append(div1_img);
        div1_media.append(div1_p);
        div1_img.append(img_media);
        div1_p.append(p1_media);
        div1_p.append(p4_media);
        div1_p.append(p2_media);
        div1_p.append(p3_media);
        df_media.append(div1_media);
        //console.log(div2);
      });
      media.append(df_media);
      div1.className = 'actor';
      div1.append(div2);
      div1.append(div3);
      div2.append(img);
      div3.append(p1);
      div3.append(p2);
      div3.append(p3);
      df.append(div1)
      // df.append(p4);
      //MEDIA.showmedia(person.known_for);
    });
    actors.append(df);
    let divs = document.querySelectorAll('.actor');
    divs.forEach((div) => {
      div.addEventListener('click', MEDIA.showmedia);
    });

    history.pushState({},null,`#${SEARCH.searchedName}`);
    console.log('add history from showinfo');
    
    //console.log('his +1');
    //console.log(location.href);
  }
};

//media is for changes connected to content in the media section
const MEDIA = {
  showmedia(ev){
    APP.hidesortLabel();
    let instructions = document.getElementById('instructions');
    let actors = document.getElementById('actors');
    let media = document.getElementById('media');
    window.scrollTo(0,0);
    let clickdiv = ev.currentTarget;
    let name = clickdiv.querySelector('p');
    let id = name.getAttribute('data-id');
    //console.log(id);
    let divs = document.querySelectorAll('#media .list');
    instructions.classList.remove('active');
    actors.classList.remove('active');
    actors.classList.remove('on');
    media.classList.add('active');
    media.classList.add('on');
    divs.forEach((actorname) => {
      if(actorname.getAttribute('data-id') === id){
        actorname.classList.remove('hide');
      }else{
        actorname.classList.add('hide');
      };
    });
    let back = document.querySelector('.media1');
    back.addEventListener('click',MEDIA.backToActor);
    history.pushState({},null,`#${SEARCH.searchedName}/${id}`);
    console.log('add history from showmedia');
    // let alive = document.querySelectorAll('#media div');
    // console.log(alive[3]);
    //console.log(location.pathname);
  },
  backToActor(ev){
    APP.showsortLabel();
    let sections  = document.querySelectorAll('section');
    window.scrollTo(0,0);
    sections.forEach((section) => {
      section.classList.remove('active');
      section.classList.remove('on');
      let actorPage = document.getElementById('actors');
      actorPage.classList.add('active');
      actorPage.classList.add('on2');
    });
    history.pushState({},null,`#${SEARCH.searchedName}`);
    console.log('add history from backtoactor');
    //console.log(location.pathname);
  }
};

//storage is for working with localstorage
const STORAGE = {
  //this will be used in Assign 4
};

//nav is for anything connected to the history api and location
const NAV = {
  //this will be used in Assign 4
};
const SORT = {
  sortName(){
    SEARCH.results.sort(function(a,b){
      if(a.name > b.name){
        return 1;
      }else if(a.name < b.name){
        return -1;
      }else{
        return 0;
      };
    });
    let media = document.getElementById('media');
    media.innerHTML = '';
    ACTORS.showinfo();
    let sortname = document.querySelector('.sortname');
    sortname.addEventListener('click', SORT.sortNamerev);
    sortname.removeEventListener('click',SORT.sortName);
  },
  sortPopularity(){
    SEARCH.results.sort(function(a,b){
      if(a.popularity > b.popularity){
        return 1;
      }else if(a.popularity < b.popularity){
        return -1;
      }else{
        return 0;
      };
    });
    let media = document.getElementById('media');
    media.innerHTML = '';
    ACTORS.showinfo();
    let sortpopularity = document.querySelector('.sortpopularity');
    sortpopularity.addEventListener('click', SORT.sortPopularityrev);
    sortpopularity.removeEventListener('click',SORT.sortPopularity);
  },
  sortNamerev(){
    SEARCH.results.sort(function(a,b){
      if(a.name < b.name){
        return 1;
      }else if(a.name > b.name){
        return -1;
      }else{
        return 0;
      };
    });
    let media = document.getElementById('media');
    media.innerHTML = '';
    ACTORS.showinfo();
    let sortname = document.querySelector('.sortname');
    sortname.addEventListener('click', SORT.sortName);
    sortname.removeEventListener('click',SORT.sortNamerev);
  },
  sortPopularityrev(){
    SEARCH.results.sort(function(a,b){
      if(a.popularity < b.popularity){
        return 1;
      }else if(a.popularity > b.popularity){
        return -1;
      }else{
        return 0;
      };
    });
    let media = document.getElementById('media');
    media.innerHTML = '';
    ACTORS.showinfo();
    let sortpopularity = document.querySelector('.sortpopularity');
    sortpopularity.addEventListener('click', SORT.sortPopularity);
    sortpopularity.removeEventListener('click',SORT.sortPopularityrev);
  }
};



//Start everything running
APP.init();
