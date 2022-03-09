'use strict';

function titleClickHandler(event) {
  // console.log('Link was clicked!');
  // console.log(event);
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  // console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  // console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  // console.log(customSelector);
  titleList.innerHTML = '';
  // console.log(titleList);
  let html = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(articles);
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    // console.log(article);
    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    // console.log(articleTitle);
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    // console.log(linkHTML);
    html = html + linkHTML;
    // console.log(html);
  }
  /* insert link into titleList */
  // titleList.insertAdjacentHTML("beforeend", html);
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  // console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    min: 999999,
    max: 0
  };
  // console.log(tags);
  for(let tag in tags){
    // console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    } else if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * (optCloudClassCount - 1) + 1);
  const classHTML = optCloudClassPrefix + classNumber;
  // console.log(classHTML);
  return classHTML;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll('article');
  // console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    // console.log(tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    // console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      // console.log(tag);
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      // console.log(linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
      // console.log(allTags);
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.insertAdjacentHTML('afterbegin', html);
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  // console.log('tagsParams: ', tagsParams);
  // console.log(allTags);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    // console.log(tag);
  /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a> ' + ' (' + allTags[tag] + ') ' + '</li>';
    // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a>' + '</li>';
    // console.log(tagLinkHTML);
    allTagsHTML += tagLinkHTML;
    // allTagsHTML += '<li><a href="#" class="">' + tag + '</a>' + ' (' + allTags[tag] + ')' + '</li>';
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const tagHref = clickedElement.getAttribute('href');
  // console.log(tagHref);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = tagHref.replace('#tag-', '');
  // console.log(tag);
  /* find all tag links with class active */
  const tagLinksActive = document.querySelectorAll('a.active[href^="#tag-"]');
  // console.log(tagLinksActive);
  /* START LOOP: for each active tag link */
  for (let tagA of tagLinksActive) {
    /* remove class active */
    tagA.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagsLinks = document.querySelectorAll('a[href="' + tagHref + '"]');
  // console.log(allTagsLinks);
  /* START LOOP: for each found tag link */
  for (let tagL of allTagsLinks) {
    /* add class active */
    tagL.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const allLinksTag = document.querySelectorAll('a[href^="#tag-"]');
  // console.log(allLinksTag);
  /* START LOOP: for each link */
  for (let link of allLinksTag) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    // console.log('Link' + link);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){
  const articles = document.querySelectorAll('article');
  for(let article of articles){
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    // console.log(authorWrapper);
    // let html = '';
    const articleAuthor = article.getAttribute('data-author');
    // console.log(articleAuthor);
    const linkHTML = '<a href="#">' + articleAuthor + '</a>';
    // console.log(linkHTML);
    authorWrapper.innerHTML = linkHTML;
  }
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const author = clickedElement.innerHTML;
  // console.log('Kliknięto w ' + author);
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const allAuthors = document.querySelectorAll('.post-author a');
  // console.log(allAuthors);
  for(let author of allAuthors){
    author.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
