'use strict';

let Moduls = (( Moduls ) => {
  // Common Function
  Moduls.scrollIntoViews = ( selector ) => {
    const scrollTo = document.querySelector( selector );
    scrollTo.scrollIntoView({ behavior: 'smooth' });
  }

  // Make navbar transparent when it is on the top;
  Moduls.navbarColorChange = () => {
    const navbar = document.querySelector('#navbar');
    const navbarHeight = navbar.getBoundingClientRect().height;
    document.addEventListener('scroll' , () =>{
      if( window.scrollY > navbarHeight ){
        navbar.classList.add('navbar--dark');
      }else{
        navbar.classList.remove('navbar--dark');
      }
    });
  }

  // Handle scrolling when tapping on the navbar menu
  Moduls.navbarClickScroll = () => {
    const navbarMenu = document.querySelector('.navbar__menu');
    const navitem = navbarMenu.querySelectorAll(`[data-link`);

    navbarMenu.addEventListener('click' , ( event ) =>{
      const target = event.target;
      const link = target.dataset.link;
      let selected = null;
      if(link === undefined){
        return;
      }
      navbarMenu.classList.remove('open');
      navitem.forEach( item => item.classList.remove('active') );
      selected = document.querySelector( `[data-link="${link}"]` );
      selected.classList.add('active');
      Moduls.scrollIntoViews( link );
    });
  }

  // Navbar toggle button for small screen
  Moduls.navbarToggle = () => {
    const navbarMenu = document.querySelector('.navbar__menu');
    const navbarToogleBtn = document.querySelector('.navbar__toggle-btn');
    navbarToogleBtn.addEventListener('click' , () =>{
      navbarMenu.classList.toggle('open');
    });
  }

  // Handle click on "contact me" button on home
  Moduls.contactScroll = () => {
    const homeContactBtn = document.querySelector('.home__contact');
    homeContactBtn.addEventListener('click', ( event ) =>{
      Moduls.scrollIntoViews('#contact')
    });
  }

  //Make home slawly fade to transparent as the window scrolls down
  Moduls.HomeOpacityAction = () => {
    const home = document.querySelector('.home__container');
    const homeHeight = home.getBoundingClientRect().height;
    document.addEventListener('scroll' , () =>{
      home.style.opacity = 1 - window.scrollY / homeHeight;
    });
  }

  // Show arrow up  button when scrolling down
  Moduls.arrowScrollTop = () => {
    const homeHeight = document.querySelector('.home__container').getBoundingClientRect().height;
    const arrowUp = document.querySelector('.arrow-up');
    document.addEventListener('scroll' , () =>{
      if(window.scrollY > homeHeight / 2){
        arrowUp.classList.add('visible');
      }else{
        arrowUp.classList.remove('visible');
      }
    });
    // Handle click on the "arrow up button"
    arrowUp.addEventListener('click' , () =>{
      Moduls.scrollIntoViews('#home');
    });
  }

  // Projects
  Moduls.projectFilter = () => {
    const workBtnContainer = document.querySelector('.work__categories');
    const projectContainer = document.querySelector('.work__projects');
    const projects = document.querySelectorAll('.project');
    workBtnContainer.addEventListener('click' , ( e ) =>{
      const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
      if(filter == null){
        return;
      }

      // Remove selection from the previous item select the new one
      const active = document.querySelector('.category__btn.selected');
      active.classList.remove('selected');
      const target = e.target.nodeName =='BUTTON' ? e.target : e.target.parentNode;
      target.classList.add('selected');

      projectContainer.classList.add('anim-out');
      setTimeout(() => {
        projects.forEach(( project ) => {
          if( filter === '*' || filter === project.dataset.type ){
            project.classList.remove('invisible');
          }else{
            project.classList.add('invisible');
          }
        })
        projectContainer.classList.remove('anim-out');
      }, 300);
    });
  }

  Moduls.navbarScrollActive = () => {
    // 1. 모든 섹션 요소들과 메뉴아이템을 가지고 온다
    // 2. IntersectionObserver 를 이용해서 모든 섹션들을 관찰한다.
    // 3. 보여지는 섹션에 해당하는 메뉴아이템을 활성화 시킨다.
    const sectionIds = [
      '#home' , 
      '#about' , 
      '#skills' , 
      '#work' , 
      // '#testimonials' , 
      '#contact' ,
    ];

    const sections = sectionIds.map( id => document.querySelector( id ) );
    const navItems = sectionIds.map( id => document.querySelector(`[data-link="${id}"]`));
    let selectedNavIndex = 0;
    let selectedNavItem = navItems[0];

    const selectNavItem = ( selected ) => {
      selectedNavItem.classList.remove('active');
      selectedNavItem = selected;
      selectedNavItem.classList.add('active');
    }
    
    const observerOptions = {
      root : null ,
      rootMargin : '0px' ,
      threshold : 0.3 ,
    }
    const observerCallback = ( entries , observer ) => {
      entries.forEach( entry => {
        if( !entry.isIntersecting && entry.intersectionRatio > 0 ){
          const index = sectionIds.indexOf(`#${entry.target.id}`);
          // 스크롤링이 아래로 되어서 페이지가 올라옴
          if( entry.boundingClientRect.y < 0){
            selectedNavIndex = index + 1;
          }else{
            selectedNavIndex = index - 1;
          }
        }
      })
    }

    const observer = new IntersectionObserver( observerCallback ,  observerOptions );
    sections.forEach( section => observer.observe( section ) );

    window.addEventListener('wheel' , () => {
      if(window.scrollY === 0){
        selectedNavIndex = 0;
      }else if( window.scrollY + window.innerHeight === document.body.clientHeight ){
        selectedNavIndex = navItems.length - 1;
      }
      selectNavItem( navItems[selectedNavIndex] );
    })
  }

  Moduls.scrollAnimation = () => {
    const saDefaultMargin = 200;
    let saTriggerMargin = 0;
    let saTriggerHeight = 0;
    const saElementList = document.querySelectorAll('.sa');

    const saFunc = () =>{
      for( const element of saElementList ){
        if(!element.classList.contains('show')){
         saTriggerMargin = saDefaultMargin;
        }
        saTriggerHeight = element.getBoundingClientRect().top + saTriggerMargin;
    
        if(window.innerHeight > saTriggerHeight) {
          let delay = element.dataset.saDelay ? element.dataset.saDelay : 0;
          setTimeout(() => {
              element.classList.add('show');
          }, delay);
        }
      }
    }
    window.addEventListener( 'load' , saFunc );
    window.addEventListener( 'scroll' , saFunc );
  }

  return Moduls;

})( window.Moduls || {} );

window.addEventListener('load', () => {
  Moduls.navbarColorChange();
  Moduls.navbarClickScroll();
  Moduls.navbarToggle();
  Moduls.contactScroll();
  Moduls.HomeOpacityAction();
  Moduls.arrowScrollTop();
  Moduls.projectFilter();
  Moduls.navbarScrollActive();
  Moduls.scrollAnimation();
});