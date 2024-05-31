
var data = []
var sort = 0
var sort_reverse = false

const url = document.getElementById("enter")
const load = document.getElementById("load")
const clear = document.getElementById("clear")
const controls = document.getElementsByClassName("controls")[0]
const after = document.getElementsByClassName("after")[0]
const count = document.getElementById("count")
const noshow = document.getElementById("noshow")
const show = document.getElementById("show")
const nosort = document.getElementById("nosort")
const table = document.getElementsByTagName("table")[0]

function enter() {
    if (url.value) {
        load.disabled = false
    } else {
        load.disabled = true
    }
}

function clear_() {
    data = []
    url.value = ""
    load.disabled = true
    controls.hidden = true
    after.hidden = true
    show.disabled = false
}
clear.onclick = () => clear_()
noshow.onclick = () => clear_()

load.onclick = () => {
    async function parse(url) {
        let response = await fetch(url)
            .then((response) => {
                return response
            },
                (error) => {
                    return error
                })
        if (response?.ok) return [await response.json(), "ok"]
        return [response, "error"]
    }

    parse(url.value)
        .then((data_) => {
            console.log(data_)
            if (data_[1] == "ok") {
                data = data_[0]
                count.textContent = data.length
                controls.hidden = false
            } else {
                data_ = data_[0]
                let error_ = document.createElement("div")
                error_.className = "error_message"
                if (data_.status == 404) error_.textContent = "404 not found"
                else error_.textContent = data_.message
                document.getElementsByClassName("main")[0].appendChild(error_)
                error_.addEventListener("click", e => e.target.remove())
            }
        })
}

function clear_table() {
    for (let i = 0; i<data.length; i++) {
        document.getElementsByTagName("tr")[1].remove()
    }
}

function draw_table() {
    after.hidden = false
    data = data.sort((a, b) => {
        if (sort == 0) {
            if (a.id < b.id) return -1 * (1-2*sort_reverse)
            else if (a.id > b.id) return 1 * (1-2*sort_reverse)
            else return 0
        } else
        if (sort == 1) {
            if (a.name < b.name) return -1 * (1-2*sort_reverse)
            else if (a.name > b.name) return 1 * (1-2*sort_reverse)
            else return 0
        } else
        if (sort == 2) {
            if (a.address.zipcode < b.address.zipcode) return -1 * (1-2*sort_reverse)
            else if (a.address.zipcode > b.address.zipcode) return 1 * (1-2*sort_reverse)
            else return 0
        } else
        {
            if (a.address.city < b.address.city) return -1 * (1-2*sort_reverse)
            else if (a.address.city > b.address.city) return 1 * (1-2*sort_reverse)
            else return 0
        }
    })
    for (let i = 0; i<data.length; i++) {
        id_ = data[i].id
        name_ = data[i].name
        zipcode = data[i].address.zipcode
        city_ = data[i].address.city
        let tr = document.createElement("tr")
        let td_id = document.createElement("td")
        let td_name = document.createElement("td")
        let td_zipcode = document.createElement("td")
        let td_city = document.createElement("td")
        td_id.textContent = id_
        td_name.textContent = name_
        td_zipcode.textContent = zipcode
        td_city.textContent = city_
        tr.appendChild(td_id)
        tr.appendChild(td_name)
        tr.appendChild(td_zipcode)
        tr.appendChild(td_city)
        table.appendChild(tr)
    }
    show.disabled = true
}

show.onclick = () => {
    draw_table()
}

function sort_by(n) {
    if (n == sort) {
        sort_reverse = -sort_reverse + 1
    } else {
        sort = n
        sort_reverse = 0
    }
    clear_table()
    draw_table()
}

nosort.onclick = () => {
    sort_by(1)
    sort_reverse = 0
    sort_by(0)
}
