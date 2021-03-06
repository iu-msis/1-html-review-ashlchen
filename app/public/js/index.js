
const SomeApp = {
  data() {
    return {
    //   students: [],
    //   selectedStudent: null,
    //   offers: [],
      books: [],
      selectedBook: null,
      bookForm: {},
    }
  },
  computed: {},
  methods: {
      prettyData(d) {
          return dayjs(d)
          .format('D MMM YYYY')
      },
      prettyDollar(n) {
          const d = new Intl.NumberFormat("en-US").format(n);
          return "$ " + d;
      },
      selectStudent(s) {
          if (s == this.selectedStudent) {
              return;
          }
          this.selectedStudent = s;
          this.offers = [];
          this.fetchOfferData(this.selectedStudent);
      },
      fetchStudentData() {
          fetch('/api/student/')
          .then( response => response.json() )
          .then( (responseJson) => {
              console.log(responseJson);
              this.students = responseJson;
          })
          .catch( (err) => {
              console.error(err);
          })
      },
      fetchOfferData(s) {
          console.log("Fetching offer data for ", s);
          fetch('/api/offer/?student=' + s.id)
          .then( response => response.json() )
          .then( (responseJson) => {
              console.log(responseJson);
              this.offers = responseJson;
          })
          .catch( (err) => {
              console.error(err);
          })
          .catch( (error) => {
              console.error(error);
          });
      },
      fetchBooksData() {
        fetch('/api/books/')
        .then( response => response.json() )
        .then( (responseJson) => {
            console.log(responseJson);
            this.books = responseJson;
        })
        .catch( (err) => {
            console.error(err);
        })
    },
    selectBook(b) {
        if (b == this.selectedBook) {
            return;
        }
        this.selectedBook = b;
        this.books = [];
        this.fetchBooksData(this.selectedBook);
    },
    postBook(evt) {
        if (this.selectedBook === null) {
            this.postNewBook(evt);
        } else {
            this.postEditBook(evt);
        }
      },
    postNewBook(evt) {
        // this.bookForm.title = this.selectedBook.title;
        // console.log("Posting!", this.bookForm);
        alert("Created!");

        fetch('api/books/create.php', {
            method:'POST',
            body: JSON.stringify(this.bookForm),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
        .then( response => response.json())
        .then( json => {
            console.log("Returned from post:", json);
            this.books = json;
            this.bookForm = {};
        });
    },
    postEditBook(evt) {
        this.bookForm.id = this.selectedBook.id;
        // this.offerForm.id = this.selectedOffer.id;

        console.log("Updating!", this.bookForm);

        fetch('api/books/update.php', {
            method:'POST',
            body: JSON.stringify(this.bookForm),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then( response => response.json() )
          .then( json => {
            console.log("Returned from post:", json);
            // TODO: test a result was returned!
            this.offers = json;

            // reset the form
            this.resetBookForm();
          });
      },
      postDeleteBook(b) {
        if (!confirm("Are you sure you want to delete the book from "+b.title+"?")) {
          return;
        }
        console.log("Delete!", b);

        fetch('api/books/delete.php', {
            method:'POST',
            body: JSON.stringify(b),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then( response => response.json() )
          .then( json => {
            console.log("Returned from post:", json);
            // TODO: test a result was returned!
            this.offers = json;

            // reset the form
            this.resetBookForm();
          });
      },
      selectBookToEdit(b) {
          this.selectedBook = b;
          this.bookForm = Object.assign({}, this.selectedBook);
      },
      resetBookForm() {
          this.selectedBook = null;
          this.bookForm = {};
      }
  },
  created() {
      this.fetchBooksData();
  }

}

Vue.createApp(SomeApp).mount('#offerApp');
