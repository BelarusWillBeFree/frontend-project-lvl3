import onChange from 'on-change';

const showFeedBack = (state) => {
    const feedback = state.view.feedback;
    const { status } = state;
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');
    feedback.classList.add(`text-${status === 'error' ? 'danger' : 'success' }`);
    feedback.textContent = state.i18n.t(state.message.pathI18n);
};

const setClassesFromStr = (element, strClass) => {
    strClass.split(' ').forEach((classForAdd)=>{
        element.classList.add(classForAdd);
    });
}

const refreshFeeds = (state) => {
    const { feedDiv } = state.view;
    const { feeds } = state;
    feedDiv.innerHTML = '';
    const divCard = document.createElement('div');
    setClassesFromStr(divCard, 'card border-0');
    divCard.innerHTML = `<div class="card-body"><h2 class="card-title h4">${state.i18n.t('elemets.title_feeds')}</h2></div>`;
    const ul = document.createElement('ul');
    feeds.forEach((item) => {
        if (item.title !== undefined) {
            const li = document.createElement('li');
            setClassesFromStr(li, 'list-group-item border-0 border-end-0');
            li.innerHTML = `<h3 class="h6 m-0">${item.title}</h3> <p class="m-0 small text-black-50">${item.description}</p>`;
            ul.append(li);
        }
    });
    divCard.append(ul);
    feedDiv.append(divCard);
};

const changeColorInLink = (idPost, state) => {
    const needAddIdPost = state.view.viewedPosts.filter(elem => elem === idPost).length === 0;
    if (needAddIdPost) {
        state.view.viewedPosts.push(idPost);
        const linkChangeColor = document.querySelector(`a[data-post-id="${idPost}"]`);
        linkChangeColor.classList.remove('fw-bold');
        linkChangeColor.classList.add('fw-normal');
    }
}

const refreshPosts = (state) => {
    const { postsDiv } = state.view;
    const { posts } = state;
    postsDiv.innerHTML = '';
    const divCard = document.createElement('div');
    setClassesFromStr(divCard, 'card border-0');
    divCard.innerHTML = `<div class="card-body"><h2 class="card-title h4">${state.i18n.t('elemets.title_posts')}</h2></div>`;
    const ul = document.createElement('ul');
    setClassesFromStr(ul, 'list-group border-0 rounded-0');
    posts.forEach((item) => {
        const li = document.createElement('li');
        setClassesFromStr(li, 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');

        const link = document.createElement('a');
        link.setAttribute('href', item.link);
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
        link.setAttribute('data-post-id', item.idPost);
        const linkViewed = state.view.viewedPosts.filter(elem => elem === item.idPost).length > 0;
        setClassesFromStr(link, linkViewed ? 'fw-normal' : 'fw-bold');
        link.textContent = item.title;
        link.addEventListener('click', (objEvent) => {
            const idPost = objEvent.target.getAttribute('data-post-id');
            changeColorInLink(idPost, state);
        });

        const button = document.createElement('button');
        setClassesFromStr(button, 'btn btn-outline-primary btn-sm');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modal');
        button.setAttribute('data-post-id', item.idPost);
        button.textContent = 'Просмотр';
        button.addEventListener('click', (objEvent) => {
            const idPost = objEvent.target.getAttribute('data-post-id');
            const [filteredPost, ] = state.posts.filter((post) => (post.idPost === idPost));
            const { modal } = state.view;
            const title = modal.querySelector('.modal-title');
            title.textContent = filteredPost.title;
            const body = modal.querySelector('.modal-body');
            body.innerHTML = `<p>${filteredPost.description}</p>`;
            const btnRead = modal.querySelector('.full-article');
            btnRead.setAttribute('href', filteredPost.link);
            changeColorInLink(idPost, state);
        });
        li.append(link);
        li.append(button);
        ul.append(li);
    });
    divCard.append(ul);
    postsDiv.append(divCard);
};

export default (state) => {
    return onChange(state, (path) => {
        switch (true) {
            case path === 'message.pathI18n':
                showFeedBack(state);
                break;
            case path==='feeds':
                state.view.urlInput.value = '';
                state.view.urlInput.focus();
                refreshFeeds(state);
                refreshPosts(state);
                break;
            case /^feeds\./.test(path):
                refreshFeeds(state);
                break;
            case path === 'posts':
                refreshPosts(state);
                break;
            default:
        }
    });
}