<template>
    <div id="app" class="px-3">
        <div v-if="alert.level === 'INFO'" class="alert alert-info mt-3" role="info">{{ alert.msg }}</div>
        <div v-else-if="alert.level === 'DANGER'" class="alert alert-danger mt-3" role="alert">{{ alert.msg }}</div>
        <div class="form-group mt-3">
            <textarea class="form-control" v-model="jsonText" rows="15" placeholder="// JSON here"></textarea>
        </div>
        <form v-if="json" class="mt-3">
            <Struct root :jsonPath="['$']" :value="json"/>
        </form>
        <Modal/>
    </div>
</template>

<script>
import Definition from './config/definition.json';
import DefaultJson from './config/default.json';
import Struct from './components/Struct.vue';
import Modal from './components/Modal.vue';

import store from './store';

export default {
    name: 'app',
    components: {
        Struct,
        Modal,
    },
    data() {
        return {
            jsonText: "",
            alert: { level: 'INFO', msg: 'Please input JSON' },
            obj: { key: "oldValue" },
        };
    },
    computed: {
        fields: function() {
            return Definition.root;
        },
        json: function() {
            return store.state.json;
        },
    },
    watch: {
        jsonText: function(val) {
            if (val === ""){
                this.alert.level = 'INFO';
                this.alert.msg = 'Please input JSON';
                store.commit('clearJson');
            } else {
                let json
                try {
                    json = JSON.parse(val);
                }
                catch (error) {
                    this.alert.level = 'DANGER';
                    this.alert.msg = error;
                    return
                }
                this.alert.level = 'INFO';
                this.alert.msg = 'Valid JSON';
                store.commit('setJson', json);
            }
        },
        json: function() {
            this.jsonText = JSON.stringify(this.json, null, 4);
        }
    },
    created () {
        this.jsonText = JSON.stringify(DefaultJson);
        store.commit('setJson', DefaultJson);
    }
}
</script>

<style>
    .flexbox {
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .grouping {
        flex-grow: 1;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0,0,0,.125);
        border-radius: .25rem;
    }

    .struct {
        flex-grow: 1;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0,0,0,.125);
        border-radius: .25rem;
    }
    .struct-with-plus {
        flex-grow: 1;
    }

    .plus-button {
        width: 100%;
    }

    .field-button {
        width: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .null-button {
        width: 100%;
    }
</style>
