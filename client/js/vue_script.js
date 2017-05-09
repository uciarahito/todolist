var app = new Vue({
    el: '#app',
    data: {
        // message: "Hello Vue!",
        // user: {
        //     username: "",
        //     password: "",
        //     email: ""
        // },
        // todo: {},
        // is_login: false
    },
    methods: {
        // onSubmitForm: (e) => {
        //     e.preventDefault();
        //     // alert(app.user.username)
        //
        //     axios.post('http://localhost:3000/users/signin', {
        //             username: app.user.username,
        //             password: app.user.password
        //         })
        //         .then(function(response) {
        //             // get the token, save in local storage
        //             console.log(response);
        //             localStorage.setItem('token', response.data);
        //             console.log(localStorage.token);
        //
        //             window.location.href = "todo.html"
        //
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        //
        //
        // }, // end of onSubmitForm
        // signOut: () => {
        //     localStorage.removeItem('token');
        //
        //     this.is_login = false;
        //     window.location.href = 'index.html'
        // } // end of signOut
    },
    created: () => {

        // axios.get(
        //         'http://localhost:3000/api/todos', {
        //             headers: {
        //                 token: localStorage.token
        //             }
        //         }
        //     )
        //     .then(response => {
        //         console.log(response);
        //
        //         this.todo = response.data;
        //
        //         if (localStorage.token != null)
        //             this.is_login = true;
        //
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })

    } // end of created
}) // end of var app