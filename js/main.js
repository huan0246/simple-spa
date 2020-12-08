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
    btn.addEventListener('click',SEARCH.searchpeople);
    let h1 = document.querySelector('h1');
    h1.addEventListener('click', APP.addlistener);
    let input = document.getElementById('search');
    input.value = '';
  }
};
//search is for anything to do with the fetch api
const SEARCH = {
  results:[],
  searchpeople(ev) {
    ev.preventDefault();
    window.scrollTo(0,0);
    let instructions = document.getElementById('instructions');
    let actors = document.getElementById('actors');
    let media = document.getElementById('media');
    let input = document.getElementById('search');
    let searchPeople = input.value.trim();
    //console.log(searchPeople);
    if(searchPeople){
    let api_key = '8553e144eda4f4a6bd14577ca052a863';
    let url = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${searchPeople}&page=1&include_adult=false`;
    //console.log(searchPeople);
    instructions.classList.remove('active');
    actors.classList.add('active');
    media.classList.remove('active');
    media.innerHTML = '';
    
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
        ACTORS.showinfo();
      })
      .catch(function (err) {
        console.error(err);
        document.querySelector('main').innerHTML += '<p>Unable to fetch data</p>'
      });
    }else{};
  }
};

//actors is for changes connected to content in the actors section
const ACTORS = {
  showinfo(){
    let actors = document.getElementById('actors');
    actors.innerHTML ='';
    let df = document.createDocumentFragment();
    let div_label_actor = document.createElement('div');
    let div_label_actor1 = document.createElement('div');
    let div_label_actor2 = document.createElement('div');
    div_label_actor.className = 'label_actor';
    div_label_actor1.innerHTML = 'Actors';
    div_label_actor1.className = 'actor1';
    div_label_actor2.innerHTML = 'Media';
    div_label_actor2.className = 'actor2';
    div_label_actor.append(div_label_actor1);
    div_label_actor.append(div_label_actor2);
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
    console.log(SEARCH.results);
    SEARCH.results.forEach((person) => {
      let div1 = document.createElement('div');
      let div2 = document.createElement('div');
      let div3 = document.createElement('div');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      let p3 = document.createElement('p');
      let img = document.createElement('img');
      img.src=`https://image.tmdb.org/t/p/w185${person.profile_path}`;
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
        img_media.src = `https://image.tmdb.org/t/p/w185${item.poster_path}`;
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
    })
  }
};

//media is for changes connected to content in the media section
const MEDIA = {
  showmedia(ev){
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
    media.classList.add('active');
    divs.forEach((actorname) => {
      if(actorname.getAttribute('data-id') === id){
        actorname.classList.remove('hide');
      }else{
        actorname.classList.add('hide');
      };
    });
    let back = document.querySelector('.media1');
    back.addEventListener('click',MEDIA.backToActor);
    // let alive = document.querySelectorAll('#media div');
    // console.log(alive[3]);
  },
  backToActor(ev){
    let sections  = document.querySelectorAll('section');
    window.scrollTo(0,0);
    sections.forEach((section) => {
      section.classList.remove('active');
      let actorPage = document.getElementById('actors');
      actorPage.classList.add('active');
    })
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

//Start everything running

APP.init();
