$(document).ready(function() {
  
  $("#add_book_btn").click(addBook);
  $("#edit_book_btn").click(editBook);

  async function addBook() {
    //Add book through a get request to /api/add
    let title = $("#add_title").val();
    let author = $("#add_author").val();
    let isbn = $("#add_isbn").val();
    let category = $( "#add_book_category option:selected" ).text();
    let agegroup = $('input[name="agegroup"]:checked').val();
    let url = `/api/add_book?title=${title}&author=${author}&isbn=${isbn}&category=${category}&agegroup=${agegroup}`
    let message = await fetch(url);
    let data = await message.json()
    $("#add_book_message").html(data.message);

    //Clear form fields
    $("#add_title").val("");
    $("#add_author").val("");
    $("#add_isbn").val("");
    $('#add_book_category').prop('selectedIndex',0);
    $('input[name="agegroup"]').prop('checked', false);
  }

  async function editBook() {
    //Edit book through a get request to /api/add
    let id = $("#edit_id").val();
    let title = $("#edit_title").val();
    let author = $("#edit_author").val();
    let isbn = $("#edit_isbn").val();
    let category = $( "#edit_book_category option:selected" ).text();
    let agegroup = $('input[name="agegroup"]:checked').val();
    let url = `/api/edit_book?title=${title}&author=${author}&isbn=${isbn}&category=${category}&agegroup=${agegroup}&id=${id}`
    let message = await fetch(url);
    let data = await message.json()
    $("#edit_book_message").html(data.message);
  }
});