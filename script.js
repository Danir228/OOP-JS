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

    addPostCheckbox(checkbox) {
        checkbox.insertAdjacentHTML('afterbegin', `
            <div class="checkbox_block">
                <input class="checkbox_block_item" id="checkbox5" type="checkbox" checked="checked" value="5">
                <label for="checkbox5">5 posts</label>
                <input class="checkbox_block_item" id="checkbox10" type="checkbox" value="10">
                <label for="checkbox10">10 posts</label>
                <input class="checkbox_block_item" id="checkbox30" type="checkbox" value="30">
                <label for="checkbox30">30 posts</label>
                <input class="checkbox_block_item" id="checkbox50" type="checkbox" value="50">
                <label for="checkbox50">50 posts</label>
                <input class="checkbox_block_item" id="checkbox100" type="checkbox" value="100">
                <label for="checkbox50">100 posts</label>
            </div>
        `);
    }

    addPaginationLink(pagination, defaultPostLength) {
        let arrLength = this.posts.length;
        let str = arrLength / defaultPostLength;
        for(let i = 0; i < str; i++) {
            let num = i + 1;
            pagination.insertAdjacentHTML('beforeend', `
                <span class="paginationLink">${num}</span>
            `);
        }
    }

    addPagination(parentSelector, defaultPostLength) {
        let paginationLink = document.querySelectorAll('.pagination span');
            paginationLink[0].classList.add('bgLink');

        let res = this.posts.slice(0, defaultPostLength);

        res.forEach(item => {
            let firstPostId = JSON.stringify(item.id);
            let firstPostUserId = JSON.stringify(item.userId);
            let firstPostTitle = JSON.stringify(item.title);
            let firstPostBody = JSON.stringify(item.body);
            parentSelector.insertAdjacentHTML('beforeend', `
            <div class="parentPost">
                <div class="postId">${firstPostId}</div>
                <div class="postUserId">${firstPostUserId}</div>
                <div class="postTitle">${firstPostTitle}</div>
                <div class="postBody">${firstPostBody}</div>
            </div>
            `);
        })

        paginationLink.forEach(item => {
            item.addEventListener('click', () => {
                parentSelector.innerHTML = '';
                let pageNum = +item.innerHTML;
                let start = (pageNum - 1) * defaultPostLength;
                let end = start + defaultPostLength;
                let result = this.posts.slice(start, end);
                result.forEach(item => {
                    let postId = JSON.stringify(item.id);
                    let postUserId = JSON.stringify(item.userId);
                    let postTitle = JSON.stringify(item.title);
                    let postBody = JSON.stringify(item.body);
                    parentSelector.insertAdjacentHTML('beforeend', `
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
    constructor(pagination, parentSelector, checkbox) {
        const fetchData = new FetchData();
        this.tweets = new Posts();
        this.pagination = document.querySelector(pagination);
        this.parentSelector = document.querySelector(parentSelector);
        this.checkbox = document.querySelector(checkbox);

        fetchData.getPost().then((data) => {
            data.forEach(this.tweets.addPost)
            this.renderPost();
            this.showPaginationlink();
        });
    }

    renderPost() {
        this.tweets.addPostCheckbox(this.checkbox);
        this.checkedCheckbox();
        this.tweets.addPaginationLink(this.pagination, this.defaultPostLength());
        this.tweets.addPagination(this.parentSelector, this.defaultPostLength());
        this.postLength();
    }

    showPaginationlink() {
        let paginationLink = document.querySelectorAll('.pagination span');
        paginationLink.forEach(item => {
            item.addEventListener('click', () => {
                paginationLink.forEach(item => {
                    item.classList.remove('bgLink');
                });
                item.classList.add('bgLink');
            })
        });
    }

    checkedCheckbox() {
        let checkboxItem = document.querySelectorAll('.checkbox_block_item');
        checkboxItem.forEach(item => {
            item.addEventListener('click', () => {
                checkboxItem.forEach(item => {
                    item.checked = false;
                });
                item.checked = true;
            });
        });
    }

    defaultPostLength() {
        let checkboxItem = document.querySelectorAll('.checkbox_block_item');
        let postsNum = 0;
        checkboxItem.forEach(item => {
            if (item.checked == true) {
                postsNum = +item.value;
            }
        })
        return postsNum
    }

    postLength() {
        let checkboxItem = document.querySelectorAll('.checkbox_block_item');
        checkboxItem.forEach(item => {
            item.addEventListener('click', () => {
                checkboxItem.forEach(item => {
                    if (item.checked == true) {
                        this.pagination.textContent = '';
                        this.parentSelector.textContent = '';
                        let postsNum = +item.value;
                        this.tweets.addPaginationLink(this.pagination, postsNum);
                        this.tweets.addPagination(this.parentSelector, postsNum);
                        this.showPaginationlink();
                    }
                })
            });
        });
    }

}

new Main(
    '.pagination',
    '.posts',
    '.main .container',
);
