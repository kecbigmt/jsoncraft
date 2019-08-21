<template>
    <button type="button" class="btn  mr-2" data-toggle="modal" data-target="#modal" 
        :class="{ 
            'btn-primary': label != null && !isArrayItem,
            'field-button': label != null && !isArrayItem,
            'btn-danger': label === null,
            'null-button': label === null,
            'btn-secondary': isArrayItem,
        }"
        @click="openModal"
        >
        {{ label === null ? 'null' : label }}
    </button>
</template>
<script>
import store from '../store';

export default {
    name: 'FieldButton',
    props: {
        label: String,
        jsonPath: Array,
        definition: [String, Object],
    },
    computed: {
        isArrayItem () {
            return !isNaN(this.jsonPath[this.jsonPath.length - 1]); // return true if the end element of jsonPath is number
        }
    },
    methods: {
        openModal () {
            store.commit('setModalProps', { 
                jsonPath: this.jsonPath,
                definition: this.definition,
            });
        }
    }
}
</script>