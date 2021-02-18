class FetchData {
    getResourse = async url => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error (' Произошла ошибка: ' + response.status);
        }
        return response.json();
    }

    getPost = () => this.getResourse (
        'https://jsonplaceholder.typicode.com/posts'
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

    addPostCheckbox(parentSelector) {
        parentSelector.insertAdjacentHTML('afterbegin', `
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

    addPostDefault(parentSelector, pageNum, length) {
        let start = (pageNum - 1) * length;
        let end = start + length;
        let array = this.posts.slice(start, end);

        array.forEach(item => {
            let firstPostId = item.id;
            let firstPostTitle = item.title;
            let firstPostBody = item.body;
            parentSelector.insertAdjacentHTML('beforeend', `
            <div class="parentPost">
                <div class="postId">${firstPostId}</div>
                <div class="postTitle">${firstPostTitle}</div>
                <div class="postBody">${firstPostBody}</div>
            </div>
            `);
        })
    }

    iterationPaginationLink(parentSelector, index, length, selectIndex) {
        for(let i = index; i < length; i++) {
            let num = i + 1;
            parentSelector.insertAdjacentHTML('beforeend', `
                <div class="paginationLink ${i === selectIndex ? 'bgLink' : ''}">${num}</div>
            `);
        }
    }

    beginPagination(parentSelector, lengthLinks, length) {
        parentSelector.insertAdjacentHTML('afterbegin', `
            ${lengthLinks >= length + 1 ?
                '<div class="pointsLeft"><div id="arrowLeft"><i class="fas fa-angle-double-left"></i>begin</div><span>...</span></div>'
                :
                ''
            }
        `)
    }

    endPagination(parentSelector, lengthLinks, length) {
        parentSelector.insertAdjacentHTML('beforeend', `
            ${lengthLinks <= length - 1 ?
                '<div class="pointsRight"><div id="arrowRight"><i class="fas fa-angle-double-right"></i>end</div><span>...</span></div>'
                :
                ''
            }
        `)
    }

    addPaginationLink(parentSelector, index, length) {
        let arrLength = this.posts.length;
        let str = arrLength / length;
        let indexResult = index - 2;

        if (indexResult < 0) {
            indexResult = 0;
        }

        let lengthLinks = str < 5 ? str : indexResult + 5;

        if (lengthLinks <= str) {
            this.iterationPaginationLink(
                parentSelector,
                indexResult,
                lengthLinks,
                index
            );

            this.endPagination(parentSelector, lengthLinks, str);
            this.clickArrowPagination(
                parentSelector,
                Number(str - 5),
                str,
                "arrowRight"
            );

            this.beginPagination(parentSelector, lengthLinks, length);
            this.clickArrowPagination(
                parentSelector,
                0,
                length,
                "arrowLeft"
            );
        } else {
            let indexResult2 = index + 2;

            if (indexResult2 >= str) {
                indexResult2 = str;
            }

            let lengthLinks2 = str < 5 ? str : indexResult2 - 5;

            this.iterationPaginationLink(
                parentSelector,
                lengthLinks2,
                indexResult2,
                index
            );

            this.beginPagination(parentSelector, lengthLinks2, length);
            this.clickArrowPagination(
                parentSelector,
                0,
                length,
                "arrowLeft"
            );
        }

    }

    clickArrowPagination(parentSelector, index, length, arrow) {
        let arrowEl = document.getElementById(arrow);
        if (arrowEl === null) return;
        arrowEl.addEventListener('click', () => {
            parentSelector.innerHTML = '';
            this.iterationPaginationLink(
                parentSelector,
                index,
                index === 0 ? 5 : length,
            )
            if (arrow === "arrowLeft") {
                this.endPagination(parentSelector, index, length);
                this.clickArrowPagination(
                    parentSelector,
                    index,
                    length,
                    "arrowRight"
                );
            } else {
                this.beginPagination(parentSelector, length, index);
                this.clickArrowPagination(
                    parentSelector,
                    0,
                    length,
                    "arrowLeft"
                );
            }
        });
    }

}

class Main {
    constructor(paginationParent, postsParent, checkboxParent) {
        this.tweets = new Posts();
        this.paginationParent = document.querySelector(paginationParent);
        this.postsParent = document.querySelector(postsParent);
        this.checkboxParent = document.querySelector(checkboxParent);

        const fetchData = new FetchData();

        fetchData.getPost().then((data) => {
            data.forEach(this.tweets.addPost)
            this.renderPost();
        });
    }

    renderPost() {
        this.tweets.addPostCheckbox(this.checkboxParent);
        this.checkedCheckbox();
        this.tweets.addPostDefault(
            this.postsParent,
            1,
            this.checkboxValue()
        );
        this.tweets.addPaginationLink(
            this.paginationParent,
            0,
            this.checkboxValue()
        );
        this.iterationCheckedCheckbox(
            this.checkboxParent,
            this.postsParent,
            this.paginationParent
        );
        this.clickPaginationLink(
            this.postsParent,
            this.paginationParent
        );
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

    checkboxValue() {
        let checkboxItem = document.querySelectorAll('.checkbox_block_item');
        let valueCheck = 0;
        checkboxItem.forEach(item => {
            if (item.checked == true) {
                valueCheck = +item.value;
            }
        })
        return valueCheck
    }

    iterationCheckedCheckbox(
        checkboxParent,
        postsParent,
        paginationParent
    ) {
        checkboxParent.addEventListener('click', (event) => {
            const target = event.target;
            if (target.checked == true) {
                postsParent.textContent = '';
                paginationParent.textContent = '';
                this.tweets.addPostDefault(
                    postsParent,
                    1,
                    this.checkboxValue()
                );
                this.tweets.addPaginationLink(
                    paginationParent,
                    0,
                    this.checkboxValue()
                );
            }
        });
    }

    clickPaginationLink(
        postsParent,
        paginationParent
    ) {
        paginationParent.addEventListener('click', (event) => {
            const target = event.target;
            let paginationLink = document.querySelectorAll('.paginationLink');
            paginationLink.forEach(item => {
                if (target === item) {
                    postsParent.innerHTML = '';
                    paginationParent.innerHTML = '';
                    let pageNum = 0;
                    pageNum = +target.innerHTML - 1;

                    this.tweets.addPostDefault(
                        postsParent,
                        pageNum + 1,
                        this.checkboxValue()
                    );
                    this.tweets.addPaginationLink(
                        paginationParent,
                        Math.round(pageNum),
                        this.checkboxValue()
                    );
                }
            })
        });
    }



}

new Main(
    '.pagination',
    '.posts',
    '.main .container',
);
