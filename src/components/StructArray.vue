<template>
    <div class="grouping p-2">
        <div v-for="(v, index) in value" :key="index" class="flexbox">
            <div>
                <!--<button type="button" class="btn btn-secondary mr-2">{{ "#" + (index + 1) }}</button>-->
                <FieldButton
                    :label="'#' + (index + 1)"
                    :jsonPath="jsonPath.concat(index)"
                    :definition="{ dataType: v.type }"
                    />
            </div>
            <div class="struct-with-plus">
                <Struct :jsonPath="jsonPath.concat(index)" :type="v.type" :value="v"/>
                <button type="button" class="btn btn-light my-1 plus-button" data-toggle="modal" data-target="#modal" @click="openModal(index+1)">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
        <button v-if="value.length === 0" type="button" class="btn btn-light my-1 plus-button" data-toggle="modal" data-target="#modal" @click="openModal(0)">
            <i class="fa fa-plus"></i>
        </button>
    </div>
</template>

<script>
import Struct from './Struct.vue';
import FieldButton from './FieldButton.vue';
import Definition from '../config/definition.json';
import store from '../store';

export default {
    components: {
        Struct,
        FieldButton,
    },
    props: {
        value: Array,
        jsonPath: Array,
        definition: Object,
    },
    computed: {
        structDefinitions () {
            return Definition.structs;
        }
    },
    methods: {
        openModal (insertPosition) {
            store.commit('setModalProps', {
                jsonPath: this.jsonPath, 
                definition: this.definition,
                insertPosition,
            });
        }
    }
}
</script>