displayTasks();
let description = document.getElementById("description");
let deadline = document.getElementById("deadline");
function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}
let current_datetime = new Date();
let formatted_date = current_datetime.getFullYear() + "-" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "T" + appendLeadingZeroes(current_datetime.getHours()) + ":" + appendLeadingZeroes(current_datetime.getMinutes());
document.getElementById("deadline").min = formatted_date;

form.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    descriptionInputVal = description.value;
    deadlineInputVal = deadline.value;
    if (descriptionInputVal.trim() != 0) {
        let webtask = sessionStorage.getItem("allTodos");
        if (webtask == null) {
            taskObj = [];
        }
        else {
            taskObj = JSON.parse(webtask);
        }
        taskObj.push({
            'description': descriptionInputVal,
            'deadline': deadlineInputVal,
            'isCompleted': false
        });
        sessionStorage.setItem("allTodos", JSON.stringify(taskObj));
        description.value = '';
        deadline.value = '';
    }
    displayTasks();
}

// display all tasks from sessionStorage
function displayTasks() {
    let webtask = sessionStorage.getItem("allTodos");
    if (webtask == null) {
        taskObj = [];
    }
    else {
        taskObj = JSON.parse(webtask);
        // sorts tasks from least time left to most time left
        taskObj.sort((a, b) => {
            if (b.deadline === null || a.deadline) {
                return -1
            }
        })
    }
    let html = '';
    let htmldonetasks = '';
    let addedtasklist = document.getElementById("addedtasklist");
    let donetasklist = document.getElementById("donetasklist");
    taskObj.forEach((item, index) => {
        if (item.deadline.trim() != 0) {
            showDeadline = `<p>${timeDiffCalc(new Date(item.deadline), Date.now())}</p>`
        } else {
            showDeadline = ``;
        }
        if (item.isCompleted == true) {
            htmldonetasks += `
            <div class="itemslist" style="background: #12af34; border-radius: 0px;">
                <div class="taskname">
                    <input type="checkbox" id="isTaskDone" name="isTaskDone" value="${index}"  onclick="completedTask(${index})"checked >
                    <p class="completed">${item.description}</p>
                </div>
                <span class="closebtn " onclick="removeTodo(${index})">&times;</span>
            </div>   
                `;
        } else {
            html += `
            <div class="itemslist">
                <div class="taskname">
                    <input  type="checkbox" id="isTaskDone" name="isTaskDone" value="${index}" onclick="completedTask(${index})" >
                    <p>${item.description}</p>
                    ${showDeadline}
                </div>
                <span class="closebtn " onclick="removeTodo(${index})">&times;</span>
            </div>        
            `;
        }
    });
    addedtasklist.innerHTML = html;
    donetasklist.innerHTML = htmldonetasks;
}

function completedTask(index) {
    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    let webtask = sessionStorage.getItem("allTodos");
    let taskObj = JSON.parse(webtask);
    
        if (checkboxes[index].checked == true) {    
                taskObj[index]['isCompleted'] = true;
                console.log(index)
        } else {
            taskObj[index]['isCompleted'] = false;
            console.log(index)
        } 
    sessionStorage.setItem("allTodos", JSON.stringify(taskObj));
    displayTasks();
}

// removes todo item from sessionStorage
function removeTodo(index) {
    if (confirm("Are you sure you want to delete?")) {
        let webtask = sessionStorage.getItem("allTodos");
        let taskObj = JSON.parse(webtask);
        taskObj.splice(index, 1);
        sessionStorage.setItem("allTodos", JSON.stringify(taskObj));
    }

    displayTasks();
}
//calculates times difference between two dates (deadline date and current date)
function timeDiffCalc(dateFuture, dateNow) {
    let late = false;
    let diffInMilliSecondsForLatency = (dateFuture - dateNow) / 1000;
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    //console.log('minutes', minutes);

    let difference = '';
    if (days > 0) {
        difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    }
    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
    difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

    if (diffInMilliSecondsForLatency <= 0) {
        late = true;
    }
    if (late === true) {
        return "You are late " + difference;
    }
    else {
        return "Time left " + difference;
    }
}


















