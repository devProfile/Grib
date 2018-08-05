var messageApi = Vue.resource('/message{/id}')    // in the resource we put url on which we want to contact the server
    // {/id} in our url means that an optional field id


Vue.component('message-row', {  //Create a template that we'll use in the app variable
    props: ['message'],    //in the props we'll got our list from app
    template: '<div><i>({{message.id}})</i>{{message.text}}</div>'
});


Vue.component('messages-list', {
    props: ['messages'],
    template:
        '<div>' +
            '<message-row v-for="message in messages" :key="message.id"  :message="message"/>' +
        '</div>',  //v-for="message in messages" it`s just like foreach. We add key attribute becouse our browser will give warning

    created: function () {
        messageApi.get().then(result => result.json().then(data => data.forEach(message => this.messages.push(message))))    //we put data that we taked from server and put them to data
    }
});

var app = new Vue({
    el: '#app', // we use id app, for the field where we want create our text in html document
    template: '<messages-list :messages="messages"/>',  //use our template in app id, without : we'll got just word messages in our app id
    data: {                                             // with : we'll got the full list
        messages: []
    }
});