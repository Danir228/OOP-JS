class FetchData {
    getResourse = async url => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error (' Произошла ошибка: ' + response.status);
        }
        return response.json();
    }

    getPost = () => this.getResourse (
        'http://jsonplaceholder.typicode.com/posts'
    )
}

class Post {
    constructor({userId, id, title, body}) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.body = body;
    }
}

class Posts {
    constructor({posts = [] } = {}) {
        this.posts = posts;
    }

    addPost = tweets => {
        this.posts.push(new Post(tweets));
    }

    addPaginationLink(element) {
        let arrLength = this.posts.length;
        let str = arrLength / 10;
        for(let i = 0; i < str; i++) {
            let num = i + 1;
            element.insertAdjacentHTML('beforeend', `
                <span class="paginationLink">${num}</span>
            `);
        }

    }

    addPagination(element) {
        let page = 10;
        let paginationElem = document.querySelectorAll('.pagination span');
        paginationElem[0].classList.add('bgLink');
        let res = this.posts.slice(0, 10);

        res.forEach(item => {
            let firstPostId = JSON.stringify(item.id);
            let firstPostUserId = JSON.stringify(item.userId);
            let firstPostTitle = JSON.stringify(item.title);
            let firstPostBody = JSON.stringify(item.body);
            element.insertAdjacentHTML('beforeend', `
            <div class="parentPost">
                <div class="postId">${firstPostId}</div>
                <div class="postUserId">${firstPostUserId}</div>
                <div class="postTitle">${firstPostTitle}</div>
                <div class="postBody">${firstPostBody}</div>
            </div>
            `);
        })

        paginationElem.forEach(item => {
            item.addEventListener('click', () => {
                element.innerHTML = '';
                let pageNum = +item.innerHTML;
                let start = (pageNum - 1) * page;
                let end = start + page;
                let result = this.posts.slice(start, end);
                result.forEach(item => {
                    let postId = JSON.stringify(item.id);
                    let postUserId = JSON.stringify(item.userId);
                    let postTitle = JSON.stringify(item.title);
                    let postBody = JSON.stringify(item.body);
                    element.insertAdjacentHTML('beforeend', `
                    <div class="parentPost">
                        <div class="postId">${postId}</div>
                        <div class="postUserId">${postUserId}</div>
                        <div class="postTitle">${postTitle}</div>
                        <div class="postBody">${postBody}</div>
                    </div>
                    `);
                })
            })
        })
    }
}

class Main {
    constructor(pagination, parentSelector) {
        const fetchData = new FetchData();
        this.tweets = new Posts();
        this.pagination = document.querySelector(pagination);
        this.parentSelector = document.querySelector(parentSelector);

        fetchData.getPost().then((data) => {
            data.forEach(this.tweets.addPost)
            this.renderPost();
        });
    }

    renderPost() {
        this.tweets.addPaginationLink(this.pagination);
        this.tweets.addPagination(this.parentSelector);
    }

}

new Main(
    '.pagination',
    '.posts'
);
