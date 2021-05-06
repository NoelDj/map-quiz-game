"use strict";

window.addEventListener("DOMContentLoaded", start);

const countriesList = []
const copy = []
let numberOfCountries = 0;
let remainingCountries = 0;
const startButton = document.querySelector('button')
let findThisCountry = ''
let points = 0;
async function start() {


    let response = await fetch('asia.svg')
    let mySvgData = await response.text();
    document.querySelector('.map').innerHTML = mySvgData;
    manipulateSvg()
    startButton.addEventListener('click', startGame)

    document.querySelector('.toggle').addEventListener('click', endGame)
}

function manipulateSvg() {
    const allCountries = document.querySelectorAll('svg > *')
    allCountries.forEach(handleCountries)
    numberOfCountries = countriesList.length
}

function handleCountries(country) {
    countriesList.push(country.id)
    if(copy.length<countriesList.length){
        copy.push(country.id)
    }

    document.querySelector('#number').textContent = countriesList.length

    country.addEventListener('click', () => {
        updateGame(country)
    })

}

function updateGame(country) {

    const find = findThisCountry.toLowerCase()

    if (find === country.id) {
        points++


        let index = countriesList.indexOf(findThisCountry);

        if (index !== -1) {

            countriesList.splice(index, 1);

        }


        document.querySelector(`#${find}`).style.fill = 'green'
        country.querySelectorAll('path').forEach(path => path.style.fill = 'green')
        document.querySelectorAll(`#${find} .st5`).forEach(path => path.style.fill = 'green')
        document.querySelectorAll(`#${find} .st6`).forEach(path => path.style.fill = '#9eff9e')
    } else {

        let index = countriesList.indexOf(findThisCountry);

        if (index !== -1) {

            countriesList.splice(index, 1);

        }
        document.querySelector(`#${find}`).style.fill = 'red'
        document.querySelectorAll(`#${find} path`).forEach(path => path.style.fill = 'red')
        document.querySelectorAll(`#${find} .st5`).forEach(path => path.style.fill = 'red')
        document.querySelectorAll(`#${find} .st6`).forEach(path => path.style.fill = '#ff9e9e')
    }

    if (countriesList.length == 0) {
        updateModal()
        startButton.removeEventListener('click', startGame)
        startButton.addEventListener('click', endGame)
    } else {
        randomCountry(countriesList)
    }
    updateScore(points)
    createLabel(find)
}

function createLabel(find) {
    const country = document.querySelector(`#${find}`)
    const parent = document.querySelector('.game').getBoundingClientRect()

    const position = country.getBoundingClientRect()

    const left = (position.left + position.width / 2) - parent.left
    const top = (position.top + position.height / 2) - parent.top

    const label = document.createElement('p')
    label.classList.add('country-label')


    label.textContent = find.split('_').map(s => capitalize(s)).join(' ')
    label.style.left = Math.floor(((position.left + position.width/2) - parent.left)/parent.width*100)+ '%'
    label.style.top = ((position.top + position.height/2) - parent.top)/parent.height*100+'%'
    document.querySelector('.map').appendChild(label)

}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
}

function startGame() {
    points = 0
    updateScore(points)

    randomCountry(countriesList)

    document.querySelector('.overlay').style.display = 'none'
}

function updateScore(points) {

    remainingCountries = countriesList.length



    let remaining = remainingCountries


    if (remaining > 1) {
        remaining = `${remainingCountries} countries remaining`
    } else if (remaining == 1) {
        remaining = `${remainingCountries} country left`
    } else {
        remaining = 'Asia'
    }

    document.querySelector('.time').textContent = remaining
    document.querySelector('#points').textContent = points
}

function randomCountry(list) {

    findThisCountry = list[Math.floor(Math.random() * list.length)]
    document.querySelector('.country-name').textContent = findThisCountry.split('_').map(s => capitalize(s)).join(' ')
}

function updateModal() {
    document.querySelector('.overlay').style.display = 'flex'
    document.querySelector('.country-name').textContent = 'Country Guesser'

    document.querySelector('#points').textContent = points
    const percent = (points / numberOfCountries) * 100
    document.querySelector('.modal p').textContent = `You guessed ${Math.round(percent * 100) / 100}% countries correct.`

}

function endGame() {
    points = 0;

    randomCountry(copy)

    countriesList.length = 0
    remainingCountries = 0
    updateScore(points)
    document.querySelector('.country-name').textContent = findThisCountry.split('_').map(s => capitalize(s)).join(' ')
    document.querySelector('.overlay').style.display = 'none'

    start()
}
