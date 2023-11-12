
var edits = document.getElementsByClassName("fa-edit");
var trash = document.getElementsByClassName("fa-trash-o");
const stars = document.querySelectorAll(".stars i")
var pass = document.querySelector('.hide-pass')


//hide user password

pass.addEventListener('click', function(){
  const password = document.querySelector('.password')

  password.classList.toggle('hidden')
})



//Create randomize for random restuarant choice. I want it to be based on star rating 3-5
document.getElementById("randomizerBtn").addEventListener('click', function() {
  fetch('/messages/randomize')
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(data => {
      //data objects needs to have elements 
      if (data.length > 0) {
        //math random
        const randomOption = data[Math.floor(Math.random() * data.length)];

        //adding data to the div!
        document.getElementById("randomizedResult").innerHTML = `
          <h3>Random Restaurant</h3>
          <p>${randomOption.name}</p>
          <p>Recent Rating: ${randomOption.star}</p>
        `;
      } else {
        //if no elements in data object, return alert to user
        document.getElementById("randomizedResult").innerHTML = "No options available.";
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
});


//create an array from the edit button and target each individual one

Array.from(edits).forEach(function(element) {
  element.addEventListener('click', function(){

    //target the closest message box to the update icon that is clicked
    const listItem = this.closest('.message')
    const name = listItem.querySelector('.name').textContent
    const msg = listItem.querySelector('.msg').textContent
    const id = listItem.dataset.id

    //pull new data from the revealed form for updates
    const newRestaurantValue = listItem.querySelector('[name="updateName"]').value;
    const newMessageValue = listItem.querySelector('[name="updateMsg"]').value;
    const newVisitValue = listItem.querySelector('[name="updateLastVisited"]').value;
    const newTypeValue = listItem.querySelector('[name="updateType"]').value;

    //reveal input when clicked once, then hide the input box when clicked again
    const editingDiv = listItem.querySelector('.editing');
    editingDiv.classList.toggle('editon')
    editingDiv.classList.toggle('hidden')


    fetch('messages/update', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'id': id,
        'name': name,
        'msg': msg,
        'updateName': newRestaurantValue,
        'updateMsg': newMessageValue,
        'updateType': newTypeValue,
        'updateDate': newVisitValue,

      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
    })
    .catch(err =>{
      console.error('Error:', err)
    })
  });
});


//Create an arraay from the star icons 

stars.forEach((star, index1) =>{
  star.addEventListener('click', function(){
    const starArr = Array.from(this.parentNode.querySelectorAll('.stars i'))
    const starIndex = starArr.indexOf(this) 
    const id = this.dataset.id
    fetch('messages', {
      method: 'put',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id,
        'amount': starIndex
      })
    })
    .then(data => {
      console.log(data)
      starArr.forEach((star, index2) =>{
        starIndex >= index2 ? star.classList.add('active') : star.classList.remove('active')
      })
      window.location.reload(true)
    })
    // starArr.forEach((star, index2) =>{
    //   starIndex >= index2 ? star.classList.add('active') : star.classList.remove('active')
    // })
    

  })
})


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const listItem = this.closest('.message')
    const name = listItem.querySelector('.name').textContent
    const id = this.dataset.id

    fetch('messages', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'id': id,
      })
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});
