var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        username: '',
        password: '',
        appTitle: 'Todo Task List App',
        displayTitle: true,
        displayTasks: true,
        displayProgressBar: false,
        displayAddTasks: true,
        displayTaskStatistics: false,
        displayedTasksStat: 'totalTasks',
        deletedTasks: 0,
        tasks: [],
        todos: []
    },
    methods: {
        loginPage: () => {
            window.location.href = 'login.html'
        },
        onLoginLocal() {
            // alert('hello')
            let self = this
            axios.post('http://localhost:3000/api/signin', {
                    username: self.username,
                    password: self.password
                })
                .then(response => {
                    console.log(response);
                    if (response.data.hasOwnProperty('err')) {
                        self.message = response.data.err.errmsg
                        alert('Login is error')
                    } else {
                        self.message = response.data.message

                        localStorage.setItem('token', response.data.token)
                        window.location.href = 'index.html'
                    }
                })
                .catch(err => {
                    alert('Username Password Invalid')
                    self.username = ''
                    self.password = ''
                })
        },
        changeAppTitle: function(event) {
            this.appTitle = event.target.value;
        },
        addTask: function(event) {
            event.preventDefault();

            if (this.tasks.name !== '' && this.tasks.name !== undefined) {
                this.tasks.push({
                    name: this.tasks.name,
                    done: false,
                });
            }
        },
        deleteTask: function(task) {
            this.tasks.splice(this.tasks.indexOf(task), 1);
            this.deletedTasks++;
        },
        changeTotalTasks: function() {
            this.displayedTasksStat = 'totalTasks';
        },
        changeLeftToDo: function() {
            this.displayedTasksStat = 'leftToDo';
        },
        changeCheckMarked: function() {
            this.displayedTasksStat = 'checkMarked';
        },
        changeDeleted: function() {
            this.displayedTasksStat = 'deletedTasks';
        }
    },
    created: () => {
        axios.get(`http://localhost:3000/api/todo/login`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                let dataTodo = response.data.todo
                this.todos = dataTodo
                // console.log('--------');
            })
            .catch(error => {
                alert('error')
                console.log(error)
            })
    },
    computed: {
        checkMarkedTasks: function() {
            let count = 0;
            for (let i = 0; i < this.tasks.length; ++i) {
                if (this.tasks[i].done == true) {
                    count++;
                }
            }
            return count;
        },
        leftToDo: function() {
            return this.tasks.length - this.checkMarkedTasks;
        },
        displayedTasksStatView: function() {
            if (this.displayedTasksStat == 'totalTasks') {
                return 'Total Tasks: ' + this.tasks.length;
            } else if (this.displayedTasksStat == 'leftToDo') {
                return 'Tasks Left: ' + this.leftToDo;
            } else if (this.displayedTasksStat == 'checkMarked') {
                return 'Check Marked Tasks: ' + this.checkMarkedTasks;
            } else if (this.displayedTasksStat == 'deletedTasks') {
                return 'Deleted Tasks: ' + this.deletedTasks;
            }
        },
        manageable: function() {
            if (this.leftToDo < 10) {
                return 'green';
            } else {
                return 'red';
            }
        },
        percentageOfTasksCompleted: function() {
            if (this.tasks.length == 0) {
                return 0;
            } else {
                return (this.checkMarkedTasks / this.tasks.length) * 100;
            }
        }
    }
})