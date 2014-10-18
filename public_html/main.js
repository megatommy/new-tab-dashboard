function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init() {
    //event binding
    $("#todo-form").submit(function() {
        todo_array.push(capital($('#todo-input').val()));
        $("#todo-input").val('');
        store.set('todo_array', todo_array);
        list_todos(true);
    });

    $("#todo-holder").delegate('.todo-del', 'click', function() {
        if(!$(this).hasClass('ays')){
            $(this).addClass('ays');
            return;
        }
        todo_array.splice($(this).attr('data-id'), 1);
        store.set('todo_array', todo_array);
        $(this).parent().slideUp(300, function() {
            list_todos();
        });
    });
    
    $("#daily-holder").delegate('span.glyphicon', 'click', function(){
        var values = $(this).attr('data-pos').split('-'),
            row = values[0],
            col = values[1];
        
        daily_array[row].checks[col] = !daily_array[row].checks[col];
        store.set('daily_array', daily_array);
        list_daily();
    });
    
    $("#todo-holder").delegate('span.glyphicon', 'mouseout', function(){
        $(this).removeClass('ays');
    });
    
    
    //nieuw object aanmaken
    var d = new Date();
    var today_date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    var today_json = {
        date: today_date,
        checks: []
    };
    
    //kolommen maken, aan hand van kolommen array maken voor de checks
    $("#daily-holder thead").append("<th></th>");
    for(var i = 0; i < columns.length; i++){
        $("#daily-holder thead").append("<th>" + capital(columns[i]) + "</th>");
        today_json.checks.push(false);
    }
    
    //array aanmaken/resetten als niet bestaat, of als kolommen veranderd zijn
    daily_array = store.get('daily_array') || [];
    if(daily_array.length === 0 || daily_array[0].checks.length !== columns.length){
        daily_array = [today_json];
        store.set('daily_array', daily_array);
    }

    //nieuwe dag erin gooien, laatste dag eruit indien nodig
    if(daily_array[0].date !== today_date){
        daily_array.unshift(today_json);
        if(daily_array.length > 7) daily_array.pop();
        store.set('daily_array', daily_array);
    }
    
    //lists aanroepen
    list_todos();
    list_daily();
}

var todo_array;
function list_todos(just_added) {
    var just_added = just_added || false; //glowing effect at adding new
    todo_array = store.get("todo_array") || [];
    $("#todo-holder").html('');
    for (var i = 0; i < todo_array.length; i++) {
        if(just_added && i === (todo_array.length - 1)){
            $("#todo-holder").append("<div class='todo'><span class='glyphicon glyphicon-remove todo-del' data-id='" + i + "'></span> <span class='todo-text todo-latest'>" + todo_array[i] + "</span></div>");
        } else {
            $("#todo-holder").append("<div class='todo'><span class='glyphicon glyphicon-remove todo-del' data-id='" + i + "'></span> <span class='todo-text'>" + todo_array[i] + "</span></div>");
        }
    }
}

var daily_array;
function list_daily(){
    $("#daily-holder tbody").html('');
    var html = "";
    for(var i in daily_array) {
        var sliced = daily_array[i].date.split('-');
        var readable = new Date(sliced[2], sliced[1], sliced[0]).toDateString();
        html += "<tr><td>" + readable + "</td>";
        for(var j in daily_array[i].checks){
            if(daily_array[i].checks[j]){
                html += "<td><span class='glyphicon glyphicon-ok' data-check='true' data-pos='" + i + "-" + j + "'></span></td>";
            } else {
                html += "<td><span class='glyphicon glyphicon-remove' data-check='false' data-pos='" + i + "-" + j + "'></span></td>";
            }
        }
    }
    html += "</tr>";
    $("#daily-holder tbody").html(html);
}
