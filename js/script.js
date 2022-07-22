let list = document.querySelector('.promo__interactive-list')
let promo__bg = document.querySelector('.promo__bg')
let promo__genre = promo__bg.querySelector('.promo__genre')
let promo__title = promo__bg.querySelector('.promo__title')
let promo__descr = promo__bg.querySelector('.promo__descr')
let imdb = promo__bg.querySelector('.imdb')
let mvsearch = promo__bg.querySelector('.mvsearch')
let search = document.querySelector('#search')
let promo__menu_list = document.querySelector('.promo__menu-list').firstChild.nextSibling
let genres = []
let form = document.forms.add
let data


let url = "http://localhost:3001/movies"


function getData() {
    axios.get(url)
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                reload(res.data)
                data = res.data
                reloadGenres(res.data)
            }
        })
        .catch(err => console.log(err))
}
getData()




search.onkeyup = () => {
    let filtered = data.filter(item => item.Title.toLowerCase().includes(search.value.toLowerCase().trim()))

    showMovie(filtered[0])

    reload(filtered)
}


function reload(arr) {
    list.innerHTML = ""

    arr.forEach((item, index) => {
        let name = document.createElement('li')
        let del = document.createElement('div')

        name.innerHTML = `${index + 1}. ${item.Title}`
        name.classList.add('promo__interactive-item')
        del.classList.add('delete')

        list.append(name)
        name.append(del)

        // functions
        name.onclick = () => {
            showMovie(item)
        }

        del.onclick = () => {
            axios.delete(url + '/' + item.id)
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        getData()
                    }
                })
        }

    });
}
// <!-- <li><a class="promo__menu-item promo__menu-item_active" href="#">Фильмы</a></li>


function reloadGenres(arr) {
    for (let item of arr) {
        genres.push(item.myGenre)
    }
    arr = new Set(genres)
    arr = [...arr]
    promo__menu_list.innerHTML = ""

    for (let item of arr) {
        let li = document.createElement('li')
        let a = document.createElement('a')

        if (arr.indexOf(item) == 0) {
            a.classList.add('promo__menu-item_active')
        }
        a.classList.add('promo__menu-item')

        a.href = "#"

        a.innerHTML = item

        li.append(a)
        promo__menu_list.append(li)

        li.onclick = () => {
            promo__menu_list.querySelectorAll('li').forEach(element => element.firstChild.classList.remove('promo__menu-item_active'));

            a.classList.add('promo__menu-item_active')

            let key = a.innerHTML

            let filtered = data.filter(item => item.myGenre.toLowerCase() === key.toLowerCase())

            showMovie(filtered[0])

            reload(filtered)

        }
    }
}

function showMovie(data) {
    promo__bg.style.background = `url('${data.Poster}')`
    promo__genre.innerHTML = data.Genre
    promo__title.innerHTML = data.Title
    promo__descr.innerHTML = data.Plot
    imdb.innerHTML = `IMDb: ${data.imdbRating}`
    mvsearch.innerHTML = `IMDb: ${data.Metascore}`
}

form.onsubmit = (event) => {
    event.preventDefault()

    let newMovie = {
        id: Math.random(),
        myGenre: 'Comedy'
    }

    let fm = new FormData(form)
    fm.forEach((value, key) => {
        newMovie[key] = value
    })

    axios.post(url, newMovie)
        .then(res => {
            if(res.status == 200 || res.status == 201) {
                getData()
            }
        })
}