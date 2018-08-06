function getIndex(list, id) {
    for(var i = 0; i < list.length; i++){
        if(list[i].id === id) {
            return i;
        }
    }
    return -1;
}


var messageApi = Vue.resource('/message{/id}');  // in the resource we put url on which we want to contact the server
    // {/id} in our url means that an optional field id

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function(){
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal){
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
       '<div>' +
            '<input type="text" placeholder="Write something" v-model="text"/>' +   //v-model exsist for put the text from this field to function in data
            '<input type="button" value="Save" @click="save"/>' +
       '</div>',
    methods: {
        save: function () {
            var message = {text: this.text};
            if (this.id) {
                messageApi.update({id: this.id}, message).then(result => result.json().then(data => {
                    var index = getIndex(this.messages, data.id);
                    this.messages.splice(index, 1, data);
                    this.text = '';
                    this.id = '';
                }))
            }
            else {

                messageApi.save({}, message).then(result => result.json().then(data => {
                    this.messages.push(data);
                    this.text = '';
                }))
            }
        }
    }
});


Vue.component('message-row', {  //Create a template that we'll use in the app variable
    props: ['message', 'editMethod', 'messages'],    //in the props we'll got our list from app
    template:
        '<div>' +
            '<i>({{message.id}})</i>{{message.text}}' +
            '<span style="position: absolute; right: 0;">' +
                '<input type="button" value="Edit" @click="edit" />' +
                '<input type="button" value="X" @click="del" />' +
            '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.message);
        },
        del: function () {
            messageApi.remove({id: this.message.id}).then(result => {
                if(result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }

    }
});


Vue.component('messages-list', {
    props: ['messages'],
    data: function(){
        return {
            message: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
            '<message-form :messages="messages" :messageAttr="message"/>' +
            '<message-row v-for="message in messages" :key="message.id"  :message="message" :editMethod="editMethod" :messages="messages"/>' +
        '</div>',  //v-for="message in messages" it`s just like foreach. We add key attribute becouse our browser will give warning

    created: function () {
        messageApi.get().then(result => result.json().then(data => data.forEach(message => this.messages.push(message))))    //we put data that we taked from server and put them to data
    },
    methods: {
        editMethod: function (message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app', // we use id app, for the field where we want create our text in html document
    template: '<messages-list :messages="messages"/>',  //use our template in app id, without : we'll got just word messages in our app id
    data: {                                             // with : we'll got the full list
        messages: []
    }
});